'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import {
  ArrowLeft, ChevronDown, AlertTriangle, TrendingUp, Target,
  CheckCircle2, Circle, Zap, Edit3, Check, X, MessageSquare,
  BookMarked, PenLine, ArrowRight, Eye, Crosshair,
} from 'lucide-react';
import FloatingChat from '@/components/dashboard/FloatingChat';
import ConstraintMap from '@/components/dashboard/ConstraintMap';
import SprintBuilder from '@/components/dashboard/SprintBuilder';

interface Bottleneck {
  primary: string;
  severity: number;
  confidence: string;
  evidence: string[];
  upside: string;
  actions: string[];
}

interface Recommendation {
  action: string;
  reason: string;
  outcome: string;
  difficulty: string;
  time: string;
  metric: string;
}

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
    toast.success('Renamed');
  }, [id, newName]);

  const addLog = useCallback(() => {
    if (!logEntry.trim()) return;
    const updated = [{ text: logEntry.trim(), date: new Date().toISOString() }, ...logs];
    setLogs(updated);
    localStorage.setItem(`logs-${id}`, JSON.stringify(updated));
    setLogEntry('');
    toast.success('Logged');
  }, [logEntry, logs, id]);

  // Skeleton loading
  if (loading || !data) return (
    <div className="min-h-screen bg-surface page-transition">
      <div className="border-b border-border/20 h-12" />
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 space-y-5">
        <div className="skeleton h-32 rounded-xl" />
        <div className="grid grid-cols-3 gap-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16" />)}</div>
        <div className="skeleton h-48" />
      </div>
    </div>
  );

  const { metrics, pipeline, actionItems, bottleneck, recommendations, constraintMap, learnings, risks, strengths } = data;
  const completedCount = completedActions.size;
  const totalActions = actionItems.length;

  // Top 3 moves only
  const topMoves = actionItems.slice(0, 3);
  const has = (v: string) => v && v.length > 0;

  return (
    <div className="min-h-screen bg-surface page-transition">
      {/* ═══ HEADER ═══ */}
      <header className="border-b border-border/20 bg-surface/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text"><ArrowLeft className="w-4 h-4" /></button>
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
          <div className="flex items-center gap-1.5">
            <a href={`/session/${id}`} className="text-xs text-text-muted hover:text-text px-2.5 py-1.5 rounded-lg hover:bg-surface-light transition-colors flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </a>
            <a href={`/brief/${id}`} className="text-xs text-primary hover:text-primary-light px-2.5 py-1.5 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" /> Brief
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 space-y-6">

        {/* ════════════════════════════════════════════════════════
            HERO: BOTTLENECK CARD — the single most important thing
            ════════════════════════════════════════════════════════ */}
        {bottleneck ? (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/60 via-primary to-primary/60" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Crosshair className="w-4 h-4 text-primary" />
                  <span className="label-sm text-primary">Current Bottleneck</span>
                </div>
                <h2 className="heading-lg text-text mb-2">{bottleneck.primary}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted/60">
                  <span>Severity: <strong className="text-primary data-value">{bottleneck.severity}/10</strong></span>
                  <span>Confidence: <strong className="text-text data-value">{bottleneck.confidence}</strong></span>
                  <span>Upside: <strong className="text-accent-green">{bottleneck.upside}</strong></span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a href={`/session/${id}`} className="text-xs bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors text-center">
                  Fix this now
                </a>
                <button onClick={() => setShowEvidence(!showEvidence)} className="text-xs text-text-muted hover:text-text px-4 py-2 rounded-lg border border-border/20 hover:border-border/40 transition-colors flex items-center gap-1.5 justify-center">
                  <Eye className="w-3 h-3" /> Evidence
                </button>
              </div>
            </div>
            {/* Evidence drawer */}
            {showEvidence && bottleneck.evidence.length > 0 && (
              <div className="mt-4 pt-4 border-t border-primary/10 animate-slide-up">
                <p className="label-xs text-text-muted/40 mb-2">Why Sterling identified this</p>
                <div className="space-y-1.5">
                  {bottleneck.evidence.map((e, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-xs text-text-muted/70 leading-relaxed">{e}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl card-dark p-5 sm:p-6 text-center">
            <Crosshair className="w-6 h-6 text-text-muted/20 mx-auto mb-2" />
            <h2 className="heading-md text-text mb-1">No bottleneck identified yet</h2>
            <p className="text-xs text-text-muted/50 mb-3">Complete more stages to let Sterling diagnose your #1 constraint.</p>
            <a href={`/session/${id}`} className="text-xs bg-primary/10 text-primary px-4 py-2 rounded-lg inline-flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Continue analysis
            </a>
          </div>
        )}

        {/* ═══ TODAY'S 3 MOVES ═══ */}
        {topMoves.length > 0 && (
          <div>
            <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> What to do now
              <span className="label-xs text-text-muted/30 data-value ml-auto">{completedCount}/{totalActions}</span>
            </h3>
            <div ref={actionsRef} className="space-y-2">
              {topMoves.map((item, i) => {
                const done = completedActions.has(i);
                const rec = recommendations[i];
                return (
                  <div key={i} onClick={() => toggleAction(i)}
                    className={`card-dark p-4 cursor-pointer transition-all hover:border-primary/20 ${done ? 'opacity-30' : ''}`}>
                    <div className="flex items-start gap-3">
                      {done ? <CheckCircle2 className="w-4.5 h-4.5 text-accent-green flex-shrink-0 mt-0.5" /> : <Circle className="w-4.5 h-4.5 text-border flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${done ? 'line-through text-text-muted/30' : 'text-text/90'}`}>{item.text}</p>
                        {rec && !done && (
                          <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-text-muted/40">
                            <span>Impact: <strong className="text-text-muted/60">{rec.outcome.slice(0, 40)}</strong></span>
                            <span>Time: <strong className="text-text-muted/60">{rec.time}</strong></span>
                            <span>Measure: <strong className="text-text-muted/60">{rec.metric.slice(0, 30)}</strong></span>
                          </div>
                        )}
                      </div>
                      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        item.priority === 'high' ? 'bg-primary/15 text-primary' : 'bg-accent-amber/10 text-accent-amber/70'
                      }`}>{item.priority === 'high' ? 'NOW' : 'SOON'}</span>
                    </div>
                  </div>
                );
              })}
              {actionItems.length > 3 && (
                <p className="text-[10px] text-text-muted/30 text-center">+ {actionItems.length - 3} more actions available</p>
              )}
            </div>
          </div>
        )}

        {/* ═══ TWO-COLUMN: Constraint Map + Health ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Constraint Map */}
          <div>
            <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-gold" /> Constraint Map
            </h3>
            <ConstraintMap constraints={constraintMap} />
          </div>

          {/* Business Health Strip */}
          <div>
            <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent-green" /> Business Health
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <HealthMetric label="Revenue" value={metrics.revenueMonthly} />
              <HealthMetric label="Price Point" value={metrics.pricePoint} />
              <HealthMetric label="Channels" value={metrics.activeChannels} />
              <HealthMetric label="Audience" value={metrics.targetAudience} />
              <HealthMetric label="Value Prop" value={metrics.coreValueProp} />
              <HealthMetric label="Offering" value={metrics.offering} />
            </div>
          </div>
        </div>

        {/* ═══ 7-DAY SPRINT ═══ */}
        <div>
          <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-blue" /> 7-Day Sprint
          </h3>
          <div className="card-dark p-4">
            <SprintBuilder sessionId={id} actionItems={actionItems} />
          </div>
        </div>

        {/* ═══ RECENT LEARNINGS ═══ */}
        {learnings.length > 0 && (
          <div>
            <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-amber" /> What Sterling learned
            </h3>
            <div className="space-y-1.5">
              {learnings.map((l, i) => (
                <div key={i} className="flex items-start gap-2.5 px-1">
                  <div className="w-1 h-1 rounded-full bg-accent-amber/50 mt-2 flex-shrink-0" />
                  <p className="text-xs text-text-muted/60 leading-relaxed">{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PROGRESS LOG ═══ */}
        <div>
          <h3 className="heading-sm text-text mb-3 flex items-center gap-2">
            <PenLine className="w-4 h-4 text-accent-green" /> Progress
          </h3>
          <div className="card-dark p-4">
            <div className="flex gap-2 mb-3">
              <input value={logEntry} onChange={e => setLogEntry(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLog()}
                placeholder="What did you accomplish?"
                className="flex-1 bg-surface border border-border/20 rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted/25 focus:outline-none focus:border-primary/30" />
              <button onClick={addLog} disabled={!logEntry.trim()} className="text-xs text-primary px-3 disabled:opacity-30">Log</button>
            </div>
            {logs.length === 0 && <p className="text-[10px] text-text-muted/25">Log what you've done to track momentum and update Sterling's model.</p>}
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
        </div>

        {/* ═══ PIPELINE + NAV ═══ */}
        <div className="flex items-center gap-1.5 px-1">
          {pipeline.stages.map(stage => (
            <div key={stage} className={`flex-1 h-1.5 rounded-full ${pipeline.completed.includes(stage) ? 'bg-primary' : 'bg-surface-lighter'}`} />
          ))}
          <span className="label-xs data-value ml-2">{pipeline.percentage}%</span>
        </div>

        <div className="flex gap-2 pb-20">
          <NavPill href={`/session/${id}`} label="Chat" icon={<MessageSquare className="w-3.5 h-3.5" />} />
          <NavPill href={`/brief/${id}`} label="Brief" icon={<BookMarked className="w-3.5 h-3.5" />} />
          <NavPill href="/" label="Home" icon={<ArrowLeft className="w-3.5 h-3.5" />} />
        </div>
      </main>

      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} />
    </div>
  );
}

function HealthMetric({ label, value }: { label: string; value: string }) {
  const has = value && value.length > 0;
  return (
    <div className={`rounded-lg p-2.5 ${has ? 'card-dark' : 'bg-surface-lighter/20 border border-border/5'}`}>
      <span className="label-xs">{label}</span>
      {has ? (
        <p className="text-xs text-text/70 mt-0.5 leading-snug">{value.length > 50 ? value.slice(0, 50) + '...' : value}</p>
      ) : (
        <p className="text-[10px] text-text-muted/20 mt-0.5">Unknown — ask Sterling how to track this</p>
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
