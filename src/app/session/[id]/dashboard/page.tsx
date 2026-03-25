'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Brain, Target, BarChart3, TrendingUp,
  CheckCircle2, ChevronDown,
  Zap, BookMarked, ClipboardList, MessageSquare, ArrowLeft,
  AlertTriangle, Star, X, Send,
} from 'lucide-react';

interface DashboardData {
  session: { id: string; name: string; activeModule: string; intakeComplete: boolean };
  metrics: Record<string, string>;
  pipeline: { stages: string[]; completed: string[]; total: number; percentage: number };
  stageFindings: Record<string, string[]>;
  actionItems: Array<{ text: string; priority: string; stage: string }>;
  risks: string[];
  strengths: string[];
  plans: Array<{ id: string; title: string; items: Array<{ id: string; title: string; status: string; priority: string; description: string }> }>;
  planStats: { totalItems: number; completedItems: number; inProgressItems: number } | null;
}

const STAGE_LABELS: Record<string, string> = {
  'intake': 'Intake', 'value-diagnosis': 'Value Dx', 'business-logic': 'Business',
  'platform-power': 'Platform', 'strategy-macro': 'Macro', 'strategy-meso': 'Meso', 'strategy-micro': 'Micro',
};

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sessions/${id}/dashboard`).then(r => r.ok ? r.json() : null).then(d => { setData(d); setLoading(false); }).catch(() => { router.push('/'); });
  }, [id, router]);

  const sendChat = useCallback(async () => {
    if (!chatMsg.trim() || chatLoading) return;
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, { role: 'user', content: msg }], module: 'general', sessionId: id, businessContext: `Dashboard consultation for: ${data?.metrics.businessName}`, ethicalStance: 'balanced' }),
      });
      const result = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: result.response || result.error || 'Error' }]);
    } catch { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Try again.' }]); }
    setChatLoading(false);
  }, [chatMsg, chatLoading, chatMessages, id, data]);

  if (loading || !data) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex items-center gap-3 text-text-muted"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> Loading dashboard...</div>
    </div>
  );

  const { metrics, pipeline, actionItems, risks, strengths, stageFindings } = data;
  const has = (v: string) => v && v.length > 0;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="border-b border-border bg-surface/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-bold text-text">{metrics.businessName || 'Strategy Dashboard'}</h1>
              {has(metrics.businessType) && <p className="text-xs text-text-muted">{metrics.businessType}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`/session/${id}`} className="text-xs bg-surface-light border border-border rounded-lg px-3 py-1.5 text-text-muted hover:text-text transition-colors flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Chat</a>
            <a href={`/brief/${id}`} className="text-xs bg-primary/10 text-primary-light border border-primary/20 rounded-lg px-3 py-1.5 hover:bg-primary/20 transition-colors flex items-center gap-1.5"><BookMarked className="w-3.5 h-3.5" /> Brief</a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-5">
        {/* Pipeline Progress */}
        <div className="bg-surface-light border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-text uppercase tracking-wider">Strategy Pipeline</h2>
            <span className="text-sm font-bold text-primary-light">{pipeline.percentage}%</span>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-accent-green to-primary rounded-full transition-all" style={{ width: `${pipeline.percentage}%` }} />
          </div>
          <div className="flex gap-2">
            {pipeline.stages.map(stage => {
              const done = pipeline.completed.includes(stage);
              return (
                <div key={stage} className={`flex-1 text-center rounded-lg py-1.5 text-[10px] font-medium ${done ? 'bg-accent-green/10 text-accent-green' : 'bg-surface text-text-muted/30'}`}>
                  {done && <CheckCircle2 className="w-3 h-3 mx-auto mb-0.5" />}
                  {STAGE_LABELS[stage]}
                </div>
              );
            })}
          </div>
        </div>

        {/* Snapshot + Scores */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary-light" /> Business Snapshot</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <Field label="Offering" value={metrics.offering} />
              <Field label="Audience" value={metrics.targetAudience} />
              <Field label="Revenue" value={metrics.revenueMonthly} />
              <Field label="Price Point" value={metrics.pricePoint} />
              <Field label="Channels" value={metrics.activeChannels} />
              <Field label="Value Prop" value={metrics.coreValueProp} />
            </div>
            {has(metrics.primaryBottleneck) && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div><span className="text-[10px] font-bold text-red-400 uppercase">Bottleneck</span><p className="text-xs text-text-muted mt-0.5">{metrics.primaryBottleneck}</p></div>
              </div>
            )}
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary-light" /> Health Scores</h3>
            <div className="space-y-3">
              <Score label="Value Clarity" value={metrics.valueClarityScore} />
              <Score label="Business Health" value={metrics.businessHealthScore} />
              <Score label="Sovereignty" value={metrics.sovereigntyScore} />
              <Score label="Moat" value={metrics.moatScore} />
            </div>
          </div>
        </div>

        {/* Strengths & Risks */}
        {(strengths.length > 0 || risks.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strengths.length > 0 && (
              <div className="bg-surface-light border border-border rounded-xl p-4">
                <h3 className="text-xs font-bold text-accent-green uppercase tracking-wider mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Strengths</h3>
                {strengths.map((s, i) => <p key={i} className="text-xs text-text-muted leading-snug py-0.5">+ {s}</p>)}
              </div>
            )}
            {risks.length > 0 && (
              <div className="bg-surface-light border border-border rounded-xl p-4">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Risks</h3>
                {risks.map((r, i) => <p key={i} className="text-xs text-text-muted leading-snug py-0.5">- {r}</p>)}
              </div>
            )}
          </div>
        )}

        {/* Action Items */}
        {actionItems.length > 0 && (
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-accent-amber" /> Priority Actions</h3>
            {actionItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-1.5 border-b border-border/20 last:border-0">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-0.5 ${item.priority === 'high' ? 'bg-red-500/10 text-red-400' : item.priority === 'medium' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-surface text-text-muted'}`}>
                  {item.priority === 'high' ? 'NOW' : item.priority === 'medium' ? 'SOON' : 'LATER'}
                </span>
                <p className="text-xs text-text leading-snug flex-1">{item.text}</p>
                <span className="text-[9px] text-text-muted/40">{STAGE_LABELS[item.stage]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Stage Details */}
        {Object.keys(stageFindings).length > 0 && (
          <div className="bg-surface-light border border-border rounded-xl overflow-hidden">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider px-4 pt-4 pb-2 flex items-center gap-2"><ClipboardList className="w-4 h-4 text-primary-light" /> Stage Details</h3>
            {Object.entries(stageFindings).map(([stage, findings]) => findings.length > 0 && (
              <div key={stage} className="border-t border-border/30">
                <button onClick={() => setExpandedStage(expandedStage === stage ? null : stage)} className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-surface/50 transition-colors">
                  <span className="text-xs font-medium text-text">{STAGE_LABELS[stage]}</span>
                  <div className="flex items-center gap-2"><span className="text-[10px] text-text-muted">{findings.length}</span><ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${expandedStage === stage ? 'rotate-180' : ''}`} /></div>
                </button>
                {expandedStage === stage && (
                  <div className="px-4 pb-3 space-y-1.5">
                    {findings.map((f, i) => <p key={i} className="text-xs text-text-muted leading-snug pl-3 border-l-2 border-primary/20">{f}</p>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Goals */}
        {(has(metrics.goal30d) || has(metrics.goal6m) || has(metrics.goal1y)) && (
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary-light" /> Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {has(metrics.goal30d) && <GoalCard tf="30 Days" goal={metrics.goal30d} c="text-accent-green" />}
              {has(metrics.goal6m) && <GoalCard tf="6 Months" goal={metrics.goal6m} c="text-accent-blue" />}
              {has(metrics.goal1y) && <GoalCard tf="1 Year" goal={metrics.goal1y} c="text-primary-light" />}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QA href={`/session/${id}`} icon={<MessageSquare className="w-5 h-5" />} label="Continue Chat" />
          <QA href={`/brief/${id}`} icon={<BookMarked className="w-5 h-5" />} label="Master Brief" />
          <QA onClick={() => setChatOpen(true)} icon={<Brain className="w-5 h-5" />} label="Ask AI" />
          <QA href="/" icon={<ArrowLeft className="w-5 h-5" />} label="All Projects" />
        </div>
      </main>

      {/* AI Chat FAB */}
      {!chatOpen && <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 z-40"><Brain className="w-6 h-6" /></button>}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] h-[28rem] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2"><Brain className="w-4 h-4 text-primary-light" /><span className="text-xs font-bold text-text">Strategy Assistant</span></div>
            <button onClick={() => setChatOpen(false)} className="text-text-muted hover:text-text"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.length === 0 && <p className="text-xs text-text-muted text-center py-4">Ask anything about your strategy or next steps.</p>}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white ml-auto' : 'bg-surface-light text-text-muted'}`}>
                {msg.content.length > 600 ? msg.content.slice(0, 600) + '...' : msg.content}
              </div>
            ))}
            {chatLoading && <div className="text-xs text-text-muted/50 px-3 animate-pulse">Thinking...</div>}
          </div>
          <div className="p-2 border-t border-border flex gap-2">
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder="Ask about your strategy..." className="flex-1 bg-surface-light border border-border rounded-lg px-3 py-2 text-xs text-text placeholder:text-text-muted/50 focus:outline-none focus:border-primary" />
            <button onClick={sendChat} disabled={chatLoading || !chatMsg.trim()} className="bg-primary text-white px-3 py-2 rounded-lg disabled:opacity-40"><Send className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const has = value && value.length > 0;
  return (<div className="py-1"><span className="text-[10px] text-text-muted/50 uppercase tracking-wider">{label}</span><p className={`text-xs leading-snug mt-0.5 ${has ? 'text-text' : 'text-text-muted/30 italic'}`}>{has ? (value.length > 120 ? value.slice(0, 120) + '...' : value) : 'Not yet captured'}</p></div>);
}

