'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import {
  Zap, ChevronRight, BarChart2, TrendingUp, Sparkles,
  BookMarked, Trash2, MessageSquare, LayoutDashboard, Plus,
  Target, Search, Scale, Map, Shield, FlaskConical,
  FolderOpen, Calendar, BookOpen, ClipboardList, Power,
} from 'lucide-react';
import NotificationBell from '@/components/ui/NotificationBell';
import { ProgressRing } from '@/components/dashboard/Charts';

interface SessionItem {
  id: string;
  name: string;
  description?: string;
  intakeComplete: boolean;
  activeModule: string;
  updatedAt: string;
  profileJson: string;
  _count: { messages: number };
}

const STAGE_PIPELINE = [
  { key: 'intake', label: 'Intake' },
  { key: 'value-diagnosis', label: 'Value' },
  { key: 'business-logic', label: 'Health' },
  { key: 'platform-power', label: 'Platform' },
  { key: 'strategy-macro', label: 'Macro' },
  { key: 'strategy-meso', label: 'Meso' },
  { key: 'strategy-micro', label: 'Execute' },
];

function getSessionStages(s: SessionItem): number {
  if (!s.intakeComplete) return 0;
  return Math.min(STAGE_PIPELINE.length - 1, 1 + Math.floor(s._count.messages / 25));
}

