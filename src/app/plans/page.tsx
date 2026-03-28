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
    draft: 'text-zinc-600',
    active: 'text-blue-400',
    completed: 'text-green-500',
    archived: 'text-zinc-700',
  };

  const priorityColors: Record<string, string> = {
    low: 'text-zinc-600',
    medium: 'text-blue-400',
    high: 'text-amber-500',
    critical: 'text-red-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="text-zinc-600">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-600 hover:text-white transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </a>
            <ClipboardList className="w-5 h-5 text-red-400" />
            <div>
              <h1 className="text-lg font-bold text-white">Action Plans</h1>
              <p className="text-xs text-zinc-600">Track your strategy execution</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/new')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {plans.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-white mb-2">No action plans yet</h2>
            <p className="text-sm text-zinc-600 mb-6 max-w-md mx-auto">
              Start a business analysis session and MadAi will generate an action plan you can track here.
              Plans include step-by-step tasks, timelines, and metrics.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg px-6 py-2.5 transition-colors border border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)]"
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
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-[#0a0a0f] border-red-900/15 hover:border-red-500/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-semibold text-white truncate">{plan.title}</h3>
                      <span className={`text-[10px] font-medium ${statusColors[plan.status]}`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 truncate mb-2">{plan.description || plan.horizon}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all shadow-[0_0_6px_rgba(220,38,38,0.4)]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600">{progress}%</span>
                    </div>
                    <div className="text-[10px] text-zinc-700 mt-1.5">
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
                      <h2 className="text-xl font-bold text-white">{selectedPlan.title}</h2>
                      {selectedPlan.description && (
                        <p className="text-sm text-zinc-500 mt-1">{selectedPlan.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-zinc-600 flex items-center gap-1">
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
                          className="text-xs text-green-500 hover:text-green-400 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-green-500/30"
                        >
                          <Check className="w-3 h-3" /> Complete
                        </button>
                      )}
                      {selectedPlan.status === 'draft' && (
                        <button
                          onClick={() => updatePlanStatus(selectedPlan.id, 'active')}
                          className="text-xs text-red-400 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30"
                        >
                          <Play className="w-3 h-3" /> Activate
                        </button>
                      )}
                      {selectedPlan.sessionId && (
                        <button
                          onClick={() => router.push(`/session/${selectedPlan.sessionId}`)}
                          className="text-xs text-zinc-600 hover:text-white px-3 py-1.5 rounded-lg border border-red-900/20"
                        >
                          Open Chat
                        </button>
                      )}
                      <button
                        onClick={() => deletePlan(selectedPlan.id)}
                        className="text-zinc-700 hover:text-red-400 p-1.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-6 p-4 bg-[#0a0a0f] border border-red-900/15 rounded-xl relative overflow-hidden">
                    <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-white">Progress</span>
                      <span className="text-sm font-bold font-mono text-red-400">{getProgress(selectedPlan)}%</span>
                    </div>
                    <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-green-500 rounded-full transition-all"
                        style={{ width: `${getProgress(selectedPlan)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
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
                            ? 'bg-green-500/5 border-green-500/15'
                            : 'bg-[#0a0a0f] border-red-900/15'
                        }`}
                      >
                        <button
                          onClick={() => toggleItem(selectedPlan.id, item.id, item.status)}
                          className="mt-0.5 flex-shrink-0"
                        >
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : item.status === 'in_progress' ? (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-700" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${
                            item.status === 'completed' ? 'text-zinc-600 line-through' : 'text-white'
                          }`}>
                            {item.title}
                          </div>
                          {item.description && (
                            <p className="text-xs text-zinc-600 mt-0.5">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-medium ${priorityColors[item.priority]}`}>
                              {item.priority}
                            </span>
                            {item.frequency && (
                              <span className="text-[10px] text-zinc-700">{item.frequency}</span>
                            )}
                            {item.category && (
                              <span className="text-[10px] text-zinc-600 bg-[#050507] px-1.5 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                            {item.dueDate && (
                              <span className="text-[10px] text-zinc-700 flex items-center gap-0.5">
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
                <div className="text-center py-20 text-zinc-700">
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
