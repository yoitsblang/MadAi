'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Edit3 } from 'lucide-react';

export interface Modification {
  type: 'update' | 'add' | 'remove';
  target: string;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
  approved?: boolean;
}

interface ModificationApprovalProps {
  modifications: Modification[];
  onApprove: (approved: Modification[]) => void;
  onReject: () => void;
}

export function parseModifications(text: string): Modification[] {
  const mods: Modification[] = [];
  const regex = /\[MODIFICATION\]\s*\n(?:TYPE:\s*(.+)\n)(?:TARGET:\s*(.+)\n)(?:FIELD:\s*(.+)\n)(?:OLD:\s*(.*)\n)(?:NEW:\s*(.+)\n)(?:REASON:\s*(.+)\n)\[\/MODIFICATION\]/gi;
  let match;
  while ((match = regex.exec(text)) !== null) {
    mods.push({
      type: (match[1].trim() as 'update' | 'add' | 'remove'),
      target: match[2].trim(),
      field: match[3].trim(),
      oldValue: match[4].trim(),
      newValue: match[5].trim(),
      reason: match[6].trim(),
    });
  }
  return mods;
}

export function stripModificationBlocks(text: string): string {
  return text.replace(/\[MODIFICATION\][\s\S]*?\[\/MODIFICATION\]/gi, '').trim();
}

export default function ModificationApproval({ modifications, onApprove, onReject }: ModificationApprovalProps) {
  const [decisions, setDecisions] = useState<Record<number, boolean>>(
    Object.fromEntries(modifications.map((_, i) => [i, true]))
  );

  const toggleDecision = (idx: number) => {
    setDecisions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleApproveSelected = () => {
    const approved = modifications.filter((_, i) => decisions[i]);
    onApprove(approved);
  };

  const approvedCount = Object.values(decisions).filter(Boolean).length;

  return (
    <div className="border border-primary/20 rounded-xl overflow-hidden bg-surface-light/50 my-3">
      <div className="px-4 py-2.5 bg-primary/5 border-b border-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary-light" />
          <span className="text-xs font-bold text-text">Proposed Changes ({modifications.length})</span>
        </div>
        <span className="text-[10px] text-text-muted">{approvedCount} selected</span>
      </div>

      <div className="divide-y divide-border/30">
        {modifications.map((mod, i) => (
          <div key={i} className={`px-4 py-3 transition-colors ${decisions[i] ? '' : 'opacity-40'}`}>
            <div className="flex items-start gap-3">
              <button
                onClick={() => toggleDecision(i)}
                className={`mt-0.5 w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                  decisions[i] ? 'bg-accent-green border-accent-green text-white' : 'border-border hover:border-primary/50'
                }`}>
                {decisions[i] && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    mod.type === 'add' ? 'bg-accent-green/10 text-accent-green' :
                    mod.type === 'remove' ? 'bg-accent-red/10 text-accent-red' :
                    'bg-accent-blue/10 text-accent-blue'
                  }`}>{mod.type}</span>
                  <span className="text-[10px] text-text-muted">{mod.field}</span>
                </div>
                {mod.type === 'update' && mod.oldValue && (
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="text-accent-red/70 line-through">{mod.oldValue}</span>
                    <ArrowRight className="w-3 h-3 text-text-muted/40 flex-shrink-0" />
                    <span className="text-accent-green font-medium">{mod.newValue}</span>
                  </div>
                )}
                {mod.type === 'add' && (
                  <p className="text-xs text-accent-green font-medium mb-1">+ {mod.newValue}</p>
                )}
                {mod.type === 'remove' && (
                  <p className="text-xs text-accent-red line-through mb-1">- {mod.oldValue}</p>
                )}
                <p className="text-[10px] text-text-muted/70 leading-snug">{mod.reason}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-2.5 bg-surface border-t border-border/30 flex items-center justify-between">
        <button onClick={onReject}
          className="text-xs text-text-muted hover:text-text flex items-center gap-1.5 transition-colors">
          <XCircle className="w-3.5 h-3.5" /> Reject All
        </button>
        <button onClick={handleApproveSelected}
          disabled={approvedCount === 0}
          className="text-xs font-semibold bg-accent-green text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-40 hover:bg-accent-green/90 transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5" /> Apply {approvedCount} Change{approvedCount !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}
