'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Edit3, Check, X, Search } from 'lucide-react';

interface Memory {
  id: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  business: 'text-primary border-primary/20 bg-primary/5',
  economics: 'text-accent-gold border-accent-gold/20 bg-accent-gold/5',
  platform: 'text-accent-blue border-accent-blue/20 bg-accent-blue/5',
  psychology: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
  ethics: 'text-accent-green border-accent-green/20 bg-accent-green/5',
  market: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  strategy: 'text-accent-amber border-accent-amber/20 bg-accent-amber/5',
  metrics: 'text-accent-gold border-accent-gold/20 bg-accent-gold/5',
  progress: 'text-accent-green border-accent-green/20 bg-accent-green/5',
};

export default function MemoriesPage() {
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/memory').then(r => r.ok ? r.json() : []).then(d => { setMemories(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const categories = [...new Set(memories.map(m => m.category))].sort();

  const filtered = memories.filter(m => {
    if (filter !== 'all' && m.category !== filter) return false;
    if (search && !m.key.toLowerCase().includes(search.toLowerCase()) && !m.value.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  async function handleDelete(id: string, key: string) {
    if (!confirm(`Delete memory "${key}"?`)) return;
    await fetch(`/api/memory?key=${encodeURIComponent(key)}`, { method: 'DELETE' });
    setMemories(prev => prev.filter(m => m.id !== id));
  }

  async function handleSaveEdit(id: string) {
    await fetch('/api/memory', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, value: editValue }) });
    setMemories(prev => prev.map(m => m.id === id ? { ...m, value: editValue } : m));
    setEditingId(null);
  }

  function startEdit(m: Memory) {
    setEditingId(m.id);
    setEditValue(m.value);
  }

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-surface bg-grid">
      <header className="border-b border-border glass-strong sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-text-muted hover:text-text"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-bold text-text">Sterling's Memory</h1>
              <p className="text-[10px] text-text-muted">{memories.length} entries — what Sterling knows about you</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/40" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memories..."
              className="w-full bg-surface-light border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-text placeholder:text-text-muted/40 focus:outline-none focus:border-primary" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-surface-light border border-border rounded-xl px-3 py-2.5 text-xs text-text-muted focus:outline-none focus:border-primary">
            <option value="all">All ({memories.length})</option>
            {categories.map(c => <option key={c} value={c}>{c} ({memories.filter(m => m.category === c).length})</option>)}
          </select>
        </div>

        {/* Memory List */}
        <div className="space-y-2">
          {filtered.map(m => (
            <div key={m.id} className="glass rounded-xl p-4 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-text">{m.key.replace(/_/g, ' ')}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[m.category] || 'text-text-muted border-border bg-surface'}`}>
                      {m.category}
                    </span>
                  </div>
                  {editingId === m.id ? (
                    <div className="flex gap-2 mt-1">
                      <input value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="flex-1 bg-surface border border-primary/30 rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none" autoFocus />
                      <button onClick={() => handleSaveEdit(m.id)} className="text-accent-green p-1"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="text-text-muted p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted leading-relaxed">{m.value}</p>
                  )}
                  <p className="text-[9px] text-text-muted/30 mt-1">{new Date(m.updatedAt).toLocaleDateString()}</p>
                </div>
                {editingId !== m.id && (
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-surface-light text-text-muted hover:text-text" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(m.id, m.key)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-text-muted/40 text-sm">
              {search ? 'No memories match your search.' : 'Sterling hasn\'t learned anything about you yet. Start a conversation!'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
