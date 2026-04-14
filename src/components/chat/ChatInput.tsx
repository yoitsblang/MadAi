'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [listening, setListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [message]);

  const toggleVoice = useCallback(() => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = message; // Start from current text

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? ' ' : '') + transcript;
        } else {
          interim = transcript;
        }
      }
      setMessage(finalTranscript + (interim ? ' ' + interim : ''));
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening, message]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }
    const trimmed = message.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Type your message...'}
          disabled={disabled}
          rows={1}
          className="w-full bg-[#12121a] border border-red-900/20 rounded-xl px-4 py-3 pr-10 text-white text-sm
            placeholder:text-zinc-700 resize-none focus:outline-none focus:border-red-500/40
            focus:ring-1 focus:ring-red-500/20 focus:shadow-[0_0_15px_rgba(220,38,38,0.1)] disabled:opacity-50 transition-all"
        />
        {/* Voice toggle inside input */}
        <button
          type="button"
          onClick={toggleVoice}
          className={`absolute right-2 bottom-2.5 p-1.5 rounded-lg transition-colors ${
            listening ? 'bg-red-600 text-white animate-pulse' : 'text-zinc-700 hover:text-zinc-500'
          }`}
          title={listening ? 'Stop voice input' : 'Start voice input'}
        >
          {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      </div>
      <button
        type="submit"
        disabled={disabled || !message.trim()}
        className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-5 py-3
          font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed
          transition-all flex-shrink-0 hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]
          border border-red-500/50"
      >
        Send
      </button>
    </form>
  );
}
