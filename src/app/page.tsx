'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FolderOpen, Calendar, BookOpen, User, Power,
  Target, Search, Scale, Map, Shield, FlaskConical, ClipboardList,
  TrendingUp, Zap, ChevronRight, BarChart2,
  CheckCircle2, Lock, Clock, Sparkles, BookMarked,
} from 'lucide-react';

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

// Stage pipeline for progress display
const STAGE_PIPELINE = [
  { key: 'intake', label: 'Intake', short: 'I' },
  { key: 'value-diagnosis', label: 'Value Dx', short: 'V' },
  { key: 'business-logic', label: 'Health', short: 'H' },
  { key: 'platform-power', label: 'Platform', short: 'P' },
  { key: 'strategy-macro', label: 'Macro', short: 'M' },
  { key: 'strategy-meso', label: 'Meso', short: 'C' },
  { key: 'strategy-micro', label: 'Execute', short: 'X' },
];

function getSessionStages(s: SessionItem): number {
  // Quick heuristic: intake = 1 stage, each 20 messages = ~1 more stage
  if (!s.intakeComplete) return 0;
  return Math.min(STAGE_PIPELINE.length - 1, 1 + Math.floor(s._count.messages / 25));
}

function getSessionScore(s: SessionItem): number {
  const stagesComplete = getSessionStages(s);
  return Math.round((stagesComplete / STAGE_PIPELINE.length) * 100);
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent-gold';
  if (score >= 50) return 'text-primary';
  if (score >= 25) return 'text-yellow-400';
  return 'text-text-muted';
}

