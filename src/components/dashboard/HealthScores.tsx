'use client';

import React from 'react';
import Link from 'next/link';
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface Score {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  module: string;
}

interface HealthScoresProps {
  scores: Score[];
  sessionId: string;
}

function getScoreColor(value: number): string {
  if (value === 0) return '#4b5563';
  if (value >= 7) return '#22c55e';
  if (value >= 4) return '#d4a843';
  return '#dc2626';
}

function ScoreRing({ score, sessionId }: { score: Score; sessionId: string }) {
  const color = getScoreColor(score.value);
  const isEmpty = score.value === 0;
  const data = [{ value: isEmpty ? 0 : score.value, fill: color }];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20">
        <RadialBarChart
          width={80}
          height={80}
          cx={40}
          cy={40}
          innerRadius={28}
          outerRadius={38}
          barSize={6}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, score.maxValue]} tick={false} angleAxisId={0} />
          <RadialBar
            background={{ fill: 'rgba(255,255,255,0.04)' }}
            dataKey="value"
            angleAxisId={0}
            cornerRadius={4}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex items-center justify-center">
          {isEmpty ? (
            <span className="text-sm font-bold text-gray-500">--</span>
          ) : (
            <span className="text-sm font-bold" style={{ color }}>{score.value}</span>
          )}
        </div>
      </div>

      <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider text-center leading-tight">
        {score.label}
      </span>

      {isEmpty && (
        <Link
          href={`/session/${sessionId}`}
          className="text-[10px] text-primary-light hover:text-primary-light/80 transition-colors"
        >
          Run Analysis
        </Link>
      )}
    </div>
  );
}

export default function HealthScores({ scores, sessionId }: HealthScoresProps) {
  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-sm font-bold text-text uppercase tracking-wider mb-5">
        Health Scores
      </h2>
      <div className="flex items-start justify-between gap-2">
        {scores.map((score) => (
          <ScoreRing key={score.module} score={score} sessionId={sessionId} />
        ))}
      </div>
    </div>
  );
}
