'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Brain, FolderOpen, Calendar, BookOpen, User, Power, Target, Search, Scale, Map, Shield, FlaskConical, ClipboardList } from 'lucide-react';

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
      if (res.ok) {
        setSessions(await res.json());
      }
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
    if (confirm('Delete this session?')) {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      loadSessions();
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  const featureCards = [
    { Icon: Target, title: 'Any Business Type', desc: 'Lemonade stand to SaaS. Creator brand to consulting. No restrictions.' },
    { Icon: Search, title: 'Live Research', desc: 'Real competitors, real trends, real market data. Not generic advice.' },
    { Icon: Scale, title: 'Ethical Intelligence', desc: 'Maximize profit through genuine value, not predatory extraction.' },
    { Icon: Map, title: 'Macro to Micro', desc: 'From business model design down to exact Instagram captions.' },
    { Icon: Shield, title: 'Platform Power Awareness', desc: 'Know when you\'re building a business vs feeding someone else\'s.' },
    { Icon: FlaskConical, title: 'Innovation Lab', desc: 'Cross-industry tactics. Hybrid strategies. Novel approaches.' },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-text">MadAi</h1>
              <p className="text-[10px] sm:text-xs text-text-muted">Strategic Marketing Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            <a href="/plans" className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-current sm:hidden" />
              <span className="hidden sm:inline flex items-center gap-1.5"><ClipboardList className="w-4 h-4 text-current" /> Plans</span>
            </a>
            <a href="/templates" className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-current sm:hidden" />
              <span className="hidden sm:inline flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-current" /> Templates</span>
            </a>
            <a href="/calendar" className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-current sm:hidden" />
              <span className="hidden sm:inline flex items-center gap-1.5"><Calendar className="w-4 h-4 text-current" /> Calendar</span>
            </a>
            <a href="/library" className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-current sm:hidden" />
              <span className="hidden sm:inline flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-current" /> Library</span>
            </a>
            <a href="/profile" className="text-xs sm:text-sm text-text-muted hover:text-text transition-colors px-2 sm:px-3 py-2 flex items-center gap-1.5">
              {session?.user?.image ? (
                <img src={session.user.image} alt="" className="w-6 h-6 rounded-full inline" />
              ) : (
                <>
                  <User className="w-4 h-4 text-current sm:hidden" />
                  <span className="hidden sm:inline flex items-center gap-1.5"><User className="w-4 h-4 text-current" /> {session?.user?.name || 'Profile'}</span>
                </>
              )}
            </a>
            <button
              onClick={() => signOut()}
              className="text-xs text-text-muted/50 hover:text-accent-red transition-colors px-2 py-2 hidden sm:block"
              title="Sign out"
            >
              <Power className="w-4 h-4 text-current" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-2 sm:mb-3">
            Turn value into revenue.
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Business fundamentals. Psychological insight. Live market research. Platform-power awareness.
            Channel-specific execution. All in one strategic intelligence system.
          </p>
          {sessions.length === 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary-light text-xs px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-primary-light rounded-full animate-pulse" />
              Start by telling MadAi about your business
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-6 sm:mt-8">
            <button
              onClick={handleNew}
              className="bg-primary hover:bg-primary-dark text-white font-semibold
                rounded-xl px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base transition-colors shadow-lg shadow-primary/25"
            >
              + New Business Analysis
            </button>
            <a href="/templates"
              className="border border-border hover:border-primary/40 text-text font-medium
                rounded-xl px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base transition-colors">
              Browse Templates
            </a>
          </div>
        </div>

        {/* Capabilities grid (shown when no sessions) */}
        {sessions.length === 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-12">
            {featureCards.map((cap, i) => (
              <div key={i} className="bg-surface-light border border-border rounded-xl p-4 sm:p-5">
                <cap.Icon className="w-6 h-6 text-primary-light" />
                <h3 className="text-sm font-semibold text-text mt-2 sm:mt-3 mb-1">{cap.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Sessions list */}
        {sessions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-text">Your Projects</h3>
              <span className="text-xs text-text-muted">{sessions.length} project{sessions.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {sessions.map(s => {
                let offering = '';
                try {
                  const profile = JSON.parse(s.profileJson || '{}');
                  offering = profile.offering || profile.description || '';
                } catch { /* ignore */ }

                return (
                  <div
                    key={s.id}
                    onClick={() => router.push(`/session/${s.id}`)}
                    className="bg-surface-light border border-border rounded-xl p-3 sm:p-4 cursor-pointer
                      hover:border-primary/40 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-text truncate">{s.name}</h4>
                        {s.intakeComplete && (
                          <span className="text-[10px] bg-accent-green/20 text-accent-green px-2 py-0.5 rounded-full">
                            Intake Complete
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 truncate">
                        {offering || 'No description yet'}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-text-muted/50">{s._count.messages} messages</span>
                        <span className="text-[10px] text-text-muted/50">{new Date(s.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      className="text-text-muted/30 hover:text-accent-red opacity-0 group-hover:opacity-100 transition-all px-2 py-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Install PWA prompt for mobile */}
        <div className="mt-8 sm:mt-12 bg-surface-light border border-border rounded-xl p-4 sm:p-5 text-center sm:hidden">
          <p className="text-sm font-medium text-text mb-1">Install MadAi on your phone</p>
          <p className="text-xs text-text-muted">
            Tap the share button in your browser, then &quot;Add to Home Screen&quot; for the full app experience.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-16 text-center border-t border-border pt-6 sm:pt-8">
          <p className="text-xs text-text-muted/50 max-w-lg mx-auto">
            Built on The Personal MBA (Kaufman), Technofeudalism (Varoufakis), direct response marketing,
            behavioral psychology, and platform economics.
          </p>
        </div>
      </main>
    </div>
  );
}