function getSessionScore(s: SessionItem): number {
  return Math.round((getSessionStages(s) / STAGE_PIPELINE.length) * 100);
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listRef] = useAutoAnimate({ duration: 200 });

  useEffect(() => {
    if (status === 'authenticated') loadSessions();
  }, [status]);

  async function loadSessions() {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) setSessions(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleNew() {
    const res = await fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    if (res.ok) {
      const s = await res.json();
      toast.success('New analysis created');
      router.push(`/session/${s.id}`);
    } else {
      toast.error('Failed to create analysis');
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Delete this project permanently?')) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    toast.success('Project deleted');
    loadSessions();
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const activeProjects = sessions.filter(s => s.intakeComplete).length;
  const avgScore = sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + getSessionScore(s), 0) / sessions.length) : 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const userName = session?.user?.name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-surface page-transition">
      {/* ═══ HEADER ═══ */}
      <header className="border-b border-border/20 bg-surface/95 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-200.png" alt="MadAi" className="w-9 h-9 rounded-lg" />
            <span className="heading-sm text-text hidden sm:block">MadAi</span>
          </div>

          <div className="flex items-center gap-1">
            <NavIcon href="/plans" icon={<ClipboardList className="w-4 h-4" />} label="Plans" />
            <NavIcon href="/library" icon={<BookOpen className="w-4 h-4" />} label="Library" />
            <NavIcon href="/calendar" icon={<Calendar className="w-4 h-4" />} label="Calendar" />
            <NavIcon href="/templates" icon={<FolderOpen className="w-4 h-4" />} label="Templates" />
            <div className="w-px h-5 bg-border/20 mx-1" />
            <NotificationBell />
            <a href="/profile" className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-light transition-colors">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-surface-lighter flex items-center justify-center text-xs text-text-muted">{userName[0] || '?'}</div>
              )}
            </a>
            <button onClick={() => signOut()} className="p-2 text-text-muted/30 hover:text-primary transition-colors hidden sm:block" title="Sign out">
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8">

        {/* ═══ HERO ═══ */}
        <div className="mb-10">
          <p className="label-sm mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="heading-xl text-text">
                {sessions.length === 0 ? 'Build your strategy.' : `${greeting}, ${userName}.`}
              </h1>
              <p className="text-text-muted text-sm mt-2 max-w-lg leading-relaxed">
                {sessions.length === 0
                  ? 'Deep strategic analysis combining business fundamentals, live research, and psychological insight.'
                  : 'Your strategic command center. Analysis, plans, and execution.'}
              </p>
            </div>
            <button onClick={handleNew}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl px-6 py-3 text-sm transition-all hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] flex-shrink-0">
              <Plus className="w-4 h-4" /> New Analysis
            </button>
          </div>
        </div>

        {/* ═══ STATS ROW ═══ */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            <StatCard label="Projects" value={sessions.length.toString()} icon={<BarChart2 className="w-4 h-4 text-primary" />} />
            <StatCard label="Active" value={activeProjects.toString()} icon={<Zap className="w-4 h-4 text-accent-green" />} />
            <StatCard label="Avg Progress" value={`${avgScore}%`} icon={<TrendingUp className="w-4 h-4 text-accent-gold" />} />
            <StatCard label="Pipeline Stages" value="7" icon={<Sparkles className="w-4 h-4 text-accent-blue" />} />
          </div>
        )}

        {/* ═══ PROJECTS ═══ */}
        {sessions.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="heading-md text-text">Your Projects</h2>
              <span className="label-xs">{sessions.length} project{sessions.length !== 1 ? 's' : ''}</span>
            </div>

            <div ref={listRef} className="space-y-3">
              {sortedSessions.map(s => {
                const score = getSessionScore(s);
                const stages = getSessionStages(s);
                let offering = '';
                try { const p = JSON.parse(s.profileJson || '{}'); offering = p.offering || p.description || ''; } catch {}

                return (
                  <div key={s.id} className="card-dark hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      {/* Progress ring */}
                      <div className="flex-shrink-0">
                        <ProgressRing progress={score} size={52} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0" onClick={() => router.push(`/session/${s.id}/dashboard`)} style={{ cursor: 'pointer' }}>
                        <h3 className="heading-sm text-text truncate">{s.name}</h3>
                        {offering && <p className="text-xs text-text-muted/60 truncate mt-0.5">{offering.slice(0, 80)}</p>}
                        <div className="flex items-center gap-3 mt-2">
                          {/* Mini pipeline */}
                          <div className="flex gap-0.5">
                            {STAGE_PIPELINE.map((stage, i) => (
                              <div key={stage.key} className={`w-5 h-1 rounded-full ${i < stages ? 'bg-primary' : i === stages ? 'bg-primary/40' : 'bg-surface-lighter'}`} />
                            ))}
                          </div>
                          <span className="label-xs">{!s.intakeComplete ? 'In intake' : stages >= 7 ? 'Complete' : `Stage ${stages + 1}/7`}</span>
                          <span className="text-[9px] text-text-muted/25">{formatRelativeTime(s.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <a href={`/session/${s.id}/dashboard`} className="p-2 rounded-lg hover:bg-surface-lighter text-text-muted hover:text-text transition-colors" title="Dashboard">
                          <LayoutDashboard className="w-4 h-4" />
                        </a>
                        <a href={`/session/${s.id}`} className="p-2 rounded-lg hover:bg-surface-lighter text-text-muted hover:text-text transition-colors" title="Chat">
                          <MessageSquare className="w-4 h-4" />
                        </a>
                        <a href={`/brief/${s.id}`} className="p-2 rounded-lg hover:bg-surface-lighter text-text-muted hover:text-text transition-colors" title="Brief">
                          <BookMarked className="w-4 h-4" />
                        </a>
                        <button onClick={e => handleDelete(e, s.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted/30 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ NEW USER — FEATURE SHOWCASE ═══ */}
        {sessions.length === 0 && (
          <div className="mb-10">
            <h2 className="heading-md text-text mb-5">What MadAi does</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { Icon: Target, title: 'Any Business Type', desc: 'Lemonade stand to SaaS. Creator brand to consulting.', color: 'text-primary', bg: 'bg-primary/10' },
                { Icon: Search, title: 'Live Research', desc: 'Real competitors, trends, and market data.', color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
                { Icon: Scale, title: 'Ethical Intelligence', desc: 'Maximize profit through genuine value creation.', color: 'text-accent-green', bg: 'bg-accent-green/10' },
                { Icon: Map, title: 'Macro to Micro', desc: 'Business model design down to exact copy.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { Icon: Shield, title: 'Platform Sovereignty', desc: 'Know if you own your business or rent it.', color: 'text-primary', bg: 'bg-primary/10' },
                { Icon: FlaskConical, title: 'Innovation Lab', desc: 'Cross-industry tactics and novel approaches.', color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
              ].map((cap, i) => (
                <div key={i} className="card-dark p-5 hover:border-primary/20 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${cap.bg} flex items-center justify-center mb-3`}>
                    <cap.Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h3 className="heading-sm text-text mb-1">{cap.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ QUICK ACCESS ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <QuickCard href="/plans" icon={<ClipboardList className="w-5 h-5" />} label="Action Plans" color="text-primary" />
          <QuickCard href="/library" icon={<BookOpen className="w-5 h-5" />} label="Strategy Library" color="text-accent-gold" />
          <QuickCard href="/templates" icon={<FolderOpen className="w-5 h-5" />} label="Templates" color="text-accent-green" />
          <QuickCard href="/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" color="text-accent-blue" />
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="border-t border-border/10 pt-6 pb-8 text-center">
          <p className="text-[10px] text-text-muted/20">MadAi — Strategic Marketing Intelligence</p>
        </div>
      </main>
    </div>
  );
}

/* ═══ SUB-COMPONENTS ═══ */

function NavIcon({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-light transition-colors text-xs" title={label}>
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </a>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card-dark p-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="label-xs">{label}</span>
      </div>
      <div className="text-xl font-bold text-text data-value">{value}</div>
    </div>
  );
}

function QuickCard({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <a href={href} className="card-dark p-4 hover:border-primary/20 transition-colors group flex items-center gap-3">
      <div className={`${color} opacity-60 group-hover:opacity-100 transition-opacity`}>{icon}</div>
      <span className="text-xs text-text-muted group-hover:text-text transition-colors">{label}</span>
      <ChevronRight className="w-3 h-3 text-text-muted/20 ml-auto group-hover:text-text-muted/50 transition-colors" />
    </a>
  );
}
