'use client';

import React from 'react';
import { MODULE_INFO, ModuleType, EthicalStance } from '@/lib/types/business';
import { ModuleIcon } from '@/lib/icons';

interface ModuleHeaderProps {
  module: ModuleType;
  ethicalStance: EthicalStance;
  onStanceChange: (stance: EthicalStance) => void;
}

const STANCE_CONFIG: Record<EthicalStance, { label: string; color: string; description: string }> = {
  'ethical-first': { label: 'Ethical-First', color: 'text-green-500', description: 'Prioritize customer value and trust' },
  'balanced': { label: 'Balanced', color: 'text-blue-400', description: 'Optimize effectiveness + legitimacy' },
  'aggressive-but-defensible': { label: 'Aggressive', color: 'text-amber-500', description: 'Push hard, stay defensible' },
  'max-performance-with-warning': { label: 'Max Performance', color: 'text-red-400', description: 'Full power, with warnings' },
};

export default function ModuleHeader({ module, ethicalStance, onStanceChange }: ModuleHeaderProps) {
  const info = MODULE_INFO[module];
  const stance = STANCE_CONFIG[ethicalStance];

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-red-900/30 bg-[#050507]/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <ModuleIcon name={info.icon} className="w-5 h-5 text-current" />
        <div>
          <h2 className="text-sm font-bold text-white">{info.label}</h2>
          <p className="text-xs text-zinc-600">{info.description}</p>
        </div>
      </div>

      {/* Ethical stance selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-600">Stance:</span>
        <select
          value={ethicalStance}
          onChange={e => onStanceChange(e.target.value as EthicalStance)}
          className={`text-xs font-medium bg-[#12121a] border border-red-900/20 rounded-lg px-2 py-1.5
            ${stance.color} cursor-pointer focus:outline-none focus:border-red-500/30`}
        >
          {Object.entries(STANCE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
