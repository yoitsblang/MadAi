'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus, Trash2, ChevronRight, ChevronDown, Power, Bell, User,
  TrendingUp, Zap, Target, Activity, ArrowUpRight, AlertTriangle,
  Calendar, ClipboardList, BookOpen, FolderOpen, Settings, Eye,
  Crosshair, Shield, FlaskConical, Scale, Map, MessageSquare,
  BarChart2, Edit3, Check, X, Cpu, Layers, Beaker, Archive,
  Clock, ArrowRight, Lightbulb, Ban, HelpCircle, Gauge,
} from 'lucide-react';
import NotificationBell from '@/components/ui/NotificationBell';

/* ═══ TYPES ═══ */
interface SessionItem {
  id: string; name: string; description?: string; intakeComplete: boolean;
  activeModule: string; updatedAt: string; profileJson: string;
  _count: { messages: number };
}

interface ProjectData {
  bottleneck: { primary: string; severity: number; confidence: string; upside: string; evidence: string[]; actions: string[] } | null;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  metrics: Record<string, string>;
  risks: string[];
  strengths: string[];
  learnings: string[];
  recommendations: Array<{ action: string; reason: string; outcome: string; difficulty: string; time: string; metric: string }>;
  decisions: Array<{ question: string; recommendation: string; confidence: string }>;
}

