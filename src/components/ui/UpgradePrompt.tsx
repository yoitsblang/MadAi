'use client';

import React from 'react';
import { Zap, Lock, Crown, ChevronRight, X } from 'lucide-react';

interface UpgradePromptProps {
  reason: 'credits' | 'module';
  currentTier: string;
  currentCredits: number;
  requiredModule?: string;
  onClose: () => void;
}

const TIER_DISPLAY = [
  { key: 'free', label: 'Free', price: '$0', credits: '50 credits', color: 'text-text-muted', features: ['Core analysis (3 modules)', '2 sessions'] },
  { key: 'starter', label: 'Starter', price: '$19/mo', credits: '200 credits/mo', color: 'text-accent-blue', features: ['Full 7-stage pipeline', 'Ethics & Psychology', '5 sessions', 'Templates'] },
  { key: 'pro', label: 'Pro', price: '$49/mo', credits: '500 credits/mo', color: 'text-primary-light', features: ['All 14 modules', 'Live market research', 'Innovation lab', 'Export', 'Unlimited sessions'] },
  { key: 'enterprise', label: 'Enterprise', price: '$99/mo', credits: 'Unlimited', color: 'text-accent-green', features: ['Everything in Pro', 'Calendar', 'Priority AI', 'Unlimited credits'] },
];

export default function UpgradePrompt({ reason, currentTier, currentCredits, requiredModule, onClose }: UpgradePromptProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full mx-4 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            {reason === 'credits' ? (
              <Zap className="w-5 h-5 text-accent-amber" />
            ) : (
              <Lock className="w-5 h-5 text-primary-light" />
            )}
            <div>
              <h2 className="text-sm font-bold text-text">
                {reason === 'credits' ? 'Out of Credits' : 'Module Locked'}
              </h2>
              <p className="text-xs text-text-muted">
                {reason === 'credits'
                  ? `You have ${currentCredits} credits remaining. Upgrade for more.`
                  : `The ${requiredModule?.replace(/-/g, ' ')} module requires a higher plan.`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tier Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TIER_DISPLAY.map(tier => {
              const isCurrent = tier.key === currentTier;
              const isUpgrade = TIER_DISPLAY.findIndex(t => t.key === tier.key) > TIER_DISPLAY.findIndex(t => t.key === currentTier);
              return (
                <div
                  key={tier.key}
                  className={`rounded-xl border p-3 transition-all ${
                    isCurrent
                      ? 'border-primary/50 bg-primary/5'
                      : isUpgrade
                      ? 'border-border hover:border-primary/30 cursor-pointer'
                      : 'border-border/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {tier.key === 'enterprise' && <Crown className="w-3.5 h-3.5 text-accent-amber" />}
                    <span className={`text-xs font-bold ${tier.color}`}>{tier.label}</span>
                  </div>
                  <div className="text-lg font-bold text-text mb-0.5">{tier.price}</div>
                  <div className="text-[10px] text-text-muted mb-2">{tier.credits}</div>
                  <ul className="space-y-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="text-[10px] text-text-muted flex items-start gap-1">
                        <ChevronRight className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 text-primary-light/50" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent && (
                    <div className="mt-2 text-[10px] font-medium text-primary-light bg-primary/10 rounded px-2 py-0.5 text-center">
                      Current Plan
                    </div>
                  )}
                  {isUpgrade && (
                    <button className="mt-2 w-full text-[10px] font-semibold bg-primary text-white rounded-lg px-2 py-1.5 hover:bg-primary/90 transition-colors">
                      Upgrade
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-text-muted/60 text-center mt-4">
            Stripe integration coming soon. Contact support for early access to paid plans.
          </p>
        </div>
      </div>
    </div>
  );
}
