'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Download, ArrowLeft, Zap, CheckCircle2, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface DbMessage {
  id: string;
  role: string;
  content: string;
  module: string;
  createdAt: string;
}

interface SessionData {
  id: string;
  name: string;
  profileJson: string;
  intakeComplete: boolean;
  messages: DbMessage[];
}

const STAGE_PIPELINE = [
  { key: 'intake', label: 'Strategic Intake' },
  { key: 'value-diagnosis', label: 'Value Diagnosis' },
  { key: 'business-logic', label: 'Business Logic' },
  { key: 'platform-power', label: 'Platform Power' },
  { key: 'market-research', label: 'Market Research' },
  { key: 'psychology', label: 'Psychology' },
  { key: 'strategy-macro', label: 'Macro Strategy' },
  { key: 'strategy-meso', label: 'Meso Strategy' },
  { key: 'strategy-micro', label: 'Micro Execution' },
];

export default function BriefPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [brief, setBrief] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) { router.push('/'); return; }
        const data = await res.json();
        setSession(data);
      } catch {
        router.push('/');
      }
      setIsLoading(false);
    }
    load();
  }, [id, router]);

  const generateBrief = useCallback(async () => {
    if (!session || isGenerating) return;
    setIsGenerating(true);
    setError('');

    // Build a rich context from all session messages
    const moduleOutputs: Record<string, string> = {};
    for (const stage of STAGE_PIPELINE) {
      const stageMsgs = session.messages
        .filter(m => m.module === stage.key && m.role === 'assistant')
        .map(m => m.content)
        .join('\n\n');
      if (stageMsgs.trim()) {
        moduleOutputs[stage.label] = stageMsgs.slice(0, 8000); // cap per stage — generous to preserve analysis depth
      }
    }

    const contextSections = Object.entries(moduleOutputs)
      .map(([label, content]) => `=== ${label.toUpperCase()} ===\n${content}`)
      .join('\n\n');

    let profile: Record<string, unknown> = {};
    try { profile = JSON.parse(session.profileJson || '{}'); } catch { /* ignore */ }

    const briefPrompt = `You are generating a MASTER STRATEGY BRIEF for this business.

BUSINESS PROFILE:
${Object.entries(profile).map(([k, v]) => `${k}: ${v}`).join('\n')}

ANALYSIS OUTPUTS FROM ALL COMPLETED STAGES:
${contextSections || 'No stage outputs yet — generate based on available profile information.'}

Generate a comprehensive, one-document Master Strategy Brief with these sections:

## Executive Summary
[3-4 sentences: what this business is, what makes it viable, what the core strategic direction is, and what the #1 priority is right now]

## Business Snapshot
- Business: [name and what it does]
- Type: [business type]
- Stage: [current stage]
- Core Offer: [exactly what is being sold and at what price]
- Target Customer: [specific description of who buys this]
- Core Value: [what transformation or outcome the customer gets]

## Where You Are Now
[Honest assessment of current traction, strengths, and the most critical gap]

## The Core Strategic Thesis
[1-2 paragraphs: the big idea behind this business's strategy. Why this approach, why this market, why now. Be specific to this business — no generic startup advice.]

## Unit Economics Assessment
[Calculate and display CAC, LTV, LTV:CAC ratio, payback period, contribution margin, and break-even based on whatever data is available. If numbers are missing, state clearly what needs to be measured.]

## Revenue Scenario Projections (12 months)
- Conservative: $X/mo — [key assumption]
- Realistic: $X/mo — [key assumption]
- Optimistic: $X/mo — [key assumption]

## Competitive Position
[Where this business sits in its market, what the moat is, Porter's Five Forces summary, and the most dangerous competitor or substitute]

## Top 5 Opportunities (Ranked by Impact)
1. [Opportunity — why it's the highest leverage thing right now]
2. [Opportunity]
3. [Opportunity]
4. [Opportunity]
5. [Opportunity]

## Top 5 Risks (Ranked by Severity)
1. [CRITICAL RISK] [Risk — what it is and how to mitigate it]
2. [HIGH RISK] [Risk]
3. [MEDIUM RISK] [Risk]
4. [MEDIUM RISK] [Risk]
5. [LOW RISK] [Risk]

## Channel Strategy
[The 2-3 channels to focus on, why these specifically, and what success looks like on each]

## The 30-Day Execution Sprint
[Specific, numbered tasks for the next 30 days — the highest-leverage moves that can happen immediately with available resources. No vague advice. Real tasks.]

## 90-Day Milestones
[What should be accomplished in 90 days — specific, measurable targets]

## 1-Year Vision
[Where this business should be in 12 months if the strategy executes well]

## Blindspots & Honest Warnings
[Things the founder may be avoiding thinking about, assumptions that haven't been tested, external risks they can't control but need to plan for]

## Niche Intelligence Summary
[Key facts about this market: size, growth rate, competition level, benchmarks, what's working in this space right now]

Be direct. Be specific. This brief should be useful enough that someone could hand it to an investor, a business partner, or an advisor and have them immediately understand the business and its strategy. No fluff. No generic advice. Every sentence should be traceable to this specific business.

Do NOT use emojis. Use text labels like [CRITICAL] [HIGH] [MEDIUM] [LOW] [OPPORTUNITY] [RISK] for emphasis.`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: briefPrompt }],
          module: 'general',
          businessContext: Object.entries(profile).map(([k, v]) => `${k}: ${v}`).join('\n'),
          ethicalStance: (profile.ethicalStance as string) || 'balanced',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate brief');
      }

      const data = await res.json();
      setBrief(data.response);

      // Save as a message in the session
      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'assistant',
          content: data.response,
          module: 'general',
        }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }, [session, isGenerating, id]);

  function handleDownload() {
    if (!brief) return;
    const blob = new Blob([brief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session?.name || 'strategy'}-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // Check which stages have been completed
  const completedStages = STAGE_PIPELINE.filter(stage => {
    if (stage.key === 'intake') return session?.intakeComplete;
    return session?.messages.some(m => m.role === 'assistant' && m.content.includes(`[STAGE_COMPLETE: ${stage.key}]`));
  });

  const profile: Record<string, unknown> = (() => {
    try { return JSON.parse(session?.profileJson || '{}'); } catch { return {}; }
  })();

  return (
    <div className="min-h-screen bg-surface page-transition">
      {/* Header */}
      <header className="border-b border-border/20 bg-surface/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/session/${id}`)}
              className="text-text-muted hover:text-text transition-colors flex items-center gap-1.5 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-4 border-l border-border" />
            <div>
              <h1 className="text-sm font-semibold text-text">{session?.name || 'Strategy Brief'}</h1>
              <p className="text-[10px] text-text-muted">Master Strategy Brief</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {brief && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text border border-border rounded-lg px-3 py-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download .md
              </button>
            )}
            <button
              onClick={generateBrief}
              disabled={isGenerating}
              className="flex items-center gap-1.5 text-xs bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-1.5 transition-colors font-medium disabled:opacity-60"
            >
              {isGenerating ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating...</>
              ) : (
                <><Zap className="w-3.5 h-3.5" /> {brief ? 'Regenerate' : 'Generate Brief'}</>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Stage completion overview */}
        <div className="mb-6 bg-surface-light border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-light" />
              Analysis Coverage
            </h2>
            <span className="text-xs text-text-muted">{completedStages.length}/{STAGE_PIPELINE.length} stages complete</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {STAGE_PIPELINE.map(stage => {
              const done = completedStages.some(s => s.key === stage.key);
              return (
                <div key={stage.key} className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border
                    ${done ? 'bg-accent-green/20 border-accent-green/40 text-accent-green' : 'bg-surface border-border text-text-muted/40'}`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-[9px] text-text-muted/60 text-center leading-tight">{stage.label}</span>
                </div>
              );
            })}
          </div>
          {completedStages.length < 3 && (
            <p className="text-xs text-yellow-400/80 mt-3 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              Complete more stages for a more accurate brief. At minimum, finish Intake, Value Diagnosis, and Business Logic.
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!brief && !isGenerating && (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
              <FileText className="w-8 h-8 text-primary-light" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">Master Strategy Brief</h3>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Synthesizes everything — intake, all analyses, and strategies — into one comprehensive document.
              Includes unit economics, revenue scenarios, competitive moat, and a 30-day execution sprint.
            </p>
            <button
              onClick={generateBrief}
              className="bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl px-8 py-3 text-sm transition-colors flex items-center gap-2 mx-auto"
            >
              <Zap className="w-4 h-4" />
              Generate Master Brief
            </button>
            <p className="text-xs text-text-muted/50 mt-3">
              Based on {profile.name ? `${profile.name} — ` : ''}{completedStages.length} completed stages
            </p>
          </div>
        )}

        {/* Generating state */}
        {isGenerating && (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-base font-semibold text-text mb-2">Synthesizing your strategy...</h3>
            <p className="text-sm text-text-muted">Pulling together all stage outputs, running unit economics, and building your brief.</p>
          </div>
        )}

        {/* Brief output */}
        {brief && !isGenerating && (
          <div className="bg-surface-light border border-border rounded-2xl p-5 sm:p-8">
            <BriefRenderer content={brief} />
          </div>
        )}
      </main>
    </div>
  );
}

function BriefRenderer({ content }: { content: string }) {
  // Remove STAGE_COMPLETE blocks and emojis, then render markdown-like
  const cleaned = content
    .replace(/\n*---\s*\n\[STAGE_COMPLETE:[^\]]+\][^\n]*\nNext:[^\n]+\n---/g, '')
    .replace(/\[STAGE_COMPLETE:[^\]]+\]/g, '')
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

  const lines = cleaned.split('\n');
  const elements: React.ReactNode[] = [];

  const STATUS_COLORS: Record<string, string> = {
    '[CRITICAL]': 'text-red-400 bg-red-500/10 border-red-500/20',
    '[HIGH]': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    '[MEDIUM]': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    '[LOW]': 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    '[OPPORTUNITY]': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    '[RISK]': 'text-red-400 bg-red-500/10 border-red-500/20',
    '[CRITICAL RISK]': 'text-red-300 bg-red-600/10 border-red-600/20',
    '[HIGH RISK]': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    '[MEDIUM RISK]': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    '[LOW RISK]': 'text-gray-400 bg-gray-500/10 border-gray-500/20',
    '[HEALTHY]': 'text-green-400 bg-green-500/10 border-green-500/20',
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-text mt-8 mb-3 pb-2 border-b border-border first:mt-0">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-base font-semibold text-text mt-5 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-2xl font-bold text-text mt-4 mb-3">
          {line.slice(2)}
        </h1>
      );
    } else if (line.match(/^[-*] /)) {
      // Collect list items
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 space-y-1.5 my-3">
          {items.map((item, idx) => {
            // Check for status label at start
            const labelMatch = Object.keys(STATUS_COLORS).find(l => item.startsWith(l));
            if (labelMatch) {
              const rest = item.slice(labelMatch.length).replace(/^[\s:/—-]+/, '');
              return (
                <li key={idx} className="list-none -ml-5">
                  <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${STATUS_COLORS[labelMatch]}`}>
                    {labelMatch.replace(/[\[\]]/g, '')}
                  </span>
                  <span className="text-sm text-text-muted ml-2">{rest}</span>
                </li>
              );
            }
            return (
              <li key={idx} className="text-sm text-text-muted leading-relaxed">
                <InlineFmt text={item} />
              </li>
            );
          })}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 space-y-2 my-3">
          {items.map((item, idx) => {
            const labelMatch = Object.keys(STATUS_COLORS).find(l => item.startsWith(l));
            if (labelMatch) {
              const rest = item.slice(labelMatch.length).replace(/^[\s:/—-]+/, '');
              return (
                <li key={idx}>
                  <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${STATUS_COLORS[labelMatch]}`}>
                    {labelMatch.replace(/[\[\]]/g, '')}
                  </span>
                  <span className="text-sm text-text-muted ml-2">{rest}</span>
                </li>
              );
            }
            return <li key={idx} className="text-sm text-text-muted leading-relaxed"><InlineFmt text={item} /></li>;
          })}
        </ol>
      );
      continue;
    } else if (line.match(/^---+$/)) {
      elements.push(<hr key={i} className="border-border my-5" />);
    } else if (line.trim() === '') {
      // skip
    } else {
      elements.push(
        <p key={i} className="text-sm text-text-muted my-2 leading-relaxed">
          <InlineFmt text={line} />
        </p>
      );
    }
    i++;
  }

  return <div className="space-y-0">{elements}</div>;
}

function InlineFmt({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="font-semibold text-text">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i}>{part.slice(1, -1)}</em>;
        if (part.startsWith('`') && part.endsWith('`'))
          return <code key={i} className="bg-surface px-1.5 py-0.5 rounded text-primary-light text-xs font-mono">{part.slice(1, -1)}</code>;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
