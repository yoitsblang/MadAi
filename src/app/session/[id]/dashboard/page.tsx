'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, BookMarked, MessageSquare, ChevronDown, ChevronRight,
  AlertTriangle, Star, TrendingUp, Target, BarChart3,
  CheckCircle2, Circle, Zap, Clock, ArrowUpRight,
} from 'lucide-react';
import FloatingChat from '@/components/dashboard/FloatingChat';

interface DashboardData {
  session: { id: string; name: string };
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  stageFindings: Record<string, string[]>;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  risks: string[];
  strengths: string[];
}

const STAGE_LABELS: Record<string, string> = {
  'intake': 'Intake', 'value-diagnosis': 'Value', 'business-logic': 'Business',
  'platform-power': 'Platform', 'strategy-macro': 'Macro', 'strategy-meso': 'Meso', 'strategy-micro': 'Micro',
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('actions');
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); }).catch(() => router.push('/'));
  }, [id, router]);

  const toggleAction = useCallback((idx: number) => {
    setCompletedActions(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }, []);

  if (loading || !data) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted text-sm"><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Loading...</div>
    </div>
  );

  const { metrics, pipeline, actionItems, risks, strengths, stageFindings } = data;
  const has = (v: string) => v && v.length > 0;

  // Parse scores capped at 10
  const parseScore = (v: string) => { const n = parseInt(v) || 0; return n > 10 ? Math.min(Math.round(n / 10), 10) : Math.min(n, 10); };
  const scores = [
    { label: 'Value', value: parseScore(metrics.valueClarityScore), color: '#22c55e' },
    { label: 'Health', value: parseScore(metrics.businessHealthScore), color: '#dc2626' },
    { label: 'Sovereignty', value: parseScore(metrics.sovereigntyScore), color: '#d4a843' },
    { label: 'Moat', value: parseScore(metrics.moatScore), color: '#3b82f6' },
  ];
  const avgHealth = scores.filter(s => s.value > 0).reduce((a, s) => a + s.value, 0) / (scores.filter(s => s.value > 0).length || 1);

  // Categorize actions by stage area
  const actionsByCategory: Record<string, typeof actionItems> = {};
  for (const item of actionItems) {
    const cat = ['intake', 'value-diagnosis'].includes(item.stage) ? 'Foundation' :
      ['business-logic', 'platform-power'].includes(item.stage) ? 'Operations' :
      ['strategy-macro', 'strategy-meso', 'strategy-micro'].includes(item.stage) ? 'Strategy' : 'General';
    if (!actionsByCategory[cat]) actionsByCategory[cat] = [];
    actionsByCategory[cat].push(item);
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="min-h-screen bg-surface bg-grid">
      {/* Compact header */}
      <header className="border-b border-border/50 glass-strong sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-3 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text"><ArrowLeft className="w-4 h-4" /></button>
            <img src="/logo-64.png" alt="" className="w-6 h-6 rounded-md" />
            <span className="text-xs font-semibold text-text truncate max-w-[200px]">{metrics.businessName || 'Dashboard'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <a href={`/session/${id}`} className="text-[10px] text-text-muted hover:text-text px-2 py-1 rounded-md hover:bg-surface-light transition-colors">Chat</a>
            <a href={`/brief/${id}`} className="text-[10px] text-primary hover:text-primary-light px-2 py-1 rounded-md hover:bg-primary/5 transition-colors">Brief</a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 py-4 space-y-3">
        {/* Hero: Greeting + Scores inline */}
        <div className="glass rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent-gold to-primary opacity-60" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-muted/50">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              <h2 className="text-sm font-semibold text-text mt-0.5">{greeting}. Here's your focus.</h2>
              {actionItems[0] && (
                <p className="text-xs text-text-muted mt-1.5 leading-relaxed line-clamp-2">
                  Top priority: <span className="text-primary font-medium">{actionItems[0].text.slice(0, 80)}{actionItems[0].text.length > 80 ? '...' : ''}</span>
                </p>
              )}
              {has(metrics.primaryBottleneck) && (
                <p className="text-[10px] text-red-400/70 mt-1">Bottleneck: {metrics.primaryBottleneck}</p>
              )}
            </div>
            {/* Mini score ring */}
            <div className="flex-shrink-0 text-center">
              <div className={`text-xl font-bold ${avgHealth >= 7 ? 'text-accent-green' : avgHealth >= 4 ? 'text-accent-gold' : avgHealth > 0 ? 'text-primary' : 'text-text-muted/20'}`}>
                {avgHealth > 0 ? avgHealth.toFixed(1) : '--'}
              </div>
              <p className="text-[9px] text-text-muted/40">health</p>
            </div>
          </div>

          {/* Inline score pills */}
          <div className="flex gap-2 mt-3">
            {scores.map(s => (
              <div key={s.label} className="flex items-center gap-1.5 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.value > 0 ? s.color : '#3f3f46' }} />
                <span className="text-text-muted/60">{s.label}</span>
                <span className={`font-semibold ${s.value > 0 ? 'text-text' : 'text-text-muted/20'}`}>{s.value > 0 ? s.value : '--'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline - compact */}
        <div className="flex items-center gap-1.5 px-1">
          {pipeline.stages.map(stage => {
            const done = pipeline.completed.includes(stage);
            return <div key={stage} className={`flex-1 h-1 rounded-full ${done ? 'bg-primary' : 'bg-surface-light'}`} title={STAGE_LABELS[stage]} />;
          })}
          <span className="text-[9px] text-text-muted/40 ml-1">{pipeline.percentage}%</span>
        </div>

        {/* Action Items — Categorized */}
        <Section title="What to do now" count={actionItems.length} icon={<Zap className="w-3.5 h-3.5 text-primary" />} defaultOpen expanded={expandedSection === 'actions'} onToggle={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}>
          {Object.entries(actionsByCategory).map(([category, items]) => (
            <div key={category} className="mb-3 last:mb-0">
              <p className="text-[10px] font-medium text-accent-gold/70 mb-1.5 px-1">{category}</p>
              {items.map((item, i) => {
                const globalIdx = actionItems.indexOf(item);
                const done = completedActions.has(globalIdx);
                return (
                  <div key={i} onClick={() => toggleAction(globalIdx)}
                    className={`flex items-start gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-all hover:bg-white/[0.02] ${done ? 'opacity-40' : ''}`}>
                    {done ? <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-border flex-shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${done ? 'line-through text-text-muted/40' : 'text-text/90'}`}>{item.text}</p>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded flex-shrink-0 ${
                      item.priority === 'high' ? 'bg-primary/15 text-primary' : 'bg-accent-gold/10 text-accent-gold/70'
                    }`}>{item.priority === 'high' ? 'now' : 'soon'}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </Section>

        {/* Business snapshot — compact grid */}
        <Section title="Your business" icon={<Target className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'snapshot'} onToggle={() => setExpandedSection(expandedSection === 'snapshot' ? null : 'snapshot')}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-1">
            <Metric label="Offering" value={metrics.offering} />
            <Metric label="Audience" value={metrics.targetAudience} />
            <Metric label="Revenue" value={metrics.revenueMonthly} />
            <Metric label="Price" value={metrics.pricePoint} />
            <Metric label="Channels" value={metrics.activeChannels} />
            <Metric label="Value prop" value={metrics.coreValueProp} />
          </div>
        </Section>

        {/* Strengths & Risks side by side */}
        {(strengths.length > 0 || risks.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {strengths.length > 0 && (
              <Section title="Strengths" icon={<Star className="w-3.5 h-3.5 text-accent-green" />} expanded={expandedSection === 'strengths'} onToggle={() => setExpandedSection(expandedSection === 'strengths' ? null : 'strengths')}>
                {strengths.slice(0, 4).map((s, i) => <p key={i} className="text-[11px] text-text-muted/80 leading-relaxed px-1 py-0.5">+ {s}</p>)}
              </Section>
            )}
            {risks.length > 0 && (
              <Section title="Risks" icon={<AlertTriangle className="w-3.5 h-3.5 text-red-400" />} expanded={expandedSection === 'risks'} onToggle={() => setExpandedSection(expandedSection === 'risks' ? null : 'risks')}>
                {risks.slice(0, 4).map((r, i) => <p key={i} className="text-[11px] text-text-muted/80 leading-relaxed px-1 py-0.5">- {r}</p>)}
              </Section>
            )}
          </div>
        )}

        {/* Stage findings — compact accordion */}
        {Object.keys(stageFindings).length > 0 && (
          <Section title="Analysis details" icon={<BarChart3 className="w-3.5 h-3.5 text-text-muted/50" />} expanded={expandedSection === 'stages'} onToggle={() => setExpandedSection(expandedSection === 'stages' ? null : 'stages')}>
            {Object.entries(stageFindings).map(([stage, findings]) => findings.length > 0 && (
              <details key={stage} className="group">
                <summary className="flex items-center justify-between px-1 py-1.5 text-xs text-text-muted cursor-pointer hover:text-text transition-colors list-none">
                  <span>{STAGE_LABELS[stage]}</span>
                  <span className="text-[9px] text-text-muted/30">{findings.length}</span>
                </summary>
                <div className="pl-3 pb-2 space-y-1">
                  {findings.map((f, i) => <p key={i} className="text-[11px] text-text-muted/60 leading-relaxed border-l border-primary/10 pl-2">{f}</p>)}
                </div>
              </details>
            ))}
          </Section>
        )}

        {/* Goals */}
        {(has(metrics.goal30d) || has(metrics.goal6m) || has(metrics.goal1y)) && (
          <Section title="Goals" icon={<TrendingUp className="w-3.5 h-3.5 text-accent-gold" />} expanded={expandedSection === 'goals'} onToggle={() => setExpandedSection(expandedSection === 'goals' ? null : 'goals')}>
            <div className="space-y-2 px-1">
              {has(metrics.goal30d) && <Goal label="30d" value={metrics.goal30d} color="text-accent-green" />}
              {has(metrics.goal6m) && <Goal label="6m" value={metrics.goal6m} color="text-accent-blue" />}
              {has(metrics.goal1y) && <Goal label="1y" value={metrics.goal1y} color="text-primary-light" />}
            </div>
          </Section>
        )}

        {/* Quick nav */}
        <div className="flex gap-2 pb-20">
          <NavPill href={`/session/${id}`} label="Chat" />
          <NavPill href={`/brief/${id}`} label="Brief" />
          <NavPill href="/memories" label="Memory" />
          <NavPill href="/" label="Home" />
        </div>
      </main>

      <FloatingChat sessionId={id} businessName={metrics.businessName || ''} />
    </div>
  );
}

// Collapsible section with clean toggle
function Section({ title, icon, children, expanded, onToggle, count, defaultOpen }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode;
  expanded?: boolean; onToggle?: () => void; count?: number; defaultOpen?: boolean;
}) {
  const isOpen = defaultOpen ? expanded !== false : expanded;
  return (
    <div className="glass rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.02] transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-text">{title}</span>
          {count !== undefined && <span className="text-[9px] text-text-muted/30">{count}</span>}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="px-3 pb-3 animate-slide-up">{children}</div>}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const v = value && value.length > 0;
  return (
    <div className="py-0.5">
      <p className="text-[9px] text-text-muted/40">{label}</p>
      <p className={`text-[11px] leading-snug ${v ? 'text-text/80' : 'text-text-muted/15'}`}>
        {v ? (value.length > 60 ? value.slice(0, 60) + '...' : value) : '—'}
      </p>
    </div>
  );
}

function Goal({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex gap-2">
      <span className={`text-[10px] font-semibold ${color} w-6 flex-shrink-0`}>{label}</span>
      <p className="text-[11px] text-text-muted/70 leading-relaxed">{value.length > 100 ? value.slice(0, 100) + '...' : value}</p>
    </div>
  );
}

function NavPill({ href, label }: { href: string; label: string }) {
  return <a href={href} className="flex-1 text-center text-[10px] text-text-muted/50 hover:text-text py-2 rounded-lg hover:bg-surface-light transition-colors">{label}</a>;
}
