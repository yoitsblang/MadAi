'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Plus, Trash2, ChevronRight, LayoutDashboard, MessageSquare,
  BookMarked, Power, Bell, Search, User, TrendingUp,
  Zap, Target, BarChart2, Activity, ArrowUpRight, ArrowDownRight,
  Calendar, ClipboardList, BookOpen, FolderOpen, Settings,
  Cpu, Shield, FlaskConical, Scale, Map, Eye,
} from 'lucide-react';
import NotificationBell from '@/components/ui/NotificationBell';

/* ═══ TYPES ═══ */
interface SessionItem {
  id: string; name: string; description?: string; intakeComplete: boolean;
  activeModule: string; updatedAt: string; profileJson: string;
  _count: { messages: number };
}

const STAGES = ['intake','value-diagnosis','business-logic','platform-power','strategy-macro','strategy-meso','strategy-micro'];

function stageCount(s: SessionItem): number {
  if (!s.intakeComplete) return 0;
  return Math.min(STAGES.length, 1 + Math.floor(s._count.messages / 25));
}
function score(s: SessionItem): number { return Math.round((stageCount(s) / STAGES.length) * 100); }
function relTime(d: string): string {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

/* ═══ SVG CHARTS ═══ */
function DonutChart({ value, size = 80, color = '#dc2626' }: { value: number; size?: number; color?: string }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(63,63,70,0.3)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${color}40)` }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        className="fill-text text-sm font-bold transform rotate-90" style={{ transformOrigin: 'center' }}>
        {value}%
      </text>
    </svg>
  );
}

function MiniAreaChart({ data, color = '#dc2626', h = 40, w = 120 }: { data: number[]; color?: string; h?: number; w?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`).join(' ');
  const area = `0,${h} ${pts} ${w},${h}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`ag-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#ag-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }} />
    </svg>
  );
}

function MiniBarChart({ data, color = '#dc2626', h = 40, w = 100 }: { data: number[]; color?: string; h?: number; w?: number }) {
  const max = Math.max(...data, 1);
  const bw = Math.max(4, (w / data.length) - 2);
  return (
    <svg width={w} height={h}>
      {data.map((v, i) => {
        const bh = (v / max) * (h - 2);
        return <rect key={i} x={i * (bw + 2)} y={h - bh} width={bw} height={bh} rx={2}
          fill={color} opacity={0.6 + (i / data.length) * 0.4}
          style={{ filter: `drop-shadow(0 0 3px ${color}30)` }} />;
      })}
    </svg>
  );
}

