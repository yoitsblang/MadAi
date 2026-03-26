'use client';

import React from 'react';

import ModificationApproval, { parseModifications, stripModificationBlocks, type Modification } from '@/components/ui/ModificationApproval';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  module?: string;
  timestamp?: string;
  onApproveModifications?: (mods: Modification[]) => void;
  onRejectModifications?: () => void;
}

// Strip emojis and the STAGE_COMPLETE signal block from displayed content
function sanitizeContent(content: string): string {
  // Remove STAGE_COMPLETE blocks (between --- markers)
  let cleaned = content.replace(/\n*---\s*\n\[STAGE_COMPLETE:[^\]]+\][^\n]*\nNext:[^\n]+\n---/g, '');
  // Remove standalone STAGE_COMPLETE markers
  cleaned = cleaned.replace(/\[STAGE_COMPLETE:[^\]]+\]/g, '');
  // Strip emojis
  cleaned = cleaned.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FA9F}\u{1FAA0}-\u{1FAFF}\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2614}-\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '');
  return cleaned.trim();
}

export default function ChatMessage({ role, content, module, timestamp, onApproveModifications, onRejectModifications }: ChatMessageProps) {
  const isUser = role === 'user';
  const rawContent = isUser ? content : sanitizeContent(content);
  const modifications = !isUser ? parseModifications(rawContent) : [];
  const displayContent = modifications.length > 0 ? stripModificationBlocks(rawContent) : rawContent;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? 'bg-gradient-to-r from-red-700 to-red-600 text-white rounded-br-md'
            : 'bg-surface-light border border-border rounded-bl-md'
        }`}
      >
        {!isUser && module && module !== 'general' && (
          <div className="text-[10px] text-accent-gold/70 font-semibold mb-2 uppercase tracking-widest border-b border-border/40 pb-1.5">
            {module.replace(/-/g, ' ')}
          </div>
        )}
        <div className={`prose max-w-none text-sm leading-relaxed ${isUser ? 'text-white' : 'text-text'}`}>
          <MessageContent content={displayContent} isUser={isUser} />
        </div>
        {modifications.length > 0 && onApproveModifications && (
          <ModificationApproval
            modifications={modifications}
            onApprove={onApproveModifications}
            onReject={onRejectModifications || (() => {})}
          />
        )}
        {timestamp && (
          <div className={`text-xs mt-1.5 ${isUser ? 'text-white/50' : 'text-text-muted/50'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
}

// Status label colors
const STATUS_LABELS: Record<string, string> = {
  '[STRONG]': 'bg-green-500/15 text-green-400 border-green-500/30',
  '[WEAK]': 'bg-red-500/15 text-red-400 border-red-500/30',
  '[RISK]': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  '[OPPORTUNITY]': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  '[ACTION]': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  '[WARNING]': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  '[CRITICAL]': 'bg-red-600/15 text-red-300 border-red-600/30',
  '[HIGH]': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  '[MEDIUM]': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  '[LOW]': 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  '[PRIORITY]': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  '[DECISION]': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  '[BOTTLENECK]': 'bg-red-500/15 text-red-400 border-red-500/30',
  '[FLAW]': 'bg-red-600/15 text-red-300 border-red-600/30',
  '[BLIND SPOT]': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  '[ASSUMPTION]': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  '[DELUSION]': 'bg-red-500/15 text-red-300 border-red-500/30',
  '[FAILURE MODE]': 'bg-red-700/15 text-red-200 border-red-700/30',
  '[SKEPTIC]': 'bg-gray-500/15 text-gray-300 border-gray-500/30',
  // Ethics module verdicts
  '[GREEN]': 'bg-green-500/15 text-green-400 border-green-500/30',
  '[YELLOW]': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  '[ORANGE]': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  '[RED]': 'bg-red-500/15 text-red-400 border-red-500/30',
  '[LEGITIMATE]': 'bg-green-500/15 text-green-400 border-green-500/30',
  '[MANIPULATIVE]': 'bg-red-600/15 text-red-300 border-red-600/30',
  '[BORDERLINE]': 'bg-yellow-600/15 text-yellow-300 border-yellow-600/30',
  // Research trend labels
  '[EVERGREEN]': 'bg-green-700/15 text-green-300 border-green-700/30',
  '[DURABLE SHIFT]': 'bg-blue-600/15 text-blue-300 border-blue-600/30',
  '[HOT TREND]': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  '[TEMPORARY FAD]': 'bg-gray-600/15 text-gray-300 border-gray-600/30',
  '[MANUFACTURED HYPE]': 'bg-red-400/15 text-red-300 border-red-400/30',
  '[LOCAL OPPORTUNITY]': 'bg-teal-600/15 text-teal-300 border-teal-600/30',
  // Timing labels
  '[NOW]': 'bg-green-500/15 text-green-400 border-green-500/30',
  '[WAIT]': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  '[TAILWIND]': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  '[HEADWIND]': 'bg-orange-600/15 text-orange-300 border-orange-600/30',
  '[DEADLINE]': 'bg-red-500/15 text-red-400 border-red-500/30',
  // Moat/growth labels
  '[HEALTHY]': 'bg-green-500/15 text-green-400 border-green-500/30',
  '[QUICK WIN]': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  '[LONG GAME]': 'bg-purple-600/15 text-purple-300 border-purple-600/30',
  '[WILD CARD]': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  '[HIGH POTENTIAL]': 'bg-green-600/15 text-green-300 border-green-600/30',
  '[PRIMARY DRIVER]': 'bg-primary/15 text-primary-light border-primary/30',
};

