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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all hover:scale-105"
          style={{ boxShadow: '0 0 20px rgba(220,38,38,0.4), 0 4px 20px rgba(0,0,0,0.5)' }}
        >
          <img src="/logo-64.png" alt="Sterling" className="w-7 h-7 rounded-lg" />
          <div className="absolute inset-0 rounded-full border border-primary/50 ping-slow" />
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[32rem] glass-strong flex flex-col animate-slide-up corner-frame" style={{ boxShadow: '0 0 40px rgba(220,38,38,0.1), 0 8px 40px rgba(0,0,0,0.6)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <img src="/logo-64.png" alt="Sterling" className="w-4 h-4 rounded-full" />
              <span className="text-sm font-semibold text-text">Sterling</span>
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
