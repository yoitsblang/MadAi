'use client';

import React, { useState } from 'react';
import {
  Globe, Mail, Plus, Users, DollarSign, BarChart2,
  MessageCircle, Video, Hash, Share2,
} from 'lucide-react';

interface Channel {
  id: string;
  platform: string;
  followers?: number;
  engagement?: number;
  posts?: number;
  revenue?: number;
}

interface ChannelTrackerProps {
  channels: Channel[];
  onAdd: (platform: string) => void;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  instagram: <Share2 className="w-5 h-5" />,
  youtube: <Video className="w-5 h-5" />,
  twitter: <MessageCircle className="w-5 h-5" />,
  linkedin: <Hash className="w-5 h-5" />,
  tiktok: <BarChart2 className="w-5 h-5" />,
  reddit: <MessageCircle className="w-5 h-5" />,
  deviantart: <Share2 className="w-5 h-5" />,
  fanvue: <Users className="w-5 h-5" />,
};

const PLATFORMS = ['Website', 'Email', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn', 'TikTok', 'Other'];

function formatMetric(value: number | undefined): string {
  if (value === undefined || value === null) return '--';
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default function ChannelTracker({ channels, onAdd }: ChannelTrackerProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0]);

  function handleAdd() {
    onAdd(selectedPlatform.toLowerCase());
    setShowAdd(false);
  }

  return (
    <div className="glass p-6 animate-slide-up">
      <h2 className="text-sm font-bold text-text uppercase tracking-wider mb-4">Channels</h2>

      {channels.length === 0 && !showAdd ? (
        <div className="text-center py-8">
          <Globe className="w-8 h-8 text-text-muted/30 mx-auto mb-3" />
          <p className="text-sm text-text-muted mb-3">Track your platforms</p>
          <button
            onClick={() => setShowAdd(true)}
            className="text-xs text-primary-light hover:text-primary-light/80 transition-colors"
          >
            Add a channel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {channels.map((channel) => {
            const icon = PLATFORM_ICONS[channel.platform.toLowerCase()] || <Globe className="w-5 h-5" />;
            const primaryMetric = channel.revenue !== undefined
              ? { label: 'Revenue', value: `$${formatMetric(channel.revenue)}` }
              : { label: 'Followers', value: formatMetric(channel.followers) };

            return (
              <div
                key={channel.id}
                className="bg-white/[0.03] border border-border/40 rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <div className="text-text-muted mb-2">{icon}</div>
                <h3 className="text-xs font-semibold text-text capitalize mb-2">{channel.platform}</h3>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {channel.revenue !== undefined
                      ? <DollarSign className="w-3 h-3 text-accent-green" />
                      : <Users className="w-3 h-3 text-primary-light" />
                    }
                    <span className="text-xs text-text-muted">{primaryMetric.label}</span>
                    <span className="text-xs font-semibold text-text ml-auto">{primaryMetric.value}</span>
                  </div>
                  {channel.engagement !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <BarChart2 className="w-3 h-3 text-accent-amber" />
                      <span className="text-xs text-text-muted">Engagement</span>
                      <span className="text-xs font-semibold text-text ml-auto">{channel.engagement}%</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add Channel Card */}
          <button
            onClick={() => setShowAdd(true)}
            className="border border-dashed border-border/60 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-white/[0.02] transition-all text-text-muted hover:text-primary-light min-h-[120px]"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Add Channel</span>
          </button>
        </div>
      )}

      {/* Add Channel Form */}
      {showAdd && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-3">
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button
            onClick={handleAdd}
            className="text-xs bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 font-medium transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setShowAdd(false)}
            className="text-xs text-text-muted hover:text-text px-2 py-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
