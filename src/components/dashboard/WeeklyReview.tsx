'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Calendar, TrendingUp, TrendingDown, Minus, RefreshCw, ChevronDown, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  weekOf: string;
  improved: string;
  stalled: string;
  completed: string;
  newBottleneck: string;
  bestNextMove: string;
  notes: string;
}

export default function WeeklyReviewWidget({ sessionId }: { sessionId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/weekly-review?sessionId=${sessionId}`).then(r => r.ok ? r.json() : []).then(setReviews);
  }, [sessionId]);

  async function generateReview() {
    setGenerating(true);
    try {
      // Ask AI to generate a weekly review via chat
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: `Generate my weekly review. Analyze what improved this week, what stalled, what was completed, identify if there's a new bottleneck, and recommend the best next move. Be specific and grounded in the actual work done. Format your response with clear sections: IMPROVED, STALLED, COMPLETED, NEW BOTTLENECK, BEST NEXT MOVE.`,
          module: 'general',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiText = data.reply || '';

        // Parse the AI response into structured data
        const improved = extractSection(aiText, 'IMPROVED');
        const stalled = extractSection(aiText, 'STALLED');
        const completed = extractSection(aiText, 'COMPLETED');
        const newBn = extractLine(aiText, 'NEW BOTTLENECK');
        const nextMove = extractLine(aiText, 'BEST NEXT MOVE');

        // Save the review
        const saveRes = await fetch('/api/weekly-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            improved: improved.length > 0 ? improved : ['No clear improvements detected yet'],
            stalled: stalled.length > 0 ? stalled : ['Need more data'],
            completed: completed.length > 0 ? completed : ['Analysis stages'],
            newBottleneck: newBn || 'Same as current',
            bestNextMove: nextMove || 'Continue current sprint',
            notes,
          }),
        });

        if (saveRes.ok) {
          const review = await saveRes.json();
          setReviews(prev => [review, ...prev]);
          toast.success('Weekly review generated');
        }
      }
    } catch (e) {
      toast.error('Failed to generate review');
    }
    setGenerating(false);
  }

  const latest = reviews[0];
  const latestImproved = latest ? safeParseArray(latest.improved) : [];
  const latestStalled = latest ? safeParseArray(latest.stalled) : [];
  const latestCompleted = latest ? safeParseArray(latest.completed) : [];

  return (
    <div className="bg-[#12121a] border border-red-900/30 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" /> Weekly Review
        </h3>
        <button onClick={generateReview} disabled={generating}
          className="text-[10px] text-zinc-600 hover:text-red-400 flex items-center gap-1 transition-colors disabled:opacity-30">
          <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin' : ''}`} />
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {!latest && !generating && (
        <div className="text-center py-6">
          <p className="text-[11px] text-zinc-700 mb-3">No reviews yet. Generate your first weekly review.</p>
          <button onClick={generateReview}
            className="text-xs bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg border border-blue-500/20 font-medium">
            Generate Weekly Review
          </button>
        </div>
      )}

      {latest && (
        <div className="space-y-3">
          {/* Improved */}
          {latestImproved.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-green-500/60">Improved</span>
              </div>
              {latestImproved.map((item, i) => (
                <p key={i} className="text-[11px] text-zinc-400 pl-4 leading-relaxed">{item}</p>
              ))}
            </div>
          )}

          {/* Stalled */}
          {latestStalled.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Minus className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500/60">Stalled</span>
              </div>
              {latestStalled.map((item, i) => (
                <p key={i} className="text-[11px] text-zinc-500 pl-4 leading-relaxed">{item}</p>
              ))}
            </div>
          )}

          {/* Completed */}
          {latestCompleted.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <TrendingDown className="w-3 h-3 text-blue-400" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400/60">Completed</span>
              </div>
              {latestCompleted.map((item, i) => (
                <p key={i} className="text-[11px] text-zinc-400 pl-4 leading-relaxed">{item}</p>
              ))}
            </div>
          )}

          {/* New bottleneck + next move */}
          {latest.newBottleneck && (
            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 mt-2">
              <span className="text-[9px] text-red-500/60 uppercase tracking-wider font-bold">New Bottleneck</span>
              <p className="text-xs text-zinc-300 mt-0.5">{latest.newBottleneck}</p>
            </div>
          )}
          {latest.bestNextMove && (
            <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-2.5">
              <span className="text-[9px] text-green-500/60 uppercase tracking-wider font-bold">Best Next Move</span>
              <p className="text-xs text-zinc-300 mt-0.5">{latest.bestNextMove}</p>
            </div>
          )}

          {/* History toggle */}
          {reviews.length > 1 && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-zinc-700 hover:text-zinc-400 flex items-center gap-1 transition-colors">
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              {reviews.length - 1} previous review{reviews.length > 2 ? 's' : ''}
            </button>
          )}
          {expanded && reviews.slice(1).map(r => (
            <div key={r.id} className="border-t border-zinc-900/50 pt-2 text-[10px] text-zinc-700">
              Week of {new Date(r.weekOf).toLocaleDateString()} — {r.newBottleneck || 'No change'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function extractSection(text: string, header: string): string[] {
  const regex = new RegExp(`(?:#{1,3}\\s*)?${header}[:\\s]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s|\\n[A-Z]{4,}|$)`, 'i');
  const match = text.match(regex);
  if (!match?.[1]) return [];
  return match[1].split('\n')
    .map(l => l.replace(/^[-*\d.]+\s*/, '').trim())
    .filter(l => l.length > 5)
    .slice(0, 4);
}

function extractLine(text: string, header: string): string {
  const regex = new RegExp(`${header}[:\\s]*(.+?)(?:\\n|$)`, 'i');
  const match = text.match(regex);
  return match?.[1]?.trim() || '';
}

function safeParseArray(val: string): string[] {
  try { const arr = JSON.parse(val); return Array.isArray(arr) ? arr : [val]; }
  catch { return val ? [val] : []; }
}
