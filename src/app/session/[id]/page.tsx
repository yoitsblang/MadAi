'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/ui/Sidebar';
import ModuleHeader from '@/components/ui/ModuleHeader';
import ChatWindow from '@/components/chat/ChatWindow';
import type { ModuleType, EthicalStance, ChatMessage } from '@/lib/types/business';
import { MODULE_INFO } from '@/lib/types/business';

const mobileModuleGroups = [
  { label: '•', modules: ['intake', 'value-diagnosis', 'business-logic'] as ModuleType[] },
  { label: '•', modules: ['platform-power', 'market-research', 'psychology', 'ethics'] as ModuleType[] },
  { label: '•', modules: ['strategy-macro', 'strategy-meso', 'strategy-micro'] as ModuleType[] },
  { label: '•', modules: ['timing', 'innovation', 'teaching', 'general'] as ModuleType[] },
];

interface DbSession {
  id: string;
  name: string;
  profileJson: string;
  activeModule: string;
  intakeComplete: boolean;
  messages: DbMessage[];
  valueDiagnosisJson?: string;
  healthScoreJson?: string;
  platformJson?: string;
  strategyJson?: string;
}

interface DbMessage {
  id: string;
  role: string;
  content: string;
  module: string;
  createdAt: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [session, setSession] = useState<DbSession | null>(null);
  const [profile, setProfile] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load session from DB
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${id}`);
        if (!res.ok) {
          router.push('/');
          return;
        }
        const data = await res.json();
        setSession(data);
        try {
          setProfile(JSON.parse(data.profileJson || '{}'));
        } catch { setProfile({}); }
      } catch {
        router.push('/');
      }
      setInitialLoading(false);
    }
    load();
  }, [id, router]);

  const handleModuleChange = useCallback(async (module: ModuleType) => {
    if (!session) return;
    setSession(prev => prev ? { ...prev, activeModule: module } : null);
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activeModule: module }),
    });
  }, [session, id]);

  const handleStanceChange = useCallback(async (stance: EthicalStance) => {
    const updatedProfile = { ...profile, ethicalStance: stance };
    setProfile(updatedProfile);
    await fetch(`/api/sessions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileJson: JSON.stringify(updatedProfile) }),
    });
  }, [profile, id]);

  const buildBusinessContext = useCallback(() => {
    const p = profile;
    const parts: string[] = [];
    const fields = ['name', 'description', 'businessType', 'stage', 'offering', 'targetAudience',
      'audiencePain', 'audienceDesire', 'pricePoint', 'currentTraction', 'availableAssets',
      'geographicScope', 'budget', 'timeAvailable', 'primaryGoal', 'brandPersonality', 'ethicalBoundaries'];

    for (const field of fields) {
      if (p[field]) parts.push(`${field}: ${p[field]}`);
    }
    if (Array.isArray(p.currentChannels) && p.currentChannels.length) {
      parts.push(`Current Channels: ${(p.currentChannels as string[]).join(', ')}`);
    }
    return parts.join('\n') || 'Business details not yet established.';
  }, [profile]);

  const handleSend = useCallback(async (message: string) => {
    if (!session || isLoading) return;
    setIsLoading(true);

    // Optimistically add user message to UI
    const tempUserMsg: DbMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      module: session.activeModule,
      createdAt: new Date().toISOString(),
    };
    setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempUserMsg] } : null);

    try {
      // Save user message to DB
      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: message, module: session.activeModule }),
      });

      // Get AI response
      const recentMessages = session.messages
        .filter(m => m.role !== 'system')
        .slice(-19)
        .concat(tempUserMsg)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const aiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: recentMessages,
          module: session.activeModule,
          businessContext: buildBusinessContext(),
          ethicalStance: (profile.ethicalStance as string) || 'balanced',
        }),
      });

      if (!aiRes.ok) {
        const err = await aiRes.json();
        throw new Error(err.error || 'Failed to get response');
      }

      const aiData = await aiRes.json();

      // Save AI response to DB
      await fetch(`/api/sessions/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'assistant', content: aiData.response, module: session.activeModule }),
      });

      const tempAiMsg: DbMessage = {
        id: `temp-ai-${Date.now()}`,
        role: 'assistant',
        content: aiData.response,
        module: session.activeModule,
        createdAt: new Date().toISOString(),
      };
      setSession(prev => prev ? { ...prev, messages: [...prev.messages, tempAiMsg] } : null);

      // Check if intake profile summary was generated
      if (session.activeModule === 'intake' && aiData.response.includes('BUSINESS PROFILE SUMMARY')) {
        const nameMatch = aiData.response.match(/Business:\s*(.+)/);
        const offeringMatch = aiData.response.match(/Offering:\s*(.+)/);
        const updates: Record<string, unknown> = { intakeComplete: true };
        if (nameMatch) updates.name = nameMatch[1].trim();

        const updatedProfile = { ...profile };
        if (nameMatch) updatedProfile.name = nameMatch[1].trim();
        if (offeringMatch) updatedProfile.offering = offeringMatch[1].trim();
        updates.profileJson = JSON.stringify(updatedProfile);

        setSession(prev => prev ? { ...prev, intakeComplete: true, name: (updates.name as string) || prev.name } : null);
        setProfile(updatedProfile);

        await fetch(`/api/sessions/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Something went wrong';
      const errDbMsg: DbMessage = {
        id: `temp-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${errMsg}. Please try again.`,
        module: session.activeModule,
        createdAt: new Date().toISOString(),
      };
      setSession(prev => prev ? { ...prev, messages: [...prev.messages, errDbMsg] } : null);
    } finally {
      setIsLoading(false);
    }
  }, [session, isLoading, id, buildBusinessContext, profile]);

  if (initialLoading || !session) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-text-muted">Loading session...</div>
      </div>
    );
  }

  // Convert DB messages to ChatMessage format
  const chatMessages: ChatMessage[] = session.messages.map(m => ({
    id: m.id,
    role: m.role as 'user' | 'assistant' | 'system',
    content: m.content,
    module: m.module as ModuleType,
    timestamp: m.createdAt,
  }));

  const activeModule = session.activeModule as ModuleType;

  function handleExport(format: 'md' | 'json') {
    const url = `/api/sessions/${id}/export?format=${format}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session?.name || 'session'}.${format === 'md' ? 'md' : 'json'}`;
    a.click();
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar - hidden on mobile, shown on desktop */}
      <div className="hidden md:block">
        <Sidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          intakeComplete={session.intakeComplete}
          sessionName={session.name || undefined}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile nav bar - shows all modules with horizontal scroll */}
        <div className="md:hidden border-b border-border">
          <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-none">
            <a href="/" className="text-text-muted hover:text-text px-2 py-1 flex-shrink-0 text-lg">←</a>
            {mobileModuleGroups.map((group) => (
              <React.Fragment key={group.label}>
                <span className="text-[8px] text-text-muted/40 uppercase tracking-wider px-1 flex-shrink-0">{group.label}</span>
                {group.modules.map(mod => {
                  const info = MODULE_INFO[mod];
                  const isLocked = mod !== 'intake' && mod !== 'general' && !session.intakeComplete;
                  return (
                    <button
                      key={mod}
                      onClick={() => !isLocked && handleModuleChange(mod)}
                      disabled={isLocked}
                      className={`text-[10px] px-2 py-1.5 rounded-full whitespace-nowrap flex-shrink-0 transition-colors flex items-center gap-1
                        ${activeModule === mod ? 'bg-primary/20 text-primary-light font-medium' : 'text-text-muted'}
                        ${isLocked ? 'opacity-30' : ''}`}
                    >
                      <span className="text-xs">{info.icon}</span>
                      {info.label}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
            {/* Export buttons */}
            <button onClick={() => handleExport('md')} className="text-[10px] px-2 py-1.5 text-text-muted hover:text-text flex-shrink-0">
              📄
            </button>
            <button onClick={() => handleExport('json')} className="text-[10px] px-2 py-1.5 text-text-muted hover:text-text flex-shrink-0">
              📋
            </button>
          </div>
          {/* Progress bar showing strategy journey */}
          {session.intakeComplete && (
            <div className="px-3 pb-2">
              <div className="h-1 bg-surface-light rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent-green rounded-full transition-all"
                  style={{ width: `${Math.min(100, (session.messages.length / 20) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div className="flex-1">
            <ModuleHeader
              module={activeModule}
              ethicalStance={(profile.ethicalStance as EthicalStance) || 'balanced'}
              onStanceChange={handleStanceChange}
            />
          </div>
          {/* Desktop export */}
          <div className="hidden md:flex items-center gap-1 pr-4">
            <button onClick={() => handleExport('md')}
              className="text-xs text-text-muted hover:text-text px-2 py-1 transition-colors" title="Export Markdown">
              📄 .md
            </button>
            <button onClick={() => handleExport('json')}
              className="text-xs text-text-muted hover:text-text px-2 py-1 transition-colors" title="Export JSON">
              📋 .json
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={chatMessages.filter(
              m => m.module === activeModule || activeModule === 'general'
            )}
            onSend={handleSend}
            isLoading={isLoading}
            module={activeModule}
          />
        </div>
      </div>
    </div>
  );
}
