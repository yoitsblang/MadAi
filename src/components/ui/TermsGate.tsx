'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Shield, ExternalLink } from 'lucide-react';

const CURRENT_TERMS_VERSION = '2026-03-25-v1';

export default function TermsGate({ children }: { children: React.ReactNode }) {
  const [accepted, setAccepted] = useState<boolean | null>(null); // null = loading
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if user has accepted terms
    fetch('/api/user')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setAccepted(true); return; } // not logged in, let proxy handle
        setAccepted(!!data.acceptedTermsAt);
      })
      .catch(() => setAccepted(true)); // error = let them through, proxy handles auth
  }, []);

  async function handleAccept() {
    if (!checked) return;
    setChecking(true);
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptedTermsAt: new Date().toISOString(),
          acceptedTermsVersion: CURRENT_TERMS_VERSION,
        }),
      });
      setAccepted(true);
    } catch {
      alert('Failed to save. Please try again.');
    }
    setChecking(false);
  }

  // Still loading
  if (accepted === null) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Already accepted
  if (accepted) return <>{children}</>;

  // Show mandatory gate
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 border-b border-primary/20 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-light" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text">Terms of Service & Privacy Policy</h2>
            <p className="text-xs text-text-muted">Please review and accept to continue</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-text-muted leading-relaxed">
            Before using MadAi, you must agree to our Terms of Service and Privacy Policy.
            These documents explain how we handle your data, what you can expect from our service,
            and your rights as a user.
          </p>

          <div className="space-y-2">
            <a href="/terms" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-light border border-border hover:border-primary/30 transition-colors group">
              <div>
                <p className="text-sm font-medium text-text">Terms of Service</p>
                <p className="text-xs text-text-muted">Usage rules, limitations, and your responsibilities</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary-light" />
            </a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-surface-light border border-border hover:border-primary/30 transition-colors group">
              <div>
                <p className="text-sm font-medium text-text">Privacy Policy</p>
                <p className="text-xs text-text-muted">How we collect, use, and protect your data</p>
              </div>
              <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-primary-light" />
            </a>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-sm text-text leading-snug">
              I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
              I understand that MadAi provides AI-generated strategic guidance and does not guarantee
              specific business outcomes.
            </span>
          </label>
        </div>

        {/* Action */}
        <div className="px-6 py-4 border-t border-border bg-surface-light/50">
          <button
            onClick={handleAccept}
            disabled={!checked || checking}
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold
              hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {checking ? 'Saving...' : 'Accept & Continue'}
          </button>
          <p className="text-[10px] text-text-muted/50 text-center mt-2">
            Version {CURRENT_TERMS_VERSION}
          </p>
        </div>
      </div>
    </div>
  );
}
