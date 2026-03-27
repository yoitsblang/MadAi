'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, HelpCircle } from 'lucide-react';

interface Constraint {
  label: string;
  score: number;
  status: string; // primary | secondary | stable | unknown
}

export default function ConstraintMap({ constraints }: { constraints: Constraint[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {constraints.map(c => {
        const isPrimary = c.status === 'primary';
        const isUnknown = c.status === 'unknown' || c.score === 0;

        return (
          <div key={c.label}
            className={`relative rounded-xl p-3 transition-all ${
              isPrimary ? 'bg-primary/8 border border-primary/30' :
              isUnknown ? 'bg-surface-lighter/30 border border-border/10' :
              c.status === 'secondary' ? 'bg-accent-amber/5 border border-accent-amber/15' :
              'bg-surface-light/50 border border-border/15'
            }`}>
            {/* Status badge */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-text/80">{c.label}</span>
              {isPrimary && (
                <span className="text-[8px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  FIX NOW
                </span>
              )}
              {c.status === 'secondary' && (
                <span className="text-[8px] font-semibold text-accent-amber/70 uppercase tracking-wider">
                  at risk
                </span>
              )}
              {isUnknown && (
                <HelpCircle className="w-3 h-3 text-text-muted/25" />
              )}
            </div>

            {/* Score */}
            {isUnknown ? (
              <div>
                <p className="text-lg font-bold text-text-muted/20 data-value">?</p>
                <p className="text-[9px] text-text-muted/30 mt-0.5">No data yet</p>
              </div>
            ) : (
              <div className="flex items-end gap-1.5">
                <span className={`text-xl font-bold data-value ${
                  isPrimary ? 'text-primary' : c.score >= 7 ? 'text-accent-green' : c.score >= 4 ? 'text-accent-amber' : 'text-primary'
                }`}>{c.score}</span>
                <span className="text-[10px] text-text-muted/40 mb-0.5">/10</span>
                {/* Trend arrow */}
                <div className="ml-auto mb-0.5">
                  {c.score >= 6 ? <TrendingUp className="w-3.5 h-3.5 text-accent-green/60" /> :
                   c.score <= 3 ? <TrendingDown className="w-3.5 h-3.5 text-primary/60" /> :
                   <Minus className="w-3.5 h-3.5 text-text-muted/25" />}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
