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
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="text-zinc-600 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="/logo-400.png" alt="MadAi" className="w-8 h-8 rounded-lg" />
          <h1 className="text-sm font-bold text-white text-glow-red">MadAi Pricing</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-sm text-white">Payment successful! Your account has been upgraded.</p>
          </div>
        )}
        {canceled && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
            <p className="text-sm text-zinc-500">Checkout canceled. No charges were made.</p>
          </div>
        )}

        {user && (
          <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 mb-6 flex items-center justify-between relative overflow-hidden">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
            <div>
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Current Plan</span>
              <p className="text-sm font-bold text-white capitalize">{currentTier} {user.role === 'admin' && '(Admin)'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-600 uppercase tracking-wider">Credits</span>
              <p className="text-sm font-bold font-mono text-red-400">{user.credits >= 999999 ? 'Unlimited' : user.credits}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-white mb-1">Choose Your Plan</h2>
        <p className="text-sm text-zinc-500 mb-6">All plans include the core AI strategy engine. Upgrade for more modules, credits, and features.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {tiers.map(([key, config]) => {
            const isCurrent = key === currentTier;
            const isPopular = key === 'pro';
            return (
              <div key={key} className={`relative bg-[#0a0a0f] border rounded-xl p-5 flex flex-col overflow-hidden ${
                isPopular ? 'border-red-500/40 ring-1 ring-red-500/20' : 'border-red-900/15'
              }`}>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider z-10">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  {key === 'enterprise' ? <Crown className="w-4 h-4 text-amber-500" /> : <Zap className="w-4 h-4 text-red-400" />}
                  <h3 className="text-sm font-bold text-white">{config.label}</h3>
                </div>
                <div className="mb-3">
                  <span className="text-2xl font-bold font-mono text-white">${config.price}</span>
                  <span className="text-xs text-zinc-600">/mo</span>
                </div>
                <p className="text-xs text-zinc-600 mb-3">{config.description}</p>
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
                  <div className="text-xs text-center py-2 rounded-lg bg-green-500/10 text-green-500 font-medium border border-green-500/20">
                    Current Plan
                  </div>
                ) : key === 'free' ? (
                  <div className="text-xs text-center py-2 rounded-lg bg-[#050507] text-zinc-600 border border-zinc-800">
                    Free Forever
                  </div>
                ) : (
                  <button
                    onClick={() => handleCheckout('subscription', key)}
                    disabled={loading === key}
                    className={`text-xs font-semibold py-2.5 rounded-lg transition-colors w-full ${
                      isPopular
                        ? 'bg-red-600 text-white hover:bg-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                        : 'bg-[#050507] border border-red-500/20 text-red-400 hover:bg-red-500/10'
                    } disabled:opacity-50`}>
                    {loading === key ? 'Redirecting...' : `Upgrade to ${config.label}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Credit Packs */}
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-red-400" /> Buy More Credits
        </h2>
        <p className="text-sm text-zinc-500 mb-4">Need more credits without changing your plan? Buy a one-time credit pack.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { key: 'small', credits: 100, price: 5, savings: '' },
            { key: 'medium', credits: 300, price: 12, savings: 'Save 20%' },
            { key: 'large', credits: 1000, price: 35, savings: 'Save 30%' },
          ].map(pack => (
            <div key={pack.key} className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 relative overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold text-white">{pack.credits} Credits</span>
                </div>
                {pack.savings && (
                  <span className="text-[9px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold border border-green-500/20">
                    {pack.savings}
                  </span>
                )}
              </div>
              <p className="text-xl font-bold font-mono text-white mb-3">${pack.price}</p>
              <button
                onClick={() => handleCheckout('credits', pack.key)}
                disabled={loading === pack.key}
                className="w-full text-xs font-medium py-2 rounded-lg bg-[#050507] border border-red-900/20 text-zinc-500 hover:text-white hover:border-red-500/30 transition-colors disabled:opacity-50">
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
    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
      {text}
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050507] flex items-center justify-center text-zinc-600">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}
