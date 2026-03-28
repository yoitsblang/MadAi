'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTos, setAcceptedTos] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    if (!acceptedTos) { setError('You must accept the Terms of Service'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
      const signInRes = await signIn('credentials', { email, password, redirect: false });
      if (signInRes?.url) router.push(signInRes.url); else router.push('/');
    } catch { setError('Something went wrong'); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-10">
          <img src="/logo-200.png" alt="MAD" className="w-16 h-16 rounded-xl mx-auto mb-4 border border-red-900/30" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-xs text-zinc-600 mt-1">Start diagnosing your business bottleneck</p>
        </div>

        <button onClick={() => signIn('google', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-[#0a0a0f] border border-zinc-800 rounded-xl py-3 text-sm text-zinc-300 font-medium hover:border-red-500/30 hover:bg-red-500/5 transition-all mb-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-zinc-800" /><span className="text-[10px] text-zinc-700 uppercase tracking-wider">or</span><div className="flex-1 h-px bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-xs text-red-400">{error}</div>}
          <div>
            <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1 block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40 transition-colors"
              placeholder="Your name" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40 transition-colors"
              placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
              className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40 transition-colors"
              placeholder="Minimum 8 characters" />
          </div>

          {/* ToS */}
          <div className="flex items-start gap-3 py-2">
            <button type="button" onClick={() => setAcceptedTos(!acceptedTos)}
              className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${
                acceptedTos ? 'bg-red-600 border-red-500' : 'border-zinc-700 hover:border-red-500/50'
              }`}>
              {acceptedTos && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </button>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              I agree to the <a href="/terms" target="_blank" className="text-red-400 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-red-400 hover:underline">Privacy Policy</a>
            </p>
          </div>

          <button type="submit" disabled={loading || !acceptedTos}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl py-3 text-sm transition-all shadow-[0_0_30px_rgba(220,38,38,0.2)] border border-red-500/50 disabled:opacity-30">
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center text-xs text-zinc-700 mt-8">Already have an account? <a href="/login" className="text-red-400 hover:text-red-300 font-medium">Sign in</a></p>
      </div>
    </div>
  );
}
