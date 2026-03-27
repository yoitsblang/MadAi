'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  }

  if (!token || !email) {
    return (
      <div className="text-center">
        <p className="text-sm text-accent-red">Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" className="text-sm text-primary-light hover:underline mt-2 inline-block">
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 text-center">
        <CheckCircle2 className="w-8 h-8 text-accent-green mx-auto mb-2" />
        <p className="text-sm text-text">Password reset successfully!</p>
        <Link href="/login" className="text-sm text-primary-light hover:underline mt-2 inline-block">
          Sign In with New Password
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg px-4 py-2.5 text-sm text-accent-red">
          {error}
        </div>
      )}
      <div>
        <label className="text-sm font-medium text-text">New Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-text
            placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mt-1"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-text">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-sm text-text
            placeholder:text-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 mt-1"
          placeholder="Confirm your password"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold
          hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo-400.png" alt="MadAi" className="w-20 h-20 rounded-2xl mx-auto mb-4 float" />
          <h1 className="text-2xl font-bold text-text text-glow-red">Set New Password</h1>
          <p className="text-sm text-text-muted mt-1">Choose a strong password for your account</p>
        </div>
        <Suspense fallback={<div className="text-center text-text-muted text-sm">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
