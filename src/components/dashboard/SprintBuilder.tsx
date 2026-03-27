'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { CheckCircle2, Circle, Clock, Zap, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface SprintTask {
  id: string;
  text: string;
  day: number; // 1-7
  timeEstimate: string;
  metric?: string;
  done: boolean;
}

interface SprintData {
  goal: string;
  tasks: SprintTask[];
  createdAt: string;
}

export default function SprintBuilder({ sessionId, actionItems }: {
  sessionId: string;
  actionItems: Array<{ text: string; priority: string }>;
}) {
  const [sprint, setSprint] = useState<SprintData | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(`sprint-${sessionId}`);
    if (saved) setSprint(JSON.parse(saved));
  }, [sessionId]);

  const generateSprint = useCallback(() => {
    if (actionItems.length === 0) return;

    const highPriority = actionItems.filter(a => a.priority === 'high');
    const medPriority = actionItems.filter(a => a.priority !== 'high');

    const tasks: SprintTask[] = [];
    let day = 1;

    // Day 1-2: Quick wins (high priority, first 2)
    for (const item of highPriority.slice(0, 2)) {
      tasks.push({
        id: Math.random().toString(36).slice(2),
        text: item.text.slice(0, 120),
        day,
        timeEstimate: '2-3 hours',
        done: false,
      });
      day = Math.min(day + 1, 2);
    }

    // Day 3-5: Core fixes
    day = 3;
    for (const item of [...highPriority.slice(2), ...medPriority].slice(0, 3)) {
      tasks.push({
        id: Math.random().toString(36).slice(2),
        text: item.text.slice(0, 120),
        day,
        timeEstimate: '3-4 hours',
        done: false,
      });
      day = Math.min(day + 1, 5);
    }

    // Day 6-7: Measurement + review
    tasks.push({
      id: Math.random().toString(36).slice(2),
      text: 'Review results from this week. What worked? What didn\'t?',
      day: 6,
      timeEstimate: '1 hour',
      done: false,
    });
    tasks.push({
      id: Math.random().toString(36).slice(2),
      text: 'Set up tracking for key metrics. Measure baseline numbers.',
      day: 7,
      timeEstimate: '1-2 hours',
      done: false,
    });

    const newSprint: SprintData = {
      goal: highPriority[0]?.text.slice(0, 80) || 'Execute top priorities',
      tasks,
      createdAt: new Date().toISOString(),
    };

    setSprint(newSprint);
    localStorage.setItem(`sprint-${sessionId}`, JSON.stringify(newSprint));
    toast.success('7-day sprint generated');
  }, [sessionId, actionItems]);

  const toggleTask = useCallback((taskId: string) => {
    if (!sprint) return;
    const updated = {
      ...sprint,
      tasks: sprint.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t),
    };
    setSprint(updated);
    localStorage.setItem(`sprint-${sessionId}`, JSON.stringify(updated));
    const task = updated.tasks.find(t => t.id === taskId);
    if (task?.done) toast.success('Task completed');
  }, [sprint, sessionId]);

  if (!sprint) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-text-muted/40 mb-3">No active sprint. Generate one from your action items.</p>
        <button onClick={generateSprint} disabled={actionItems.length === 0}
          className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-30 flex items-center gap-1.5 mx-auto">
          <Zap className="w-3.5 h-3.5" /> Build 7-Day Sprint
        </button>
      </div>
    );
  }

  const completed = sprint.tasks.filter(t => t.done).length;
  const total = sprint.tasks.length;
  const pct = Math.round((completed / total) * 100);
  const today = Math.min(7, Math.ceil((Date.now() - new Date(sprint.createdAt).getTime()) / 86400000) + 1);

  return (
    <div>
      {/* Sprint header */}
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-bold text-text data-value">{pct}%</div>
          <div className="w-20 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="label-xs">Day {today}/7</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-text-muted/30 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="space-y-1">
          {[1, 2, 3, 4, 5, 6, 7].map(day => {
            const dayTasks = sprint.tasks.filter(t => t.day === day);
            if (dayTasks.length === 0) return null;
            const isToday = day === today;

            return (
              <div key={day} className={`rounded-lg ${isToday ? 'bg-primary/5 border border-primary/15' : ''} px-2 py-1.5`}>
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                  isToday ? 'text-primary' : day < today ? 'text-text-muted/25' : 'text-text-muted/40'
                }`}>Day {day} {isToday ? '— TODAY' : ''}</span>
                {dayTasks.map(task => (
                  <div key={task.id} onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-2.5 py-1.5 cursor-pointer ${task.done ? 'opacity-30' : ''}`}>
                    {task.done ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-green flex-shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-border flex-shrink-0 mt-0.5" />}
                    <p className={`text-xs flex-1 leading-relaxed ${task.done ? 'line-through text-text-muted/30' : 'text-text/80'}`}>{task.text}</p>
                    <span className="text-[9px] text-text-muted/25 flex-shrink-0 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {task.timeEstimate}
                    </span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
