'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, AlertTriangle, TrendingUp, Target,
  CheckCircle2, Circle, Zap, Edit3, Check, X, MessageSquare,
  BookMarked, PenLine, Eye, Crosshair, Activity,
  BarChart2, ArrowUpRight, Shield, ChevronDown, ChevronRight,
} from 'lucide-react';
import FloatingChat from '@/components/dashboard/FloatingChat';
import ConstraintMap from '@/components/dashboard/ConstraintMap';
import SprintBuilder from '@/components/dashboard/SprintBuilder';

interface Bottleneck { primary: string; severity: number; confidence: string; evidence: string[]; upside: string; actions: string[]; }
interface Recommendation { action: string; reason: string; outcome: string; difficulty: string; time: string; metric: string; }
interface DashboardData {
  session: { id: string; name: string };
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  stageFindings: Record<string, string[]>;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  risks: string[];
  strengths: string[];
  bottleneck: Bottleneck | null;
  recommendations: Recommendation[];
  constraintMap: Array<{ label: string; score: number; status: string }>;
  learnings: string[];
}

/* ═══ SVG CHARTS ═══ */
function GaugeRing({ value, size = 90, label }: { value: number; size?: number; label: string }) {
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 70 ? '#22c55e' : value >= 40 ? '#f59e0b' : '#dc2626';
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(220,38,38,0.08)" strokeWidth={7} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease', filter: `drop-shadow(0 0 8px ${color}50)` }} />
      </svg>
      <span className="text-xl font-bold font-mono mt-[-58px] mb-[28px]" style={{ color, textShadow: `0 0 15px ${color}30` }}>{value}%</span>
      <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-600 font-medium">{label}</span>
    </div>
  );
}