/* ═══ MAIN COMMAND CENTER ═══ */
export default function CommandCenter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProject, setActiveProject] = useState<SessionItem | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());
  const [showEvidence, setShowEvidence] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => { if (status === 'authenticated') loadSessions(); }, [status]);

  async function loadSessions() {
    try {
      const r = await fetch('/api/sessions');
      if (r.ok) {
        const data = await r.json();
        setSessions(data);
        // Auto-select most recent project
        if (data.length > 0) {
          const sorted = [...data].sort((a: SessionItem, b: SessionItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setActiveProject(sorted[0]);
          loadProjectData(sorted[0].id);
        }
      }
    } catch {}
    setLoading(false);
  }

  async function loadProjectData(id: string) {
    setLoadingData(true);
    try {
      const r = await fetch(`/api/sessions/${id}/dashboard`);
      if (r.ok) setProjectData(await r.json());
    } catch {}
    setLoadingData(false);
  }

  function selectProject(s: SessionItem) {
    setActiveProject(s);
    setProjectData(null);
    setCompletedActions(new Set());
    loadProjectData(s.id);
  }

  async function handleNew() {
    const r = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    if (r.ok) { const s = await r.json(); toast.success('Project created'); router.push(`/session/${s.id}`); }
    else toast.error('Failed');
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation(); e.preventDefault();
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    toast.success('Deleted');
    if (activeProject?.id === id) { setActiveProject(null); setProjectData(null); }
    loadSessions();
  }

  async function handleRename(id: string) {
    if (!renameValue.trim()) return;
    await fetch(`/api/sessions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: renameValue.trim() }) });
    setRenamingId(null); toast.success('Renamed'); loadSessions();
  }

  const userName = session?.user?.name?.split(' ')[0] || 'Operator';
  const bn = projectData?.bottleneck;
  const actions = projectData?.actionItems || [];
  const topMoves = actions.slice(0, 3);
  const metrics = projectData?.metrics || {};
  const risks = projectData?.risks || [];
  const learnings = projectData?.learnings || [];
  const decisions = projectData?.decisions || [];

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#050507]">
        <div className="h-12 border-b border-red-900/20" />
        <div className="max-w-[900px] mx-auto p-4 space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-[#0a0a0f] border border-red-900/10 animate-pulse" />)}
        </div>
      </div>
    );
  }

  // No projects — show onboarding
  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-[#050507] text-white">
        <Header userName={userName} userImage={session?.user?.image} onSignOut={() => signOut()} />
        <main className="max-w-[700px] mx-auto px-4 py-12 text-center">
          <div className="mb-8">
            <img src="/logo-200.png" alt="MAD" className="w-20 h-20 rounded-xl mx-auto mb-6 border border-red-900/30" />
            <h1 className="text-3xl font-bold mb-2">Find the bottleneck. <span className="text-red-500">Fix it.</span></h1>
            <p className="text-zinc-600 text-sm max-w-md mx-auto">MadAi diagnoses your business constraint, builds a sprint to fix it, and tracks what actually moves the needle.</p>
          </div>
          <button onClick={handleNew}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl px-8 py-4 text-sm transition-all
              shadow-[0_0_40px_rgba(220,38,38,0.3)] border border-red-500/50">
            <Crosshair className="w-5 h-5" /> DIAGNOSE MY BUSINESS
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            {[
              { Icon: Crosshair, t: 'Bottleneck Detection', d: 'AI finds what\'s actually limiting your growth.' },
              { Icon: Zap, t: '7-Day Sprints', d: 'Instant execution plan. Tasks, deadlines, metrics.' },
              { Icon: Beaker, t: 'Experiment Engine', d: 'Test hypotheses. Track what works. Kill what doesn\'t.' },
            ].map((f, i) => (
              <div key={i} className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5 text-left">
                <f.Icon className="w-5 h-5 text-red-500 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">{f.t}</h3>
                <p className="text-[11px] text-zinc-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </main>
        <BottomNav active="command" onNew={handleNew} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <Header userName={userName} userImage={session?.user?.image} onSignOut={() => signOut()} />

      <main className="max-w-[900px] mx-auto px-4 py-5 pb-24 space-y-5">
        {/* ═══ PROJECT SWITCHER ═══ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(s => (
            <button key={s.id} onClick={() => selectProject(s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeProject?.id === s.id
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'text-zinc-600 border-zinc-800/50 hover:border-red-900/30 hover:text-zinc-400'
              }`}>
              {s.name.length > 20 ? s.name.slice(0, 20) + '...' : s.name}
            </button>
          ))}
          <button onClick={handleNew} className="flex-shrink-0 w-8 h-8 rounded-lg border border-dashed border-zinc-800 flex items-center justify-center text-zinc-700 hover:text-red-400 hover:border-red-500/30 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Project actions */}
        {activeProject && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              {renamingId === activeProject.id ? (
                <div className="flex items-center gap-1.5">
                  <input value={renameValue} onChange={e => setRenameValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename(activeProject.id)}
                    className="text-sm font-bold bg-[#0a0a0f] border border-red-500/30 rounded-lg px-3 py-1 text-white focus:outline-none w-48" autoFocus />
                  <button onClick={() => handleRename(activeProject.id)} className="text-green-500"><Check className="w-4 h-4" /></button>
                  <button onClick={() => setRenamingId(null)} className="text-zinc-600"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <h2 className="text-lg font-bold text-white truncate">{activeProject.name}</h2>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setRenamingId(activeProject.id); setRenameValue(activeProject.name); }}
                className="p-1.5 rounded-lg text-zinc-700 hover:text-white hover:bg-white/5 transition-colors" title="Rename">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <a href={`/session/${activeProject.id}`} className="p-1.5 rounded-lg text-zinc-700 hover:text-white hover:bg-white/5 transition-colors" title="Chat">
                <MessageSquare className="w-3.5 h-3.5" />
              </a>
              <a href={`/session/${activeProject.id}/dashboard`} className="p-1.5 rounded-lg text-zinc-700 hover:text-white hover:bg-white/5 transition-colors" title="Dashboard">
                <BarChart2 className="w-3.5 h-3.5" />
              </a>
              <button onClick={e => handleDelete(e, activeProject.id)}
                className="p-1.5 rounded-lg text-zinc-800 hover:text-red-400 hover:bg-red-500/5 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {loadingData && (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-[#0a0a0f] border border-red-900/10 animate-pulse" />)}
          </div>
        )}

        {projectData && !loadingData && (
          <>
            {/* ═══ BOTTLENECK HERO ═══ */}
            {bn ? (
              <div className="bg-[#0a0a0f] border border-red-500/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.08)]">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">CURRENT BOTTLENECK</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{bn.primary}</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <Chip label="Severity" value={`${bn.severity}/10`} color="red" />
                    <Chip label="Confidence" value={bn.confidence} color="zinc" />
                    <Chip label="Upside" value={bn.upside} color="green" />
                  </div>
                  <div className="flex gap-2">
                    <a href={`/session/${activeProject?.id}`}
                      className="text-xs bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/50">
                      FIX THIS NOW
                    </a>
                    <button onClick={() => setShowEvidence(!showEvidence)}
                      className="text-xs text-zinc-500 hover:text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-red-500/30 transition-all flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {showEvidence ? 'Hide' : 'Why'}
                    </button>
                  </div>
                  {showEvidence && bn.evidence.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-red-900/20 space-y-1.5 animate-slide-up">
                      {bn.evidence.map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-zinc-500">
                          <div className="w-1 h-1 rounded-full bg-red-500/50 mt-1.5 flex-shrink-0" />
                          {e}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-[#0a0a0f] border border-red-900/20 rounded-xl p-6 text-center">
                <Crosshair className="w-6 h-6 text-red-500/20 mx-auto mb-2" />
                <p className="text-sm font-bold text-white mb-1">No bottleneck identified yet</p>
                <p className="text-[11px] text-zinc-700 mb-3">Complete the analysis to identify your #1 constraint.</p>
                <a href={`/session/${activeProject?.id}`} className="inline-flex items-center gap-1.5 text-xs bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/50">
                  <Zap className="w-3.5 h-3.5" /> Continue Analysis
                </a>
              </div>
            )}

            {/* ═══ TODAY'S 3 MOVES ═══ */}
            {topMoves.length > 0 && (
              <div>
                <SectionHead icon={<Zap className="w-4 h-4 text-red-500" />} title="What to do now" meta={`${completedActions.size}/${actions.length}`} />
                <div className="space-y-2">
                  {topMoves.map((item, i) => {
                    const done = completedActions.has(i);
                    const rec = projectData.recommendations[i];
                    return (
                      <div key={i} className={`bg-[#0a0a0f] border rounded-xl p-4 transition-all ${done ? 'border-green-500/10 opacity-30' : 'border-red-900/15 hover:border-red-500/25'}`}>
                        <div className="flex items-start gap-3">
                          <button onClick={() => { const n = new Set(completedActions); n.has(i) ? n.delete(i) : n.add(i); setCompletedActions(n); }} className="mt-0.5 flex-shrink-0">
                            {done ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-zinc-700" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${done ? 'line-through text-zinc-700' : 'text-zinc-200'}`}>{item.text}</p>
                            {rec && !done && (
                              <div className="flex flex-wrap gap-3 mt-1.5 text-[10px] text-zinc-700">
                                <span><Clock className="w-3 h-3 inline mr-0.5" />{rec.time}</span>
                                <span><ArrowUpRight className="w-3 h-3 inline mr-0.5" />{rec.outcome.slice(0, 35)}</span>
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            item.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-500/60 border border-amber-500/15'
                          }`}>{item.priority === 'high' ? 'NOW' : 'NEXT'}</span>
                        </div>
                      </div>
                    );
                  })}
                  {actions.length > 3 && (
                    <a href={`/session/${activeProject?.id}/dashboard`} className="block text-center text-[10px] text-zinc-700 hover:text-red-400 transition-colors py-1">
                      + {actions.length - 3} more actions <ChevronRight className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ═══ DO NOT WASTE TIME ═══ */}
            {risks.length > 0 && (
              <div className="bg-[#0a0a0f] border border-amber-500/15 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-4 h-4 text-amber-500/60" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-500/60">DO NOT WASTE TIME ON</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{risks[0]}</p>
              </div>
            )}

            {/* ═══ HEALTH METRIC STRIP ═══ */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <MetricChip label="Revenue" value={metrics.revenueMonthly} />
              <MetricChip label="Price" value={metrics.pricePoint} />
              <MetricChip label="Channels" value={metrics.activeChannels} />
              <MetricChip label="Audience" value={metrics.targetAudience} />
              <MetricChip label="Delivery" value={metrics.offering ? 'Active' : 'Unknown'} />
              <MetricChip label="Trust" value={metrics.coreValueProp ? 'Defined' : 'Weak'} />
            </div>

            {/* ═══ DECISIONS WAITING ═══ */}
            {decisions.length > 0 && (
              <div>
                <SectionHead icon={<HelpCircle className="w-4 h-4 text-blue-500" />} title="Decisions waiting" />
                <div className="space-y-2">
                  {decisions.slice(0, 3).map((d, i) => (
                    <div key={i} className="bg-[#0a0a0f] border border-blue-500/10 rounded-xl p-3 flex items-start gap-3">
                      <HelpCircle className="w-4 h-4 text-blue-500/40 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-zinc-300">{d.question}</p>
                        <p className="text-[10px] text-zinc-600 mt-0.5">{d.recommendation} — {d.confidence} confidence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ RECENT SIGNALS ═══ */}
            {learnings.length > 0 && (
              <div>
                <SectionHead icon={<Activity className="w-4 h-4 text-amber-500" />} title="Recent signals" />
                <div className="space-y-1">
                  {learnings.slice(0, 4).map((l, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30 mt-1.5 flex-shrink-0" />
                      <p className="text-[11px] text-zinc-600 leading-relaxed">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ QUICK ACTIONS DOCK ═══ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <QuickBtn href={`/session/${activeProject?.id}`} icon={<Crosshair className="w-4 h-4" />} label="Diagnose" />
              <QuickBtn href={`/session/${activeProject?.id}/dashboard`} icon={<BarChart2 className="w-4 h-4" />} label="Full Dashboard" />
              <QuickBtn href={`/brief/${activeProject?.id}`} icon={<BookMarked className="w-4 h-4" />} label="Strategy Brief" />
              <QuickBtn href={`/session/${activeProject?.id}`} icon={<Lightbulb className="w-4 h-4" />} label="Ask Sterling" />
            </div>
          </>
        )}
      </main>

      <BottomNav active="command" onNew={handleNew} />
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function Header({ userName, userImage, onSignOut }: { userName: string; userImage?: string | null; onSignOut: () => void }) {
  return (
    <header className="border-b border-red-900/30 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[900px] mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-200.png" alt="MAD" className="w-8 h-8 rounded-lg" />
          <span className="text-[10px] text-zinc-600 hidden sm:block">Strategic Intelligence</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <a href="/profile" className="w-7 h-7 rounded-full overflow-hidden border border-red-900/30">
            {userImage ? <img src={userImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center text-[10px] text-zinc-600">{userName[0]}</div>}
          </a>
          <button onClick={onSignOut} className="p-1 text-zinc-800 hover:text-red-500 transition-colors hidden sm:block"><Power className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    </header>
  );
}

function BottomNav({ active, onNew }: { active: string; onNew: () => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#050507]/95 backdrop-blur-xl border-t border-red-900/30 z-50">
      <div className="max-w-[900px] mx-auto flex items-center justify-around py-1.5 px-2">
        <BNavItem href="/" icon={<Crosshair />} label="Command" active={active === 'command'} />
        <BNavItem href="/plans" icon={<ClipboardList />} label="Work" active={active === 'work'} />
        <button onClick={onNew} className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] -mt-3 border border-red-500/50">
          <Plus className="w-5 h-5 text-white" />
        </button>
        <BNavItem href="/library" icon={<Beaker />} label="Analyze" active={active === 'analyze'} />
        <BNavItem href="/templates" icon={<Archive />} label="Vault" active={active === 'vault'} />
      </div>
    </nav>
  );
}

function BNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a href={href} className="flex flex-col items-center gap-0.5 py-1 px-2">
      <div className={`w-5 h-5 ${active ? 'text-red-500' : 'text-zinc-700'}`}>{icon}</div>
      <span className={`text-[8px] font-medium tracking-wider ${active ? 'text-red-400' : 'text-zinc-700'}`}>{label}</span>
    </a>
  );
}

function SectionHead({ icon, title, meta }: { icon: React.ReactNode; title: string; meta?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">{icon} {title}</h3>
      {meta && <span className="text-[9px] font-mono text-zinc-700">{meta}</span>}
    </div>
  );
}

function Chip({ label, value, color }: { label: string; value: string; color: 'red' | 'green' | 'zinc' }) {
  const colors = {
    red: 'bg-red-500/5 border-red-500/15 text-red-400',
    green: 'bg-green-500/5 border-green-500/15 text-green-400',
    zinc: 'bg-white/[0.02] border-zinc-800/50 text-zinc-300',
  };
  return (
    <div className={`border rounded-lg px-3 py-1.5 ${colors[color]}`}>
      <span className="text-[8px] text-zinc-600 uppercase tracking-wider block">{label}</span>
      <span className="text-sm font-bold font-mono">{value}</span>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value?: string }) {
  const has = value && value.length > 0;
  return (
    <div className={`rounded-lg p-2.5 text-center ${has ? 'bg-[#0a0a0f] border border-red-900/10' : 'bg-[#080809] border border-zinc-900/30'}`}>
      <span className="text-[8px] uppercase tracking-wider text-zinc-700 block mb-0.5">{label}</span>
      <span className={`text-[10px] font-medium ${has ? 'text-zinc-400' : 'text-zinc-800'}`}>
        {has ? (value.length > 12 ? value.slice(0, 12) + '..' : value) : '—'}
      </span>
    </div>
  );
}

function QuickBtn({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} className="bg-[#0a0a0f] border border-red-900/10 rounded-xl p-3 flex items-center gap-2 hover:border-red-500/25 transition-all group">
      <div className="text-zinc-700 group-hover:text-red-400 transition-colors">{icon}</div>
      <span className="text-[10px] text-zinc-600 group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}

function BookMarkedIcon() { return <BookMarked className="w-3.5 h-3.5" />; }
function CheckCircle2Icon() { return <CheckCircle2 className="w-5 h-5" />; }