/* ═══ MAIN PAGE ═══ */
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (status === 'authenticated') load(); }, [status]);

  async function load() {
    try { const r = await fetch('/api/sessions'); if (r.ok) setSessions(await r.json()); } catch {}
    setLoading(false);
  }

  async function handleNew() {
    const r = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    if (r.ok) { const s = await r.json(); toast.success('Project created'); router.push(`/session/${s.id}`); }
    else toast.error('Failed to create project');
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation(); e.preventDefault();
    if (!confirm('Delete this project permanently?')) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    toast.success('Deleted'); load();
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#050507]">
        <div className="h-14 border-b border-red-900/20" />
        <div className="max-w-[1440px] mx-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-xl bg-[#0a0a0f] border border-red-900/10 animate-pulse" />)}
          </div>
        </div>
      </div>
    );
  }

  const sorted = [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const active = sessions.filter(s => s.intakeComplete).length;
  const avg = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + score(s), 0) / sessions.length) : 0;
  const total = sessions.length;
  const complete = sessions.filter(s => stageCount(s) >= 7).length;
  const userName = session?.user?.name?.split(' ')[0] || 'Operator';

  // Fake trend data for charts
  const trendData = [20, 35, 28, 45, 42, 58, 65, 72];
  const barData = [45, 62, 38, 75, 55, 68, 82];

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* ═══ TOP BAR ═══ */}
      <header className="border-b border-red-900/30 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-200.png" alt="MAD" className="w-10 h-10 rounded-lg" />
            <nav className="hidden md:flex items-center gap-1">
              <NavBtn href="/" label="Overview" active />
              <NavBtn href="/plans" label="Plans" />
              <NavBtn href="/library" label="Library" />
              <NavBtn href="/calendar" label="Calendar" />
              <NavBtn href="/templates" label="Templates" />
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <a href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-red-900/30 hover:border-red-500/50 transition-colors">
              {session?.user?.image
                ? <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-[#0a0a0f] flex items-center justify-center text-xs text-zinc-500">{userName[0]}</div>
              }
            </a>
            <button onClick={() => signOut()} className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors hidden md:block" title="Sign out">
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">

        {/* ═══ COMMAND HEADER ═══ */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-red-500/60 mb-1 font-mono">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} / COMMAND CENTER
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {total === 0 ? (
                <><span className="text-white">Find the bottleneck.</span> <span className="text-red-500">Fix it.</span></>
              ) : (
                <><span className="text-white">{userName},</span> <span className="text-red-500">{active} active</span> <span className="text-zinc-600">/ {total} total</span></>
              )}
            </h1>
          </div>
          <button onClick={handleNew}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl px-6 py-3 text-sm transition-all
              shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_50px_rgba(220,38,38,0.5)] flex-shrink-0 border border-red-500/50">
            <Plus className="w-4 h-4" /> NEW PROJECT
          </button>
        </div>

        {/* ═══ METRIC CARDS ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <MetricCard label="PROJECTS" value={total} trend="+1" up icon={<BarChart2 className="w-4 h-4" />}
            chart={<MiniBarChart data={barData} h={32} w={80} />} />
          <MetricCard label="ACTIVE" value={active} trend={active > 0 ? 'live' : '—'} up={active > 0} icon={<Zap className="w-4 h-4" />}
            chart={<MiniAreaChart data={trendData} h={32} w={80} />} />
          <MetricCard label="AVG PROGRESS" value={`${avg}%`} trend={avg > 50 ? '+' : ''} up={avg > 50} icon={<TrendingUp className="w-4 h-4" />}
            chart={<DonutChart value={avg} size={44} />} />
          <MetricCard label="COMPLETED" value={complete} trend={complete > 0 ? 'done' : '—'} up={complete > 0} icon={<Target className="w-4 h-4" />}
            chart={<MiniAreaChart data={[10,15,20,25,35,40,complete * 14]} color="#22c55e" h={32} w={80} />} />
        </div>

        {/* ═══ PROJECTS GRID ═══ */}
        {sorted.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Your Projects</h2>
              <span className="text-[10px] font-mono text-red-500/40">{total} REGISTERED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sorted.map(s => {
                const sc = score(s);
                const st = stageCount(s);
                let offering = '';
                try { const p = JSON.parse(s.profileJson || '{}'); offering = p.offering || p.description || ''; } catch {}

                return (
                  <div key={s.id} onClick={() => router.push(`/session/${s.id}/dashboard`)}
                    className="relative bg-[#0a0a0f] border border-red-900/20 rounded-xl overflow-hidden cursor-pointer
                      hover:border-red-500/40 transition-all group hover:shadow-[0_0_30px_rgba(220,38,38,0.08)]">
                    {/* Red top accent */}
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

                    <div className="p-4 md:p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-sm truncate group-hover:text-red-400 transition-colors">{s.name}</h3>
                          {offering && <p className="text-[11px] text-zinc-600 truncate mt-0.5">{offering.slice(0, 60)}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                          <DonutChart value={sc} size={36} />
                        </div>
                      </div>

                      {/* Stage pills */}
                      <div className="flex gap-1 mb-3">
                        {STAGES.map((stage, i) => (
                          <div key={stage} className={`flex-1 h-1.5 rounded-full transition-all ${
                            i < st ? 'bg-red-500 shadow-[0_0_4px_rgba(220,38,38,0.5)]' :
                            i === st ? 'bg-red-500/30' :
                            'bg-zinc-800'
                          }`} />
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-600">
                          {!s.intakeComplete ? 'INTAKE' : st >= 7 ? 'COMPLETE' : `STAGE ${st+1}/7`}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-zinc-700">{relTime(s.updatedAt)}</span>
                          <button onClick={e => handleDelete(e, s.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ NEW USER SHOWCASE ═══ */}
        {sessions.length === 0 && (
          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-5">CAPABILITIES</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { Icon: Target, t: 'Bottleneck Detection', d: 'Find what\'s actually limiting growth.', c: '#dc2626' },
                { Icon: Activity, t: 'Business Health Score', d: 'Kaufman 5-part framework analysis.', c: '#dc2626' },
                { Icon: Shield, t: 'Platform Sovereignty', d: 'Know if you own your business or rent it.', c: '#f59e0b' },
                { Icon: Map, t: 'Full Strategy Pipeline', d: 'Macro positioning to micro execution.', c: '#3b82f6' },
                { Icon: Scale, t: 'Ethical Intelligence', d: 'Maximize profit through real value.', c: '#22c55e' },
                { Icon: FlaskConical, t: 'Experiment Engine', d: 'Test hypotheses, track what works.', c: '#a855f7' },
              ].map((cap, i) => (
                <div key={i} className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5 hover:border-red-500/30 transition-all group">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: `${cap.c}15`, border: `1px solid ${cap.c}30` }}>
                    <cap.Icon className="w-5 h-5" style={{ color: cap.c }} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{cap.t}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{cap.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ QUICK ACCESS STRIP ═══ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/plans', Icon: ClipboardList, label: 'Action Plans', c: '#dc2626' },
            { href: '/library', Icon: BookOpen, label: 'Strategy Library', c: '#f59e0b' },
            { href: '/templates', Icon: FolderOpen, label: 'Templates', c: '#22c55e' },
            { href: '/calendar', Icon: Calendar, label: 'Calendar', c: '#3b82f6' },
          ].map((q, i) => (
            <a key={i} href={q.href}
              className="bg-[#0a0a0f] border border-red-900/10 rounded-xl p-4 hover:border-red-500/30 transition-all group flex items-center gap-3">
              <q.Icon className="w-5 h-5 text-zinc-600 group-hover:text-red-400 transition-colors" />
              <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">{q.label}</span>
              <ChevronRight className="w-3 h-3 text-zinc-800 ml-auto group-hover:text-zinc-500 transition-colors" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-red-900/10 mt-10 pt-6 text-center">
          <p className="text-[9px] text-zinc-800 font-mono tracking-wider">MAD AI — STRATEGIC INTELLIGENCE SYSTEM</p>
        </div>
      </main>

      {/* ═══ MOBILE BOTTOM NAV ═══ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050507]/95 backdrop-blur-xl border-t border-red-900/30 z-50">
        <div className="flex items-center justify-around py-2 px-2">
          <MobileNav href="/" Icon={LayoutDashboard} label="Home" active />
          <MobileNav href="/plans" Icon={ClipboardList} label="Plans" />
          <button onClick={handleNew} className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] -mt-4 border border-red-500/50">
            <Plus className="w-5 h-5 text-white" />
          </button>
          <MobileNav href="/library" Icon={BookOpen} label="Library" />
          <MobileNav href="/profile" Icon={User} label="Profile" />
        </div>
      </nav>
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function NavBtn({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a href={href} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
      active ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
    }`}>{label}</a>
  );
}

function MetricCard({ label, value, trend, up, icon, chart }: {
  label: string; value: string | number; trend: string; up: boolean;
  icon: React.ReactNode; chart: React.ReactNode;
}) {
  return (
    <div className="bg-[#0a0a0f] border border-red-900/20 rounded-xl p-4 relative overflow-hidden">
      {/* Red top line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="text-red-500/60">{icon}</div>
          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</span>
        </div>
        {trend !== '—' && (
          <div className={`flex items-center gap-0.5 text-[9px] font-mono ${up ? 'text-green-500' : 'text-red-400'}`}>
            {up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <span className="text-2xl md:text-3xl font-bold text-white font-mono tracking-tight"
          style={{ textShadow: '0 0 20px rgba(220,38,38,0.15)' }}>
          {value}
        </span>
        <div className="opacity-60">{chart}</div>
      </div>
    </div>
  );
}

function MobileNav({ href, Icon, label, active }: { href: string; Icon: React.ComponentType<{className?: string}>; label: string; active?: boolean }) {
  return (
    <a href={href} className="flex flex-col items-center gap-0.5 py-1 px-3">
      <Icon className={`w-5 h-5 ${active ? 'text-red-500' : 'text-zinc-600'}`} />
      <span className={`text-[9px] ${active ? 'text-red-400' : 'text-zinc-700'}`}>{label}</span>
    </a>
  );
}
