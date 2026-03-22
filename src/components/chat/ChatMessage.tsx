'use client';

import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  module?: string;
  timestamp?: string;
}

export default function ChatMessage({ role, content, module, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-surface-light border border-border rounded-bl-md'
        }`}
      >
        {!isUser && module && module !== 'general' && (
          <div className="text-xs text-primary-light font-medium mb-1.5 uppercase tracking-wide">
            {module.replace(/-/g, ' ')}
          </div>
        )}
        <div className={`prose max-w-none text-sm leading-relaxed ${isUser ? 'text-white' : 'text-text'}`}>
          <MessageContent content={content} />
        </div>
        {timestamp && (
          <div className={`text-xs mt-1.5 ${isUser ? 'text-white/50' : 'text-text-muted/50'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  // Simple markdown-like rendering
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function flushList() {
    if (currentList.length > 0 && listType) {
      const Tag = listType;
      elements.push(
        <Tag key={elements.length} className={`${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 my-2 space-y-1`}>
          {currentList.map((item, i) => (
            <li key={i} className="text-text-muted">
              <InlineFormat text={item} />
            </li>
          ))}
        </Tag>
      );
      currentList = [];
      listType = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={i} className="text-base font-bold text-text mt-4 mb-1.5">{line.slice(4)}</h3>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={i} className="text-lg font-bold text-text mt-5 mb-2">{line.slice(3)}</h2>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={i} className="text-xl font-bold text-text mt-5 mb-2">{line.slice(2)}</h1>
      );
    }
    // Bullet lists
    else if (line.match(/^[-*] /)) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      currentList.push(line.slice(2));
    }
    // Numbered lists
    else if (line.match(/^\d+\. /)) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      currentList.push(line.replace(/^\d+\. /, ''));
    }
    // Horizontal rules
    else if (line.match(/^---+$/)) {
      flushList();
      elements.push(<hr key={i} className="border-border my-4" />);
    }
    // Empty lines
    else if (line.trim() === '') {
      flushList();
    }
    // Regular paragraphs
    else {
      flushList();
      elements.push(
        <p key={i} className="text-text-muted my-1.5">
          <InlineFormat text={line} />
        </p>
      );
    }
  }
  flushList();

  return <>{elements}</>;
}

function InlineFormat({ text }: { text: string }) {
  // Handle **bold**, *italic*, `code`, and emoji indicators
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|🟢|🟡|🟠|🔴|🌲|📈|🔥|💨|🎭|📍)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-text font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-surface-lighter px-1.5 py-0.5 rounded text-primary-light text-xs">{part.slice(1, -1)}</code>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-surface-light border border-border rounded-2xl rounded-bl-md px-5 py-4">
        <div className="flex gap-1.5">
          <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
          <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
          <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
        </div>
      </div>
    </div>
  );
}
