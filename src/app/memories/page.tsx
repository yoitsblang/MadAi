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
  business: 'text-red-400 border-red-500/20 bg-red-500/5',
  economics: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
  platform: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
  psychology: 'text-purple-400 border-purple-400/20 bg-purple-400/5',
  ethics: 'text-green-400 border-green-500/20 bg-green-500/5',
  market: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
  strategy: 'text-amber-500 border-amber-500/20 bg-amber-500/5',
  metrics: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
  progress: 'text-green-500 border-green-500/20 bg-green-500/5',
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

  if (loading) return <div className="min-h-screen bg-[#050507] flex items-center justify-center"><div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="text-zinc-600 hover:text-white"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-sm font-bold text-white">Sterling&apos;s Memory</h1>
              <p className="text-[10px] text-zinc-600">{memories.length} entries — what Sterling knows about you</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Search + Filter */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search memories..."
              className="w-full bg-[#12121a] border border-red-900/20 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/30" />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="bg-[#12121a] border border-red-900/20 rounded-xl px-3 py-2.5 text-xs text-zinc-500 focus:outline-none focus:border-red-500/30">
            <option value="all">All ({memories.length})</option>
            {categories.map(c => <option key={c} value={c}>{c} ({memories.filter(m => m.category === c).length})</option>)}
          </select>
        </div>

        {/* Memory List */}
        <div className="space-y-2">
          {filtered.map(m => (
            <div key={m.id} className="bg-[#12121a] border border-red-900/30 rounded-xl p-4 group hover:border-red-500/25 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white">{m.key.replace(/_/g, ' ')}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[m.category] || 'text-zinc-600 border-zinc-800 bg-[#050507]'}`}>
                      {m.category}
                    </span>
                  </div>
                  {editingId === m.id ? (
                    <div className="flex gap-2 mt-1">
                      <input value={editValue} onChange={e => setEditValue(e.target.value)}
                        className="flex-1 bg-[#050507] border border-red-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none" autoFocus />
                      <button onClick={() => handleSaveEdit(m.id)} className="text-green-500 p-1"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingId(null)} className="text-zinc-600 p-1"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 leading-relaxed">{m.value}</p>
                  )}
                  <p className="text-[9px] text-zinc-800 mt-1">{new Date(m.updatedAt).toLocaleDateString()}</p>
                </div>
                {editingId !== m.id && (
                  <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-[#111116] text-zinc-600 hover:text-white" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(m.id, m.key)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-600 hover:text-red-400" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-zinc-700 text-sm">
              {search ? 'No memories match your search.' : 'Sterling hasn\'t learned anything about you yet. Start a conversation!'}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
