'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ExportButtonProps {
  sessionId: string;
}

export default function ExportButton({ sessionId }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleExport(format: 'md' | 'json') {
    setOpen(false);
    window.open(`/api/sessions/${sessionId}/export?format=${format}`, '_blank');
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted
          bg-surface-light border border-border rounded-lg hover:text-text hover:border-primary
          transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
        </svg>
        Export
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => handleExport('md')}
            className="w-full px-3 py-2 text-left text-xs text-text hover:bg-surface-light transition-colors"
          >
            Export as Markdown
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full px-3 py-2 text-left text-xs text-text hover:bg-surface-light transition-colors border-t border-border"
          >
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
}
