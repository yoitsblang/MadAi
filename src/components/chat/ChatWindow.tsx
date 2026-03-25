'use client';

import React, { useRef, useEffect } from 'react';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import ChatInput from './ChatInput';
import { Brain } from 'lucide-react';
import type { ChatMessage as ChatMessageType, ModuleType } from '@/lib/types/business';

interface ChatWindowProps {
  messages: ChatMessageType[];
  onSend: (message: string) => void;
  isLoading: boolean;
  module: ModuleType;
  placeholder?: string;
}

export default function ChatWindow({ messages, onSend, isLoading, module, placeholder }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const filteredMessages = messages.filter(m => m.role !== 'system');

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {filteredMessages.length === 0 && !isLoading && (
          <WelcomeMessage module={module} onPromptClick={onSend} />
        )}
        {filteredMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role as 'user' | 'assistant'}
            content={msg.content}
            module={msg.module}
            timestamp={msg.timestamp}
          />
        ))}
        {isLoading && <TypingIndicator module={module} />}
      </div>

      {/* Input area */}
      <div className="border-t border-border px-4 py-4 bg-surface/80 backdrop-blur-sm">
        <ChatInput
          onSend={onSend}
          disabled={isLoading}
          placeholder={placeholder || getModulePlaceholder(module)}
        />
      </div>
    </div>
  );
}

function WelcomeMessage({ module, onPromptClick }: { module: ModuleType; onPromptClick: (msg: string) => void }) {
  const welcomes: Record<string, { title: string; subtitle: string; prompts: string[] }> = {
    'intake': {
      title: 'Welcome to MadAi',
      subtitle: 'Tell me about your business, idea, or what you\'re working on. I\'ll ask the right questions to build a complete picture — then we\'ll build your strategy.',
      prompts: [
        'I have an idea but I\'m not sure where to start',
        'I sell handmade candles on Etsy and want to grow',
        'I\'m a freelance developer trying to productize my services',
        'I run a local bakery and want to get more customers',
        'I\'m building a SaaS product for small businesses',
        'I want to start a coaching business from scratch',
      ],
    },
    'value-diagnosis': {
      title: 'Value Diagnosis',
      subtitle: 'Let\'s analyze what value you\'re actually creating, whether your framing does it justice, and where the hidden opportunities are.',
      prompts: ['Run a full value diagnosis', 'What am I really selling vs. what I think I\'m selling?', 'Is my pricing aligned with my value?', 'Where are my hidden value opportunities?'],
    },
    'business-logic': {
      title: 'Business Logic Analysis',
      subtitle: 'Analyzing your 5 core business processes (Value Creation, Marketing, Sales, Delivery, Finance) to find your biggest bottleneck.',
      prompts: ['Run the business health scorecard', 'Why aren\'t my sales growing?', 'Where\'s my weakest link?', 'Am I spending money in the right places?'],
    },
    'platform-power': {
      title: 'Platform Power Analysis',
      subtitle: 'Analyze your dependency on platforms and algorithms. Are you building a business or feeding someone else\'s digital estate?',
      prompts: ['How dependent am I on Instagram?', 'What\'s my platform sovereignty score?', 'How do I build owned demand?', 'What happens if the algorithm changes?'],
    },
    'psychology': {
      title: 'Psychological Strategy',
      subtitle: 'Deep psychological modeling for better framing — using psychology to communicate real value, not to manipulate.',
      prompts: ['What drives my audience\'s buying decisions?', 'How can I reduce purchase friction?', 'What emotional triggers should I use ethically?'],
    },
    'ethics': {
      title: 'Ethical Exchange Evaluation',
      subtitle: 'Evaluate any tactic or strategy for both effectiveness AND legitimacy.',
      prompts: ['Evaluate my current sales strategy', 'Is this marketing tactic ethical?', 'How do I sell aggressively without being manipulative?'],
    },
    'market-research': {
      title: 'Live Market Research',
      subtitle: 'Real-time research on competitors, trends, audience behavior, and market conditions using live data.',
      prompts: ['Research my top competitors', 'What are the trends in my market right now?', 'What\'s my audience saying online?', 'What are the pricing patterns in my space?'],
    },
    'strategy-macro': {
      title: 'Macro Strategy',
      subtitle: 'Big-picture strategy: business model, positioning, market selection, pricing philosophy, competitive moat.',
      prompts: ['Design my overall business strategy', 'How should I position against competitors?', 'What\'s my competitive moat?'],
    },
    'strategy-meso': {
      title: 'Campaign Strategy',
      subtitle: 'Mid-level strategy: campaigns, funnels, offer bundles, content pillars, launch sequencing.',
      prompts: ['Design a launch campaign', 'Build my content pillars', 'Create a funnel strategy', 'Plan my email sequence'],
    },
    'strategy-micro': {
      title: 'Execution Playbook',
      subtitle: 'Specific execution items: exact posts, headlines, hooks, CTAs, daily plans, test matrices.',
      prompts: ['Write me 10 Instagram hooks', 'Create my weekly content plan', 'Write a sales page outline', 'Give me 5 ad angles to test'],
    },
    'innovation': {
      title: 'Innovation Lab',
      subtitle: 'Cross-industry tactics, hybrid strategies, and novel approaches nobody in your space is using yet.',
      prompts: ['What are unusual strategies for my business?', 'Cross-pollinate from another industry', 'Generate novel monetization ideas'],
    },
    'teaching': {
      title: 'Strategic Education',
      subtitle: 'Understand WHY strategies work, not just WHAT to do. Learn the principles behind every recommendation.',
      prompts: ['Explain why this strategy works', 'What principle is behind this recommendation?', 'Teach me about pricing psychology'],
    },
    'general': {
      title: 'Strategic Intelligence',
      subtitle: 'Ask me anything about your business strategy, marketing, positioning, or execution. I have full context on your business.',
      prompts: ['Help me figure out my next move', 'What should I prioritize this week?', 'Review my current approach', 'What am I missing?'],
    },
  };

  const w = welcomes[module] || welcomes['general'];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-16">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
        <Brain className="w-8 h-8 text-primary-light" />
      </div>
      <h2 className="text-2xl font-bold text-text mb-2">{w.title}</h2>
      <p className="text-text-muted max-w-md mb-8">{w.subtitle}</p>
      <div className="flex flex-wrap gap-2 justify-center max-w-lg">
        {w.prompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => onPromptClick(prompt)}
            className="text-xs bg-surface-light border border-border rounded-lg px-3 py-2
              text-text-muted hover:text-text hover:border-primary/50 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function getModulePlaceholder(module: ModuleType): string {
  const placeholders: Record<string, string> = {
    'intake': 'Tell me about your business or idea...',
    'value-diagnosis': 'Ask about your value proposition...',
    'business-logic': 'Ask about your business health...',
    'platform-power': 'Ask about platform dependency...',
    'market-research': 'What do you want to research?',
    'psychology': 'Ask about audience psychology...',
    'ethics': 'Evaluate a tactic or strategy...',
    'strategy-macro': 'Ask about big-picture strategy...',
    'strategy-meso': 'Ask about campaigns and funnels...',
    'strategy-micro': 'Ask for specific execution items...',
    'timing': 'Ask about timing and context...',
    'innovation': 'Ask for novel strategy ideas...',
    'teaching': 'Ask why something works...',
    'general': 'Ask anything about your business...',
  };
  return placeholders[module] || 'Type your message...';
}
