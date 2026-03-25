'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import ModuleHeader from '@/components/ui/ModuleHeader';
import ChatWindow from '@/components/chat/ChatWindow';
import { ModuleIcon } from '@/lib/icons';
import {
  FileText, Clipboard, ClipboardList, AlertTriangle,
  Zap, ArrowRight, BookMarked, CheckCircle2, ChevronRight, BarChart3,
} from 'lucide-react';
import type { ModuleType, EthicalStance, ChatMessage } from '@/lib/types/business';
import { MODULE_INFO } from '@/lib/types/business';
import UpgradePrompt from '@/components/ui/UpgradePrompt';

const mobileModuleGroups = [
  { label: '•', modules: ['intake', 'value-diagnosis', 'business-logic'] as ModuleType[] },
  { label: '•', modules: ['platform-power', 'market-research', 'psychology', 'ethics'] as ModuleType[] },
  { label: '•', modules: ['strategy-macro', 'strategy-meso', 'strategy-micro'] as ModuleType[] },
  { label: '•', modules: ['timing', 'innovation', 'teaching', 'general'] as ModuleType[] },
];

// The main guided pipeline order
const STAGE_FLOW: ModuleType[] = [
  'intake', 'value-diagnosis', 'business-logic', 'platform-power',
  'strategy-macro', 'strategy-meso', 'strategy-micro',
];

// Labels shown on the accept card
const STAGE_NEXT_LABEL: Partial<Record<ModuleType, string>> = {
  'intake': 'Value Diagnosis',
  'value-diagnosis': 'Business Logic',
  'business-logic': 'Platform & Power',
  'platform-power': 'Macro Strategy',
  'strategy-macro': 'Meso Strategy',
  'strategy-meso': 'Micro Execution',
  'strategy-micro': 'Strategy Complete',
};

// What the AI will be asked when each stage auto-starts
const STAGE_KICKOFF_MESSAGES: Partial<Record<ModuleType, string>> = {
  'value-diagnosis': `Based on my business profile, please run the full Value Diagnosis now. Analyze: (1) what value type I'm actually creating, (2) whether my framing does it justice, (3) pricing assessment, (4) hidden value opportunities, and (5) my weakest link. Give me the complete report with your honest assessment.`,
  'business-logic': `Please run the complete Business Health Scorecard now. Score all five core areas (Value Creation, Marketing, Sales, Value Delivery, Finance), identify my primary bottleneck, run unit economics if you have the numbers, and tell me exactly what to fix first.`,
  'platform-power': `Please run the full Platform & Power Analysis now. Map all my platform dependencies, calculate my sovereignty score, identify the critical dependencies that could kill my business if a platform changes, and give me a concrete sovereignty strategy.`,
  'strategy-macro': `Based on all the analysis so far — intake, value diagnosis, business logic, and platform power — please build my complete Macro Strategy. I need: positioning statement, business model recommendation, market selection, offer structure, pricing philosophy, channel priority, trust architecture, acquisition model, competitive moat scorecard, competitive forces analysis, platform independence plan, and 12-month revenue scenarios.`,
  'strategy-meso': `Based on my macro strategy, design the full Meso Strategy now. I need: campaign themes for the next 90 days, offer architecture, launch sequence week by week, funnel design, audience segments, content pillars with examples, partnership opportunities, and owned channel development plan.`,
  'strategy-micro': `Based on my macro and meso strategy, give me the complete Micro Execution Playbook. I need specific, actionable deliverables: 5 Instagram hooks, 3 email subject lines, 3 ad angles to test, a sales page outline, a 30-day content calendar framework, and my exact action items for this week.`,
};

const STAGE_DESCRIPTIONS: Partial<Record<ModuleType, string>> = {
  'intake': 'Business profile captured and confirmed',
  'value-diagnosis': 'Value diagnosis complete — clarity on what you actually sell',
  'business-logic': 'Business health scorecard complete — bottleneck identified',
  'platform-power': 'Platform analysis complete — sovereignty score calculated',
  'strategy-macro': 'Macro strategy built — positioning, model, and moat defined',
  'strategy-meso': 'Campaign strategy complete — funnels and content pillars ready',
  'strategy-micro': 'Execution playbook complete — you have everything you need',
};

interface StageCompleteData {
  stage: ModuleType;
  nextStage: ModuleType | null;
  nextLabel: string;
  description: string;
}

