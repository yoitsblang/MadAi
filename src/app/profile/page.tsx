'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { EthicalStance } from '@/lib/types/business';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  defaultStance: string;
  createdAt: string;
  _count: { strategies: number; calendarEvents: number; aiMemories: number };
}

interface SessionItem {
  id: string;
  name: string;
  intakeComplete: boolean;
  activeModule: string;
  updatedAt: string;
  profileJson: string;
  _count: { messages: number };
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [name, setName] = useState('');
  const [stance, setStance] = useState<EthicalStance>('balanced');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'account' | 'projects' | 'preferences'>('account');

  useEffect(() => {
    loadProfile();
    loadSessions();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || '');
        setStance(data.defaultStance as EthicalStance);
      }
    } catch { /* ignore */ }
  }

  async function loadSessions() {
    try {
      const res = await fetch('/api/sessions');
      if (res.ok) {
        setSessions(await res.json());
      }
    } catch { /* ignore */ }
  }

  async function handleSave() {
    setError('');
    const body: Record<string, string> = { name, defaultStance: stance };
    if (newPassword) {
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      body.newPassword = newPassword;
    }

    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setSaved(true);
      setNewPassword('');
      setTimeout(() => setSaved(false), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save');
    }
  }

  async function handleDeleteSession(id: string) {
    if (confirm('Delete this project and all its data?')) {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      loadSessions();
    }
  }

  const isGoogleUser = session?.user?.image?.includes('googleusercontent');

  return (
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <a href="/" className="text-zinc-600 hover:text-white transition-colors">←</a>
          <h1 className="text-lg font-bold text-white">Profile</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* User header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile?.image ? (
              <img src={profile.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-red-400">
                {(profile?.name || session?.user?.name || '?')[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white truncate">{profile?.name || session?.user?.name || 'User'}</h2>
            <p className="text-sm text-zinc-500 truncate">{profile?.email || session?.user?.email}</p>
            {isGoogleUser && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-[#12121a] border border-red-900/20 rounded-full px-2 py-0.5 mt-1 text-zinc-500">
                <svg className="w-3 h-3" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google linked
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-red-900/20 mb-6">
          {(['account', 'projects', 'preferences'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px
                ${activeTab === tab
                  ? 'text-red-400 border-red-500'
                  : 'text-zinc-600 border-transparent hover:text-white'}`}
            >
              {tab === 'account' ? 'Account' : tab === 'projects' ? `Projects (${sessions.length})` : 'Preferences'}
            </button>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <section className="bg-[#12121a] border border-red-900/30 rounded-xl p-5 sm:p-6 relative overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5 text-sm text-red-400 mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-[#050507] border border-red-900/20 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500/40" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email</label>
                  <input type="email" value={session?.user?.email || ''} disabled
                    className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-600 opacity-60 cursor-not-allowed" />
                </div>
                {!isGoogleUser && (
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">New Password (optional)</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-[#050507] border border-red-900/20 rounded-lg px-3 py-2.5 text-sm text-white
                        placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40" />
                  </div>
                )}
              </div>
              <button onClick={handleSave}
                className="mt-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/50">
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </section>

            {/* Stats */}
            {profile && (
              <section className="bg-[#12121a] border border-red-900/30 rounded-xl p-5 sm:p-6 relative overflow-hidden">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
                <h3 className="text-sm font-semibold text-white mb-3">Activity</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-red-400">{profile._count.strategies}</div>
                    <div className="text-xs text-zinc-600 mt-1">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-red-400">{profile._count.calendarEvents}</div>
                    <div className="text-xs text-zinc-600 mt-1">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-mono text-red-400">{profile._count.aiMemories}</div>
                    <div className="text-xs text-zinc-600 mt-1">AI Memories</div>
                  </div>
                </div>
                <div className="text-xs text-zinc-700 mt-4">
                  Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </section>
            )}

            <button onClick={() => signOut({ callbackUrl: '/login' })}
              className="w-full border border-red-900/20 text-zinc-600 hover:text-red-400 hover:border-red-500/30 rounded-xl py-3 text-sm transition-colors">
              Sign Out
            </button>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-500">All your business projects and strategy sessions.</p>
              <a href="/"
                className="text-xs bg-red-600 hover:bg-red-500 text-white rounded-lg px-3 py-1.5 transition-colors border border-red-500/50">
                + New
              </a>
            </div>
            {sessions.length === 0 ? (
              <div className="bg-[#12121a] border border-red-900/30 rounded-xl p-8 text-center">
                <p className="text-zinc-600 text-sm">No projects yet. Create your first one!</p>
              </div>
            ) : (
              sessions.map(s => {
                let offering = '';
                try {
                  const p = JSON.parse(s.profileJson || '{}');
                  offering = p.offering || p.description || '';
                } catch { /* ignore */ }

                return (
                  <div key={s.id} className="bg-[#12121a] border border-red-900/30 rounded-xl p-4 group hover:border-red-500/25 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <a href={`/session/${s.id}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white truncate">{s.name}</h4>
                          {s.intakeComplete && (
                            <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">Complete</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5 truncate">{offering || 'No description yet'}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-zinc-700">{s._count.messages} messages</span>
                          <span className="text-[10px] text-zinc-700">{s.activeModule.replace(/-/g, ' ')}</span>
                          <span className="text-[10px] text-zinc-700">{new Date(s.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </a>
                      <button onClick={() => handleDeleteSession(s.id)}
                        className="text-zinc-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all px-1 py-1 flex-shrink-0">
                        &#x2715;
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <section className="bg-[#12121a] border border-red-900/30 rounded-xl p-5 sm:p-6 relative overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
              <h3 className="text-sm font-semibold text-white mb-1">Default Ethical Stance</h3>
              <p className="text-xs text-zinc-600 mb-4">Controls how aggressively the AI generates tactics.</p>
              <div className="space-y-2">
                {[
                  { value: 'ethical-first' as const, label: 'Ethical-First', color: 'border-green-500/30', desc: 'Prioritize customer value and trust above all.' },
                  { value: 'balanced' as const, label: 'Balanced', color: 'border-blue-500/30', desc: 'Optimize both effectiveness and legitimacy.' },
                  { value: 'aggressive-but-defensible' as const, label: 'Aggressive but Defensible', color: 'border-amber-500/30', desc: 'Push hard, stay factually accurate.' },
                  { value: 'max-performance-with-warning' as const, label: 'Max Performance', color: 'border-red-500/30', desc: 'Full power with warnings attached.' },
                ].map(opt => (
                  <label key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                      ${stance === opt.value ? `${opt.color} bg-[#111116]` : 'border-red-900/30 hover:border-red-900/30'}`}>
                    <input type="radio" name="stance" value={opt.value} checked={stance === opt.value}
                      onChange={() => setStance(opt.value)} className="mt-0.5 accent-red-500" />
                    <div>
                      <div className="text-sm font-medium text-white">{opt.label}</div>
                      <div className="text-xs text-zinc-600 mt-0.5">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <button onClick={handleSave}
                className="mt-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl px-6 py-2.5 text-sm transition-colors shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/50">
                {saved ? 'Saved!' : 'Save Preferences'}
              </button>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
