'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Beaker, Plus, Play, Trophy, X, ChevronDown, ChevronRight, Clock } from 'lucide-react';

interface Experiment {
  id: string; hypothesis: string; change: string; metric: string;
  passCondition: string; failCondition: string; winAction: string;
  status: string; duration: string; deadline: string; verdict: string;
  results: string; priority: string;
}

const STATUS_ORDER = ['running', 'backlog', 'won', 'lost', 'archived'];
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  backlog: { label: 'QUEUED', color: 'text-zinc-500', bg: 'bg-zinc-800/30' },
  running: { label: 'RUNNING', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  won: { label: 'WON', color: 'text-green-400', bg: 'bg-green-500/10' },
  lost: { label: 'LOST', color: 'text-red-400', bg: 'bg-red-500/10' },
  archived: { label: 'ARCHIVED', color: 'text-zinc-600', bg: 'bg-zinc-900/30' },
};

export default function ExperimentLab({ sessionId }: { sessionId: string }) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // New experiment form
  const [hypothesis, setHypothesis] = useState('');
  const [change, setChange] = useState('');
  const [metric, setMetric] = useState('');
  const [passCondition, setPassCondition] = useState('');
  const [failCondition, setFailCondition] = useState('');

  useEffect(() => {
    fetch(`/api/experiments?sessionId=${sessionId}`).then(r => r.ok ? r.json() : []).then(setExperiments);
  }, [sessionId]);

  async function createExperiment() {
    if (!hypothesis || !change || !metric || !passCondition || !failCondition) { toast.error('Fill all fields'); return; }
    const res = await fetch('/api/experiments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, hypothesis, change, metric, passCondition, failCondition, duration: '7 days' }),
    });
    if (res.ok) {
      const exp = await res.json();
      setExperiments(prev => [exp, ...prev]);
      setShowNew(false); setHypothesis(''); setChange(''); setMetric(''); setPassCondition(''); setFailCondition('');
      toast.success('Experiment created');
    }
  }

  async function updateStatus(id: string, status: string, verdict?: string) {
    const res = await fetch('/api/experiments', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, verdict }),
    });
    if (res.ok) {
      const updated = await res.json();
      setExperiments(prev => prev.map(e => e.id === id ? updated : e));
      toast.success(`Experiment ${status}`);
    }
  }

  const sorted = [...experiments].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
  const running = sorted.filter(e => e.status === 'running').length;
  const won = sorted.filter(e => e.status === 'won').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Beaker className="w-4 h-4 text-purple-400" /> Experiment Lab
          {running > 0 && <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">{running} running</span>}
          {won > 0 && <span className="text-[9px] font-mono text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{won} won</span>}
        </h3>
        <button onClick={() => setShowNew(!showNew)}
          className="text-[10px] text-zinc-600 hover:text-red-400 flex items-center gap-1 transition-colors">
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {/* New experiment form */}
      {showNew && (
        <div className="bg-[#0a0a0f] border border-purple-500/20 rounded-xl p-4 mb-3 animate-slide-up space-y-2">
          <input value={hypothesis} onChange={e => setHypothesis(e.target.value)}
            className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/30"
            placeholder="If I do X, then Y will happen because Z" />
          <input value={change} onChange={e => setChange(e.target.value)}
            className="w-full bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-purple-500/30"
            placeholder="What to change/test" />
          <div className="grid grid-cols-3 gap-2">
            <input value={metric} onChange={e => setMetric(e.target.value)}
              className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none"
              placeholder="Metric" />
            <input value={passCondition} onChange={e => setPassCondition(e.target.value)}
              className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none"
              placeholder="Win if..." />
            <input value={failCondition} onChange={e => setFailCondition(e.target.value)}
              className="bg-[#050507] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-700 focus:outline-none"
              placeholder="Kill if..." />
          </div>
          <div className="flex gap-2">
            <button onClick={createExperiment} className="text-xs bg-purple-600 text-white px-4 py-1.5 rounded-lg font-medium">Create</button>
            <button onClick={() => setShowNew(false)} className="text-xs text-zinc-600 px-3 py-1.5">Cancel</button>
          </div>
        </div>
      )}

      {/* Experiment cards */}
      {sorted.length === 0 && !showNew && (
        <p className="text-[10px] text-zinc-800 text-center py-4">No experiments yet. Test a hypothesis to learn faster.</p>
      )}

      <div className="space-y-2">
        {sorted.map(exp => {
          const cfg = STATUS_CONFIG[exp.status] || STATUS_CONFIG.backlog;
          const isExpanded = expanded === exp.id;
          return (
            <div key={exp.id} className={`bg-[#0a0a0f] border border-zinc-800/30 rounded-xl overflow-hidden ${exp.status === 'running' ? 'border-blue-500/20' : ''}`}>
              <div className="p-3 flex items-start gap-3 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : exp.id)}>
                <Beaker className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300 leading-relaxed">{exp.hypothesis}</p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
                {isExpanded ? <ChevronDown className="w-3 h-3 text-zinc-700" /> : <ChevronRight className="w-3 h-3 text-zinc-700" />}
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 ml-7 animate-slide-up">
                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                    <div><span className="text-zinc-700">Change:</span> <span className="text-zinc-400">{exp.change}</span></div>
                    <div><span className="text-zinc-700">Metric:</span> <span className="text-zinc-400">{exp.metric}</span></div>
                    <div><span className="text-zinc-700">Win if:</span> <span className="text-green-500/60">{exp.passCondition}</span></div>
                    <div><span className="text-zinc-700">Kill if:</span> <span className="text-red-500/60">{exp.failCondition}</span></div>
                  </div>
                  {exp.verdict && <p className="text-[10px] text-amber-400/60 mb-2">Verdict: {exp.verdict}</p>}
                  <div className="flex gap-1.5">
                    {exp.status === 'backlog' && (
                      <button onClick={() => updateStatus(exp.id, 'running')} className="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded border border-blue-500/20 flex items-center gap-1">
                        <Play className="w-3 h-3" /> Start
                      </button>
                    )}
                    {exp.status === 'running' && (
                      <>
                        <button onClick={() => updateStatus(exp.id, 'won', 'Hypothesis confirmed')} className="text-[10px] bg-green-500/10 text-green-400 px-2.5 py-1 rounded border border-green-500/20 flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Won
                        </button>
                        <button onClick={() => updateStatus(exp.id, 'lost', 'Hypothesis rejected')} className="text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded border border-red-500/20 flex items-center gap-1">
                          <X className="w-3 h-3" /> Lost
                        </button>
                      </>
                    )}
                    {(exp.status === 'won' || exp.status === 'lost') && (
                      <button onClick={() => updateStatus(exp.id, 'archived')} className="text-[10px] text-zinc-600 px-2.5 py-1 rounded border border-zinc-800">Archive</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
