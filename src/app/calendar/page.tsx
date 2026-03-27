'use client';

import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: string;
  status: string;
  priority: string;
  module?: string;
}

const TYPE_COLORS: Record<string, string> = {
  campaign: 'bg-primary/20 text-primary-light border-primary/30',
  post: 'bg-accent-blue/20 text-accent-blue border-accent-blue/30',
  launch: 'bg-accent-amber/20 text-accent-amber border-accent-amber/30',
  review: 'bg-accent-green/20 text-accent-green border-accent-green/30',
  research: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  custom: 'bg-surface-lighter text-text-muted border-border',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', type: 'custom', priority: 'medium' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  useEffect(() => {
    loadEvents();
  }, [currentDate]);

  async function loadEvents() {
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0).toISOString();
    try {
      const res = await fetch(`/api/calendar?start=${start}&end=${end}`);
      if (res.ok) {
        const loaded = await res.json();
        if (loaded.length === 0) {
          // Auto-seed calendar from active sessions
          await seedFromSessions();
        } else {
          setEvents(loaded);
        }
      }
    } catch {
      setEvents([]);
    }
  }

  async function seedFromSessions() {
    try {
      const sessRes = await fetch('/api/sessions');
      if (!sessRes.ok) return;
      const sessions = await sessRes.json();
      const active = sessions.filter((s: { intakeComplete: boolean }) => s.intakeComplete);
      if (active.length === 0) return;

      // Get dashboard data for first active session to pull action items
      const dashRes = await fetch(`/api/sessions/${active[0].id}/dashboard`);
      if (!dashRes.ok) return;
      const dash = await dashRes.json();

      const today = new Date();
      const seededEvents: Array<{ title: string; date: string; type: string; priority: string }> = [];

      // Seed week 1: Quick wins from action items
      if (dash.actionItems) {
        dash.actionItems.slice(0, 3).forEach((item: { text: string; priority: string }, i: number) => {
          const d = new Date(today);
          d.setDate(d.getDate() + i + 1);
          seededEvents.push({ title: item.text.slice(0, 60), date: d.toISOString(), type: 'campaign', priority: item.priority });
        });
      }

      // Add review checkpoint at end of week
      const reviewDate = new Date(today);
      reviewDate.setDate(reviewDate.getDate() + 7);
      seededEvents.push({ title: 'Weekly Review: What worked? What failed?', date: reviewDate.toISOString(), type: 'review', priority: 'high' });

      // Add measurement checkpoint
      const measureDate = new Date(today);
      measureDate.setDate(measureDate.getDate() + 14);
      seededEvents.push({ title: 'Measure results. Update Sterling with findings.', date: measureDate.toISOString(), type: 'research', priority: 'medium' });

      // Save all seeded events
      for (const evt of seededEvents) {
        await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(evt),
        });
      }

      // Reload
      const start = new Date(year, month, 1).toISOString();
      const end = new Date(year, month + 1, 0).toISOString();
      const reloadRes = await fetch(`/api/calendar?start=${start}&end=${end}`);
      if (reloadRes.ok) setEvents(await reloadRes.json());
    } catch { /* ignore seed failures */ }
  }

  async function handleAddEvent() {
    if (!newEvent.title || !selectedDate) return;
    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newEvent,
          date: selectedDate.toISOString(),
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewEvent({ title: '', description: '', type: 'custom', priority: 'medium' });
        loadEvents();
      }
    } catch { /* ignore */ }
  }

  async function toggleEventStatus(event: CalendarEvent) {
    const newStatus = event.status === 'completed' ? 'scheduled' : 'completed';
    try {
      await fetch(`/api/calendar/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      loadEvents();
    } catch { /* ignore */ }
  }

  function getEventsForDay(day: number): CalendarEvent[] {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-text-muted hover:text-text transition-colors">&larr;</a>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-current" />
              <h1 className="text-lg font-bold text-text">Marketing Calendar</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="text-text-muted hover:text-text px-2 py-1"
            >
              &larr;
            </button>
            <span className="text-sm font-semibold text-text min-w-[140px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="text-text-muted hover:text-text px-2 py-1"
            >
              &rarr;
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-medium text-text-muted py-2">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] bg-surface-light/30 rounded-lg" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                onClick={() => {
                  setSelectedDate(new Date(year, month, day));
                  setShowAddModal(true);
                }}
                className={`min-h-[100px] p-1.5 rounded-lg border cursor-pointer transition-colors
                  ${isToday(day)
                    ? 'bg-primary/10 border-primary/30'
                    : 'bg-surface-light border-border hover:border-primary/20'
                  }`}
              >
                <div className={`text-xs font-medium mb-1 ${isToday(day) ? 'text-primary-light' : 'text-text-muted'}`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(evt => (
                    <div
                      key={evt.id}
                      onClick={(e) => { e.stopPropagation(); toggleEventStatus(evt); }}
                      className={`text-[10px] px-1.5 py-0.5 rounded border truncate
                        ${evt.status === 'completed' ? 'line-through opacity-50' : ''}
                        ${TYPE_COLORS[evt.type] || TYPE_COLORS.custom}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-text-muted/50 px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming events list */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-text mb-3">Upcoming Tasks</h2>
          <div className="space-y-2">
            {events
              .filter(e => e.status !== 'completed' && new Date(e.date) >= new Date())
              .slice(0, 10)
              .map(evt => (
                <div key={evt.id} className="flex items-center gap-3 bg-surface-light border border-border rounded-lg px-4 py-2.5">
                  <button
                    onClick={() => toggleEventStatus(evt)}
                    className="w-4 h-4 rounded border border-border hover:border-primary flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-text">{evt.title}</span>
                    {evt.description && (
                      <span className="text-xs text-text-muted ml-2">{evt.description}</span>
                    )}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${TYPE_COLORS[evt.type] || TYPE_COLORS.custom}`}>
                    {evt.type}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            {events.filter(e => e.status !== 'completed').length === 0 && (
              <p className="text-sm text-text-muted/50 text-center py-8">
                No upcoming tasks. Generate a strategy to populate your calendar.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Add event modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-surface-light border border-border rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-text mb-4">
              Add Event — {selectedDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newEvent.title}
                onChange={e => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Event title"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text
                  placeholder:text-text-muted/50 focus:outline-none focus:border-primary"
              />
              <textarea
                value={newEvent.description}
                onChange={e => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text
                  placeholder:text-text-muted/50 focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex gap-3">
                <select
                  value={newEvent.type}
                  onChange={e => setNewEvent(prev => ({ ...prev, type: e.target.value }))}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="campaign">Campaign</option>
                  <option value="post">Content Post</option>
                  <option value="launch">Launch</option>
                  <option value="review">Review</option>
                  <option value="research">Research</option>
                  <option value="custom">Custom</option>
                </select>
                <select
                  value={newEvent.priority}
                  onChange={e => setNewEvent(prev => ({ ...prev, priority: e.target.value }))}
                  className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border border-border text-text-muted rounded-lg py-2 text-sm hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  disabled={!newEvent.title}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-lg py-2 text-sm
                    transition-colors disabled:opacity-50"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
