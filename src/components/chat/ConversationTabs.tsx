'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ConversationTab {
  id: string;
  title: string;
  module?: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ConversationTabsProps {
  conversations: ConversationTab[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export default function ConversationTabs({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: ConversationTabsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  function startRename(id: string, currentTitle: string) {
    setEditingId(id);
    setEditValue(currentTitle);
  }

  function commitRename() {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (window.confirm('Delete this conversation and all its messages?')) {
      onDelete(id);
    }
  }

  function truncate(str: string, max: number) {
    return str.length > max ? str.slice(0, max) + '...' : str;
  }

  const tabs = conversations.length > 0 ? conversations : null;

  return (
    <div className="flex items-center border-b border-border bg-surface/60 backdrop-blur-sm px-2 py-1.5 gap-1 overflow-x-auto scrollbar-none"
      ref={scrollRef}
    >
      {tabs ? (
        tabs.map((conv) => {
          const isActive = conv.id === activeId;
          const isEditing = editingId === conv.id;
          const isHovered = hoveredId === conv.id;
          const msgCount = conv._count?.messages ?? 0;

          return (
            <button
              key={conv.id}
              onClick={() => !isEditing && onSelect(conv.id)}
              onDoubleClick={() => startRename(conv.id, conv.title)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                whitespace-nowrap transition-all duration-150 shrink-0 max-w-[200px]
                ${isActive
                  ? 'bg-primary/15 border border-primary/40 text-primary shadow-sm'
                  : 'bg-surface/40 border border-transparent text-muted hover:bg-surface/80 hover:text-foreground'
                }
              `}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') commitRename();
                    if (e.key === 'Escape') { setEditingId(null); setEditValue(''); }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent border-none outline-none text-xs w-full min-w-[60px] text-foreground"
                  maxLength={100}
                />
              ) : (
                <span className="truncate">{truncate(conv.title, 20)}</span>
              )}

              {msgCount > 0 && !isEditing && (
                <span className={`
                  text-[10px] px-1.5 py-0.5 rounded-full leading-none
                  ${isActive ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'}
                `}>
                  {msgCount}
                </span>
              )}

              {isHovered && !isEditing && (
                <span
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="ml-0.5 text-muted hover:text-red-400 transition-colors cursor-pointer text-[10px] leading-none"
                  title="Delete conversation"
                >
                  x
                </span>
              )}
            </button>
          );
        })
      ) : (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/15 border border-primary/40 text-primary">
          Default
        </span>
      )}

      {/* Create new conversation button */}
      <button
        onClick={onCreate}
        className="flex items-center justify-center w-6 h-6 rounded-full text-muted hover:text-primary hover:bg-primary/10 transition-colors shrink-0 text-sm font-bold"
        title="New conversation"
      >
        +
      </button>
    </div>
  );
}
