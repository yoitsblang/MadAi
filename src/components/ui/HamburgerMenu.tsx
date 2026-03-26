'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, BarChart3, Home, BookOpen, Calendar, Settings, User, ClipboardList } from 'lucide-react';
import { MODULE_INFO, ModuleType } from '@/lib/types/business';
import { ModuleIcon } from '@/lib/icons';

const QUICK_LINKS = [
  { href: '/', icon: Home, label: 'All Projects' },
  { href: '/plans', icon: ClipboardList, label: 'Action Plans' },
  { href: '/library', icon: BookOpen, label: 'Strategy Library' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const MODULE_GROUPS = [
  { label: 'Foundation', modules: ['intake', 'value-diagnosis', 'business-logic'] as ModuleType[] },
  { label: 'Analysis', modules: ['platform-power', 'market-research', 'psychology', 'ethics'] as ModuleType[] },
  { label: 'Strategy', modules: ['strategy-macro', 'strategy-meso', 'strategy-micro'] as ModuleType[] },
  { label: 'Tools', modules: ['timing', 'innovation', 'teaching', 'general'] as ModuleType[] },
];

interface HamburgerMenuProps {
  sessionId: string;
  activeModule: string;
  onModuleChange: (module: ModuleType) => void;
  intakeComplete: boolean;
}

export default function HamburgerMenu({ sessionId, activeModule, onModuleChange, intakeComplete }: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setOpen(!open)}
        className="text-text-muted hover:text-text p-1.5 rounded-lg hover:bg-surface-light transition-colors">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 glass-strong rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          {/* Dashboard link */}
          <a href={`/session/${sessionId}/dashboard`}
            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-primary-light hover:bg-primary/10 transition-colors border-b border-border/20">
            <BarChart3 className="w-4 h-4" /> Dashboard
          </a>

          {/* Quick Links */}
          <div className="py-1.5 border-b border-border/20">
            {QUICK_LINKS.map(link => (
              <a key={link.href} href={link.href}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-text hover:bg-surface/50 transition-colors">
                <link.icon className="w-3.5 h-3.5" /> {link.label}
              </a>
            ))}
          </div>

          {/* Module Navigation */}
          <div className="py-1.5 max-h-64 overflow-y-auto">
            {MODULE_GROUPS.map(group => (
              <div key={group.label}>
                <div className="px-4 py-1 text-[9px] font-bold text-text-muted/40 uppercase tracking-widest">{group.label}</div>
                {group.modules.map(mod => {
                  const info = MODULE_INFO[mod];
                  const isActive = activeModule === mod;
                  const isLocked = !intakeComplete && mod !== 'intake' && mod !== 'general';
                  return (
                    <button key={mod} onClick={() => { if (!isLocked) { onModuleChange(mod); setOpen(false); } }}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs transition-colors ${
                        isActive ? 'text-primary-light bg-primary/10' : isLocked ? 'text-text-muted/20 cursor-not-allowed' : 'text-text-muted hover:text-text hover:bg-surface/50'
                      }`}>
                      <ModuleIcon name={info.icon} className="w-3.5 h-3.5" />
                      {info.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
