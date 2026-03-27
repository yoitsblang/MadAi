'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import {
  ArrowLeft, ChevronDown, ChevronRight, AlertTriangle, Star, TrendingUp, Target, BarChart3,
  CheckCircle2, Circle, Zap, Edit3, Check, X, MessageSquare,
  Calculator, PenLine, Lightbulb, CalendarDays, BookMarked, Plus,
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

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [logEntry, setLogEntry] = useState('');
  const [logs, setLogs] = useState<Array<{ text: string; date: string }>>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [actionsRef] = useAutoAnimate({ duration: 150 });

  useEffect(() => {
    fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); if (d) setNewName(d.session.name); }).catch(() => router.push('/'));
    const saved = localStorage.getItem(`logs-${id}`);
    if (saved) setLogs(JSON.parse(saved));
  }, [id, router]);

  const toggleAction = useCallback((idx: number) => {
    setCompletedActions(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }, []);

  const handleRename = useCallback(async () => {
    if (!newName.trim()) return;
    await fetch(`/api/sessions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
    setData(prev => prev ? { ...prev, session: { ...prev.session, name: newName.trim() } } : prev);
    setRenaming(false);
    toast.success('Project renamed');
  }, [id, newName]);

  const addLog = useCallback(() => {
    if (!logEntry.trim()) return;
    const updated = [{ text: logEntry.trim(), date: new Date().toISOString() }, ...logs];
    setLogs(updated);
    localStorage.setItem(`logs-${id}`, JSON.stringify(updated));
    setLogEntry('');
    toast.success('Progress logged');
  }, [logEntry, logs, id]);

  if (loading || !data) return (
    <div className="min-h-screen bg-surface page-transition">
      <div className="border-b border-border/20 h-12" />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div><div className="skeleton h-3 w-24 mb-2" /><div className="skeleton h-7 w-64" /></div>
          <div className="skeleton w-14 h-14 rounded-full" />
        </div>
        <div className="skeleton h-2 w-full rounded-full" />
        <div className="skeleton h-20 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-3">
            <div className="skeleton h-32" /><div className="skeleton h-24" /><div className="skeleton h-24" />
          </div>
          <div className="space-y-3">
            <div className="skeleton h-64" /><div className="skeleton h-40" />
          </div>
        </div>
      </div>
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
  const completedCount = completedActions.size;
  const totalActions = actionItems.length;

  // Categorize actions
  const actionsByCategory: Record<string, typeof actionItems> = {};
  for (const item of actionItems) {
    const cat = ['intake', 'value-diagnosis'].includes(item.stage) ? 'Foundation' :
      ['business-logic', 'platform-power'].includes(item.stage) ? 'Operations' :
      ['strategy-macro', 'strategy-meso', 'strategy-micro'].includes(item.stage) ? 'Strategy' : 'General';
    if (!actionsByCategory[cat]) actionsByCategory[cat] = [];
    actionsByCategory[cat].push(item);
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="min-h-screen bg-surface page-transition">
      {/* ═══ HEADER ═══ */}
      <header className="border-b border-border/20 bg-surface/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text flex-shrink-0"><ArrowLeft className="w-4 h-4" /></button>
            <img src="/logo-64.png" alt="" className="w-6 h-6 rounded-md flex-shrink-0" />
            {renaming ? (
              <div className="flex items-center gap-1.5">
                <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()}
                  className="text-sm font-medium text-text bg-surface-light border border-primary/30 rounded-lg px-2.5 py-1 focus:outline-none w-48" autoFocus />
                <button onClick={handleRename} className="text-accent-green"><Check className="w-4 h-4" /></button>
                <button onClick={() => setRenaming(false)} className="text-text-muted"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => setRenaming(true)} className="text-sm font-medium text-text truncate max-w-[250px] hover:text-primary transition-colors flex items-center gap-1.5">
                {data.session.name} <Edit3 className="w-3 h-3 text-text-muted/20" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a href={`/session/${id}`} className="text-xs text-text-muted hover:text-text px-2.5 py-1.5 rounded-lg hover:bg-surface-light transition-colors flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </a>
            <a href={`/brief/${id}`} className="text-xs text-primary hover:text-primary-light px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" /> Brief
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6">

        {/* ═══ PROJECT HEADER ═══ */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="label-xs mb-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="heading-lg text-text">{greeting}. Here's your focus.</h1>
            {has(metrics.primaryBottleneck) && (
              <p className="text-xs text-red-400/70 mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Bottleneck: {metrics.primaryBottleneck}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <ProgressRing progress={pipeline.percentage} size={56} label="complete" />
            <div className="text-right hidden sm:block">
              <div className={`text-2xl font-bold data-value ${avgHealth >= 7 ? 'text-accent-green' : avgHealth >= 4 ? 'text-accent-gold' : avgHealth > 0 ? 'text-primary' : 'text-text-muted/20'}`}>
                {avgHealth > 0 ? avgHealth.toFixed(1) : '--'}
              </div>
              <p className="label-xs">health score</p>
            </div>
          </div>
        </div>

        {/* ═══ TWO-COLUMN LAYOUT ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

          {/* ══ LEFT COLUMN ══ */}
          <div className="space-y-5">

            {/* Pipeline */}
            <div className="flex items-center gap-1.5">
              {pipeline.stages.map(stage => {
                const done = pipeline.completed.includes(stage);
                return (
                  <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                    <div className={`w-full h-1.5 rounded-full ${done ? 'bg-primary' : 'bg-surface-lighter'}`} />
                    <span className="label-xs" style={{ fontSize: '8px' }}>{STAGE_LABELS[stage]}</span>
                  </div>
                );
              })}
            </div>

            {/* Sterling suggests */}
            {actionItems.length > 0 && actionItems[0] && !completedActions.has(0) && (
              <div className="card-dark p-4 border-l-2 border-primary">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-accent-gold" />
                  <span className="label-sm text-accent-gold/80">Top priority</span>
                </div>
                <p className="text-sm text-text leading-relaxed">{actionItems[0].text}</p>
              </div>
            )}

            {/* Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="heading-sm text-text flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> What to do now
                </h2>
                <span className="label-xs data-value">{completedCount}/{totalActions}</span>
              </div>
              <div ref={actionsRef} className="space-y-1">
                {Object.entries(actionsByCategory).map(([category, items]) => (
                  <div key={category}>
                    <p className="label-xs text-accent-gold/60 mb-1.5 mt-3 first:mt-0">{category}</p>
                    {items.map((item, i) => {
                      const gIdx = actionItems.indexOf(item);
                      const done = completedActions.has(gIdx);
                      return (
                        <div key={gIdx} onClick={() => toggleAction(gIdx)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all hover:bg-surface-light ${done ? 'opacity-30' : ''}`}>
                          {done ? <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" /> : <Circle className="w-4 h-4 text-border flex-shrink-0 mt-0.5" />}
                          <p className={`text-sm leading-relaxed flex-1 ${done ? 'line-through text-text-muted/30' : 'text-text/80'}`}>{item.text}</p>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                            item.priority === 'high' ? 'bg-primary/15 text-primary' : 'bg-accent-gold/10 text-accent-gold/70'
                          }`}>{item.priority === 'high' ? 'NOW' : 'SOON'}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* SWOT */}
            {data.swot && (data.swot.strengths.length > 0 || data.swot.weaknesses.length > 0) && (
              <div>
                <h2 className="heading-sm text-text flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-accent-gold" /> SWOT Analysis
                </h2>
                <SwotQuadrant strengths={data.swot.strengths} weaknesses={data.swot.weaknesses} opportunities={data.swot.opportunities} threats={data.swot.threats} />
              </div>
            )}

            {/* Strengths & Risks */}
            {(strengths.length > 0 || risks.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {strengths.length > 0 && (
                  <div className="card-dark p-4">
                    <h3 className="label-sm text-accent-green mb-2 flex items-center gap-1.5"><Star className="w-3 h-3" /> Strengths</h3>
                    {strengths.slice(0, 4).map((s, i) => <p key={i} className="text-xs text-text-muted/60 leading-relaxed py-0.5">+ {s}</p>)}
                  </div>
                )}
                {risks.length > 0 && (
                  <div className="card-dark p-4">
                    <h3 className="label-sm text-red-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Risks</h3>
                    {risks.slice(0, 4).map((r, i) => <p key={i} className="text-xs text-text-muted/60 leading-relaxed py-0.5">- {r}</p>)}
                  </div>
                )}
              </div>
            )}

            {/* Stage analysis */}
            {Object.keys(stageFindings).length > 0 && (
              <div>
                <button onClick={() => setShowAnalysis(!showAnalysis)}
                  className="flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Analysis details</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAnalysis ? 'rotate-180' : ''}`} />
                </button>
                {showAnalysis && (
                  <div className="space-y-2 animate-slide-up">
                    {Object.entries(stageFindings).map(([stage, findings]) => findings.length > 0 && (
                      <details key={stage} className="group card-dark">
                        <summary className="flex items-center justify-between px-4 py-2.5 text-xs text-text-muted cursor-pointer hover:text-text transition-colors list-none">
                          <span>{STAGE_LABELS[stage]}</span>
                          <span className="label-xs">{findings.length}</span>
                        </summary>
                        <div className="px-4 pb-3 space-y-1">
                          {findings.map((f, i) => <p key={i} className="text-xs text-text-muted/50 leading-relaxed border-l border-primary/10 pl-3">{f}</p>)}
                        </div>
                      </details>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="space-y-5">

            {/* Radar + Scores */}
            <div className="card-dark p-4">
              <h3 className="label-sm mb-3">Business Radar</h3>
              <div className="flex justify-center mb-4">
                <RadarChart data={scores.map(s => ({ label: s.label, value: s.value, max: 10 }))} size={170} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {scores.map(s => (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <DonutChart value={s.value} max={10} size={36} color={s.color} />
                    <div>
                      <p className="text-xs text-text/80">{s.label}</p>
                      <p className="label-xs data-value">{s.value > 0 ? `${s.value}/10` : 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business snapshot */}
            <div className="card-dark p-4">
              <h3 className="label-sm mb-3">Your Business</h3>
              <div className="space-y-2">
                <SnapRow label="Offering" value={metrics.offering} />
                <SnapRow label="Audience" value={metrics.targetAudience} />
                <SnapRow label="Revenue" value={metrics.revenueMonthly} />
                <SnapRow label="Price" value={metrics.pricePoint} />
                <SnapRow label="Channels" value={metrics.activeChannels} />
                <SnapRow label="Value prop" value={metrics.coreValueProp} />
              </div>
            </div>

            {/* Revenue calculator */}
            <RevCalc />

            {/* Progress log */}
            <div className="card-dark p-4">
              <h3 className="label-sm mb-2 flex items-center gap-1.5"><PenLine className="w-3 h-3 text-accent-green" /> Progress Log</h3>
              <div className="flex gap-2 mb-3">
                <input value={logEntry} onChange={e => setLogEntry(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLog()}
                  placeholder="What did you accomplish?"
                  className="flex-1 bg-surface border border-border/20 rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted/25 focus:outline-none focus:border-primary/30" />
                <button onClick={addLog} disabled={!logEntry.trim()} className="text-xs text-primary px-2 disabled:opacity-30">Log</button>
              </div>
              {logs.length === 0 && <p className="text-[10px] text-text-muted/25">Log progress to build momentum.</p>}
              {logs.slice(0, 5).map((log, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5">
                  <CheckCircle2 className="w-3 h-3 text-accent-green/40 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-text/70">{log.text}</p>
                    <p className="text-[9px] text-text-muted/25">{new Date(log.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Goals */}
            {(has(metrics.goal30d) || has(metrics.goal6m) || has(metrics.goal1y)) && (
              <div className="card-dark p-4">
                <h3 className="label-sm mb-2 flex items-center gap-1.5"><TrendingUp className="w-3 h-3 text-accent-gold" /> Goals</h3>
                <div className="space-y-2">
                  {has(metrics.goal30d) && <GoalRow label="30d" value={metrics.goal30d} color="text-accent-green" />}
                  {has(metrics.goal6m) && <GoalRow label="6m" value={metrics.goal6m} color="text-accent-blue" />}
                  {has(metrics.goal1y) && <GoalRow label="1y" value={metrics.goal1y} color="text-primary-light" />}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ QUICK NAV ═══ */}
        <div className="flex gap-2 mt-8 pb-20">
          <NavPill href={`/session/${id}`} label="Chat" icon={<MessageSquare className="w-3.5 h-3.5" />} />
          <NavPill href={`/brief/${id}`} label="Brief" icon={<BookMarked className="w-3.5 h-3.5" />} />
          <NavPill href="/" label="Home" icon={<ArrowLeft className="w-3.5 h-3.5" />} />
        </div>
      </main>

      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} />
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function SnapRow({ label, value }: { label: string; value: string }) {
  const v = value && value.length > 0;
  return (
    <div className="flex items-start gap-2">
      <span className="label-xs w-16 flex-shrink-0 mt-0.5">{label}</span>
      <span className={`text-xs leading-snug ${v ? 'text-text/70' : 'text-text-muted/15'}`}>{v ? (value.length > 60 ? value.slice(0, 60) + '...' : value) : '—'}</span>
    </div>
  );
}

function GoalRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex gap-2">
      <span className={`label-sm ${color} w-6 flex-shrink-0`}>{label}</span>
      <p className="text-xs text-text-muted/60 leading-relaxed">{value.length > 100 ? value.slice(0, 100) + '...' : value}</p>
    </div>
  );
}

function RevCalc() {
  const [price, setPrice] = useState('');
  const [customers, setCustomers] = useState('');
  const [freq, setFreq] = useState('1');
  const monthly = (parseFloat(price) || 0) * (parseFloat(customers) || 0) * (parseFloat(freq) || 1);

  return (
    <div className="card-dark p-4">
      <h3 className="label-sm mb-2 flex items-center gap-1.5"><Calculator className="w-3 h-3 text-accent-gold" /> Revenue Calc</h3>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <span className="label-xs" style={{ fontSize: '8px' }}>Price ($)</span>
          <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="20"
            className="w-full bg-surface border border-border/20 rounded-lg px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary/30" />
        </div>
        <div>
          <span className="label-xs" style={{ fontSize: '8px' }}>Customers</span>
          <input value={customers} onChange={e => setCustomers(e.target.value)} type="number" placeholder="100"
            className="w-full bg-surface border border-border/20 rounded-lg px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary/30" />
        </div>
        <div>
          <span className="label-xs" style={{ fontSize: '8px' }}>Freq/mo</span>
          <input value={freq} onChange={e => setFreq(e.target.value)} type="number" placeholder="1"
            className="w-full bg-surface border border-border/20 rounded-lg px-2 py-1.5 text-xs text-text focus:outline-none focus:border-primary/30" />
        </div>
      </div>
      {monthly > 0 && (
        <div className="text-center py-2 card-elevated rounded-lg">
          <p className="text-lg font-bold text-accent-green data-value">${monthly.toLocaleString()}</p>
          <p className="label-xs">${(monthly * 12).toLocaleString()}/year</p>
        </div>
      )}
    </div>
  );
}

function NavPill({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a href={href} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-text-muted/40 hover:text-text py-2.5 rounded-lg card-dark hover:border-primary/20 transition-all">
      {icon} {label}
    </a>
  );
}
