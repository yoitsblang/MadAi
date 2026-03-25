'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Brain, Target, Gem, Cog, Shield, BarChart3, TrendingUp,
  CheckCircle2, Clock, ArrowRight, ChevronRight, Calendar,
  Zap, BookMarked, ClipboardList, MessageSquare, ArrowLeft,
} from 'lucide-react';

interface DashboardData {
  session: { id: string; name: string; activeModule: string; intakeComplete: boolean; createdAt: string; updatedAt: string };
  profile: Record<string, unknown>;
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  plans: Array<{ id: string; title: string; status: string; items: Array<{ id: string; title: string; status: string; priority: string; category: string; description: string }> }>;
  planStats: { totalItems: number; completedItems: number; inProgressItems: number } | null;
  calendarEvents: Array<{ id: string; title: string; date: string; type: string; status: string }>;
  memories: Array<{ key: string; value: string; category: string }>;
}

const STAGE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  'intake': { label: 'Intake', icon: <Target className="w-3.5 h-3.5" /> },
  'value-diagnosis': { label: 'Value Dx', icon: <Gem className="w-3.5 h-3.5" /> },
  'business-logic': { label: 'Business', icon: <Cog className="w-3.5 h-3.5" /> },
  'platform-power': { label: 'Platform', icon: <Shield className="w-3.5 h-3.5" /> },
  'strategy-macro': { label: 'Macro', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  'strategy-meso': { label: 'Meso', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  'strategy-micro': { label: 'Micro', icon: <Zap className="w-3.5 h-3.5" /> },
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${id}/dashboard`);
        if (!res.ok) { router.push('/'); return; }
        setData(await res.json());
      } catch { router.push('/'); }
      setLoading(false);
    }
    load();
  }, [id, router]);

  const togglePlanItem = useCallback(async (planId: string, itemId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await fetch(`/api/plans/${planId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, itemUpdate: { status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : null } }),
    });
    // Refresh
    const res = await fetch(`/api/sessions/${id}/dashboard`);
    if (res.ok) setData(await res.json());
  }, [id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex items-center gap-3 text-text-muted">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const { metrics, pipeline, plans, planStats } = data;
  const plan = plans[0]; // Primary plan

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm font-bold text-text">{metrics.businessName}</h1>
              <p className="text-xs text-text-muted">{metrics.businessType} {metrics.offering ? `— ${metrics.offering.substring(0, 50)}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/session/${id}`} className="text-xs bg-surface-light border border-border rounded-lg px-3 py-1.5 text-text-muted hover:text-text transition-colors flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" /> Chat
            </a>
            <a href={`/brief/${id}`} className="text-xs bg-primary/10 text-primary-light border border-primary/20 rounded-lg px-3 py-1.5 hover:bg-primary/20 transition-colors flex items-center gap-1.5">
              <BookMarked className="w-3.5 h-3.5" /> Brief
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Pipeline Progress */}
        <div className="bg-surface-light border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">Strategy Pipeline</h2>
            <span className="text-xs text-text-muted">{pipeline.percentage}% complete</span>
          </div>
          <div className="flex gap-2">
            {pipeline.stages.map(stage => {
              const done = pipeline.completed.includes(stage);
              const info = STAGE_LABELS[stage];
              return (
                <a key={stage} href={`/session/${id}`}
                  className={`flex-1 rounded-lg p-2.5 text-center transition-all border ${
                    done ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' : 'bg-surface border-border/50 text-text-muted/40'
                  }`}>
                  <div className="flex items-center justify-center mb-1">
                    {done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-medium">{info?.label || stage}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Value Clarity" value={metrics.valueClarityScore} icon={<Gem className="w-4 h-4 text-primary-light" />} />
          <MetricCard label="Business Health" value={metrics.businessHealthScore} icon={<Cog className="w-4 h-4 text-accent-blue" />} />
          <MetricCard label="Sovereignty" value={metrics.sovereigntyScore} icon={<Shield className="w-4 h-4 text-accent-amber" />} />
          <MetricCard label="Competitive Moat" value={metrics.moatScore} icon={<BarChart3 className="w-4 h-4 text-accent-green" />} />
        </div>

        {/* Business Snapshot + Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Snapshot */}
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">Business Snapshot</h3>
            <div className="space-y-2.5">
              <SnapshotRow label="Revenue" value={metrics.revenueMonthly || 'Not tracked'} />
              <SnapshotRow label="AOV" value={metrics.avgOrderValue || 'Not tracked'} />
              <SnapshotRow label="Price Point" value={metrics.pricePoint || 'Not set'} />
              <SnapshotRow label="Channels" value={metrics.activeChannels || 'None tracked'} />
              <SnapshotRow label="Audience" value={metrics.targetAudience || 'Not defined'} />
              <SnapshotRow label="Value Prop" value={metrics.coreValueProp || 'Not defined'} />
              {metrics.primaryBottleneck && (
                <div className="mt-2 p-2 rounded-lg bg-accent-red/5 border border-accent-red/20">
                  <span className="text-[10px] font-bold text-accent-red uppercase tracking-wider">Bottleneck</span>
                  <p className="text-xs text-text-muted mt-0.5">{metrics.primaryBottleneck}</p>
                </div>
              )}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3">Goals & Milestones</h3>
            <div className="space-y-3">
              <GoalCard timeframe="30 Days" goal={metrics.goal30d} color="text-accent-green" />
              <GoalCard timeframe="6 Months" goal={metrics.goal6m} color="text-accent-blue" />
              <GoalCard timeframe="1 Year" goal={metrics.goal1y} color="text-primary-light" />
            </div>
          </div>
        </div>

        {/* Action Plan */}
        {plan && (
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary-light" />
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">{plan.title}</h3>
              </div>
              {planStats && (
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span>{planStats.completedItems}/{planStats.totalItems} done</span>
                  <div className="w-24 h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-accent-green rounded-full transition-all" style={{ width: `${planStats.totalItems > 0 ? (planStats.completedItems / planStats.totalItems) * 100 : 0}%` }} />
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              {plan.items.slice(0, 10).map(item => (
                <div key={item.id} className="flex items-start gap-2.5 py-1.5">
                  <button
                    onClick={() => togglePlanItem(plan.id, item.id, item.status)}
                    className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                      item.status === 'completed'
                        ? 'bg-accent-green border-accent-green text-white'
                        : 'border-border hover:border-primary/50'
                    }`}>
                    {item.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${item.status === 'completed' ? 'text-text-muted line-through' : 'text-text'}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-[10px] text-text-muted/70 mt-0.5 line-clamp-1">{item.description}</p>
                    )}
                  </div>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
                    item.priority === 'high' ? 'bg-accent-red/10 text-accent-red' :
                    item.priority === 'medium' ? 'bg-accent-amber/10 text-accent-amber' :
                    'bg-surface text-text-muted'
                  }`}>{item.priority}</span>
                </div>
              ))}
              {plan.items.length > 10 && (
                <a href="/plans" className="text-xs text-primary-light hover:underline flex items-center gap-1 pt-1">
                  View all {plan.items.length} items <ChevronRight className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Calendar Events */}
        {data.calendarEvents.length > 0 && (
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary-light" />
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">Upcoming Events</h3>
            </div>
            <div className="space-y-2">
              {data.calendarEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-3 text-xs">
                  <span className="text-text-muted w-20 flex-shrink-0">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <span className="text-text">{event.title}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                    event.type === 'launch' ? 'bg-accent-green/10 text-accent-green' :
                    event.type === 'campaign' ? 'bg-primary/10 text-primary-light' :
                    'bg-surface text-text-muted'
                  }`}>{event.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction href={`/session/${id}`} icon={<MessageSquare className="w-5 h-5" />} label="Continue Chat" desc="Ask follow-up questions" />
          <QuickAction href={`/brief/${id}`} icon={<BookMarked className="w-5 h-5" />} label="Master Brief" desc="Full strategy document" />
          <QuickAction href="/plans" icon={<ClipboardList className="w-5 h-5" />} label="Action Plans" desc="Track your progress" />
          <QuickAction href="/calendar" icon={<Calendar className="w-5 h-5" />} label="Calendar" desc="Schedule & milestones" />
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-surface-light border border-border rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-text">{value || 'N/A'}</p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] text-text-muted/60 uppercase tracking-wider w-20 flex-shrink-0 mt-0.5">{label}</span>
      <span className="text-xs text-text leading-snug">{value.length > 100 ? value.substring(0, 100) + '...' : value}</span>
    </div>
  );
}

function GoalCard({ timeframe, goal, color }: { timeframe: string; goal: string; color: string }) {
  return (
    <div className="p-2.5 rounded-lg bg-surface border border-border/50">
      <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{timeframe}</span>
      <p className="text-xs text-text-muted mt-1 leading-snug">
        {goal ? (goal.length > 150 ? goal.substring(0, 150) + '...' : goal) : 'Not yet defined'}
      </p>
    </div>
  );
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: React.ReactNode; label: string; desc: string }) {
  return (
    <a href={href} className="bg-surface-light border border-border rounded-xl p-3 hover:border-primary/30 transition-colors group">
      <div className="text-text-muted group-hover:text-primary-light transition-colors mb-2">{icon}</div>
      <h4 className="text-xs font-bold text-text">{label}</h4>
      <p className="text-[10px] text-text-muted">{desc}</p>
    </a>
  );
}
