'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronDown, AlertTriangle, Star, TrendingUp, Target, BarChart3,
  CheckCircle2, Circle, Zap, Clock, DollarSign, Edit3, Check, X,
  Calculator, PenLine, ArrowUpRight, Lightbulb, CalendarDays,
} from 'lucide-react';
import FloatingChat from '@/components/dashboard/FloatingChat';
import { RadarChart, DonutChart, SwotQuadrant, ProgressRing } from '@/components/dashboard/Charts';

interface DashboardData {
  session: { id: string; name: string };
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  stageFindings: Record<string, string[]>;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  risks: string[];
  strengths: string[];
  swot?: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
}

const STAGE_LABELS: Record<string, string> = {
  'intake': 'Intake', 'value-diagnosis': 'Value', 'business-logic': 'Business',
  'platform-power': 'Platform', 'strategy-macro': 'Macro', 'strategy-meso': 'Meso', 'strategy-micro': 'Micro',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('actions');
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [logEntry, setLogEntry] = useState('');
  const [logs, setLogs] = useState<Array<{ text: string; date: string }>>([]);
  const [revCalc, setRevCalc] = useState({ price: '', customers: '', frequency: '1' });
  const [experiments, setExperiments] = useState<Array<{ hypothesis: string; status: 'testing' | 'won' | 'lost'; result?: string }>>([]);
  const [newExperiment, setNewExperiment] = useState('');
  const [okrs, setOkrs] = useState<Array<{ objective: string; keyResults: Array<{ text: string; progress: number }> }>>([]);
  const [newOkr, setNewOkr] = useState('');
  const [milestones, setMilestones] = useState<Array<{ text: string; target: string; status: 'on-track' | 'at-risk' | 'behind' }>>([]);
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); if (d) setNewName(d.session.name); }).catch(() => router.push('/'));
    // Load local state
    const saved = localStorage.getItem(`logs-${id}`);
    if (saved) setLogs(JSON.parse(saved));
    const savedExp = localStorage.getItem(`experiments-${id}`);
    if (savedExp) setExperiments(JSON.parse(savedExp));
    const savedOkr = localStorage.getItem(`okrs-${id}`);
    if (savedOkr) setOkrs(JSON.parse(savedOkr));
    const savedMs = localStorage.getItem(`milestones-${id}`);
    if (savedMs) setMilestones(JSON.parse(savedMs));
  }, [id, router]);

  const toggleAction = useCallback((idx: number) => {
    setCompletedActions(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }, []);

  const handleRename = useCallback(async () => {
    if (!newName.trim()) return;
    await fetch(`/api/sessions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
    setData(prev => prev ? { ...prev, session: { ...prev.session, name: newName.trim() } } : prev);
    setRenaming(false);
  }, [id, newName]);

  const addLog = useCallback(() => {
    if (!logEntry.trim()) return;
    const entry = { text: logEntry.trim(), date: new Date().toISOString() };
    const updated = [entry, ...logs];
    setLogs(updated);
    localStorage.setItem(`logs-${id}`, JSON.stringify(updated));
    setLogEntry('');
  }, [logEntry, logs, id]);

  const addExperiment = useCallback(() => {
    if (!newExperiment.trim()) return;
    const updated = [...experiments, { hypothesis: newExperiment.trim(), status: 'testing' as const }];
    setExperiments(updated);
    localStorage.setItem(`experiments-${id}`, JSON.stringify(updated));
    setNewExperiment('');
  }, [newExperiment, experiments, id]);

  const updateExperiment = useCallback((idx: number, status: 'won' | 'lost') => {
    const updated = experiments.map((e, i) => i === idx ? { ...e, status } : e);
    setExperiments(updated);
    localStorage.setItem(`experiments-${id}`, JSON.stringify(updated));
  }, [experiments, id]);

  const addMilestone = useCallback(() => {
    if (!newMilestone.trim()) return;
    const updated = [...milestones, { text: newMilestone.trim(), target: 'This month', status: 'on-track' as const }];
    setMilestones(updated);
    localStorage.setItem(`milestones-${id}`, JSON.stringify(updated));
    setNewMilestone('');
  }, [newMilestone, milestones, id]);

  const cycleMilestoneStatus = useCallback((idx: number) => {
    const order: Array<'on-track' | 'at-risk' | 'behind'> = ['on-track', 'at-risk', 'behind'];
    const updated = milestones.map((m, i) => {
      if (i !== idx) return m;
      const next = order[(order.indexOf(m.status) + 1) % 3];
      return { ...m, status: next };
    });
    setMilestones(updated);
    localStorage.setItem(`milestones-${id}`, JSON.stringify(updated));
  }, [milestones, id]);

  // Streak calculation from logs
  const streakDays = (() => {
    if (logs.length === 0) return 0;
    let streak = 0;
    const today = new Date().toDateString();
    const dates = [...new Set(logs.map(l => new Date(l.date).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (dates[i] === expected.toDateString()) streak++;
      else break;
    }
    return streak;
  })();

  if (loading || !data) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted text-sm"><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Loading...</div>
    </div>
  );

  const { metrics, pipeline, actionItems, risks, strengths, stageFindings } = data;
  const has = (v: string) => v && v.length > 0;
  const parseScore = (v: string) => { const n = parseInt(v) || 0; return n > 10 ? Math.min(Math.round(n / 10), 10) : Math.min(n, 10); };
  const scores = [
    { label: 'Value', value: parseScore(metrics.valueClarityScore), color: '#22c55e' },
    { label: 'Health', value: parseScore(metrics.businessHealthScore), color: '#dc2626' },
    { label: 'Sovereignty', value: parseScore(metrics.sovereigntyScore), color: '#d4a843' },
    { label: 'Moat', value: parseScore(metrics.moatScore), color: '#3b82f6' },
  ];
  const avgHealth = scores.filter(s => s.value > 0).reduce((a, s) => a + s.value, 0) / (scores.filter(s => s.value > 0).length || 1);

  // Categorize actions
  const actionsByCategory: Record<string, typeof actionItems> = {};
  for (const item of actionItems) {
    const cat = ['intake', 'value-diagnosis'].includes(item.stage) ? 'Foundation' :
      ['business-logic', 'platform-power'].includes(item.stage) ? 'Operations' :
      ['strategy-macro', 'strategy-meso', 'strategy-micro'].includes(item.stage) ? 'Strategy' : 'General';
    if (!actionsByCategory[cat]) actionsByCategory[cat] = [];
    actionsByCategory[cat].push(item);
  }

  // Revenue calculator
  const monthlyRev = (parseFloat(revCalc.price) || 0) * (parseFloat(revCalc.customers) || 0) * (parseFloat(revCalc.frequency) || 1);

  // Smart suggestions based on what's missing
  const suggestions: string[] = [];
  if (!has(metrics.activeChannels)) suggestions.push('Define your active channels — Sterling needs this for strategy.');
  if (!has(metrics.revenueMonthly)) suggestions.push('Add your revenue data to unlock financial projections.');
  if (parseScore(metrics.businessHealthScore) < 4) suggestions.push('Your business health is critical. Focus on the Operations section first.');
  if (parseScore(metrics.sovereigntyScore) === 0) suggestions.push('Run the Platform & Power analysis to understand your dependencies.');
  if (actionItems.length === 0) suggestions.push('Complete more stages to generate actionable priorities.');
  const completedCount = completedActions.size;
  const totalActions = actionItems.length;
  if (completedCount > 0 && completedCount < totalActions) suggestions.push(`${totalActions - completedCount} actions remaining. Keep going.`);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const dayOfWeek = new Date().getDay(); // 0=Sun

  return (
    <div className="min-h-screen bg-surface bg-grid scanlines">
      {/* Header */}
      <header className="border-b border-border/30 glass-strong sticky top-0 z-10 accent-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text flex-shrink-0"><ArrowLeft className="w-4 h-4" /></button>
            <img src="/logo-64.png" alt="" className="w-6 h-6 rounded-md flex-shrink-0" />
            {renaming ? (
              <div className="flex items-center gap-1.5">
                <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()}
                  className="text-xs font-semibold text-text bg-surface-light border border-primary/30 rounded px-2 py-1 focus:outline-none w-40" autoFocus />
                <button onClick={handleRename} className="text-accent-green"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => setRenaming(false)} className="text-text-muted"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button onClick={() => setRenaming(true)} className="text-xs font-semibold text-text truncate max-w-[180px] sm:max-w-[300px] hover:text-primary transition-colors flex items-center gap-1" title="Click to rename">
                {data.session.name} <Edit3 className="w-3 h-3 text-text-muted/30" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a href={`/session/${id}`} className="text-[10px] text-text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-light">Chat</a>
            <a href={`/brief/${id}`} className="text-[10px] text-primary hover:text-primary-light px-2 py-1 rounded-md hover:bg-primary/5">Brief</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        {/* Hero */}
        <div className="glass rounded-xl p-5 sm:p-6 relative overflow-hidden border-glow corner-frame glass-glow">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/20 to-transparent" />
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-muted/40 tracking-wide">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
              <h2 className="text-base sm:text-lg font-semibold text-text mt-1">{greeting}. Here's your focus.</h2>
              {actionItems[0] && !completedActions.has(0) && (
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                  #1: <span className="text-primary font-medium">{actionItems[0].text.slice(0, 80)}{actionItems[0].text.length > 80 ? '...' : ''}</span>
                </p>
              )}
              {has(metrics.primaryBottleneck) && (
                <p className="text-[10px] text-red-400/70 mt-1">Bottleneck: {metrics.primaryBottleneck}</p>
              )}
            </div>
            <div className="flex-shrink-0 text-center">
              <div className={`text-xl font-bold metric-value animate-count ${avgHealth >= 7 ? 'text-accent-green text-glow-green' : avgHealth >= 4 ? 'text-accent-gold text-glow-gold' : avgHealth > 0 ? 'text-primary text-glow-red' : 'text-text-muted/20'}`}>
                {avgHealth > 0 ? avgHealth.toFixed(1) : '--'}
              </div>
              <p className="text-[9px] text-text-muted/40">health</p>
            </div>
          </div>
          <div className="flex gap-4 sm:gap-6 mt-4 pt-3 border-t border-border/10">
            {scores.map(s => (
              <div key={s.label} className="flex items-center gap-2 card-lift rounded-lg px-2 py-1 -mx-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.value > 0 ? s.color : '#3f3f46', boxShadow: s.value > 0 ? `0 0 8px ${s.color}40` : 'none' }} />
                  {s.value > 0 && <div className="absolute inset-0 w-2 h-2 rounded-full ping-slow" style={{ backgroundColor: s.color + '30' }} />}
                </div>
                <span className="text-[11px] text-text-muted/50">{s.label}</span>
                <span className={`text-[11px] font-semibold metric-value ${s.value > 0 ? 'text-text' : 'text-text-muted/20'}`}>{s.value > 0 ? `${s.value}/10` : '--'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly focus bar */}
        <div className="flex items-center gap-1 px-1">
          {DAYS.map((d, i) => {
            const isToday = (i + 1) % 7 === dayOfWeek;
            return (
              <div key={d} className={`flex-1 text-center py-1 rounded text-[9px] ${isToday ? 'bg-primary/15 text-primary font-semibold' : 'text-text-muted/20'}`}>
                {d}
              </div>
            );
          })}
        </div>

        {/* Pipeline */}
        <div className="flex items-center gap-1.5 px-1">
          {pipeline.stages.map(stage => {
            const done = pipeline.completed.includes(stage);
            return <div key={stage} className={`flex-1 h-1.5 rounded-full transition-all ${done ? 'bg-primary progress-glow' : 'bg-surface-light'}`} title={STAGE_LABELS[stage]} style={done ? { boxShadow: '0 0 8px rgba(220,38,38,0.3)' } : {}} />;
          })}
          <span className="text-[9px] text-text-muted/40 ml-1 metric-value">{pipeline.percentage}%</span>
        </div>

        {/* Smart suggestions */}
        {suggestions.length > 0 && (
          <div className="glass-subtle rounded-lg px-4 py-3 border border-accent-gold/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
            <div className="flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-3 h-3 text-accent-gold/60" />
              <span className="text-[10px] font-medium text-accent-gold/70 text-glow-gold">Sterling suggests</span>
            </div>
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((s, i) => (
                <p key={i} className="text-[11px] text-text-muted/60 leading-relaxed">{s}</p>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ANALYTICS ROW — Radar + Donut Scores + Pipeline Ring ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Radar Chart */}
          <div className="glass rounded-xl p-4 flex flex-col items-center corner-frame">
            <p className="text-[10px] font-medium text-text-muted/50 uppercase tracking-wider mb-2 self-start">Business Radar</p>
            <RadarChart data={scores.map(s => ({ label: s.label, value: s.value, max: 10 }))} size={160} />
          </div>

          {/* Score Donuts */}
          <div className="glass rounded-xl p-4 corner-frame">
            <p className="text-[10px] font-medium text-text-muted/50 uppercase tracking-wider mb-3">Health Scores</p>
            <div className="grid grid-cols-2 gap-3">
              {scores.map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <DonutChart value={s.value} max={10} size={44} color={s.color} />
                  <div>
                    <p className="text-[10px] font-medium text-text/80">{s.label}</p>
                    <p className="text-[9px] text-text-muted/40">{s.value > 0 ? `${s.value}/10` : 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Progress */}
          <div className="glass rounded-xl p-4 flex flex-col items-center justify-center corner-frame">
            <p className="text-[10px] font-medium text-text-muted/50 uppercase tracking-wider mb-3 self-start">Pipeline</p>
            <ProgressRing progress={pipeline.percentage} size={90} label="complete" />
            <p className="text-[10px] text-text-muted/40 mt-2">{pipeline.completed.length} of {pipeline.total} stages</p>
          </div>
        </div>

        {/* ═══ SWOT ANALYSIS ═══ */}
        {data.swot && (data.swot.strengths.length > 0 || data.swot.weaknesses.length > 0 || data.swot.opportunities.length > 0 || data.swot.threats.length > 0) && (
          <Section title="SWOT Analysis" icon={<Target className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'swot'} onToggle={() => setExpandedSection(expandedSection === 'swot' ? null : 'swot')}>
            <SwotQuadrant
              strengths={data.swot.strengths}
              weaknesses={data.swot.weaknesses}
              opportunities={data.swot.opportunities}
              threats={data.swot.threats}
            />
          </Section>
        )}

        {/* Actions */}
        <Section title="What to do now" count={`${completedCount}/${totalActions}`} icon={<Zap className="w-3.5 h-3.5 text-primary" />} expanded={expandedSection === 'actions'} onToggle={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}>
          {Object.entries(actionsByCategory).map(([category, items]) => (
            <div key={category} className="mb-3 last:mb-0">
              <p className="text-[10px] font-medium text-accent-gold/70 mb-1 px-1">{category}</p>
              {items.map((item, i) => {
                const gIdx = actionItems.indexOf(item);
                const done = completedActions.has(gIdx);
                return (
                  <div key={i} onClick={() => toggleAction(gIdx)}
                    className={`flex items-start gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all hover:bg-white/[0.02] ${done ? 'opacity-30' : ''}`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-border flex-shrink-0 mt-0.5" />}
                    <p className={`text-[11px] leading-relaxed flex-1 ${done ? 'line-through text-text-muted/30' : 'text-text/80'}`}>{item.text}</p>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 ${item.priority === 'high' ? 'bg-primary/15 text-primary' : 'bg-accent-gold/10 text-accent-gold/70'}`}>
                      {item.priority === 'high' ? 'now' : 'soon'}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </Section>

        {/* Tools row — two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Revenue Calculator */}
        <Section title="Revenue calculator" icon={<Calculator className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'calc'} onToggle={() => setExpandedSection(expandedSection === 'calc' ? null : 'calc')}>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="text-[9px] text-text-muted/50">Price ($)</label>
              <input value={revCalc.price} onChange={e => setRevCalc(p => ({ ...p, price: e.target.value }))} type="number" placeholder="20"
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[9px] text-text-muted/50">Customers</label>
              <input value={revCalc.customers} onChange={e => setRevCalc(p => ({ ...p, customers: e.target.value }))} type="number" placeholder="100"
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[9px] text-text-muted/50">Purchases/mo</label>
              <input value={revCalc.frequency} onChange={e => setRevCalc(p => ({ ...p, frequency: e.target.value }))} type="number" placeholder="1"
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary" />
            </div>
          </div>
          {monthlyRev > 0 && (
            <div className="glass rounded-lg p-3 text-center corner-frame data-grid">
              <p className="text-[10px] text-text-muted/50">Monthly revenue</p>
              <p className="text-lg font-bold text-accent-green text-glow-green metric-value animate-count">${monthlyRev.toLocaleString()}</p>
              <p className="text-[10px] text-text-muted/30 metric-value">${(monthlyRev * 12).toLocaleString()}/year</p>
            </div>
          )}
        </Section>

        {/* Progress Log */}
        <Section title="Progress log" count={logs.length > 0 ? `${logs.length}` : undefined} icon={<PenLine className="w-3.5 h-3.5 text-accent-green" />} expanded={expandedSection === 'log'} onToggle={() => setExpandedSection(expandedSection === 'log' ? null : 'log')}>
          <div className="flex gap-2 mb-2">
            <input value={logEntry} onChange={e => setLogEntry(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLog()}
              placeholder="What did you accomplish today?"
              className="flex-1 bg-surface border border-border rounded px-2.5 py-1.5 text-[11px] text-text placeholder:text-text-muted/30 focus:outline-none focus:border-primary" />
            <button onClick={addLog} disabled={!logEntry.trim()} className="text-[10px] text-primary px-2 py-1.5 rounded hover:bg-primary/5 disabled:opacity-30">Log</button>
          </div>
          {logs.length === 0 && <p className="text-[10px] text-text-muted/30 px-1">No entries yet. Log your progress to track momentum.</p>}
          {logs.slice(0, 5).map((log, i) => (
            <div key={i} className="flex items-start gap-2 px-1 py-1">
              <CheckCircle2 className="w-3 h-3 text-accent-green/50 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-text/70">{log.text}</p>
                <p className="text-[9px] text-text-muted/30">{new Date(log.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </Section>

        </div>{/* close tools grid */}

        {/* Business snapshot */}
        <Section title="Your business" icon={<Target className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'snapshot'} onToggle={() => setExpandedSection(expandedSection === 'snapshot' ? null : 'snapshot')}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1">
            <Metric label="Offering" value={metrics.offering} />
            <Metric label="Audience" value={metrics.targetAudience} />
            <Metric label="Revenue" value={metrics.revenueMonthly} />
            <Metric label="Price" value={metrics.pricePoint} />
            <Metric label="Channels" value={metrics.activeChannels} />
            <Metric label="Value prop" value={metrics.coreValueProp} />
          </div>
        </Section>

        {/* Strengths & Risks */}
        {(strengths.length > 0 || risks.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strengths.length > 0 && (
              <Section title="Strengths" icon={<Star className="w-3.5 h-3.5 text-accent-green" />} expanded={expandedSection === 'strengths'} onToggle={() => setExpandedSection(expandedSection === 'strengths' ? null : 'strengths')}>
                {strengths.slice(0, 4).map((s, i) => <p key={i} className="text-[11px] text-text-muted/70 leading-relaxed px-1 py-0.5">+ {s}</p>)}
              </Section>
            )}
            {risks.length > 0 && (
              <Section title="Risks" icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />} expanded={expandedSection === 'risks'} onToggle={() => setExpandedSection(expandedSection === 'risks' ? null : 'risks')}>
                {risks.slice(0, 4).map((r, i) => <p key={i} className="text-[11px] text-text-muted/70 leading-relaxed px-1 py-0.5">- {r}</p>)}
              </Section>
            )}
          </div>
        )}

        {/* Stage details */}
        {Object.keys(stageFindings).length > 0 && (
          <Section title="Analysis details" icon={<BarChart3 className="w-3.5 h-3.5 text-text-muted/50" />} expanded={expandedSection === 'stages'} onToggle={() => setExpandedSection(expandedSection === 'stages' ? null : 'stages')}>
            {Object.entries(stageFindings).map(([stage, findings]) => findings.length > 0 && (
              <details key={stage} className="group">
                <summary className="flex items-center justify-between px-1 py-1.5 text-xs text-text-muted cursor-pointer hover:text-text transition-colors list-none">
                  <span>{STAGE_LABELS[stage]}</span>
                  <span className="text-[9px] text-text-muted/30">{findings.length}</span>
                </summary>
                <div className="pl-3 pb-2 space-y-1">
                  {findings.map((f, i) => <p key={i} className="text-[11px] text-text-muted/60 leading-relaxed border-l border-primary/10 pl-2">{f}</p>)}
                </div>
              </details>
            ))}
          </Section>
        )}

        {/* Goals */}
        {(has(metrics.goal30d) || has(metrics.goal6m) || has(metrics.goal1y)) && (
          <Section title="Goals" icon={<TrendingUp className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'goals'} onToggle={() => setExpandedSection(expandedSection === 'goals' ? null : 'goals')}>
            <div className="space-y-2 px-1">
              {has(metrics.goal30d) && <Goal label="30d" value={metrics.goal30d} color="text-accent-green" />}
              {has(metrics.goal6m) && <Goal label="6m" value={metrics.goal6m} color="text-accent-blue" />}
              {has(metrics.goal1y) && <Goal label="1y" value={metrics.goal1y} color="text-primary-light" />}
            </div>
          </Section>
        )}

        {/* Momentum Streak */}
        {logs.length > 0 && (
          <div className="glass rounded-xl p-3 flex items-center justify-between corner-frame glass-glow">
            <div className="flex items-center gap-2">
              <div className={`text-lg font-bold metric-value ${streakDays >= 7 ? 'text-accent-green text-glow-green' : streakDays >= 3 ? 'text-accent-gold text-glow-gold' : 'text-primary text-glow-red'}`}>{streakDays}</div>
              <div>
                <p className="text-[11px] text-text/80">day streak</p>
                <p className="text-[9px] text-text-muted/40">{streakDays >= 7 ? 'On fire. Keep it going.' : streakDays >= 3 ? 'Building momentum.' : 'Log daily to build your streak.'}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[...Array(7)].map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                const hasLog = logs.some(l => new Date(l.date).toDateString() === d.toDateString());
                return <div key={i} className={`w-2 h-2 rounded-sm ${hasLog ? 'bg-primary' : 'bg-surface-light'}`} title={d.toLocaleDateString()} />;
              })}
            </div>
          </div>
        )}

        {/* Experiment Tracker */}
        <Section title="Experiments" count={experiments.length > 0 ? `${experiments.filter(e => e.status === 'won').length}W/${experiments.filter(e => e.status === 'lost').length}L` : undefined} icon={<Lightbulb className="w-3.5 h-3.5 text-purple-400" />} expanded={expandedSection === 'experiments'} onToggle={() => setExpandedSection(expandedSection === 'experiments' ? null : 'experiments')}>
          <div className="flex gap-2 mb-2">
            <input value={newExperiment} onChange={e => setNewExperiment(e.target.value)} onKeyDown={e => e.key === 'Enter' && addExperiment()}
              placeholder="Hypothesis: if I do X, then Y will happen..."
              className="flex-1 bg-surface border border-border rounded px-2.5 py-1.5 text-[11px] text-text placeholder:text-text-muted/30 focus:outline-none focus:border-primary" />
            <button onClick={addExperiment} disabled={!newExperiment.trim()} className="text-[10px] text-primary px-2 py-1.5 rounded hover:bg-primary/5 disabled:opacity-30">Add</button>
          </div>
          {experiments.length === 0 && <p className="text-[10px] text-text-muted/30 px-1">Test assumptions instead of guessing. Add your first experiment.</p>}
          {experiments.map((exp, i) => (
            <div key={i} className="flex items-start gap-2 px-1 py-1.5">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${exp.status === 'won' ? 'bg-accent-green' : exp.status === 'lost' ? 'bg-red-400' : 'bg-accent-gold animate-pulse'}`} />
              <p className={`text-[11px] flex-1 ${exp.status !== 'testing' ? 'text-text-muted/50' : 'text-text/80'}`}>{exp.hypothesis}</p>
              {exp.status === 'testing' && (
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => updateExperiment(i, 'won')} className="text-[9px] text-accent-green px-1.5 py-0.5 rounded hover:bg-accent-green/10">won</button>
                  <button onClick={() => updateExperiment(i, 'lost')} className="text-[9px] text-red-400 px-1.5 py-0.5 rounded hover:bg-red-400/10">lost</button>
                </div>
              )}
              {exp.status !== 'testing' && <span className={`text-[9px] ${exp.status === 'won' ? 'text-accent-green' : 'text-red-400'}`}>{exp.status}</span>}
            </div>
          ))}
        </Section>

        {/* Milestones */}
        <Section title="Milestones" count={milestones.length > 0 ? `${milestones.filter(m => m.status === 'on-track').length}/${milestones.length}` : undefined} icon={<CalendarDays className="w-3.5 h-3.5 text-accent-blue" />} expanded={expandedSection === 'milestones'} onToggle={() => setExpandedSection(expandedSection === 'milestones' ? null : 'milestones')}>
          <div className="flex gap-2 mb-2">
            <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMilestone()}
              placeholder="Revenue milestone, launch target, growth goal..."
              className="flex-1 bg-surface border border-border rounded px-2.5 py-1.5 text-[11px] text-text placeholder:text-text-muted/30 focus:outline-none focus:border-primary" />
            <button onClick={addMilestone} disabled={!newMilestone.trim()} className="text-[10px] text-primary px-2 py-1.5 rounded hover:bg-primary/5 disabled:opacity-30">Add</button>
          </div>
          {milestones.length === 0 && <p className="text-[10px] text-text-muted/30 px-1">Set monthly targets to track your trajectory.</p>}
          {milestones.map((ms, i) => (
            <div key={i} className="flex items-center gap-2 px-1 py-1.5">
              <button onClick={() => cycleMilestoneStatus(i)}
                className={`w-2 h-2 rounded-full flex-shrink-0 ${ms.status === 'on-track' ? 'bg-accent-green' : ms.status === 'at-risk' ? 'bg-accent-gold' : 'bg-red-400'}`}
                title={`Status: ${ms.status}. Click to change.`} />
              <p className="text-[11px] text-text/80 flex-1">{ms.text}</p>
              <span className={`text-[9px] ${ms.status === 'on-track' ? 'text-accent-green' : ms.status === 'at-risk' ? 'text-accent-gold' : 'text-red-400'}`}>
                {ms.status.replace('-', ' ')}
              </span>
            </div>
          ))}
        </Section>

        {/* Quick nav */}
        <div className="flex gap-2 pb-20">
          <NavPill href={`/session/${id}`} label="Chat" />
          <NavPill href={`/brief/${id}`} label="Brief" />
          <NavPill href="/memories" label="Memory" />
          <NavPill href="/" label="Home" />
        </div>
      </main>

      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} />
    </div>
  );
}

function Section({ title, icon, children, expanded, onToggle, count }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode;
  expanded?: boolean; onToggle?: () => void; count?: string | number;
}) {
  return (
    <div className="glass rounded-xl overflow-hidden border-glow card-lift">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-[13px] font-medium text-text/90">{title}</span>
          {count !== undefined && <span className="text-[10px] text-text-muted/30 ml-1 metric-value">{count}</span>}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted/30 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 animate-slide-up">
          <div className="divider-red mb-3" />
          {children}
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const v = value && value.length > 0;
  return (
    <div className="py-0.5">
      <p className="text-[9px] text-text-muted/40">{label}</p>
      <p className={`text-[11px] leading-snug ${v ? 'text-text/80' : 'text-text-muted/15'}`}>{v ? (value.length > 60 ? value.slice(0, 60) + '...' : value) : '—'}</p>
    </div>
  );
}

function Goal({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex gap-2">
      <span className={`text-[10px] font-semibold ${color} w-6 flex-shrink-0`}>{label}</span>
      <p className="text-[11px] text-text-muted/70 leading-relaxed">{value.length > 100 ? value.slice(0, 100) + '...' : value}</p>
    </div>
  );
}

function NavPill({ href, label }: { href: string; label: string }) {
  return <a href={href} className="flex-1 text-center text-[10px] text-text-muted/50 hover:text-text py-2 rounded-lg glass-subtle hover:border-primary/20 transition-all card-lift">{label}</a>;
}