function SparkBar({ data, color = '#dc2626' }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-[2px] h-6">
      {data.map((v, i) => (
        <div key={i} className="w-[4px] rounded-sm transition-all"
          style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.4 + (i / data.length) * 0.6,
            boxShadow: `0 0 4px ${color}20` }} />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [showEvidence, setShowEvidence] = useState(false);
  const [logEntry, setLogEntry] = useState('');
  const [logs, setLogs] = useState<Array<{ text: string; date: string }>>([]);
  const [expandedAction, setExpandedAction] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); if (d) setNewName(d.session.name); }).catch(() => router.push('/'));
    const saved = localStorage.getItem(`logs-${id}`);
    if (saved) setLogs(JSON.parse(saved));
  }, [id, router]);

  const toggleAction = useCallback((idx: number) => {
    setCompletedActions(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
    toast.success('Updated');
  }, []);

  const handleRename = useCallback(async () => {
    if (!newName.trim()) return;
    await fetch(`/api/sessions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() }) });
    setData(prev => prev ? { ...prev, session: { ...prev.session, name: newName.trim() } } : prev);
    setRenaming(false); toast.success('Renamed');
  }, [id, newName]);

  const addLog = useCallback(() => {
    if (!logEntry.trim()) return;
    const updated = [{ text: logEntry.trim(), date: new Date().toISOString() }, ...logs];
    setLogs(updated); localStorage.setItem(`logs-${id}`, JSON.stringify(updated));
    setLogEntry(''); toast.success('Progress logged');
  }, [logEntry, logs, id]);

  if (loading || !data) return (
    <div className="min-h-screen bg-[#050507]">
      <div className="h-12 border-b border-red-900/20" />
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-28 rounded-xl bg-[#0a0a0f] border border-red-900/10 animate-pulse" />)}
      </div>
    </div>
  );

  const { metrics, pipeline, actionItems, bottleneck, recommendations, constraintMap, learnings, risks, strengths } = data;
  const completedCount = completedActions.size;
  const totalActions = actionItems.length;

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* ═══ TOP BAR ═══ */}
      <header className="border-b border-red-900/30 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/')} className="text-zinc-600 hover:text-red-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            {renaming ? (
              <div className="flex items-center gap-1.5">
                <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename()}
                  className="text-sm font-bold text-white bg-[#0a0a0f] border border-red-500/30 rounded-lg px-3 py-1 focus:outline-none w-48" autoFocus />
                <button onClick={handleRename} className="text-green-500"><Check className="w-4 h-4" /></button>
                <button onClick={() => setRenaming(false)} className="text-zinc-600"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={() => setRenaming(true)} className="text-sm font-bold text-white truncate max-w-[250px] hover:text-red-400 transition-colors flex items-center gap-1.5">
                {data.session.name} <Edit3 className="w-3 h-3 text-zinc-700" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <a href={`/session/${id}`} className="text-[10px] font-medium text-zinc-500 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 border border-red-900/20">
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </a>
            <a href={`/brief/${id}`} className="text-[10px] font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/5 border border-red-500/20 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" /> Brief
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-6 space-y-6 pb-24 md:pb-8">

        {/* ════════════════════════════════
            HERO: BOTTLENECK COMMAND CARD
            ════════════════════════════════ */}
        {bottleneck ? (
          <div className="relative bg-[#0a0a0f] border border-red-500/30 rounded-xl overflow-hidden
            shadow-[0_0_40px_rgba(220,38,38,0.08)]">
            {/* Animated top accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            <div className="p-5 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">CURRENT BOTTLENECK</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{bottleneck.primary}</h2>

                  {/* Severity / Confidence / Upside */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-1.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Severity</span>
                      <p className="text-sm font-bold font-mono text-red-400" style={{ textShadow: '0 0 10px rgba(220,38,38,0.3)' }}>
                        {bottleneck.severity}/10
                      </p>
                    </div>
                    <div className="bg-white/[0.02] border border-zinc-800/50 rounded-lg px-3 py-1.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Confidence</span>
                      <p className="text-sm font-bold font-mono text-zinc-300">{bottleneck.confidence}</p>
                    </div>
                    <div className="bg-green-500/5 border border-green-500/15 rounded-lg px-3 py-1.5">
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wider">Upside if fixed</span>
                      <p className="text-sm font-bold font-mono text-green-400">{bottleneck.upside}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                  <a href={`/session/${id}`}
                    className="text-xs bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-red-500 transition-all
                      shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50 text-center">
                    FIX THIS NOW
                  </a>
                  <button onClick={() => setShowEvidence(!showEvidence)}
                    className="text-xs text-zinc-500 hover:text-white px-4 py-2.5 rounded-lg border border-zinc-800 hover:border-red-500/30 transition-all flex items-center gap-1.5 justify-center">
                    <Eye className="w-3 h-3" /> {showEvidence ? 'Hide' : 'Evidence'}
                  </button>
                </div>
              </div>

              {/* Evidence */}
              {showEvidence && bottleneck.evidence.length > 0 && (
                <div className="mt-4 pt-4 border-t border-red-900/20 animate-slide-up">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-red-500/40 mb-3">WHY THIS WAS IDENTIFIED</p>
                  <div className="space-y-2">
                    {bottleneck.evidence.map((e, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-white/[0.02] rounded-lg p-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-zinc-400 leading-relaxed">{e}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#0a0a0f] border border-red-900/20 rounded-xl p-6 text-center">
            <Crosshair className="w-8 h-8 text-red-500/20 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-1">No bottleneck identified yet</h2>
            <p className="text-xs text-zinc-600 mb-4">Complete more stages to identify your #1 constraint.</p>
            <a href={`/session/${id}`} className="inline-flex items-center gap-2 text-xs bg-red-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50">
              <Zap className="w-3.5 h-3.5" /> Continue Analysis
            </a>
          </div>
        )}

        {/* ═══ GAUGES ROW ═══ */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 flex justify-center">
            <GaugeRing value={pipeline.percentage} label="Pipeline" />
          </div>
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 flex justify-center">
            <GaugeRing value={totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0} label="Actions" />
          </div>
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 flex justify-center">
            <GaugeRing value={Math.min(100, (learnings.length + strengths.length) * 12)} label="Intelligence" />
          </div>
        </div>

        {/* ═══ TODAY'S MOVES ═══ */}
        {actionItems.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-red-500" /> What to do now
              </h3>
              <span className="text-[10px] font-mono text-zinc-700">{completedCount}/{totalActions} DONE</span>
            </div>
            <div className="space-y-2">
              {actionItems.slice(0, 5).map((item, i) => {
                const done = completedActions.has(i);
                const rec = recommendations[i];
                const expanded = expandedAction === i;
                return (
                  <div key={i} className={`bg-[#0a0a0f] border rounded-xl overflow-hidden transition-all ${
                    done ? 'border-green-500/10 opacity-40' : 'border-red-900/15 hover:border-red-500/30'
                  }`}>
                    <div className="p-4 flex items-start gap-3">
                      <button onClick={() => toggleAction(i)} className="mt-0.5 flex-shrink-0">
                        {done
                          ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                          : <Circle className="w-5 h-5 text-zinc-700 hover:text-red-400 transition-colors" />
                        }
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${done ? 'line-through text-zinc-700' : 'text-zinc-200'}`}>{item.text}</p>
                        {rec && !done && (
                          <button onClick={() => setExpandedAction(expanded ? null : i)}
                            className="flex items-center gap-1 mt-1.5 text-[10px] text-red-500/50 hover:text-red-400 transition-colors">
                            {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                            {expanded ? 'Less' : 'Why this matters'}
                          </button>
                        )}
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        item.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-500/70 border border-amber-500/15'
                      }`}>{item.priority === 'high' ? 'NOW' : 'NEXT'}</span>
                    </div>
                    {/* Expanded detail */}
                    {expanded && rec && !done && (
                      <div className="px-4 pb-4 pt-0 ml-8 animate-slide-up">
                        <div className="bg-white/[0.02] rounded-lg p-3 border border-zinc-800/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[10px]">
                          <div>
                            <span className="text-zinc-600 uppercase tracking-wider">Expected outcome</span>
                            <p className="text-zinc-400 mt-0.5">{rec.outcome}</p>
                          </div>
                          <div>
                            <span className="text-zinc-600 uppercase tracking-wider">Time required</span>
                            <p className="text-zinc-400 mt-0.5">{rec.time}</p>
                          </div>
                          <div>
                            <span className="text-zinc-600 uppercase tracking-wider">Success metric</span>
                            <p className="text-zinc-400 mt-0.5">{rec.metric}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ TWO-COLUMN: Constraint Map + Health ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Constraint Map */}
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" /> Constraint Map
            </h3>
            <ConstraintMap constraints={constraintMap} />
          </div>

          {/* Business Health */}
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" /> Business Vitals
            </h3>
            <div className="space-y-2">
              <VitalRow label="Revenue" value={metrics.revenueMonthly} />
              <VitalRow label="Price Point" value={metrics.pricePoint} />
              <VitalRow label="Channels" value={metrics.activeChannels} />
              <VitalRow label="Audience" value={metrics.targetAudience} />
              <VitalRow label="Value Prop" value={metrics.coreValueProp} />
              <VitalRow label="Offering" value={metrics.offering} />
            </div>
          </div>
        </div>

        {/* ═══ 7-DAY SPRINT ═══ */}
        <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" /> 7-Day Sprint
          </h3>
          <SprintBuilder sessionId={id} actionItems={actionItems} />
        </div>

        {/* ═══ STRENGTHS + RISKS ═══ */}
        {(strengths.length > 0 || risks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.length > 0 && (
              <div className="bg-[#0a0a0f] border border-green-500/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" /> Strengths
                </h3>
                <div className="space-y-1.5">
                  {strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ArrowUpRight className="w-3 h-3 text-green-500/50 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-zinc-400">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {risks.length > 0 && (
              <div className="bg-[#0a0a0f] border border-red-500/10 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" /> Risks
                </h3>
                <div className="space-y-1.5">
                  {risks.map((r, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-red-500/40 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-zinc-400">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ LEARNINGS ═══ */}
        {learnings.length > 0 && (
          <div className="bg-[#0a0a0f] border border-amber-500/10 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" /> Intelligence Feed
            </h3>
            <div className="space-y-1.5">
              {learnings.map((l, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white/[0.015] rounded-lg p-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-zinc-500 leading-relaxed">{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROGRESS LOG ═══ */}
        <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <PenLine className="w-4 h-4 text-green-500" /> Progress Log
          </h3>
          <div className="flex gap-2 mb-4">
            <input value={logEntry} onChange={e => setLogEntry(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLog()}
              placeholder="What did you accomplish today?"
              className="flex-1 bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-zinc-700
                focus:outline-none focus:border-red-500/30 transition-colors" />
            <button onClick={addLog} disabled={!logEntry.trim()}
              className="text-xs font-bold text-red-400 px-4 border border-red-500/20 rounded-lg hover:bg-red-500/5 disabled:opacity-20 transition-colors">
              LOG
            </button>
          </div>
          {logs.length === 0 && <p className="text-[10px] text-zinc-800">Track what you&apos;ve done to build momentum.</p>}
          {logs.slice(0, 5).map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 py-2 border-t border-zinc-900/50 first:border-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500/30 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-zinc-400">{log.text}</p>
                <p className="text-[9px] text-zinc-800 font-mono">{new Date(log.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ═══ PIPELINE BAR ═══ */}
        <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 flex-1">
              {pipeline.stages.map(stage => (
                <div key={stage} className={`flex-1 h-2 rounded-full transition-all ${
                  pipeline.completed.includes(stage)
                    ? 'bg-red-500 shadow-[0_0_6px_rgba(220,38,38,0.4)]'
                    : 'bg-zinc-800'
                }`} />
              ))}
            </div>
            <span className="text-xs font-bold font-mono text-red-400">{pipeline.percentage}%</span>
          </div>
        </div>

        {/* ═══ NAV PILLS ═══ */}
        <div className="flex gap-2 pb-4">
          <a href={`/session/${id}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-zinc-600 hover:text-white py-3 rounded-xl bg-[#0a0a0f] border border-red-900/15 hover:border-red-500/30 transition-all">
            <MessageSquare className="w-3.5 h-3.5" /> Chat
          </a>
          <a href={`/brief/${id}`} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-zinc-600 hover:text-white py-3 rounded-xl bg-[#0a0a0f] border border-red-900/15 hover:border-red-500/30 transition-all">
            <BookMarked className="w-3.5 h-3.5" /> Brief
          </a>
          <a href="/" className="flex-1 flex items-center justify-center gap-1.5 text-xs text-zinc-600 hover:text-white py-3 rounded-xl bg-[#0a0a0f] border border-red-900/15 hover:border-red-500/30 transition-all">
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </a>
        </div>
      </main>

      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} />
    </div>
  );
}

function VitalRow({ label, value }: { label: string; value: string }) {
  const has = value && value.length > 0;
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-zinc-900/50 last:border-0">
      <span className="text-[10px] uppercase tracking-wider text-zinc-600 flex-shrink-0 w-20 mt-0.5">{label}</span>
      {has ? (
        <p className="text-xs text-zinc-300 text-right leading-snug">{value.length > 60 ? value.slice(0, 60) + '...' : value}</p>
      ) : (
        <p className="text-[10px] text-zinc-800 text-right">Not tracked</p>
      )}
    </div>
  );
}
