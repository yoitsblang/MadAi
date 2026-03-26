'use client';

import React, { useState, useMemo } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface FinanceEntry {
  id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}

interface FinanceTrackerProps {
  entries: FinanceEntry[];
  onAdd: (entry: { type: string; category: string; amount: number; date: string; description?: string }) => void;
}

const CATEGORIES = ['Sales', 'Services', 'Subscriptions', 'Ads', 'Software', 'Payroll', 'Marketing', 'Operations', 'Other'];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

export default function FinanceTracker({ entries, onAdd }: FinanceTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('revenue');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDescription, setFormDescription] = useState('');

  const totals = useMemo(() => {
    const revenue = entries.filter(e => e.type === 'revenue').reduce((sum, e) => sum + e.amount, 0);
    const expenses = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    return { revenue, expenses, net: revenue - expenses };
  }, [entries]);

  const chartData = useMemo(() => {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const weeks: Record<string, { week: string; revenue: number; expenses: number }> = {};

    entries
      .filter(e => new Date(e.date) >= ninetyDaysAgo)
      .forEach(e => {
        const d = new Date(e.date);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const key = weekStart.toISOString().split('T')[0];
        if (!weeks[key]) weeks[key] = { week: key, revenue: 0, expenses: 0 };
        if (e.type === 'revenue') weeks[key].revenue += e.amount;
        else weeks[key].expenses += e.amount;
      });

    return Object.values(weeks).sort((a, b) => a.week.localeCompare(b.week));
  }, [entries]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0) return;
    onAdd({ type: formType, category: formCategory, amount, date: formDate, description: formDescription || undefined });
    setFormAmount('');
    setFormDescription('');
    setShowForm(false);
  }

  const inputClass = 'w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors';

  return (
    <div className="glass p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-text uppercase tracking-wider">Finance</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-text-muted hover:text-primary-light transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {entries.length === 0 && !showForm ? (
        <div className="text-center py-8">
          <DollarSign className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted mb-3">Start tracking your finances</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-primary-light hover:text-primary-light/80 transition-colors"
          >
            Add first entry
          </button>
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-accent-green" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Revenue</span>
              </div>
              <span className="text-sm font-bold text-accent-green">{formatCurrency(totals.revenue)}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="w-3 h-3 text-accent-red" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Expenses</span>
              </div>
              <span className="text-sm font-bold text-accent-red">{formatCurrency(totals.expenses)}</span>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <DollarSign className="w-3 h-3 text-text" />
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Net</span>
              </div>
              <span className={`text-sm font-bold ${totals.net >= 0 ? 'text-white' : 'text-accent-red'}`}>
                {formatCurrency(totals.net)}
              </span>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="h-40 mb-4 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    tickFormatter={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#1a1d2e', border: '1px solid #2e3348', borderRadius: '0.5rem', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                    labelFormatter={(v) => `Week of ${new Date(v).toLocaleDateString()}`}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#fillRevenue)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#fillExpenses)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-border/50">
          <div className="grid grid-cols-2 gap-3">
            <select value={formType} onChange={e => setFormType(e.target.value)} className={inputClass}>
              <option value="revenue">Revenue</option>
              <option value="expense">Expense</option>
            </select>
            <input
              type="number"
              value={formAmount}
              onChange={e => setFormAmount(e.target.value)}
              placeholder="Amount"
              min="0"
              step="0.01"
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={formDate}
              onChange={e => setFormDate(e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            value={formDescription}
            onChange={e => setFormDescription(e.target.value)}
            placeholder="Description (optional)"
            className={inputClass}
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-xs text-text-muted hover:text-text px-3 py-1.5 transition-colors">
              Cancel
            </button>
            <button type="submit" className="text-xs bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-1.5 font-medium transition-colors">
              Add
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
