'use client';

import React, { useState } from 'react';
import { Brain, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-7 h-7 text-primary-light" />
          </div>
          <h1 className="text-2xl font-bold text-text">Reset Password</h1>
          <p className="text-sm text-text-muted mt-1">Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-center">
            <Mail className="w-8 h-8 text-accent-green mx-auto mb-2" />
            <p className="text-sm text-text">Check your email for a reset link.</p>
            <p className="text-xs text-text-muted mt-1">If you don't see it, check your spam folder.</p>
            <Link href="/login" className="text-xs text-primary-light hover:underline mt-3 inline-block">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-4 py-2.5 text-sm text-accent-red">
                {error}
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-text">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-text
                  placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mt-1"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold
                hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-text-muted hover:text-text mt-2">
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
