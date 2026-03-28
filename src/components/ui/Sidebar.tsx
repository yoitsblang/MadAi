'use client';

import React from 'react';
import { MODULE_INFO, ModuleType } from '@/lib/types/business';
import { ModuleIcon } from '@/lib/icons';
import { Lock, ArrowLeft, BookOpen, Settings } from 'lucide-react';

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
  { label: 'Tools', modules: ['timing', 'innovation', 'teaching', 'general'] as ModuleType[] },
];

export default function Sidebar({ activeModule, onModuleChange, intakeComplete, sessionName }: SidebarProps) {
  return (
    <aside className="w-60 bg-[#050507] border-r border-red-900/20 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-red-900/20">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/logo-200.png" alt="MadAi" className="w-8 h-8 rounded-lg" />
          <span className="text-sm font-semibold text-white">MadAi</span>
        </a>
        {sessionName && (
          <p className="text-[11px] text-zinc-700 mt-2 truncate">{sessionName}</p>
        )}
      </div>

      {/* Module navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {MODULE_GROUPS.map(group => (
          <div key={group.label} className="mb-4">
            <div className="text-[9px] font-medium uppercase tracking-[0.08em] text-red-500/40 px-3 mb-1">
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
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-all text-[13px]
                    ${isActive
                      ? 'bg-red-500/10 text-white border-l-2 border-red-500 ml-[-1px]'
                      : isLocked
                        ? 'text-zinc-800 cursor-not-allowed'
                        : 'text-zinc-600 hover:bg-[#0a0a0f] hover:text-white'
                    }`}
                >
                  <span className={`${isLocked ? 'opacity-30' : ''}`}>
                    <ModuleIcon name={info.icon} className="w-4 h-4 text-current" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[12px] font-medium truncate ${isActive ? 'text-white' : ''}`}>
                      {info.label}
                    </div>
                  </div>
                  {isLocked && (
                    <Lock className="w-3 h-3 text-zinc-800" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Strategy Journey Progress */}
      {intakeComplete && (
        <div className="mx-3 mb-2 p-3 bg-[#0a0a0f] border border-red-900/15 rounded-lg">
          <div className="text-[10px] font-semibold text-red-500/50 uppercase tracking-wider mb-2">
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
                  <div className={`w-3 h-3 rounded-full border ${done ? 'bg-red-500 border-red-500 shadow-[0_0_6px_rgba(220,38,38,0.4)]' : 'border-zinc-800'}`} />
                  <span className={`text-[10px] ${done ? 'text-white' : 'text-zinc-700'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="p-3 border-t border-red-900/20 space-y-1">
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 hover:text-white rounded-lg hover:bg-[#0a0a0f] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-current" /> All Sessions
        </a>
        <a
          href="/library"
          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 hover:text-white rounded-lg hover:bg-[#0a0a0f] transition-colors"
        >
          <BookOpen className="w-4 h-4 text-current" /> Strategy Library
        </a>
        <a
          href="/profile"
          className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 hover:text-white rounded-lg hover:bg-[#0a0a0f] transition-colors"
        >
          <Settings className="w-4 h-4 text-current" /> Settings
        </a>
      </div>
    </aside>
  );
}
