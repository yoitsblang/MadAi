'use client';

import React, { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';

interface Scorecard {
  clarity: number; trust: number; conversion: number; retention: number;
  delivery: number; channelHealth: number; audienceOwnership: number; executionSpeed: number;
  reasoning: string;
}

const DIMENSIONS = [
  { key: 'clarity', label: 'Clarity', desc: 'How clear is your positioning and value prop?' },
  { key: 'trust', label: 'Trust', desc: 'Do customers believe and feel safe buying?' },
  { key: 'conversion', label: 'Conversion', desc: 'Are visitors becoming customers?' },
  { key: 'retention', label: 'Retention', desc: 'Do customers come back or refer?' },
  { key: 'delivery', label: 'Delivery', desc: 'Is fulfillment smooth and trust-building?' },
  { key: 'channelHealth', label: 'Channels', desc: 'Are your marketing channels working?' },
  { key: 'audienceOwnership', label: 'Owned Audience', desc: 'Do you own your audience or rent it?' },
  { key: 'executionSpeed', label: 'Execution', desc: 'How fast are you shipping and iterating?' },
];

function ScoreBar({ score, label }: { score: number; label: string }) {
  const color = score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#dc2626';
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-zinc-600 w-20 flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score * 10}%`, background: color, boxShadow: `0 0 8px ${color}40` }} />
      </div>
      <span className="text-xs font-bold font-mono w-6 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

export default function FounderScorecardWidget({ sessionId }: { sessionId: string }) {
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);

  useEffect(() => {
    fetch(`/api/scorecard?sessionId=${sessionId}`).then(r => r.ok ? r.json() : null).then(setScorecard);
  }, [sessionId]);

  if (!scorecard) return null;

  const avg = Math.round(
    (scorecard.clarity + scorecard.trust + scorecard.conversion + scorecard.retention +
     scorecard.delivery + scorecard.channelHealth + scorecard.audienceOwnership + scorecard.executionSpeed) / 8
  );

  return (
    <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Gauge className="w-4 h-4 text-red-400" /> Founder Scorecard
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold font-mono" style={{
            color: avg >= 7 ? '#22c55e' : avg >= 4 ? '#f59e0b' : '#dc2626',
            textShadow: `0 0 15px ${avg >= 7 ? '#22c55e' : avg >= 4 ? '#f59e0b' : '#dc2626'}30`,
          }}>{avg}</span>
          <span className="text-[9px] text-zinc-700">/10 AVG</span>
        </div>
      </div>
      <div className="space-y-2">
        {DIMENSIONS.map(d => (
          <ScoreBar key={d.key} score={(scorecard as Record<string, number>)[d.key] || 0} label={d.label} />
        ))}
      </div>
    </div>
  );
}
