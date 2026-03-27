'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, CheckCircle2, Zap, AlertTriangle, CreditCard } from 'lucide-react';

interface Notification {
  id: string;
  type: 'stage_complete' | 'action_due' | 'ai_suggestion' | 'credit_low' | 'info';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('madai-notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      // Seed with welcome notification
      const welcome: Notification = {
        id: 'welcome',
        type: 'info',
        title: 'Welcome to MadAi',
        body: 'Start a new analysis to begin building your strategy.',
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications([welcome]);
      localStorage.setItem('madai-notifications', JSON.stringify([welcome]));
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('madai-notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.setItem('madai-notifications', JSON.stringify([]));
    setOpen(false);
  };

  const iconMap: Record<string, React.ReactNode> = {
    stage_complete: <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />,
    action_due: <Zap className="w-3.5 h-3.5 text-primary" />,
    ai_suggestion: <Zap className="w-3.5 h-3.5 text-accent-gold" />,
    credit_low: <CreditCard className="w-3.5 h-3.5 text-accent-amber" />,
    info: <AlertTriangle className="w-3.5 h-3.5 text-accent-blue" />,
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-surface-light"
      >
        <Bell className="w-4.5 h-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden toast-enter">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
            <span className="heading-sm text-text">Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[10px] text-primary hover:text-primary-light">
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="text-text-muted/30 hover:text-text-muted">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-6 h-6 text-text-muted/20 mx-auto mb-2" />
                <p className="text-xs text-text-muted/30">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map(n => (
                <div key={n.id}
                  className={`px-4 py-3 border-b border-border/10 hover:bg-white/[0.02] transition-colors ${!n.read ? 'bg-primary/[0.02]' : ''}`}>
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">{iconMap[n.type] || iconMap.info}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${!n.read ? 'text-text' : 'text-text-muted/70'}`}>{n.title}</p>
                      <p className="text-[11px] text-text-muted/50 mt-0.5 leading-snug">{n.body}</p>
                      <p className="text-[9px] text-text-muted/25 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                    </div>
                    {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
