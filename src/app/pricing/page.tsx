'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Zap, Crown, ArrowLeft, CreditCard, Sparkles } from 'lucide-react';
import { TIER_CONFIG } from '@/lib/tiers';

function PricingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');
  const [user, setUser] = useState<{ credits: number; subscriptionTier: string; role: string } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/user').then(r => r.ok ? r.json() : null).then(setUser);
  }, [success]);

  async function handleCheckout(type: 'subscription' | 'credits', tierOrPack: string) {
    setLoading(tierOrPack);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(type === 'subscription' ? { type, tier: tierOrPack } : { type, pack: tierOrPack }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Could not start checkout');
      }
    } catch {
      alert('Network error');
    }
    setLoading(null);
  }

  const tiers = Object.entries(TIER_CONFIG) as [string, typeof TIER_CONFIG[keyof typeof TIER_CONFIG]][];
  const currentTier = user?.subscriptionTier || 'free';

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border/20 glass-strong sticky top-0 z-10 accent-line">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-text-muted hover:text-text">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="/logo-400.png" alt="MadAi" className="w-8 h-8 rounded-lg" />
          <h1 className="text-sm font-bold text-text text-glow-red">MadAi Pricing</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {success && (
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-accent-green flex-shrink-0" />
            <p className="text-sm text-text">Payment successful! Your account has been upgraded.</p>
          </div>
        )}
        {canceled && (
          <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-text-muted">Checkout canceled. No charges were made.</p>
          </div>
        )}

        {user && (
          <div className="glass rounded-xl p-4 mb-6 flex items-center justify-between glass-glow">
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Current Plan</span>
              <p className="text-sm font-bold text-text capitalize">{currentTier} {user.role === 'admin' && '(Admin)'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted uppercase tracking-wider">Credits</span>
              <p className="text-sm font-bold text-primary-light">{user.credits >= 999999 ? 'Unlimited' : user.credits}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-text mb-1">Choose Your Plan</h2>
        <p className="text-sm text-text-muted mb-6">All plans include the core AI strategy engine. Upgrade for more modules, credits, and features.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {tiers.map(([key, config]) => {
            const isCurrent = key === currentTier;
            const isPopular = key === 'pro';
            return (
              <div key={key} className={`relative bg-surface-light border rounded-xl p-5 flex flex-col ${
                isPopular ? 'border-primary ring-1 ring-primary/20' : 'border-border'
              }`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {key === 'enterprise' ? <Crown className="w-4 h-4 text-accent-gold" /> : <Zap className="w-4 h-4 text-primary-light" />}
                  <h3 className="text-sm font-bold text-text">{config.label}</h3>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-text">${config.price}</span>
                  <span className="text-xs text-text-muted">/mo</span>
                </div>
                <p className="text-xs text-text-muted mb-3">{config.description}</p>
                <div className="space-y-1.5 mb-4 flex-1">
                  <Feature text={`${config.creditsPerMonth === -1 ? 'Unlimited' : config.creditsPerMonth} credits/mo`} />
                  <Feature text={`${config.modules.length} AI modules`} />
                  <Feature text={`${config.features.maxSessions === -1 ? 'Unlimited' : config.features.maxSessions} sessions`} />
                  {config.features.export && <Feature text="Export briefs" />}
                  {config.features.templates && <Feature text="Strategy templates" />}
                  {config.features.priorityAi && <Feature text="Priority AI responses" />}
                  {config.features.calendar && <Feature text="Strategy calendar" />}
                </div>
                {isCurrent ? (
                  <div className="text-xs text-center py-2 rounded-lg bg-accent-green/10 text-accent-green font-medium border border-accent-green/20">
                    Current Plan
                  </div>
                ) : key === 'free' ? (
                  <div className="text-xs text-center py-2 rounded-lg bg-surface text-text-muted border border-border">
                    Free Forever
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout('subscription', key)}
                    disabled={loading === key}
                    className={`text-xs font-semibold py-2.5 rounded-lg transition-colors w-full ${
                      isPopular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-surface-light border border-primary/30 text-primary-light hover:bg-primary/10'
                    } disabled:opacity-50`}>
                    {loading === key ? 'Redirecting...' : `Upgrade to ${config.label}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Credit Packs */}
        <h2 className="text-lg font-bold text-text mb-1 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary-light" /> Buy More Credits
        </h2>
        <p className="text-sm text-text-muted mb-4">Need more credits without changing your plan? Buy a one-time credit pack.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { key: 'small', credits: 100, price: 5, savings: '' },
            { key: 'medium', credits: 300, price: 12, savings: 'Save 20%' },
            { key: 'large', credits: 1000, price: 35, savings: 'Save 30%' },
          ].map(pack => (
            <div key={pack.key} className="bg-surface-light border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-gold" />
                  <span className="text-sm font-bold text-text">{pack.credits} Credits</span>
                </div>
                {pack.savings && (
                  <span className="text-[9px] bg-accent-green/10 text-accent-green px-2 py-0.5 rounded-full font-bold">
                    {pack.savings}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold text-text mb-3">${pack.price}</p>
              <button
                onClick={() => handleCheckout('credits', pack.key)}
                disabled={loading === pack.key}
                className="w-full text-xs font-medium py-2 rounded-lg bg-surface border border-border text-text-muted hover:text-text hover:border-primary/30 transition-colors disabled:opacity-50">
                {loading === pack.key ? 'Redirecting...' : 'Buy Credits'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-text-muted">
      <CheckCircle2 className="w-3 h-3 text-accent-green flex-shrink-0" />
      {text}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-text-muted">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
