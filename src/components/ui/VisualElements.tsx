'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Lock,
  Unlock,
  AlertTriangle,
  ArrowUp,
  Minus,
  Flame,
  Zap,
  Target,
  Brain,
  Search,
  Shield,
  Map,
  FlaskConical,
  BookOpen,
  Scale,
  Clock,
  Cog,
  Gem,
  MessageSquare,
} from 'lucide-react';

/* ─── GlowCard ─────────────────────────────────────────────────── */

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'green' | 'amber' | 'red' | 'blue';
}

const glowColorMap: Record<string, string> = {
  primary: 'from-primary via-primary-light to-accent-blue',
  green: 'from-accent-green via-emerald-400 to-teal-400',
  amber: 'from-accent-amber via-yellow-400 to-orange-400',
  red: 'from-accent-red via-rose-400 to-pink-400',
  blue: 'from-accent-blue via-blue-400 to-cyan-400',
};

export function GlowCard({ children, className = '', color = 'primary' }: GlowCardProps) {
  const gradient = glowColorMap[color] || glowColorMap.primary;

  return (
    <div className={`relative group ${className}`}>
      {/* Glow border layer */}
      <div
        className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500`}
      />
      <div
        className={`absolute -inset-[1px] rounded-xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
      />
      {/* Content */}
      <div className="relative bg-surface-light border border-border rounded-xl overflow-hidden transition-all duration-300 group-hover:border-transparent">
        {children}
      </div>
    </div>
  );
}

/* ─── ProgressRing ─────────────────────────────────────────────── */

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#7c5cfc',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
}

/* ─── AnimatedCounter ──────────────────────────────────────────── */

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({
  target,
  duration = 1000,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ─── StatusBadge ──────────────────────────────────────────────── */

const statusColors: Record<string, { bg: string; dot: string; pulse: boolean }> = {
  green: { bg: 'bg-accent-green/15', dot: 'bg-accent-green', pulse: true },
  yellow: { bg: 'bg-yellow-500/15', dot: 'bg-yellow-500', pulse: false },
  orange: { bg: 'bg-accent-amber/15', dot: 'bg-accent-amber', pulse: false },
  red: { bg: 'bg-accent-red/15', dot: 'bg-accent-red', pulse: false },
};

export function StatusBadge({ status }: { status: 'green' | 'yellow' | 'orange' | 'red' }) {
  const s = statusColors[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${s.bg}`}>
      <span className="relative flex h-2 w-2">
        {s.pulse && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${s.dot} opacity-50 animate-ping`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${s.dot}`} />
      </span>
    </span>
  );
}

/* ─── PriorityBadge ────────────────────────────────────────────── */

const priorityConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  low: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    icon: <Minus className="w-3 h-3" />,
    label: 'Low',
  },
  medium: {
    bg: 'bg-accent-amber/15',
    text: 'text-accent-amber',
    icon: <ArrowUp className="w-3 h-3" />,
    label: 'Medium',
  },
  high: {
    bg: 'bg-accent-red/15',
    text: 'text-accent-red',
    icon: <Flame className="w-3 h-3" />,
    label: 'High',
  },
  critical: {
    bg: 'bg-red-600/20',
    text: 'text-red-400',
    icon: <AlertTriangle className="w-3 h-3" />,
    label: 'Critical',
  },
};

export function PriorityBadge({ priority }: { priority: 'low' | 'medium' | 'high' | 'critical' }) {
  const p = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${p.bg} ${p.text}`}>
      {p.icon}
      {p.label}
    </span>
  );
}

/* ─── ModuleBadge ──────────────────────────────────────────────── */

const moduleIconMap: Record<string, React.ReactNode> = {
  intake: <Target className="w-3 h-3" />,
  'value-diagnosis': <Gem className="w-3 h-3" />,
  'business-logic': <Cog className="w-3 h-3" />,
  'platform-power': <Shield className="w-3 h-3" />,
  'market-research': <Search className="w-3 h-3" />,
  psychology: <Brain className="w-3 h-3" />,
  ethics: <Scale className="w-3 h-3" />,
  'strategy-macro': <Map className="w-3 h-3" />,
  'strategy-meso': <Map className="w-3 h-3" />,
  'strategy-micro': <Map className="w-3 h-3" />,
  timing: <Clock className="w-3 h-3" />,
  innovation: <FlaskConical className="w-3 h-3" />,
  teaching: <BookOpen className="w-3 h-3" />,
  general: <MessageSquare className="w-3 h-3" />,
};

export function ModuleBadge({ module }: { module: string }) {
  const icon = moduleIconMap[module] || <Zap className="w-3 h-3" />;
  const displayName = module
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 text-primary-light text-[10px] font-medium">
      {icon}
      {displayName}
    </span>
  );
}

/* ─── GradientText ─────────────────────────────────────────────── */

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span
      className={`bg-gradient-to-r from-primary-light via-primary to-accent-blue bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
}

/* ─── AchievementBadge ─────────────────────────────────────────── */

interface AchievementBadgeProps {
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ReactNode;
}

export function AchievementBadge({ title, description, unlocked, icon }: AchievementBadgeProps) {
  return (
    <div
      className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${
        unlocked
          ? 'bg-primary/10 border-primary/30 glow-border'
          : 'bg-surface-light/50 border-border opacity-60'
      }`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
          unlocked
            ? 'bg-primary/20 text-primary-light'
            : 'bg-surface-lighter text-text-muted/40'
        }`}
      >
        {unlocked ? icon : <Lock className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${unlocked ? 'text-text' : 'text-text-muted/50'}`}>
            {title}
          </span>
          {unlocked && (
            <Unlock className="w-3 h-3 text-accent-green" />
          )}
        </div>
        <p className={`text-[10px] ${unlocked ? 'text-text-muted' : 'text-text-muted/30'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}