interface DbSession {
  id: string;
  name: string;
  profileJson: string;
  activeModule: string;
  intakeComplete: boolean;
  messages: DbMessage[];
}

interface DbMessage {
  id: string;
  role: string;
  content: string;
  module: string;
  createdAt: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<DbSession | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [stageComplete, setStageComplete] = useState<StageCompleteData | null>(null);
  const [pendingKickoff, setPendingKickoff] = useState<{ module: ModuleType; message: string } | null>(null);
  const [upgradePrompt, setUpgradePrompt] = useState<{ reason: 'credits' | 'module'; tier: string; credits: number; module?: string } | null>(null);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [userTier, setUserTier] = useState<string>('free');

  // Refs to avoid stale closures in async flows
  const sessionRef = useRef<DbSession | null>(null);
  const profileRef = useRef<Record<string, unknown>>({});
  const isLoadingRef = useRef(false);

  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { profileRef.current = profile; }, [profile]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

  // Load session
  useEffect(() => {
    async function load() {
      try {
        const [sessionRes, userRes] = await Promise.all([
          fetch(`/api/sessions/${id}`),
          fetch('/api/user'),
        ]);
        if (!sessionRes.ok) { router.push('/'); return; }
        const data = await sessionRes.json();
        setSession(data);
        sessionRef.current = data;

        let parsed: Record<string, unknown> = {};
        try { parsed = JSON.parse(data.profileJson || '{}'); } catch { /* ignore */ }

        if (userRes.ok) {
          const userData = await userRes.json();
          // Track credits and tier for UI display
          if (typeof userData.credits === 'number') setUserCredits(userData.credits);
          if (userData.subscriptionTier) setUserTier(userData.subscriptionTier);
          if (!parsed.ethicalStance && userData.defaultStance) {
            parsed.ethicalStance = userData.defaultStance;
            fetch(`/api/sessions/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ profileJson: JSON.stringify(parsed) }),
            });
          }
        }
        setProfile(parsed);
        profileRef.current = parsed;
        // Check existing messages for STAGE_COMPLETE signals on load
        if (data.messages?.length) {
          const activemod = data.activeModule as ModuleType;
          const moduleMsgs = data.messages.filter((m: DbMessage) => m.module === activemod && m.role === 'assistant');
          for (let j = moduleMsgs.length - 1; j >= 0; j--) {
            const sc = detectStageComplete(moduleMsgs[j].content);
            if (sc) { setStageComplete(sc); break; }
          }
        }
      } catch {
        router.push('/');
      }
      setInitialLoading(false);
    }
    load();
  }, [id, router]);

  // When a pendingKickoff is set, send it after module changes settle
  useEffect(() => {
    if (!pendingKickoff || isLoading || initialLoading) return;
    const { module, message } = pendingKickoff;
    setPendingKickoff(null);
    // Small delay to let React settle the module switch
    // NOTE: no cleanup — setPendingKickoff(null) triggers re-render which would
    // invoke the cleanup and cancel the timer before it fires.
    setTimeout(() => {
      sendMessageInternal(message, module);
    }, 400);
  }, [pendingKickoff, isLoading, initialLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const buildBusinessContext = useCallback(() => {
    const p = profileRef.current;
    const parts: string[] = [];
    const fields = ['name', 'description', 'businessType', 'stage', 'offering', 'targetAudience',
      'audiencePain', 'audienceDesire', 'pricePoint', 'currentTraction', 'availableAssets',
      'geographicScope', 'budget', 'timeAvailable', 'primaryGoal', 'brandPersonality', 'ethicalBoundaries'];
    for (const field of fields) {
      if (p[field]) parts.push(`${field}: ${p[field]}`);
    }
    if (Array.isArray(p.currentChannels) && p.currentChannels.length) {
      parts.push(`Current Channels: ${(p.currentChannels as string[]).join(', ')}`);
    }
    return parts.join('\n') || 'Business details not yet established.';
  }, []);

  // Detect [STAGE_COMPLETE: xxx] signal in AI response
  function detectStageComplete(response: string): StageCompleteData | null {
    const match = response.match(/\[STAGE_COMPLETE:\s*([^\]]+)\]/);
    if (!match) return null;

    const completedStage = match[1].trim() as ModuleType;
    const currentIndex = STAGE_FLOW.indexOf(completedStage);
    const nextStage = currentIndex >= 0 && currentIndex < STAGE_FLOW.length - 1
      ? STAGE_FLOW[currentIndex + 1]
      : null;

    return {
      stage: completedStage,
      nextStage,
      nextLabel: STAGE_NEXT_LABEL[completedStage] || (nextStage ? MODULE_INFO[nextStage]?.label : 'Complete'),
      description: STAGE_DESCRIPTIONS[completedStage] || 'Stage complete',
    };
  }

  // Core send function — uses refs to avoid stale closures
  async function sendMessageInternal(message: string, moduleOverride?: ModuleType) {
    const currentSession = sessionRef.current;
    if (!currentSession || isLoadingRef.current) return;

    const activeModule = (moduleOverride || currentSession.activeModule) as ModuleType;
    setIsLoading(true);
    isLoadingRef.current = true;

    const tempUserMsg: DbMessage = {
      id: `temp-user-${Date.now()}`,
      role: 'user',
      content: message,
      module: activeModule,
      createdAt: new Date().toISOString(),
    };
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempUserMsg] } : null);

    try {
      // Save user message
      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: message, module: activeModule }),
      });

      // Build context from recent messages (all modules for cross-module awareness)
      const allMessages = sessionRef.current?.messages || [];
      const contextMessages = allMessages
        .filter(m => m.role !== 'system')
        .slice(-20)
        .concat(tempUserMsg)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const aiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: contextMessages,
          module: activeModule,
          businessContext: buildBusinessContext(),
          ethicalStance: (profileRef.current.ethicalStance as string) || 'balanced',
        }),
      });

      if (!aiRes.ok) {
        const err = await aiRes.json();
        // Handle credit/module gating responses
        if (aiRes.status === 402) {
          setUpgradePrompt({ reason: 'credits', tier: err.tier, credits: err.credits });
          setSession(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== tempUserMsg.id) } : null);
          return;
        }
        if (aiRes.status === 403 && err.error === 'module_locked') {
          setUpgradePrompt({ reason: 'module', tier: err.tier, credits: 0, module: err.module });
          setSession(prev => prev ? { ...prev, messages: prev.messages.filter(m => m.id !== tempUserMsg.id) } : null);
          return;
        }
        throw new Error(err.error || 'Failed to get AI response');
      }

      const aiData = await aiRes.json();
      const aiResponse: string = aiData.response;
      // Update client-side credit display
      if (typeof aiData.creditsRemaining === 'number') setUserCredits(aiData.creditsRemaining);

      // Save AI response
      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: aiResponse, module: activeModule }),
      });

      const tempAiMsg: DbMessage = {
        id: `temp-ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        module: activeModule,
        createdAt: new Date().toISOString(),
      };
      setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempAiMsg] } : null);

      // Handle intake completion
      if (activeModule === 'intake' && aiResponse.includes('BUSINESS PROFILE SUMMARY')) {
        const nameMatch = aiResponse.match(/\*?\*?Business:\*?\*?\s*(.+)/);
        const offeringMatch = aiResponse.match(/\*?\*?Offering:\*?\*?\s*(.+)/);
        // Include activeModule explicitly so a racing module-change PATCH isn't overwritten
        const updates: Record<string, unknown> = { intakeComplete: true, activeModule };
        if (nameMatch) updates.name = nameMatch[1].trim();

        const updatedProfile = { ...profileRef.current };
        if (nameMatch) updatedProfile.name = nameMatch[1].trim();
        if (offeringMatch) updatedProfile.offering = offeringMatch[1].trim();
        updates.profileJson = JSON.stringify(updatedProfile);

        setSession(prev => prev ? {
          ...prev,
          intakeComplete: true,
          name: (updates.name as string) || prev.name
        } : null);
        setProfile(updatedProfile);
        profileRef.current = updatedProfile;

        await fetch(`/api/sessions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      }

      // Detect stage completion signal
      const stageData = detectStageComplete(aiResponse);
      if (stageData) {
        setStageComplete(stageData);
      }
      // Fallback: if intake is complete but AI forgot the STAGE_COMPLETE signal,
      // detect the user's acceptance message and force the banner
      else if (activeModule === 'intake' && (sessionRef.current?.intakeComplete || aiResponse.includes('BUSINESS PROFILE SUMMARY'))) {
        const userMsg = message.toLowerCase();
        const acceptPhrases = ['accept', 'looks good', 'correct', 'proceed', 'yes', 'move on', 'let\'s go',
          'confirmed', 'perfect', 'accurate', 'great', 'good to go', 'let\'s continue', 'next', 'all good',
          'that\'s right', 'that works', 'spot on', 'nailed it', 'i approve'];
        const isAcceptance = acceptPhrases.some(p => userMsg.includes(p));
        if (isAcceptance && !stageData) {
          setStageComplete({
            stage: 'intake' as ModuleType,
            nextStage: 'value-diagnosis' as ModuleType,
            nextLabel: 'Value Diagnosis',
            description: 'Business profile captured and confirmed',
          });
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      const errMsg2: DbMessage = {
        id: `temp-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${errMsg}. Please try again.`,
        module: activeModule,
        createdAt: new Date().toISOString(),
      };
      setSession(prev => prev ? { ...prev, messages: [...prev.messages, errMsg2] } : null);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }

  const handleSend = useCallback((message: string) => {
    sendMessageInternal(message);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleModuleChange = useCallback(async (module: ModuleType) => {
    setSession(prev => prev ? { ...prev, activeModule: module } : null);
    // Re-detect stage complete signal for the new module
    const msgs = sessionRef.current?.messages || [];
    const moduleMsgs = msgs.filter(m => m.module === module && m.role === 'assistant');
    let found: StageCompleteData | null = null;
    for (let j = moduleMsgs.length - 1; j >= 0; j--) {
      found = detectStageComplete(moduleMsgs[j].content);
      if (found) break;
    }
    setStageComplete(found);
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeModule: module }),
    });
  }, [id]);

  const handleStanceChange = useCallback(async (stance: EthicalStance) => {
    const updatedProfile = { ...profileRef.current, ethicalStance: stance };
    setProfile(updatedProfile);
    profileRef.current = updatedProfile;
    await Promise.all([
      fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileJson: JSON.stringify(updatedProfile) }),
      }),
      fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ defaultStance: stance }),
      }),
    ]);
  }, [id]);

  // Accept stage and auto-start the next one with AI generation
  const handleAcceptStage = useCallback(async (nextStage: ModuleType) => {
    setStageComplete(null);
    await handleModuleChange(nextStage);
    // Schedule the kickoff via useEffect to avoid stale closure
    const kickoff = STAGE_KICKOFF_MESSAGES[nextStage];
    if (kickoff) {
      setPendingKickoff({ module: nextStage, message: kickoff });
    }
  }, [handleModuleChange]);

  // Just navigate to the next module without auto-generating
  const handleContinueManually = useCallback(async (nextStage: ModuleType) => {
    setStageComplete(null);
    await handleModuleChange(nextStage);
  }, [handleModuleChange]);

  // Critical analysis — brutal honest review
  const handleCriticalAnalysis = useCallback(async () => {
    const criticalPrompt = `I need you to switch into Critical Mode right now. Be ruthlessly honest about my business.

This is a stress-test. I want you to actively LOOK FOR problems, not validate me. Specifically:

1. [FLAW] — What are the 3-5 biggest structural flaws in my business model or strategy?
2. [BLIND SPOT] — What am I clearly not seeing or thinking about that could derail this?
3. [ASSUMPTION] — What assumptions am I making that haven't been tested with real data?
4. [DELUSION] — Where am I being overoptimistic or self-deceiving about the market, competition, or my execution ability?
5. [FAILURE MODE] — What are the 3 most likely ways this business fails in the next 12 months?
6. [SKEPTIC] — What would a sophisticated, skeptical investor say about this plan after 5 minutes of review?

For each point: state the issue clearly, explain why it matters, and give me one thing I could do to address it.

Do NOT soften this. I need the uncomfortable truth, not encouragement.`;

    await sendMessageInternal(criticalPrompt);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate action plan
  const handleGeneratePlan = useCallback(async () => {
    const planPrompt = `Based on everything we've discussed, generate a complete ACTION PLAN with specific executable steps.

For each step use this exact format:
STEP: [clear title]
DESC: [what to do and why it matters]
PRIORITY: [high/medium/low]
CATEGORY: [marketing/sales/product/operations/research]
TIMELINE: [this week / week 2 / month 1 / month 2-3]

Generate 10-15 steps ordered by priority and time. Make every step specific enough that I know exactly what to do when I read it.`;

    setIsLoading(true);
    isLoadingRef.current = true;

    const tempUserMsg: DbMessage = {
      id: `temp-plan-${Date.now()}`,
      role: 'user',
      content: 'Generate my complete action plan',
      module: (sessionRef.current?.activeModule || 'general') as string,
      createdAt: new Date().toISOString(),
    };
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempUserMsg] } : null);

    try {
      const currentSession = sessionRef.current;
      if (!currentSession) return;

      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: planPrompt, module: currentSession.activeModule }),
      });

      const recentMessages = currentSession.messages
        .filter(m => m.role !== 'system').slice(-15)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));
      recentMessages.push({ role: 'user', content: planPrompt });

      const planModule = currentSession.activeModule || 'strategy-macro';
      const aiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          module: planModule,
          businessContext: buildBusinessContext(),
          ethicalStance: (profileRef.current.ethicalStance as string) || 'balanced',
        }),
      });

      if (!aiRes.ok) throw new Error('Failed to generate plan');
      const aiData = await aiRes.json();

      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: aiData.response, module: planModule }),
      });

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, {
          id: `temp-ai-plan-${Date.now()}`,
          role: 'assistant',
          content: aiData.response,
          module: planModule,
          createdAt: new Date().toISOString(),
        }],
      } : null);

      // Parse and save action plan
      const steps: { title: string; description: string; priority: string; category: string; timeline?: string }[] = [];
      const stepMatches = aiData.response.matchAll(/STEP:\s*(.+?)(?:\n|$)[\s\S]*?DESC:\s*(.+?)(?:\n|$)[\s\S]*?PRIORITY:\s*(.+?)(?:\n|$)[\s\S]*?CATEGORY:\s*(.+?)(?:\n|$)(?:[\s\S]*?TIMELINE:\s*(.+?)(?:\n|$))?/gi);
      for (const match of stepMatches) {
        steps.push({
          title: match[1].trim(),
          description: match[2].trim(),
          priority: match[3].trim().toLowerCase().replace(/[^a-z]/g, '').slice(0, 15),
          category: match[4].trim().toLowerCase().replace(/[^a-z- ]/g, '').slice(0, 20),
          timeline: match[5]?.trim() || '',
        });
      }
      if (steps.length === 0) {
        // Fallback: numbered list
        const listMatches = aiData.response.matchAll(/^\d+\.\s+\*?\*?([^*\n]{5,120})\*?\*?/gm);
        for (const m of listMatches) {
          steps.push({ title: m[1].trim(), description: '', priority: 'medium', category: 'marketing' });
        }
      }
      if (steps.length > 0) {
        await fetch('/api/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Action Plan: ${currentSession.name || 'My Business'}`,
            description: `Generated from strategy session on ${new Date().toLocaleDateString()}`,
            sessionId: id,
            horizon: '90-day',
            items: steps,
          }),
        });
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Something went wrong';
      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, {
          id: `temp-err-${Date.now()}`,
          role: 'assistant',
          content: `Error generating plan: ${errMsg}`,
          module: 'general',
          createdAt: new Date().toISOString(),
        }],
      } : null);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [id, buildBusinessContext]);

  function handleExport(format: 'md' | 'json') {
    const url = `/api/sessions/${id}/export?format=${format}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session?.name || 'session'}.${format === 'md' ? 'md' : 'json'}`;
    a.click();
  }

  if (initialLoading || !session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading session...
        </div>
      </div>
    );
  }

  const activeModule = session.activeModule as ModuleType;

  // Convert to ChatMessage format — show ALL messages when in general, otherwise filter by module
  const chatMessages: ChatMessage[] = session.messages
    .filter(m => m.role !== 'system')
    .filter(m => activeModule === 'general' || m.module === activeModule)
    .map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
      module: m.module as ModuleType,
      timestamp: m.createdAt,
    }));

  // Compute pipeline progress
  const completedStages = STAGE_FLOW.filter(stage => {
    if (stage === 'intake') return session.intakeComplete;
    return session.messages.some(m =>
      m.role === 'assistant' && m.content.includes(`[STAGE_COMPLETE: ${stage}]`)
    );
  });
  const progressPct = Math.round((completedStages.length / STAGE_FLOW.length) * 100);

  return (
    <div className="h-screen flex overflow-hidden bg-surface">
      {/* Upgrade Prompt Modal */}
      {upgradePrompt && (
        <UpgradePrompt
          reason={upgradePrompt.reason}
          currentTier={userTier}
          currentCredits={upgradePrompt.credits}
          requiredModule={upgradePrompt.module}
          onClose={() => setUpgradePrompt(null)}
        />
      )}
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          intakeComplete={session.intakeComplete}
          sessionName={session.name || undefined}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile module nav */}
        <div className="md:hidden border-b border-border">
          <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-none">
            <a href="/" className="text-text-muted hover:text-text px-2 py-1 flex-shrink-0 text-base">←</a>
            {mobileModuleGroups.map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                <span className="text-[8px] text-text-muted/30 px-0.5 flex-shrink-0">·</span>
                {group.modules.map(mod => {
                  const info = MODULE_INFO[mod];
                  const isLocked = mod !== 'intake' && mod !== 'general' && !session.intakeComplete;
                  return (
                    <button key={mod}
                      onClick={() => !isLocked && handleModuleChange(mod)}
                      disabled={isLocked}
                      className={`text-[10px] px-2 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-colors flex items-center gap-1
                        ${activeModule === mod ? 'bg-primary/20 text-primary-light font-medium' : 'text-text-muted'}
                        ${isLocked ? 'opacity-25 cursor-not-allowed' : ''}`}>
                      <ModuleIcon name={info.icon} className="w-3 h-3" />
                      {info.label}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Top bar */}
        <div className="flex items-center border-b border-border bg-surface/90 backdrop-blur-sm flex-shrink-0">
          <div className="flex-1 min-w-0">
            <ModuleHeader
              module={activeModule}
              ethicalStance={(profile.ethicalStance as EthicalStance) || 'balanced'}
              onStanceChange={handleStanceChange}
            />
          </div>
          <div className="hidden md:flex items-center gap-1 pr-3 flex-shrink-0">
            {session.intakeComplete && (
              <>
                <button onClick={handleCriticalAnalysis} disabled={isLoading}
                  className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  title="Critical Analysis — brutal honest review">
                  <AlertTriangle className="w-3.5 h-3.5" /> Critical
                </button>
                <button onClick={handleGeneratePlan} disabled={isLoading}
                  className="text-xs bg-primary/10 text-primary-light hover:bg-primary/20 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  title="Generate Action Plan">
                  <ClipboardList className="w-3.5 h-3.5" /> Plan
                </button>
                <a href={`/brief/${id}`}
                  className="text-xs bg-surface-light hover:bg-primary/10 text-text-muted hover:text-primary-light border border-border hover:border-primary/30 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Master Strategy Brief">
                  <BookMarked className="w-3.5 h-3.5" /> Brief
                </a>
              </>
            )}
            <button onClick={() => handleExport('md')}
              className="text-xs text-text-muted hover:text-text px-2 py-1.5 transition-colors" title="Export .md">
              <FileText className="w-4 h-4" />
            </button>
            <button onClick={() => handleExport('json')}
              className="text-xs text-text-muted hover:text-text px-2 py-1.5 transition-colors" title="Export .json">
              <Clipboard className="w-4 h-4" />
            </button>
            {/* Credit balance */}
            {userCredits !== null && (
              <div className="text-[10px] text-text-muted/60 flex items-center gap-1 pl-2 border-l border-border/30">
                <Zap className="w-3 h-3 text-accent-amber" />
                {userCredits >= 999999 ? 'Unlimited' : userCredits}
              </div>
            )}
          </div>
        </div>

        {/* Pipeline progress bar */}
        {session.intakeComplete && (
          <div className="px-4 py-1.5 bg-surface/60 border-b border-border/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {STAGE_FLOW.map(stage => {
                  const done = completedStages.includes(stage);
                  const current = activeModule === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => handleModuleChange(stage)}
                      title={MODULE_INFO[stage]?.label}
                      className={`flex-1 h-1.5 rounded-full transition-all ${
                        done ? 'bg-accent-green' :
                        current ? 'bg-primary animate-pulse' :
                        'bg-surface-light hover:bg-primary/20'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] text-text-muted/50 flex-shrink-0">{completedStages.length}/{STAGE_FLOW.length}</span>
            </div>
          </div>
        )}

        {/* ═══ STAGE COMPLETE BANNER ═══ — the key UI element */}
        {stageComplete && (
          <div className="flex-shrink-0 border-b border-accent-green/20 bg-gradient-to-r from-accent-green/8 via-primary/5 to-transparent">
            {/* Top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-accent-green to-primary/40 w-full" />
            <div className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-accent-green/20 border border-accent-green/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4.5 h-4.5 text-accent-green" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-accent-green uppercase tracking-wider">Stage Complete</span>
                      <span className="text-[10px] text-text-muted/60 bg-surface px-1.5 py-0.5 rounded">
                        {MODULE_INFO[stageComplete.stage]?.label}
                      </span>
                    </div>
                    <p className="text-sm text-text leading-snug">{stageComplete.description}</p>
                    {stageComplete.nextStage && (
                      <p className="text-xs text-text-muted mt-0.5">
                        Ready to continue to <span className="text-primary-light font-medium">{stageComplete.nextLabel}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {stageComplete.nextStage ? (
                    <>
                      <a href="/"
                        className="text-xs text-text-muted border border-border hover:border-primary/30 hover:text-text px-3 py-1.5 rounded-lg transition-colors">
                        Save & Exit
                      </a>
                      <button
                        onClick={() => handleAcceptStage(stageComplete.nextStage!)}
                        disabled={isLoading}
                        className="text-xs font-semibold bg-gradient-to-r from-accent-green to-primary text-white px-4 py-2 rounded-lg transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 disabled:opacity-40 shadow-sm shadow-accent-green/20">
                        Continue to {stageComplete.nextLabel} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <a href="/"
                        className="text-xs text-text-muted border border-border hover:border-primary/30 hover:text-text px-3 py-1.5 rounded-lg transition-colors">
                        Save & Exit
                      </a>
                      <a href={`/session/${id}/dashboard`}
                        className="text-xs font-semibold bg-gradient-to-r from-accent-green to-primary text-white px-4 py-2 rounded-lg flex items-center gap-1.5">
                        View Dashboard <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending kickoff indicator */}
        {pendingKickoff && (
          <div className="flex-shrink-0 px-4 py-2 bg-primary/5 border-b border-primary/10 flex items-center gap-2">
            <div className="w-3 h-3 border border-primary/40 border-t-primary rounded-full animate-spin" />
            <span className="text-xs text-text-muted/70">
              Starting {MODULE_INFO[pendingKickoff.module]?.label}...
            </span>
          </div>
        )}

        {/* Universal stage navigation bar — shows on any completed stage without the banner */}
        {!stageComplete && !pendingKickoff && session.intakeComplete && (() => {
          const currentIdx = STAGE_FLOW.indexOf(activeModule);
          const nextStage = currentIdx >= 0 && currentIdx < STAGE_FLOW.length - 1 ? STAGE_FLOW[currentIdx + 1] : null;
          const isCurrentDone = completedStages.includes(activeModule);
          if (!isCurrentDone && activeModule !== 'intake') return null;
          return (
            <div className="flex-shrink-0 px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent-green" />
                <span className="text-xs text-text">
                  {MODULE_INFO[activeModule]?.label} complete.
                  {nextStage ? ` Next: ${MODULE_INFO[nextStage]?.label}` : ' All stages done!'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a href="/" className="text-xs text-text-muted border border-border hover:border-primary/30 px-3 py-1 rounded-lg transition-colors">
                  Save & Exit
                </a>
                {nextStage ? (
                  <button
                    onClick={() => handleAcceptStage(nextStage)}
                    disabled={isLoading}
                    className="text-xs font-semibold bg-gradient-to-r from-accent-green to-primary text-white px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40">
                    Continue <ArrowRight className="w-3 h-3" />
                  </button>
                ) : (
                  <a href={`/session/${id}/dashboard`}
                    className="text-xs font-semibold bg-gradient-to-r from-accent-green to-primary text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5">
                    View Dashboard <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })()}

        {/* Chat area */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ChatWindow
            messages={chatMessages}
            onSend={handleSend}
            isLoading={isLoading}
            module={activeModule}
          />
        </div>
      </div>
    </div>
  );
}
