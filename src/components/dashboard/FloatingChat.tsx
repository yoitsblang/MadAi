'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingChatProps {
  sessionId: string;
  businessName: string;
  initialQuery?: string;
}

export default function FloatingChat({ sessionId, businessName }: FloatingChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const allMessages = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          module: 'general',
          messages: allMessages,
          businessContext: `Dashboard consultation for: ${businessName}`,
          ethicalStance: 'balanced',
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: data.response || data.message || 'No response.' };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
        >
          {/* Outer glow ring */}
          <div className="absolute inset-[-4px] rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 blur-sm group-hover:from-primary/50 group-hover:to-primary/10 transition-all" />
          {/* Button body */}
          <div className="relative w-12 h-12 rounded-2xl bg-surface-light border border-border/40 group-hover:border-primary/40 flex items-center justify-center transition-all group-hover:scale-105"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:text-primary-light transition-colors">
              <path d="M12 2C6.48 2 2 6 2 10.5c0 2.5 1.2 4.7 3 6.2V22l4.5-2.5c.8.2 1.6.3 2.5.3 5.52 0 10-4 10-8.5S17.52 2 12 2z" />
              <circle cx="8" cy="10.5" r="1" fill="currentColor" />
              <circle cx="12" cy="10.5" r="1" fill="currentColor" />
              <circle cx="16" cy="10.5" r="1" fill="currentColor" />
            </svg>
          </div>
          {/* Label */}
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-text-muted/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity font-medium">
            Ask Sterling
          </span>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-96 sm:h-[32rem] bg-surface sm:glass-strong flex flex-col animate-slide-up sm:corner-frame rounded-xl sm:rounded-2xl border border-border/20" style={{ boxShadow: '0 0 40px rgba(220,38,38,0.1), 0 8px 40px rgba(0,0,0,0.6)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-primary/15 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-primary">
                  <path d="M12 2C6.48 2 2 6 2 10.5c0 2.5 1.2 4.7 3 6.2V22l4.5-2.5c.8.2 1.6.3 2.5.3 5.52 0 10-4 10-8.5S17.52 2 12 2z" />
                </svg>
              </div>
              <span className="heading-sm text-text">Sterling</span>
              <div className="status-live" />
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-text-muted hover:text-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-text-muted/60 text-center pt-8 leading-relaxed">
                Ask Sterling about your strategy, next steps, or anything on this dashboard.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white/[0.04] border border-white/[0.06] text-text-muted rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="typing-dot w-1.5 h-1.5 bg-primary-light rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-primary-light rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-primary-light rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
