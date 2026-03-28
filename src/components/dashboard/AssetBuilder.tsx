'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { FileText, Copy, Download, Loader2, ChevronDown, ChevronRight, Wand2 } from 'lucide-react';

const ASSET_TYPES = [
  { id: 'welcome-pdf', label: 'Welcome / Onboarding Doc', prompt: 'Create a professional welcome document for new customers. Include: what to expect, next steps, how to get help, and any key links. Make it warm but professional.' },
  { id: 'landing-copy', label: 'Landing Page Copy', prompt: 'Write complete landing page copy including: headline, subheadline, problem statement, solution, 3 key benefits, social proof section, FAQ section, and CTA. Make it conversion-focused.' },
  { id: 'email-sequence', label: 'Email Welcome Sequence', prompt: 'Write a 5-email welcome sequence. Email 1: Welcome + quick win. Email 2: Story + value. Email 3: Social proof. Email 4: Overcome objections. Email 5: Offer + CTA. Include subject lines.' },
  { id: 'offer-statement', label: 'Offer Positioning Statement', prompt: 'Write a clear, compelling offer positioning statement. Include: who it is for, what problem it solves, how it is different, and why now. Keep it to 2-3 paragraphs max.' },
  { id: 'lead-magnet', label: 'Lead Magnet Outline', prompt: 'Design a lead magnet that would attract my ideal customer. Include: title, subtitle, 5-7 content sections with descriptions, call to action, and how it connects to the paid offer.' },
  { id: 'sales-page', label: 'Sales Page Structure', prompt: 'Create a complete sales page wireframe with all sections: hook, problem agitation, solution reveal, features vs benefits, objection handling, pricing, guarantee, urgency, final CTA. Include copy for each section.' },
  { id: 'faq', label: 'FAQ Document', prompt: 'Write 10-15 frequently asked questions and answers that address the most common objections, concerns, and questions my target audience would have. Make the answers confident and clear.' },
  { id: 'social-hooks', label: '20 Social Media Hooks', prompt: 'Write 20 attention-grabbing social media hooks/opening lines that would stop my target audience from scrolling. Mix formats: questions, bold statements, numbers, stories, contrarian takes.' },
];

export default function AssetBuilder({ sessionId }: { sessionId: string }) {
  const [generating, setGenerating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  async function generateAsset(assetId: string, prompt: string) {
    setGenerating(assetId);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: `Based on everything you know about my business from our analysis, ${prompt}`,
          module: 'general',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResults(prev => ({ ...prev, [assetId]: data.reply || 'No content generated' }));
        setExpanded(assetId);
        toast.success('Asset generated');
      } else {
        toast.error('Generation failed');
      }
    } catch {
      toast.error('Something went wrong');
    }
    setGenerating(null);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  }

  function downloadAsText(name: string, text: string) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  }

  return (
    <div className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-5">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
        <Wand2 className="w-4 h-4 text-purple-400" /> Asset Builder
      </h3>
      <p className="text-[10px] text-zinc-700 mb-4">Generate marketing assets based on your business analysis. Each asset is tailored to your specific business.</p>

      <div className="space-y-2">
        {ASSET_TYPES.map(asset => {
          const hasResult = Boolean(results[asset.id]);
          const isGenerating = generating === asset.id;
          const isExpanded = expanded === asset.id;

          return (
            <div key={asset.id} className={`border rounded-xl overflow-hidden transition-all ${
              hasResult ? 'border-purple-500/20 bg-purple-500/[0.02]' : 'border-zinc-800/30'
            }`}>
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className={`w-4 h-4 flex-shrink-0 ${hasResult ? 'text-purple-400' : 'text-zinc-700'}`} />
                  <span className={`text-xs ${hasResult ? 'text-zinc-300' : 'text-zinc-500'}`}>{asset.label}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {hasResult && (
                    <>
                      <button onClick={() => copyToClipboard(results[asset.id])}
                        className="p-1 text-zinc-700 hover:text-white transition-colors" title="Copy">
                        <Copy className="w-3 h-3" />
                      </button>
                      <button onClick={() => downloadAsText(asset.id, results[asset.id])}
                        className="p-1 text-zinc-700 hover:text-white transition-colors" title="Download">
                        <Download className="w-3 h-3" />
                      </button>
                      <button onClick={() => setExpanded(isExpanded ? null : asset.id)}
                        className="p-1 text-zinc-600 hover:text-white transition-colors">
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                    </>
                  )}
                  {!hasResult && (
                    <button onClick={() => generateAsset(asset.id, asset.prompt)} disabled={isGenerating || generating !== null}
                      className="text-[10px] text-red-400 hover:text-red-300 px-2.5 py-1 rounded border border-red-500/20 hover:bg-red-500/5 transition-all disabled:opacity-20 flex items-center gap-1">
                      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      {isGenerating ? 'Working...' : 'Generate'}
                    </button>
                  )}
                </div>
              </div>
              {/* Preview */}
              {isExpanded && hasResult && (
                <div className="px-3 pb-3 animate-slide-up">
                  <div className="bg-[#050507] border border-zinc-800/30 rounded-lg p-3 max-h-64 overflow-y-auto">
                    <pre className="text-[11px] text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">{results[asset.id]}</pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
