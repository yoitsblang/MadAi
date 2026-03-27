import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const strategySession = await prisma.strategySession.findUnique({
    where: { id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Load AI memories
  const memories = await prisma.aiMemory.findMany({
    where: {
      userId: session.user.id,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { updatedAt: 'desc' },
  });

  const plans = await prisma.actionPlan.findMany({
    where: { userId: session.user.id, sessionId: id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  });

  let profile: Record<string, unknown> = {};
  try { profile = JSON.parse(strategySession.profileJson || '{}'); } catch { /* */ }

  // Pipeline completion
  const STAGE_FLOW = ['intake', 'value-diagnosis', 'business-logic', 'platform-power',
    'strategy-macro', 'strategy-meso', 'strategy-micro'];
  const completedStages = STAGE_FLOW.filter(stage => {
    if (stage === 'intake') return strategySession.intakeComplete;
    return strategySession.messages.some(m =>
      m.role === 'assistant' && m.content.includes(`[STAGE_COMPLETE: ${stage}]`)
    );
  });

  // Memory map
  const mem: Record<string, string> = {};
  for (const m of memories) mem[m.key] = m.value;

  // ─── EXTRACT REAL DATA FROM CONVERSATIONS ────────────────────────
  // Fall back to parsing actual message content if memories are sparse
  const aiMessages = strategySession.messages.filter(m => m.role === 'assistant');
  const userMessages = strategySession.messages.filter(m => m.role === 'user');
  const allText = aiMessages.map(m => m.content).join('\n');
  const allUserText = userMessages.map(m => m.content).join('\n');

  // Extract stage summaries (last AI message per completed stage)
  const stageSummaries: Record<string, string> = {};
  for (const msg of aiMessages) {
    if (msg.module && STAGE_FLOW.includes(msg.module)) {
      stageSummaries[msg.module] = msg.content.slice(0, 3000);
    }
  }

  // Smart extraction: try memory first, then parse messages
  function extract(memKey: string, patterns: RegExp[], fallback?: string): string {
    if (mem[memKey]) return mem[memKey];
    for (const p of patterns) {
      const match = allText.match(p) || allUserText.match(p);
      if (match?.[1]) return match[1].trim().slice(0, 300);
    }
    if (fallback) {
      const profileVal = profile[fallback];
      if (profileVal && typeof profileVal === 'string') return profileVal;
    }
    return '';
  }

  const metrics = {
    businessName: extract('business_name', [/Business(?:\s+Name)?:\s*\*?\*?(.+?)(?:\*|\n)/i], 'name') || strategySession.name || '',
    businessType: extract('business_type', [/Business\s+(?:Type|Model|Category):\s*\*?\*?(.+?)(?:\*|\n)/i], 'businessType'),
    offering: extract('offering', [/(?:Offering|Product|Service|What.*sell):\s*\*?\*?(.+?)(?:\*|\n)/i], 'offering'),
    targetAudience: extract('target_audience', [/(?:Target\s*Audience|Who.*for|Ideal\s*Customer|Customer\s*Profile):\s*\*?\*?(.+?)(?:\*|\n)/i], 'targetAudience'),
    revenueMonthly: extract('revenue_monthly', [/(?:Monthly\s*Revenue|Revenue.*month|Current.*Revenue):\s*\*?\*?(.+?)(?:\*|\n)/i]),
    avgOrderValue: extract('avg_order_value', [/(?:AOV|Average\s*Order|Avg.*Value):\s*\*?\*?(.+?)(?:\*|\n)/i]),
    pricePoint: extract('price_point', [/(?:Price\s*Point|Pricing|Price.*Range):\s*\*?\*?(.+?)(?:\*|\n)/i], 'pricePoint'),
    activeChannels: extract('active_channels', [/(?:Active\s*Channels|Current\s*Channels|Distribution|Platform.*Using):\s*\*?\*?(.+?)(?:\*|\n)/i]),
    coreValueProp: extract('core_value_prop', [/(?:Value\s*Prop|Core\s*Value|Unique\s*Value|USP):\s*\*?\*?(.+?)(?:\*|\n)/i]),
    primaryBottleneck: extract('primary_bottleneck', [/(?:Primary\s*Bottleneck|Biggest\s*Bottleneck|Weakest\s*Link|Fix\s*First):\s*\*?\*?(.+?)(?:\*|\n)/i]),
    valueClarityScore: extract('value_clarity_score', [/(?:Value\s*Clarity.*?Score|Clarity.*?(\d+))/i]),
    businessHealthScore: extract('business_health_score', [/(?:Health.*?Score|Overall.*?Score|Business.*?Score).*?(\d+)/i]),
    sovereigntyScore: extract('sovereignty_score', [/(?:Sovereignty.*?Score|Platform.*?Score).*?(\d+)/i]),
    moatScore: extract('moat_score', [/(?:Moat.*?Score|Competitive.*?Score).*?(\d+)/i]),
    goal30d: extract('goal_30d', [/(?:30[\s-]*day|this\s*month|immediate).*?goal.*?:\s*(.+?)(?:\n|$)/i]),
    goal6m: extract('goal_6m', [/(?:6[\s-]*month|mid[\s-]*term).*?goal.*?:\s*(.+?)(?:\n|$)/i]),
    goal1y: extract('goal_1y', [/(?:1[\s-]*year|12[\s-]*month|annual|long[\s-]*term).*?goal.*?:\s*(.+?)(?:\n|$)/i]),
  };

  // ─── EXTRACT KEY FINDINGS PER STAGE ──────────────────────────────
  const stageFindings: Record<string, string[]> = {};
  for (const [stage, content] of Object.entries(stageSummaries)) {
    const findings: string[] = [];
    // Extract lines starting with numbered items, [ACTION], [RISK], bold items, or "Fix" directives
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        /^\d+\.\s*\*?\*?[A-Z]/.test(trimmed) ||
        /\[(ACTION|RISK|WEAK|STRONG|OPPORTUNITY|PRIORITY|WARNING)\]/.test(trimmed) ||
        /\*\*Fix\b/.test(trimmed) ||
        /\*\*(?:Immediate|Strategy|Recommendation|Do NOT|What to)\b/.test(trimmed)
      ) {
        // Clean markdown
        const clean = trimmed.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').slice(0, 200);
        if (clean.length > 15) findings.push(clean);
      }
    }
    stageFindings[stage] = findings.slice(0, 8);
  }

  // ─── EXTRACT ACTION ITEMS FROM ALL STAGES ────────────────────────
  const actionItems: Array<{ text: string; priority: string; stage: string }> = [];
  for (const [stage, content] of Object.entries(stageSummaries)) {
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (/^\d+\.\s*\*?\*?(Fix|Start|Stop|Create|Move|Build|Launch|Set up|Define|Transition|Implement|Migrate)/i.test(trimmed)) {
        const clean = trimmed.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').slice(0, 200);
        const priority = /immediate|urgent|first|critical|non-negotiable|today|this week|stop|fix.*delivery/i.test(clean) ? 'high' :
          /strategy|long[\s-]*term|consider|eventually|explore|research/i.test(clean) ? 'low' : 'medium';
        actionItems.push({ text: clean, priority, stage });
      }
    }
  }

  // ─── EXTRACT RISKS AND WARNINGS ──────────────────────────────────
  const risks: string[] = [];
  for (const content of Object.values(stageSummaries)) {
    const riskMatches = content.match(/\[(?:RISK|WARNING|WEAK)\][\s:—-]*(.+?)(?:\n|$)/g);
    if (riskMatches) {
      for (const m of riskMatches) {
        const clean = m.replace(/\[(?:RISK|WARNING|WEAK)\][\s:—-]*/, '').trim().slice(0, 200);
        if (clean.length > 10) risks.push(clean);
      }
    }
  }

  // ─── EXTRACT STRENGTHS ───────────────────────────────────────────
  const strengths: string[] = [];
  for (const content of Object.values(stageSummaries)) {
    const strongMatches = content.match(/\[(?:STRONG|OPPORTUNITY)\][\s:—-]*(.+?)(?:\n|$)/g);
    if (strongMatches) {
      for (const m of strongMatches) {
        const clean = m.replace(/\[(?:STRONG|OPPORTUNITY)\][\s:—-]*/, '').trim().slice(0, 200);
        if (clean.length > 10) strengths.push(clean);
      }
    }
  }

  // ─── EXTRACT SWOT DATA ──────────────────────────────────────────
  const opportunities: string[] = [];
  const threats: string[] = [];
  const weaknesses: string[] = [];
  for (const content of Object.values(stageSummaries)) {
    const oppMatches = content.match(/\[OPPORTUNITY\][\s:—-]*(.+?)(?:\n|$)/g);
    if (oppMatches) {
      for (const m of oppMatches) {
        const clean = m.replace(/\[OPPORTUNITY\][\s:—-]*/, '').trim().slice(0, 200);
        if (clean.length > 10) opportunities.push(clean);
      }
    }
    // Threats from RISK tags that mention external factors
    const threatMatches = content.match(/(?:threat|competition|market risk|external risk|platform.*risk|algorithm|dependency).*?:?\s*(.+?)(?:\n|$)/gi);
    if (threatMatches) {
      for (const m of threatMatches.slice(0, 3)) {
        const clean = m.trim().slice(0, 200);
        if (clean.length > 10 && !threats.includes(clean)) threats.push(clean);
      }
    }
    // Weaknesses from WEAK tags
    const weakMatches = content.match(/\[(?:WEAK|FLAW|BLIND SPOT)\][\s:—-]*(.+?)(?:\n|$)/g);
    if (weakMatches) {
      for (const m of weakMatches) {
        const clean = m.replace(/\[(?:WEAK|FLAW|BLIND SPOT)\][\s:—-]*/, '').trim().slice(0, 200);
        if (clean.length > 10) weaknesses.push(clean);
      }
    }
  }

  // ─── EXTRACT BOTTLENECK ASSESSMENT ─────────────────────────────
  let bottleneck: { primary: string; severity: number; confidence: string; evidence: string[]; upside: string; actions: string[] } | null = null;
  const bnMatch = allText.match(/\[BOTTLENECK_ASSESSMENT\]\s*\n?PRIMARY:\s*(.+)\n?SEVERITY:\s*(\d+)\n?CONFIDENCE:\s*(.+)\n?EVIDENCE:\s*(.+)\n?UPSIDE:\s*(.+)\n?ACTIONS:\s*(.+)\n?\[\/BOTTLENECK_ASSESSMENT\]/i);
  if (bnMatch) {
    bottleneck = {
      primary: bnMatch[1].trim(),
      severity: parseInt(bnMatch[2]) || 5,
      confidence: bnMatch[3].trim(),
      evidence: bnMatch[4].split('|').map(e => e.trim()).filter(Boolean),
      upside: bnMatch[5].trim(),
      actions: bnMatch[6].split('|').map(a => a.trim()).filter(Boolean),
    };
  } else {
    // Fallback: extract from memory or patterns
    const bnFromMem = mem['primary_bottleneck'] || mem['bottleneck'];
    if (bnFromMem) {
      bottleneck = {
        primary: bnFromMem,
        severity: parseScore(metrics.businessHealthScore) > 0 ? (10 - parseScore(metrics.businessHealthScore)) : 6,
        confidence: completedStages.length >= 3 ? '75%' : completedStages.length >= 2 ? '55%' : '35%',
        evidence: risks.slice(0, 3),
        upside: 'Improvement likely if addressed',
        actions: actionItems.slice(0, 3).map(a => a.text),
      };
    }
  }

  // ─── EXTRACT STRUCTURED RECOMMENDATIONS ───────────────────────
  const recommendations: Array<{ action: string; reason: string; outcome: string; difficulty: string; time: string; metric: string }> = [];
  const recRegex = /\[RECOMMENDATION\]\s*\n?ACTION:\s*(.+)\n?REASON:\s*(.+)\n?OUTCOME:\s*(.+)\n?DIFFICULTY:\s*(.+)\n?TIME:\s*(.+)\n?METRIC:\s*(.+)\n?\[\/RECOMMENDATION\]/gi;
  let recMatch;
  while ((recMatch = recRegex.exec(allText)) !== null) {
    recommendations.push({
      action: recMatch[1].trim(),
      reason: recMatch[2].trim(),
      outcome: recMatch[3].trim(),
      difficulty: recMatch[4].trim().toLowerCase(),
      time: recMatch[5].trim(),
      metric: recMatch[6].trim(),
    });
  }

  // ─── BUILD CONSTRAINT MAP ─────────────────────────────────────
  function parseScore(v: string): number { const n = parseInt(v) || 0; return n > 10 ? Math.min(Math.round(n / 10), 10) : Math.min(n, 10); }
  const constraintMap = [
    { label: 'Offer', score: parseScore(metrics.valueClarityScore), status: 'stable' as string },
    { label: 'Audience', score: has(metrics.targetAudience) ? 6 : 0, status: 'stable' as string },
    { label: 'Positioning', score: has(metrics.coreValueProp) ? 5 : 0, status: 'unknown' as string },
    { label: 'Conversion', score: 0, status: 'unknown' as string },
    { label: 'Fulfillment', score: parseScore(metrics.businessHealthScore), status: 'stable' as string },
    { label: 'Retention', score: 0, status: 'unknown' as string },
  ];
  // Mark primary/secondary based on bottleneck
  if (bottleneck) {
    const bnLower = bottleneck.primary.toLowerCase();
    for (const c of constraintMap) {
      if (bnLower.includes(c.label.toLowerCase())) c.status = 'primary';
      else if (c.score > 0 && c.score < 5) c.status = 'secondary';
      else if (c.score >= 5) c.status = 'stable';
    }
  }

  // ─── LEARNING FEED ────────────────────────────────────────────
  const learnings: string[] = [];
  for (const content of Object.values(stageSummaries)) {
    const insightMatches = content.match(/(?:Key insight|Important|Critical finding|The real issue|What this means):\s*(.+?)(?:\n|$)/gi);
    if (insightMatches) {
      for (const m of insightMatches.slice(0, 2)) {
        const clean = m.replace(/^(?:Key insight|Important|Critical finding|The real issue|What this means):\s*/i, '').trim().slice(0, 150);
        if (clean.length > 15) learnings.push(clean);
      }
    }
  }

  // Ensure first 2 items are high priority (AI lists most important first)
  if (actionItems.length > 0) actionItems[0].priority = 'high';
  if (actionItems.length > 1) actionItems[1].priority = 'high';

  const planStats = plans.length > 0 ? {
    totalItems: plans[0].items.length,
    completedItems: plans[0].items.filter(i => i.status === 'completed').length,
    inProgressItems: plans[0].items.filter(i => i.status === 'in_progress').length,
  } : null;

  return NextResponse.json({
    session: {
      id: strategySession.id,
      name: strategySession.name,
      activeModule: strategySession.activeModule,
      intakeComplete: strategySession.intakeComplete,
      createdAt: strategySession.createdAt,
      updatedAt: strategySession.updatedAt,
    },
    profile,
    metrics,
    pipeline: {
      stages: STAGE_FLOW,
      completed: completedStages,
      total: STAGE_FLOW.length,
      percentage: Math.round((completedStages.length / STAGE_FLOW.length) * 100),
    },
    stageSummaries,
    stageFindings,
    actionItems: actionItems.slice(0, 15),
    risks: risks.slice(0, 8),
    strengths: strengths.slice(0, 8),
    swot: {
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      opportunities: opportunities.slice(0, 4),
      threats: threats.slice(0, 4),
    },
    bottleneck,
    recommendations: recommendations.slice(0, 6),
    constraintMap,
    learnings: learnings.slice(0, 6),
    plans,
    planStats,
    memories: memories.map(m => ({ key: m.key, value: m.value, category: m.category })),
  });
}
