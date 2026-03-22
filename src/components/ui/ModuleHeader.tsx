'use client';

import React from 'react';
import { MODULE_INFO, ModuleType, EthicalStance } from '@/lib/types/business';

interface ModuleHeaderProps {
  module: ModuleType;
  ethicalStance: EthicalStance;
  onStanceChange: (stance: EthicalStance) => void;
}

const STANCE_CONFIG: Record<EthicalStance, { label: string; color: string; description: string }> = {
  'ethical-first': { label: 'Ethical-First', color: 'text-accent-green', description: 'Prioritize customer value and trust' },
  'balanced': { label: 'Balanced', color: 'text-accent-blue', description: 'Optimize effectiveness + legitimacy' },
  'aggressive-but-defensible': { label: 'Aggressive', color: 'text-accent-amber', description: 'Push hard, stay defensible' },
  'max-performance-with-warning': { label: 'Max Performance', color: 'text-accent-red', description: 'Full power, with warnings' },
};

export default function ModuleHeader({ module, ethicalStance, onStanceChange }: ModuleHeaderProps) {
  const info = MODULE_INFO[module];
  const stance = STANCE_CONFIG[ethicalStance];

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="text-xl">{info.icon}</span>
        <div>
          <h2 className="text-sm font-bold text-text">{info.label}</h2>
          <p className="text-xs text-text-muted">{info.description}</p>
        </div>
      </div>

      {/* Ethical stance selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Stance:</span>
        <select
          value={ethicalStance}
          onChange={e => onStanceChange(e.target.value as EthicalStance)}
          className={`text-xs font-medium bg-surface-light border border-border rounded-lg px-2 py-1.5
            ${stance.color} cursor-pointer focus:outline-none focus:border-primary`}
        >
          {Object.entries(STANCE_CONFIG).map(([key, config]) => (
            <option key={key} value={key}>{config.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
