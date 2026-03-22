'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type your message...'}
          disabled={disabled}
          rows={1}
          className="w-full bg-surface-light border border-border rounded-xl px-4 py-3 text-text text-sm
            placeholder:text-text-muted/50 resize-none focus:outline-none focus:border-primary
            focus:ring-1 focus:ring-primary/30 disabled:opacity-50 transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-primary hover:bg-primary-dark text-white rounded-xl px-5 py-3
          font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed
          transition-colors flex-shrink-0"
      >
        Send
      </button>
    </form>
  );
}
