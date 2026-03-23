'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardList, Plus, Check, Clock, ChevronRight, Trash2, Play, Pause, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface PlanItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  frequency?: string;
  category?: string;
  notes?: string;
  completedAt?: string;
}

interface Plan {
  id: string;
  title: string;
  description?: string;
  status: string;
  horizon: string;
  createdAt: string;
  updatedAt: string;
  sessionId?: string;
  items: PlanItem[];
}

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    try {
      const res = await fetch('/api/plans');
      if (res.ok) setPlans(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function toggleItem(planId: string, itemId: string, currentStatus: string) {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await fetch(`/api/plans/${planId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, itemUpdate: { status: newStatus } }),
    });
    loadPlans();
  }

  async function updatePlanStatus(planId: string, status: string) {
    await fetch(`/api/plans/${planId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadPlans();
  }

  async function deletePlan(planId: string) {
    if (!confirm('Delete this action plan?')) return;
    await fetch(`/api/plans/${planId}`, { method: 'DELETE' });
    setSelectedPlan(null);
    loadPlans();
  }

  function getProgress(plan: Plan) {
    if (plan.items.length === 0) return 0;
    const completed = plan.items.filter(i => i.status === 'completed').length;
    return Math.round((completed / plan.items.length) * 100);
  }

  const statusColors: Record<string, string> = {
    draft: 'text-text-muted',
    active: 'text-accent-blue',
    completed: 'text-accent-green',
    archived: 'text-text-muted/50',
  };

  const priorityColors: Record<string, string> = {
    low: 'text-text-muted',
    medium: 'text-accent-blue',
    high: 'text-accent-amber',
    critical: 'text-accent-red',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-muted">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-text-muted hover:text-text transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </a>
            <ClipboardList className="w-5 h-5 text-primary-light" />
            <div>
              <h1 className="text-lg font-bold text-text">Action Plans</h1>
              <p className="text-xs text-text-muted">Track your strategy execution</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/new')}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {plans.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-text mb-2">No action plans yet</h2>
            <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
              Start a business analysis session and MadAi will generate an action plan you can track here.
              Plans include step-by-step tasks, timelines, and metrics.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg px-6 py-2.5 transition-colors"
            >
              Start a Strategy Session
            </button>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Plans list */}
            <div className="w-80 flex-shrink-0 space-y-2">
              {plans.map(plan => {
                const progress = getProgress(plan);
                const isSelected = selectedPlan?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-primary/10 border-primary/30'
                        : 'bg-surface-light border-border hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-text truncate">{plan.title}</h3>
                      <span className={`text-[10px] font-medium ${statusColors[plan.status]}`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate mb-2">{plan.description || plan.horizon}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-text-muted">{progress}%</span>
                    </div>
                    <div className="text-[10px] text-text-muted/50 mt-1.5">
                      {plan.items.filter(i => i.status === 'completed').length}/{plan.items.length} tasks
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Plan detail */}
            <div className="flex-1">
              {selectedPlan ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-text">{selectedPlan.title}</h2>
                      {selectedPlan.description && (
                        <p className="text-sm text-text-muted mt-1">{selectedPlan.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {selectedPlan.horizon}
                        </span>
                        <span className={`text-xs font-medium ${statusColors[selectedPlan.status]}`}>
                          {selectedPlan.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedPlan.status === 'active' && (
                        <button
                          onClick={() => updatePlanStatus(selectedPlan.id, 'completed')}
                          className="text-xs text-accent-green hover:text-accent-green/80 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-accent-green/30"
                        >
                          <Check className="w-3 h-3" /> Complete
                        </button>
                      )}
                      {selectedPlan.status === 'draft' && (
                        <button
                          onClick={() => updatePlanStatus(selectedPlan.id, 'active')}
                          className="text-xs text-primary flex items-center gap-1 px-3 py-1.5 rounded-lg border border-primary/30"
                        >
                          <Play className="w-3 h-3" /> Activate
                        </button>
                      )}
                      {selectedPlan.sessionId && (
                        <button
                          onClick={() => router.push(`/session/${selectedPlan.sessionId}`)}
                          className="text-xs text-text-muted hover:text-text px-3 py-1.5 rounded-lg border border-border"
                        >
                          Open Chat
                        </button>
                      )}
                      <button
                        onClick={() => deletePlan(selectedPlan.id)}
                        className="text-text-muted/40 hover:text-accent-red p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6 p-4 bg-surface-light border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-text">Progress</span>
                      <span className="text-sm font-bold text-primary-light">{getProgress(selectedPlan)}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent-green rounded-full transition-all"
                        style={{ width: `${getProgress(selectedPlan)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                      <span>{selectedPlan.items.filter(i => i.status === 'completed').length} completed</span>
                      <span>{selectedPlan.items.filter(i => i.status === 'in_progress').length} in progress</span>
                      <span>{selectedPlan.items.filter(i => i.status === 'pending').length} pending</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {selectedPlan.items.map(item => (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          item.status === 'completed'
                            ? 'bg-accent-green/5 border-accent-green/20'
                            : 'bg-surface-light border-border'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(selectedPlan.id, item.id, item.status)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-accent-green" />
                          ) : item.status === 'in_progress' ? (
                            <AlertCircle className="w-5 h-5 text-accent-amber" />
                          ) : (
                            <Circle className="w-5 h-5 text-text-muted/30" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${
                            item.status === 'completed' ? 'text-text-muted line-through' : 'text-text'
                          }`}>
                            {item.title}
                          </div>
                          {item.description && (
                            <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-medium ${priorityColors[item.priority]}`}>
                              {item.priority}
                            </span>
                            {item.frequency && (
                              <span className="text-[10px] text-text-muted">{item.frequency}</span>
                            )}
                            {item.category && (
                              <span className="text-[10px] text-text-muted bg-surface px-1.5 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                            {item.dueDate && (
                              <span className="text-[10px] text-text-muted flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 text-text-muted">
                  <ChevronRight className="w-8 h-8 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select a plan to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