function getScoreRing(score: number): string {
  if (score >= 80) return 'border-accent-gold/40 bg-accent-gold/5';
  if (score >= 50) return 'border-primary/40 bg-primary/5';
  if (score >= 25) return 'border-yellow-500/30 bg-yellow-500/5';
  return 'border-border bg-surface';
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
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

  useEffect(() => {
    if (status === 'authenticated') {
      loadSessions();
    }
  }, [status]);

  async function loadSessions() {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) setSessions(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function handleNew() {
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.ok) {
      const newSession = await res.json();
      router.push(`/session/${newSession.id}`);
    }
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    const name = sessions.find(s => s.id === id)?.name || 'this project';
    const confirmed = confirm(`Delete "${name}"?\n\nThis will permanently remove the project, all conversations, analyses, and action plans. This cannot be undone.`);
    if (!confirmed) return;
    const doubleConfirm = confirm(`Are you absolutely sure? Type OK to confirm permanent deletion of "${name}".`);
    if (!doubleConfirm) return;
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    loadSessions();
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const featureCards = [
    { Icon: Target, title: 'Any Business Type', desc: 'Lemonade stand to SaaS. Creator brand to consulting. No restrictions.', color: 'text-primary', bg: 'bg-primary/10' },
    { Icon: Search, title: 'Live Research', desc: 'Real competitors, real trends, real market data. Not generic advice.', color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
    { Icon: Scale, title: 'Ethical Intelligence', desc: 'Maximize profit through genuine value, not predatory extraction.', color: 'text-accent-green', bg: 'bg-accent-green/10' },
    { Icon: Map, title: 'Macro to Micro', desc: 'From business model design down to exact Instagram captions.', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { Icon: Shield, title: 'Platform Sovereignty', desc: 'Know when you\'re building a real business vs feeding someone else\'s.', color: 'text-primary', bg: 'bg-primary/10' },
    { Icon: FlaskConical, title: 'Innovation Lab', desc: 'Cross-industry tactics. Hybrid strategies. Novel approaches.', color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
  ];

  // Sort sessions: in-progress first, then by last updated
  const sortedSessions = [...sessions].sort((a, b) => {
    const scoreA = getSessionScore(a);
    const scoreB = getSessionScore(b);
    if (scoreA > 0 && scoreB === 0) return -1;
    if (scoreB > 0 && scoreA === 0) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const totalScore = sessions.length > 0
    ? Math.round(sessions.reduce((acc, s) => acc + getSessionScore(s), 0) / sessions.length)
    : 0;

  const activeProjects = sessions.filter(s => s.intakeComplete).length;

  return (
    <div className="min-h-screen bg-surface bg-grid">
      {/* Top bar */}
      <header className="border-b border-border glass-strong sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-400.png" alt="MadAi" className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-text tracking-tight">MadAi</h1>
              <p className="text-[10px] sm:text-xs text-text-muted">Strategic Marketing Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <NavLink href="/plans" icon={<ClipboardList className="w-4 h-4" />} label="Plans" />
            <NavLink href="/templates" icon={<FolderOpen className="w-4 h-4" />} label="Templates" />
            <NavLink href="/calendar" icon={<Calendar className="w-4 h-4" />} label="Calendar" />
            <NavLink href="/library" icon={<BookOpen className="w-4 h-4" />} label="Library" />
            <NavLink href="/profile" icon={session?.user?.image
              ? <img src={session.user.image} alt="" className="w-5 h-5 rounded-full" />
              : <User className="w-4 h-4" />} label={session?.user?.name?.split(' ')[0] || 'Profile'} />
            <button
              onClick={() => signOut()}
              className="text-xs text-text-muted/40 hover:text-accent-red transition-colors px-2 py-2 hidden sm:block"
              title="Sign out"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Hero section */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2 tracking-tight">
                {sessions.length === 0 ? 'Build your strategy.' : `Welcome back${session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}.`}
              </h2>
              <p className="text-text-muted text-sm sm:text-base max-w-xl leading-relaxed">
                {sessions.length === 0
                  ? 'Business fundamentals. Psychological insight. Live research. Platform-power awareness. All in one system.'
                  : 'Your strategic intelligence system. Analysis, plans, and execution — all in one place.'}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleNew}
                className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                New Analysis
              </button>
              <a href="/templates"
                className="border border-border hover:border-primary/40 text-text font-medium rounded-xl px-5 py-2.5 text-sm transition-colors hidden sm:inline-flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                Templates
              </a>
            </div>
          </div>
        </div>

        {/* Stats row (only when user has sessions) */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-8">
            <StatCard
              label="Active Projects"
              value={activeProjects.toString()}
              icon={<BarChart2 className="w-5 h-5 text-primary-light" />}
              color="text-primary-light"
            />
            <StatCard
              label="Total Sessions"
              value={sessions.length.toString()}
              icon={<TrendingUp className="w-5 h-5 text-accent-green" />}
              color="text-accent-green"
            />
            <StatCard
              label="Avg Completion"
              value={`${totalScore}%`}
              icon={<Sparkles className="w-5 h-5 text-yellow-400" />}
              color="text-yellow-400"
            />
          </div>
        )}

        {/* Project cards */}
        {sessions.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text">Your Projects</h3>
              <span className="text-xs text-text-muted">{sessions.length} project{sessions.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedSessions.map(s => {
                let offering = '';
                let businessType = '';
                try {
                  const profile = JSON.parse(s.profileJson || '{}');
                  offering = profile.offering || profile.description || '';
                  businessType = profile.businessType || '';
                } catch { /* ignore */ }

                const stagesComplete = getSessionStages(s);
                const score = getSessionScore(s);
                const isActive = s.intakeComplete;
                const lastStageDone = stagesComplete > 0 ? STAGE_PIPELINE[stagesComplete - 1] : null;
                const nextStage = stagesComplete < STAGE_PIPELINE.length ? STAGE_PIPELINE[stagesComplete] : null;

                return (
                  <div
                    key={s.id}
                    onClick={() => router.push(s.intakeComplete ? `/session/${s.id}/dashboard` : `/session/${s.id}`)}
                    className={`relative glass glass-glow rounded-2xl p-4 sm:p-5 cursor-pointer
                      hover:border-primary/40 transition-all duration-200 group overflow-hidden
                      ${isActive ? '' : 'opacity-70'}`}
                  >
                    {/* Background glow for high-progress projects */}
                    {score >= 70 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-green/3 to-transparent pointer-events-none" />
                    )}
                    {score >= 40 && score < 70 && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent pointer-events-none" />
                    )}

                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-text truncate">{s.name}</h4>
                          {score >= 70 && <Sparkles className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                        </div>
                        {offering && (
                          <p className="text-xs text-text-muted truncate">{offering}</p>
                        )}
                      </div>
                      {/* Score ring */}
                      <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${getScoreRing(score)}`}>
                        <span className={`text-xs font-bold ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                    </div>

                    {/* Stage pipeline */}
                    <div className="flex items-center gap-1 mb-3">
                      {STAGE_PIPELINE.map((stage, idx) => {
                        const isDone = idx < stagesComplete;
                        const isCurrent = idx === stagesComplete && isActive;
                        return (
                          <div
                            key={stage.key}
                            className={`flex-1 h-1.5 rounded-full transition-all ${
                              isDone ? 'bg-primary' :
                              isCurrent ? 'bg-primary animate-pulse' :
                              'bg-surface'
                            }`}
                            title={stage.label}
                          />
                        );
                      })}
                    </div>

                    {/* Status info */}
                    <div className="flex items-center justify-between">
                      <div>
                        {!isActive ? (
                          <span className="flex items-center gap-1 text-[10px] text-text-muted/60">
                            <Lock className="w-3 h-3" /> In intake
                          </span>
                        ) : nextStage ? (
                          <span className="flex items-center gap-1 text-[10px] text-text-muted/60">
                            <ChevronRight className="w-3 h-3 text-primary" />
                            <span className="text-primary/70">Next: {nextStage.label}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] text-accent-green/70">
                            <CheckCircle2 className="w-3 h-3" /> Strategy complete
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted/40">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(s.updatedAt)}
                      </div>
                    </div>

                    {/* Brief link */}
                    {s.intakeComplete && (
                      <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between">
                        <a
                          href={`/brief/${s.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] text-text-muted/50 hover:text-primary-light flex items-center gap-1 transition-colors"
                        >
                          <BookMarked className="w-3 h-3" /> Master Brief
                        </a>
                        {businessType && (
                          <span className="text-[10px] text-text-muted/40 uppercase tracking-wider">
                            {businessType.replace(/-/g, ' ')}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Delete button — always visible */}
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      className="absolute top-3 right-3 text-text-muted/40 hover:text-red-400 transition-all w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-xs"
                      title="Delete project"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}

              {/* New project card */}
              <div
                onClick={handleNew}
                className="border border-dashed border-border/50 rounded-2xl p-5 cursor-pointer
                  hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-light" />
                </div>
                <p className="text-sm font-medium text-text-muted">New Analysis</p>
                <p className="text-[10px] text-text-muted/50">Start a new business strategy</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick tools */}
        <div className="mb-10">
          <h3 className="text-base font-semibold text-text mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickCard href="/plans" icon={<ClipboardList className="w-5 h-5" />} label="Action Plans" sub="Track your strategy" color="text-primary" bg="bg-primary/10" />
            <QuickCard href="/library" icon={<BookOpen className="w-5 h-5" />} label="Strategy Library" sub="Frameworks & principles" color="text-purple-400" bg="bg-purple-500/10" />
            <QuickCard href="/templates" icon={<FolderOpen className="w-5 h-5" />} label="Templates" sub="Jumpstart a strategy" color="text-blue-400" bg="bg-blue-500/10" />
            <QuickCard href="/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" sub="Plan your timeline" color="text-accent-green" bg="bg-accent-green/10" />
          </div>
        </div>

        {/* Capabilities grid (new users only) */}
        {sessions.length === 0 && !loading && (
          <div>
            <h3 className="text-base font-semibold text-text mb-4">What MadAi does</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-10">
              {featureCards.map((cap, i) => (
                <div key={i} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5 hover:border-primary/20 transition-colors">
                  <div className={`w-9 h-9 rounded-xl ${cap.bg} flex items-center justify-center mb-3`}>
                    <cap.Icon className={`w-5 h-5 ${cap.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-text mb-1">{cap.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{cap.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategy journey explainer */}
        {sessions.length === 0 && (
          <div className="bg-gradient-to-r from-primary/5 via-accent-gold/5 to-transparent border border-border rounded-2xl p-5 sm:p-6 mb-8">
            <h3 className="text-sm font-semibold text-text mb-4 flex items-center gap-2">
              <Map className="w-4 h-4 text-primary-light" />
              The Strategy Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
              {STAGE_PIPELINE.map((stage, i) => (
                <div key={stage.key} className="flex sm:flex-col items-center gap-2 sm:gap-1">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary-light flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[11px] text-text-muted sm:text-center">{stage.label}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted/60 mt-3">Each stage builds on the previous. Accept and continue at your own pace, or let AI auto-generate each stage.</p>
          </div>
        )}

        {/* PWA install prompt */}
        <div className="mt-4 bg-surface-light border border-border rounded-xl p-4 text-center sm:hidden">
          <p className="text-sm font-medium text-text mb-1">Install MadAi</p>
          <p className="text-xs text-text-muted">Tap share → &quot;Add to Home Screen&quot; for the full app experience.</p>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center border-t border-border/30 pt-6">
          <p className="text-[10px] text-text-muted/30 max-w-lg mx-auto">
            MadAi — Strategic Marketing Intelligence. Powered by Sterling AI.
          </p>
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5 rounded-lg hover:bg-surface-light">
      <span className="sm:hidden">{icon}</span>
      <span className="hidden sm:flex items-center gap-1.5">{icon}{label}</span>
    </a>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="glass glass-glow rounded-xl p-3 sm:p-4 border-t-2 border-primary/30">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function QuickCard({ href, icon, label, sub, color, bg }: { href: string; icon: React.ReactNode; label: string; sub: string; color: string; bg: string }) {
  return (
    <a href={href} className="glass rounded-xl p-4 hover:border-primary/40 transition-colors group flex flex-col gap-2">
      <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-text">{label}</p>
        <p className="text-[10px] text-text-muted mt-0.5">{sub}</p>
      </div>
    </a>
  );
}
