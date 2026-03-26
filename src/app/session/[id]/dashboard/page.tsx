'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, BookMarked, MessageSquare, ChevronDown,
  AlertTriangle, Star, ClipboardList, TrendingUp, Target, BarChart3,
} from 'lucide-react';
import PriorityActions from '@/components/dashboard/PriorityActions';
import HealthScores from '@/components/dashboard/HealthScores';
import FinanceTracker from '@/components/dashboard/FinanceTracker';
import ChannelTracker from '@/components/dashboard/ChannelTracker';
import FloatingChat from '@/components/dashboard/FloatingChat';

interface DashboardData {
  session: { id: string; name: string };
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  stageFindings: Record<string, string[]>;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  risks: string[];
  strengths: string[];
}

const STAGE_LABELS: Record<string, string> = {
  'intake': 'Intake', 'value-diagnosis': 'Value', 'business-logic': 'Business',
  'platform-power': 'Platform', 'strategy-macro': 'Macro', 'strategy-meso': 'Meso', 'strategy-micro': 'Micro',
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [finances, setFinances] = useState<Array<{ id: string; type: string; category: string; amount: number; date: string; description?: string }>>([]);
  const [channels, setChannels] = useState<Array<{ id: string; platform: string; followers?: number; engagement?: number; posts?: number; revenue?: number }>>([]);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);
  const [chatQuery, setChatQuery] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null),
      fetch('/api/finance').then(r => r.ok ? r.json() : []),
      fetch('/api/channels').then(r => r.ok ? r.json() : []),
    ]).then(([d, f, c]) => {
      setData(d);
      setFinances(Array.isArray(f) ? f : []);
      setChannels(Array.isArray(c) ? c : []);
      setLoading(false);
    }).catch(() => router.push('/'));
  }, [id, router]);

  const handleAddFinance = useCallback(async (entry: { type: string; category: string; amount: number; date: string; description?: string }) => {
    const res = await fetch('/api/finance', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...entry, sessionId: id }) });
    if (res.ok) { const created = await res.json(); setFinances(prev => [created, ...prev]); }
  }, [id]);

  const handleAddChannel = useCallback(async (platform: string) => {
    const res = await fetch('/api/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, sessionId: id }) });
    if (res.ok) { const created = await res.json(); setChannels(prev => [...prev, created]); }
  }, [id]);

  if (loading || !data) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Loading...</div>
    </div>
  );

  const { metrics, pipeline, actionItems, risks, strengths, stageFindings } = data;
  const has = (v: string) => v && v.length > 0;

  // Build action items for PriorityActions component
  const actions = actionItems.map((item, i) => ({
    id: `action-${i}`,
    text: item.text,
    priority: item.priority as 'high' | 'medium' | 'low',
    stage: STAGE_LABELS[item.stage] || item.stage,
    completed: false,
    description: `From ${STAGE_LABELS[item.stage] || item.stage} analysis. ${item.priority === 'high' ? 'This is critical — do it this week.' : item.priority === 'medium' ? 'Important but not urgent. Schedule it.' : 'Lower priority. Do when you have bandwidth.'}`,
  }));

  // Build health scores
  const scores = [
    { label: 'Value Clarity', value: parseInt(metrics.valueClarityScore) || 0, maxValue: 10, color: '#22c55e', module: 'value-diagnosis' },
    { label: 'Business Health', value: parseInt(metrics.businessHealthScore) || 0, maxValue: 10, color: '#3b82f6', module: 'business-logic' },
    { label: 'Sovereignty', value: parseInt(metrics.sovereigntyScore) || 0, maxValue: 10, color: '#f59e0b', module: 'platform-power' },
    { label: 'Moat', value: parseInt(metrics.moatScore) || 0, maxValue: 10, color: '#818cf8', module: 'strategy-macro' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border glass-strong sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-bold text-text">{metrics.businessName || 'Strategy Dashboard'}</h1>
              {has(metrics.businessType) && <p className="text-[10px] text-text-muted">{metrics.businessType}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/session/${id}`} className="text-xs glass rounded-lg px-3 py-1.5 text-text-muted hover:text-text transition-colors flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Chat</a>
            <a href={`/brief/${id}`} className="text-xs bg-primary/10 text-primary-light border border-primary/20 rounded-lg px-3 py-1.5 hover:bg-primary/20 transition-colors flex items-center gap-1.5"><BookMarked className="w-3.5 h-3.5" /> Brief</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Pipeline */}
        <div className="glass glass-glow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-text uppercase tracking-widest">Strategy Pipeline</h2>
            <span className="text-lg font-bold text-primary-light">{pipeline.percentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gradient-to-r from-accent-green via-primary to-primary-light rounded-full transition-all duration-700" style={{ width: `${pipeline.percentage}%` }} />
          </div>
          <div className="flex gap-1.5">
            {pipeline.stages.map(stage => {
              const done = pipeline.completed.includes(stage);
              return (
                <a key={stage} href={`/session/${id}`} className={`flex-1 text-center rounded-lg py-2 text-[10px] font-medium transition-all ${done ? 'glass text-accent-green' : 'bg-surface/50 text-text-muted/20'}`}>
                  {STAGE_LABELS[stage]}
                </a>
              );
            })}
          </div>
        </div>

        {/* Priority Actions — FIRST THING USER SEES */}
        <PriorityActions
          actions={actions}
          onToggle={() => {}}
          onAskSterling={(text) => setChatQuery(text)}
        />

        {/* Health Scores */}
        <HealthScores scores={scores} sessionId={id} />

        {/* Business Snapshot + Risks/Strengths */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Snapshot */}
          <div className="glass glass-glow rounded-2xl p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-primary-light" /> Business Snapshot</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <Field label="Offering" value={metrics.offering} />
              <Field label="Audience" value={metrics.targetAudience} />
              <Field label="Revenue" value={metrics.revenueMonthly} />
              <Field label="Price Point" value={metrics.pricePoint} />
              <Field label="Channels" value={metrics.activeChannels} />
              <Field label="Value Prop" value={metrics.coreValueProp} />
            </div>
            {has(metrics.primaryBottleneck) && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div><span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">Bottleneck</span><p className="text-xs text-text-muted mt-0.5 leading-relaxed">{metrics.primaryBottleneck}</p></div>
              </div>
            )}
          </div>

          {/* Strengths & Risks */}
          <div className="space-y-4">
            {strengths.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold text-accent-green uppercase tracking-widest mb-3 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Strengths</h3>
                {strengths.slice(0, 5).map((s, i) => <p key={i} className="text-xs text-text-muted leading-relaxed py-1 border-b border-border/20 last:border-0">+ {s}</p>)}
              </div>
            )}
            {risks.length > 0 && (
              <div className="glass rounded-2xl p-5">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Risks</h3>
                {risks.slice(0, 5).map((r, i) => <p key={i} className="text-xs text-text-muted leading-relaxed py-1 border-b border-border/20 last:border-0">- {r}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* Finance + Channel Trackers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FinanceTracker entries={finances} onAdd={handleAddFinance} />
          <ChannelTracker channels={channels} onAdd={handleAddChannel} />
        </div>

        {/* Stage Details (expandable) */}
        {Object.keys(stageFindings).length > 0 && (
          <div className="glass rounded-2xl overflow-hidden">
            <h3 className="text-xs font-bold text-text uppercase tracking-widest px-5 pt-5 pb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary-light" /> Stage Analysis</h3>
            {Object.entries(stageFindings).map(([stage, findings]) => findings.length > 0 && (
              <div key={stage} className="border-t border-border/20">
                <button onClick={() => setExpandedStage(expandedStage === stage ? null : stage)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-surface/30 transition-colors">
                  <span className="text-xs font-medium text-text">{STAGE_LABELS[stage] || stage}</span>
                  <div className="flex items-center gap-2"><span className="text-[10px] text-text-muted/50">{findings.length}</span><ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${expandedStage === stage ? 'rotate-180' : ''}`} /></div>
                </button>
                {expandedStage === stage && (
                  <div className="px-5 pb-4 space-y-2 animate-slide-up">
                    {findings.map((f, i) => <p key={i} className="text-xs text-text-muted leading-relaxed pl-3 border-l-2 border-primary/20">{f}</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Goals */}
        {(has(metrics.goal30d) || has(metrics.goal6m) || has(metrics.goal1y)) && (
          <div className="glass glass-glow rounded-2xl p-5">
            <h3 className="text-xs font-bold text-text uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary-light" /> Goals & Trajectory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {has(metrics.goal30d) && <GoalCard tf="30 Days" goal={metrics.goal30d} c="text-accent-green border-accent-green/20" />}
              {has(metrics.goal6m) && <GoalCard tf="6 Months" goal={metrics.goal6m} c="text-accent-blue border-accent-blue/20" />}
              {has(metrics.goal1y) && <GoalCard tf="1 Year" goal={metrics.goal1y} c="text-primary-light border-primary/20" />}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-20">
          <QA href={`/session/${id}`} label="Continue Strategy" />
          <QA href={`/brief/${id}`} label="Master Brief" />
          <QA href="/plans" label="Action Plans" />
          <QA href="/" label="All Projects" />
        </div>
      </main>

      {/* Floating Sterling Chat */}
      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} initialQuery={chatQuery} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const has = value && value.length > 0;
  return (<div><span className="text-[9px] text-text-muted/40 uppercase tracking-widest">{label}</span><p className={`text-xs leading-relaxed mt-0.5 ${has ? 'text-text' : 'text-text-muted/20 italic'}`}>{has ? (value.length > 100 ? value.slice(0, 100) + '...' : value) : 'Not captured'}</p></div>);
}

function GoalCard({ tf, goal, c }: { tf: string; goal: string; c: string }) {
  return (<div className={`p-3 rounded-xl glass border ${c.split(' ')[1]}`}><span className={`text-[9px] font-bold uppercase tracking-widest ${c.split(' ')[0]}`}>{tf}</span><p className="text-xs text-text-muted mt-1.5 leading-relaxed">{goal.length > 120 ? goal.slice(0, 120) + '...' : goal}</p></div>);
}

function QA({ href, label }: { href: string; label: string }) {
  return <a href={href} className="glass rounded-xl p-3 text-xs font-medium text-text-muted hover:text-text hover:border-primary/30 transition-colors text-center">{label}</a>;
}
