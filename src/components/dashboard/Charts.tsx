'use client';

import React from 'react';

// ═══ RADAR CHART — for competitive/health analysis ═══
export function RadarChart({ data, size = 180 }: {
  data: Array<{ label: string; value: number; max?: number }>;
  size?: number;
}) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = data.length;
  if (n < 3) return null;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i: number, val: number, max: number) => {
    const angle = angleStep * i - Math.PI / 2;
    const ratio = Math.min(val / max, 1);
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
  };

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1];
  const gridLines = rings.map(ring => {
    const points = Array.from({ length: n }, (_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      return `${cx + r * ring * Math.cos(angle)},${cy + r * ring * Math.sin(angle)}`;
    }).join(' ');
    return <polygon key={ring} points={points} fill="none" stroke="rgba(220,38,38,0.08)" strokeWidth="0.5" />;
  });

  // Axis lines
  const axes = Array.from({ length: n }, (_, i) => {
    const angle = angleStep * i - Math.PI / 2;
    return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(220,38,38,0.1)" strokeWidth="0.5" />;
  });

  // Data polygon
  const dataPoints = data.map((d, i) => getPoint(i, d.value, d.max || 10));
  const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Labels
  const labels = data.map((d, i) => {
    const angle = angleStep * i - Math.PI / 2;
    const lx = cx + (r + 18) * Math.cos(angle);
    const ly = cy + (r + 18) * Math.sin(angle);
    return (
      <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
        className="text-[8px] fill-text-muted/50">{d.label}</text>
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLines}
      {axes}
      <polygon points={dataPath} fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1.5" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#dc2626" stroke="#09090b" strokeWidth="1" />
      ))}
      {labels}
    </svg>
  );
}

// ═══ DONUT CHART — for completion/score display ═══
export function DonutChart({ value, max = 100, size = 80, label, color = '#dc2626' }: {
  value: number; max?: number; size?: number; label?: string; color?: string;
}) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.min(value / max, 1);
  const offset = circumference * (1 - ratio);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(63,63,70,0.3)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 4px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-text metric-value">{Math.round(value)}</span>
        {label && <span className="text-[7px] text-text-muted/40">{label}</span>}
      </div>
    </div>
  );
}

// ═══ MINI BAR CHART — for channel/metric comparison ═══
export function MiniBarChart({ data, height = 60 }: {
  data: Array<{ label: string; value: number; color?: string }>;
  height?: number;
}) {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const barH = Math.max((d.value / maxVal) * height * 0.85, 2);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t transition-all progress-glow"
              style={{ height: barH, backgroundColor: d.color || '#dc2626', boxShadow: `0 0 6px ${d.color || '#dc2626'}30` }} />
            <span className="text-[7px] text-text-muted/40 truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══ SPARKLINE — tiny inline trend line ═══
export function Sparkline({ data, width = 80, height = 24, color = '#dc2626' }: {
  data: number[]; width?: number; height?: number; color?: string;
}) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
      <circle cx={parseFloat(points.split(' ').pop()!.split(',')[0])} cy={parseFloat(points.split(' ').pop()!.split(',')[1])} r="2" fill={color} />
    </svg>
  );
}

// ═══ SWOT QUADRANT — visual SWOT analysis ═══
export function SwotQuadrant({ strengths, weaknesses, opportunities, threats }: {
  strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[];
}) {
  return (
    <div className="grid grid-cols-2 gap-px bg-border/10 rounded-xl overflow-hidden">
      <QuadrantCell title="Strengths" items={strengths} color="text-accent-green" bg="bg-accent-green/[0.03]" icon="S" />
      <QuadrantCell title="Weaknesses" items={weaknesses} color="text-red-400" bg="bg-red-400/[0.03]" icon="W" />
      <QuadrantCell title="Opportunities" items={opportunities} color="text-accent-blue" bg="bg-accent-blue/[0.03]" icon="O" />
      <QuadrantCell title="Threats" items={threats} color="text-accent-gold" bg="bg-accent-gold/[0.03]" icon="T" />
    </div>
  );
}

function QuadrantCell({ title, items, color, bg, icon }: {
  title: string; items: string[]; color: string; bg: string; icon: string;
}) {
  return (
    <div className={`${bg} p-3 min-h-[80px]`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`text-[9px] font-bold ${color} w-4 h-4 rounded flex items-center justify-center bg-surface/50`}>{icon}</span>
        <span className={`text-[10px] font-semibold ${color}`}>{title}</span>
      </div>
      <div className="space-y-0.5">
        {items.slice(0, 3).map((item, i) => (
          <p key={i} className="text-[10px] text-text-muted/60 leading-snug">{item.length > 50 ? item.slice(0, 50) + '...' : item}</p>
        ))}
        {items.length === 0 && <p className="text-[9px] text-text-muted/20 italic">Not yet analyzed</p>}
      </div>
    </div>
  );
}

// ═══ PROGRESS RING — animated circular progress ═══
export function ProgressRing({ progress, size = 48, label }: { progress: number; size?: number; label?: string }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(progress / 100, 1));
  const color = progress >= 75 ? '#22c55e' : progress >= 40 ? '#d4a843' : '#dc2626';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(63,63,70,0.2)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 3px ${color}40)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-text metric-value">{Math.round(progress)}%</span>
        {label && <span className="text-[6px] text-text-muted/30">{label}</span>}
      </div>
    </div>
  );
}