function Score({ label, value }: { label: string; value: string }) {
  const num = parseInt(value) || 0;
  const pct = Math.min(num * 10, 100);
  const color = num >= 7 ? 'bg-accent-green' : num >= 4 ? 'bg-accent-amber' : num > 0 ? 'bg-red-400' : 'bg-surface';
  return (<div><div className="flex justify-between mb-1"><span className="text-[10px] text-text-muted">{label}</span><span className={`text-xs font-bold ${num > 0 ? 'text-text' : 'text-text-muted/30'}`}>{num > 0 ? `${num}/10` : '--'}</span></div><div className="w-full h-1.5 bg-surface rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} /></div></div>);
}

function GoalCard({ tf, goal, c }: { tf: string; goal: string; c: string }) {
  return (<div className="p-3 rounded-lg bg-surface border border-border/50"><span className={`text-[10px] font-bold uppercase tracking-wider ${c}`}>{tf}</span><p className="text-xs text-text-muted mt-1 leading-snug">{goal.length > 150 ? goal.slice(0, 150) + '...' : goal}</p></div>);
}

function QA({ href, onClick, icon, label }: { href?: string; onClick?: () => void; icon: React.ReactNode; label: string }) {
  const cls = "bg-surface-light border border-border rounded-xl p-3 hover:border-primary/30 transition-colors group cursor-pointer flex items-center gap-2.5";
  const inner = (<><div className="text-text-muted group-hover:text-primary-light transition-colors">{icon}</div><span className="text-xs font-medium text-text">{label}</span></>);
  if (onClick) return <button onClick={onClick} className={cls}>{inner}</button>;
  return <a href={href} className={cls}>{inner}</a>;
}
