'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';

interface Action {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  stage: string;
  completed: boolean;
  description?: string;
}

interface PriorityActionsProps {
  actions: Action[];
  onToggle: (id: string) => void;
  onAskSterling: (text: string) => void;
}

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  high: { label: 'NOW', className: 'bg-red-600 text-white border-red-600/30' },
  medium: { label: 'SOON', className: 'bg-accent-gold/20 text-accent-gold border-accent-gold/30' },
  low: { label: 'LATER', className: 'bg-accent-blue/15 text-blue-400 border-accent-blue/30' },
};

export default function PriorityActions({ actions, onToggle, onAskSterling }: PriorityActionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...actions].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-sm font-bold text-text uppercase tracking-wider mb-4">
        What To Do Now
      </h2>

      {sorted.length === 0 && (
        <p className="text-sm text-text-muted py-4">
          No actions yet. Complete an analysis module to generate priorities.
        </p>
      )}

      <div className="space-y-1">
        {sorted.map((action) => {
          const priority = PRIORITY_CONFIG[action.priority];
          const isExpanded = expandedId === action.id;

          return (
            <div key={action.id} className={`transition-opacity ${action.completed ? 'opacity-40' : ''}`}>
              <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group">
                <button
                  onClick={() => onToggle(action.id)}
                  className="flex-shrink-0 text-text-muted hover:text-primary-light transition-colors"
                >
                  {action.completed ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
                  ) : (
                    <Circle className="w-4.5 h-4.5" />
                  )}
                </button>

                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border flex-shrink-0 ${priority.className}`}>
                  {priority.label}
                </span>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : action.id)}
                  className={`flex-1 text-left text-sm transition-colors ${
                    action.completed ? 'line-through text-text-muted' : 'text-text hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {action.description && (
                      isExpanded
                        ? <ChevronDown className="w-3 h-3 text-text-muted flex-shrink-0" />
                        : <ChevronRight className="w-3 h-3 text-text-muted flex-shrink-0" />
                    )}
                    {action.text}
                  </span>
                </button>

                <span className="text-[10px] text-text-muted/50 font-medium tracking-wide uppercase flex-shrink-0 hidden sm:block">
                  {action.stage}
                </span>

                <button
                  onClick={() => onAskSterling(action.text)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-primary-light"
                  title="Ask Sterling"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              {isExpanded && action.description && (
                <div className="ml-[4.5rem] mr-4 mb-2 px-3 py-2.5 text-xs text-text-muted leading-relaxed bg-white/[0.02] rounded-lg border border-border/30">
                  {action.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