function MessageContent({ content, isUser }: { content: string; isUser?: boolean }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  function flushList() {
    if (currentList.length > 0 && listType) {
      const Tag = listType;
      const listKey = `list-${elements.length}`;
      elements.push(
        <Tag key={listKey} className={`${listType === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 my-2 space-y-1`}>
          {currentList.map((item, i) => (
            <li key={`${listKey}-${i}`} className={isUser ? 'text-white/90' : 'text-text-muted'}>
              <InlineFormat text={item} isUser={isUser} />
            </li>
          ))}
        </Tag>
      );
      currentList = [];
      listType = null;
    }
  }

  // Check if this looks like a table row
  function isTableRow(line: string) {
    return line.trim().startsWith('|') && line.trim().endsWith('|');
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const k = `ln${i}`; // unique key per line

    // Table detection
    if (isTableRow(line)) {
      flushList();
      const tableLines: string[] = [];
      const tableStart = i;
      while (i < lines.length && (isTableRow(lines[i]) || lines[i].match(/^\s*\|?[\s-]+\|/))) {
        tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length > 0) {
        elements.push(<TableBlock key={`tbl${tableStart}`} lines={tableLines} />);
      }
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={k} className={`text-sm font-bold mt-4 mb-1.5 ${isUser ? 'text-white' : 'text-text'} uppercase tracking-wide`}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={k} className={`text-base font-bold mt-5 mb-2 ${isUser ? 'text-white' : 'text-text'} border-b ${isUser ? 'border-white/20' : 'border-border'} pb-1`}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={k} className={`text-lg font-bold mt-5 mb-2 ${isUser ? 'text-white' : 'text-text'}`}>
          {line.slice(2)}
        </h1>
      );
    }
    // Callout blocks — lines starting with status labels
    else if (Object.keys(STATUS_LABELS).some(label => line.trim().startsWith(label))) {
      flushList();
      const matchedLabel = Object.keys(STATUS_LABELS).find(label => line.trim().startsWith(label));
      if (matchedLabel) {
        const rest = line.trim().slice(matchedLabel.length).replace(/^[\s:/—-]+/, '');
        elements.push(
          <div key={k} className={`flex items-start gap-2 my-1.5 px-3 py-2 rounded-lg border text-xs ${STATUS_LABELS[matchedLabel]}`}>
            <span className="font-bold font-mono text-[10px] tracking-wider flex-shrink-0 mt-0.5">
              {matchedLabel.replace(/[\[\]]/g, '')}
            </span>
            <span className="leading-relaxed"><InlineFormat text={rest} isUser={isUser} /></span>
          </div>
        );
      }
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
    else if (line.match(/^---+$/) || line.match(/^===+$/)) {
      flushList();
      elements.push(<hr key={k} className={`${isUser ? 'border-white/20' : 'border-border'} my-4`} />);
    }
    // Empty lines
    else if (line.trim() === '') {
      flushList();
    }
    // Regular paragraphs
    else {
      flushList();
      elements.push(
        <p key={k} className={`my-1.5 ${isUser ? 'text-white/90' : 'text-text-muted'}`}>
          <InlineFormat text={line} isUser={isUser} />
        </p>
      );
    }
    i++;
  }
  flushList();

  return <>{elements}</>;
}

function TableBlock({ lines }: { lines: string[] }) {
  const rows = lines
    .filter(l => !l.match(/^\s*\|?[\s-]+\|/)) // skip separator rows
    .map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));

  if (rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="overflow-x-auto my-3 rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-surface border-b border-border">
            {header.map((cell, i) => (
              <th key={i} className="px-3 py-2 text-left text-text font-semibold">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri} className={`border-b border-border/50 ${ri % 2 === 0 ? 'bg-surface-light/30' : ''}`}>
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-text-muted">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineFormat({ text, isUser }: { text: string; isUser?: boolean }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className={`font-semibold ${isUser ? 'text-white' : 'text-text'}`}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i} className="bg-surface-lighter px-1.5 py-0.5 rounded text-primary-light text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

export function TypingIndicator({ module }: { module?: string }) {
  const labels: Record<string, string> = {
    'intake': 'Understanding your business...',
    'value-diagnosis': 'Diagnosing value...',
    'business-logic': 'Running health scorecard...',
    'platform-power': 'Mapping platform dependencies...',
    'market-research': 'Researching your market...',
    'psychology': 'Modeling audience psychology...',
    'ethics': 'Evaluating ethical dimensions...',
    'strategy-macro': 'Building macro strategy...',
    'strategy-meso': 'Designing campaign strategy...',
    'strategy-micro': 'Crafting execution plan...',
    'timing': 'Analyzing timing factors...',
    'innovation': 'Generating novel approaches...',
    'teaching': 'Preparing explanation...',
    'general': 'Thinking...',
  };
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-surface-light border border-border rounded-2xl rounded-bl-md px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
            <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
            <span className="typing-dot w-2 h-2 bg-primary-light rounded-full" />
          </div>
          <span className="text-xs text-text-muted/60 animate-pulse">
            {labels[module || 'general'] || 'Thinking...'}
          </span>
        </div>
      </div>
    </div>
  );
}
