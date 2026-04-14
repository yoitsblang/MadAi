'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { STRATEGY_TEMPLATES, type TemplateType } from '@/lib/templates';
import { ModuleIcon } from '@/lib/icons';

const CATEGORY_LABELS: Record<TemplateType['category'], string> = {
  research: 'Research',
  planning: 'Planning',
  optimization: 'Optimization',
  branding: 'Branding',
};

export default function TemplatesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<TemplateType['category'] | 'all'>('all');
  const [launching, setLaunching] = useState<string | null>(null);

  const filtered = STRATEGY_TEMPLATES.filter((t) => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.tags.some((tag) => tag.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const categories: (TemplateType['category'] | 'all')[] = [
    'all',
    'research',
    'planning',
    'optimization',
    'branding',
  ];

  async function launchTemplate(template: TemplateType) {
    if (launching) return;
    setLaunching(template.id);

    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: template.name }),
      });

      if (!res.ok) {
        setLaunching(null);
        return;
      }

      const session = await res.json();

      await fetch(`/api/sessions/${session.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'user', content: template.starterPrompt, module: 'intake' }),
      });

      router.push(`/session/${session.id}`);
    } catch {
      setLaunching(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-600 hover:text-white transition-colors">
              &larr;
            </a>
            <div>
              <h1 className="text-lg font-bold text-white">Strategy Templates</h1>
              <p className="text-xs text-zinc-600">
                Pick a template to jumpstart your strategy session
              </p>
            </div>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="bg-[#12121a] border border-red-900/20 rounded-lg px-3 py-1.5 text-sm text-white
              placeholder:text-zinc-700 w-64 focus:outline-none focus:border-red-500/30"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Category filter tabs */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${
                  activeCategory === cat
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'text-zinc-600 hover:bg-[#12121a] hover:text-white border border-transparent'
                }`}
            >
              {cat === 'all' ? 'All' : CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((template) => (
            <button
              key={template.id}
              onClick={() => launchTemplate(template)}
              disabled={launching !== null}
              className="bg-[#12121a] border border-red-900/30 rounded-xl p-5 text-left
                hover:border-red-500/30 transition-all group relative overflow-hidden
                disabled:opacity-60 disabled:cursor-wait"
            >
              <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
              <div className="flex items-start gap-3 mb-3">
                <ModuleIcon name={template.icon} className="w-6 h-6 text-red-400" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors">
                    {template.name}
                  </h3>
                  <span className="text-xs text-zinc-600">{CATEGORY_LABELS[template.category]}</span>
                </div>
                {launching === template.id && (
                  <span className="text-xs text-red-400 animate-pulse">Starting...</span>
                )}
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed mb-3">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-[#050507] border border-red-900/10 text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-600">
            No templates match your search.
          </div>
        )}
      </div>
    </div>
  );
}
