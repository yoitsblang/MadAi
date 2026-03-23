'use client';

import React from 'react';
import { MODULE_INFO, ModuleType } from '@/lib/types/business';
import { ModuleIcon } from '@/lib/icons';
import { Brain, Lock, ArrowLeft, BookOpen, Settings } from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
  intakeComplete: boolean;
  sessionName?: string;
}

const MODULE_ORDER: ModuleType[] = [
  'intake',
  'value-diagnosis',
  'business-logic',
  'platform-power',
  'market-research',
  'psychology',
  'ethics',
  'strategy-macro',
  'strategy-meso',
  'strategy-micro',
  'timing',
  'innovation',
  'teaching',
  'general',
];

const MODULE_GROUPS = [
  { label: 'Foundation', modules: ['intake', 'value-diagnosis', 'business-logic'] as ModuleType[] },
  { label: 'Analysis', modules: ['platform-power', 'market-research', 'psychology', 'ethics'] as ModuleType[] },
  { label: 'Strategy', modules: ['strategy-macro', 'strategy-meso', 'strategy-micro'] as ModuleType[] },
  { label: 'Advanced', modules: ['timing', 'innovation', 'teaching', 'general'] as ModuleType[] },
];

export default function Sidebar({ activeModule, onModuleChange, intakeComplete, sessionName }: SidebarProps) {
  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-light" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-text">MadAi</h1>
            <p className="text-xs text-text-muted">Strategic Intelligence</p>
          </div>
        </div>
        {sessionName && (
          <p className="text-xs text-primary-light mt-2 truncate">{sessionName}</p>
        )}
      </div>

      {/* Module navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {MODULE_GROUPS.map(group => (
          <div key={group.label} className="mb-3">
            <div className="text-[10px] font-semibold text-text-muted/60 uppercase tracking-wider px-3 py-1">
              {group.label}
            </div>
            {group.modules.map(module => {
              const info = MODULE_INFO[module];
              const isActive = activeModule === module;
              const isLocked = !intakeComplete && module !== 'intake' && module !== 'general';

              return (
                <button
                  key={module}
                  onClick={() => !isLocked && onModuleChange(module)}
                  disabled={isLocked}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all text-sm
                    ${isActive
                      ? 'bg-primary/15 text-primary-light border border-primary/20'
                      : isLocked
                        ? 'text-text-muted/30 cursor-not-allowed'
                        : 'text-text-muted hover:bg-surface-light hover:text-text'
                    }`}
                >
                  <span className={`${isLocked ? 'opacity-30' : ''}`}>
                    <ModuleIcon name={info.icon} className="w-4 h-4 text-current" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium truncate ${isActive ? 'text-primary-light' : ''}`}>
                      {info.label}
                    </div>
                  </div>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-text-muted/30" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Strategy Journey Progress */}
      {intakeComplete && (
        <div className="mx-3 mb-2 p-3 bg-surface-light/50 border border-border rounded-lg">
          <div className="text-[10px] font-semibold text-text-muted/60 uppercase tracking-wider mb-2">
            Strategy Journey
          </div>
          <div className="space-y-1.5">
            {[
              { mod: 'intake' as ModuleType, label: 'Intake' },
              { mod: 'value-diagnosis' as ModuleType, label: 'Value' },
              { mod: 'business-logic' as ModuleType, label: 'Logic' },
              { mod: 'strategy-macro' as ModuleType, label: 'Strategy' },
            ].map(({ mod, label }) => {
              const done = mod === 'intake' ? intakeComplete : activeModule === mod || MODULE_ORDER.indexOf(activeModule) > MODULE_ORDER.indexOf(mod);
              return (
                <div key={mod} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border ${done ? 'bg-accent-green border-accent-green' : 'border-border'}`} />
                  <span className={`text-[10px] ${done ? 'text-text' : 'text-text-muted/40'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text rounded-lg hover:bg-surface-light transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-current" /> All Sessions
        </a>
        <a
          href="/library"
          className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text rounded-lg hover:bg-surface-light transition-colors"
        >
          <BookOpen className="w-4 h-4 text-current" /> Strategy Library
        </a>
        <a
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 text-xs text-text-muted hover:text-text rounded-lg hover:bg-surface-light transition-colors"
        >
          <Settings className="w-4 h-4 text-current" /> Settings
        </a>
      </div>
    </aside>
  );
}
