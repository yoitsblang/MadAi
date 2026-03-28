'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft, ArrowRight, ChevronRight, Check,
  Crosshair, TrendingUp, Shield, Zap, Brain, Target,
  Beaker, Sword, Lightbulb, Clock,
} from 'lucide-react';

const STEPS = ['Business', 'Inputs', 'Goal', 'Constraints', 'AI Mode'];

const BUSINESS_STAGES = ['Idea', 'Pre-launch', 'Validation', 'Growth', 'Scale', 'Pivot'];
const GOALS = [
  { id: 'diagnose', label: 'Diagnose the bottleneck', icon: Crosshair, desc: 'Find what\'s actually limiting growth' },
  { id: 'marketing', label: 'Improve marketing', icon: TrendingUp, desc: 'Get more leads, better conversion' },
  { id: 'launch', label: 'Build a launch plan', icon: Zap, desc: 'Go-to-market strategy and sprint' },
  { id: 'conversion', label: 'Fix conversion', icon: Target, desc: 'More visitors becoming buyers' },
  { id: 'retention', label: 'Fix retention', icon: Shield, desc: 'Keep customers coming back' },
  { id: 'sprint', label: 'Build a weekly sprint', icon: Clock, desc: '7-day execution plan' },
  { id: 'critique', label: 'Get brutally honest critique', icon: Sword, desc: 'Red team my business' },
];
const AI_MODES = [
  { id: 'concise', label: 'Concise', desc: 'Short, sharp, actionable. No fluff.' },
  { id: 'strategist', label: 'Strategist', desc: 'Deep analysis with frameworks and reasoning.' },
  { id: 'operator', label: 'Operator', desc: 'Task-focused. What to do, when, and how.' },
  { id: 'red-team', label: 'Red Team', desc: 'Attack every assumption. Find the weaknesses.' },
  { id: 'creative', label: 'Creative Growth', desc: 'Novel angles, cross-industry tactics, wild ideas.' },
];

export default function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [creating, setCreating] = useState(false);

  // Step 1: Business basics
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [price, setPrice] = useState('');
  const [revenueGoal, setRevenueGoal] = useState('');
  const [stage, setStage] = useState('');

  // Step 2: Inputs
  const [website, setWebsite] = useState('');
  const [socialLinks, setSocialLinks] = useState('');
  const [notes, setNotes] = useState('');

  // Step 3: Goal
  const [selectedGoal, setSelectedGoal] = useState('diagnose');

  // Step 4: Constraints
  const [budget, setBudget] = useState('');
  const [timePerWeek, setTimePerWeek] = useState('');
  const [teamSize, setTeamSize] = useState('1');
  const [currentRevenue, setCurrentRevenue] = useState('');

  // Step 5: AI Mode
  const [aiMode, setAiMode] = useState('strategist');

  async function handleCreate() {
    if (!name.trim()) { toast.error('Project name is required'); return; }
    setCreating(true);

    try {
      // Create session
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) { toast.error('Failed to create project'); setCreating(false); return; }
      const session = await res.json();

      // Save profile data
      const profile = {
        businessType, offering: offer, targetAudience: audience,
        pricePoint: price, revenueGoal, businessStage: stage,
        website, socialLinks, notes, selectedGoal, budget,
        timePerWeek, teamSize, currentRevenue, aiMode,
      };
      await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileJson: JSON.stringify(profile), name: name.trim() }),
      });

      // Build kickoff message based on goal
      const goalLabels: Record<string, string> = {
        diagnose: 'diagnose my business bottleneck',
        marketing: 'improve my marketing strategy',
        launch: 'build a launch plan',
        conversion: 'fix my conversion rate',
        retention: 'improve customer retention',
        sprint: 'build a 7-day execution sprint',
        critique: 'give me a brutally honest red team critique',
      };

      const kickoff = `Here's my business:
- Name: ${name}
- Type: ${businessType || 'Not specified'}
- Offer: ${offer || 'Not specified'}
- Audience: ${audience || 'Not specified'}
- Price: ${price || 'Not specified'}
- Revenue goal: ${revenueGoal || 'Not specified'}
- Stage: ${stage || 'Not specified'}
- Current revenue: ${currentRevenue || 'Not specified'}
- Time available: ${timePerWeek || 'Not specified'} hours/week
- Team: ${teamSize} person(s)
- Budget: ${budget || 'Not specified'}
${website ? `- Website: ${website}` : ''}
${socialLinks ? `- Social: ${socialLinks}` : ''}
${notes ? `\nAdditional context: ${notes}` : ''}

My goal: ${goalLabels[selectedGoal] || 'diagnose my business bottleneck'}

Please ${goalLabels[selectedGoal] || 'diagnose my business bottleneck'}. Be thorough, specific, and actionable.`;

      // Send the kickoff message
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          message: kickoff,
          module: selectedGoal === 'critique' ? 'red-team' : 'intake',
        }),
      });

      toast.success('Project created — analysis starting');
      router.push(`/session/${session.id}`);
    } catch {
      toast.error('Something went wrong');
      setCreating(false);
    }
  }

  const canNext = step === 0 ? name.trim().length > 0 : true;

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[600px] mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={() => step > 0 ? setStep(step - 1) : router.push('/')} className="text-zinc-600 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <div key={i} className={`w-8 h-1 rounded-full transition-all ${i <= step ? 'bg-red-500' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <span className="text-[10px] text-zinc-700 font-mono">{step + 1}/{STEPS.length}</span>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-8">
        {/* STEP 1: Business Basics */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">Tell me about your business</h1>
            <p className="text-xs text-zinc-600 mb-6">The more context, the sharper the diagnosis.</p>
            <div className="space-y-4">
              <Field label="Project name *" value={name} onChange={setName} placeholder="Ember & Wick Candles" />
              <Field label="Business type" value={businessType} onChange={setBusinessType} placeholder="E-commerce, SaaS, Consulting, Creator..." />
              <Field label="What do you sell?" value={offer} onChange={setOffer} placeholder="Handmade soy candles with custom scents" />
              <Field label="Who is your customer?" value={audience} onChange={setAudience} placeholder="Women 25-45 who want premium home fragrance" />
              <Field label="Price point" value={price} onChange={setPrice} placeholder="$28-$45 per candle" />
              <Field label="Monthly revenue goal" value={revenueGoal} onChange={setRevenueGoal} placeholder="$5,000/month" />
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 block">Business stage</label>
                <div className="flex flex-wrap gap-2">
                  {BUSINESS_STAGES.map(s => (
                    <button key={s} onClick={() => setStage(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        stage === s ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'border-zinc-800 text-zinc-600 hover:border-red-900/30'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Inputs */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">Add context</h1>
            <p className="text-xs text-zinc-600 mb-6">Optional but helps the AI understand your situation better.</p>
            <div className="space-y-4">
              <Field label="Website" value={website} onChange={setWebsite} placeholder="https://emberandwick.com" />
              <Field label="Social links" value={socialLinks} onChange={setSocialLinks} placeholder="instagram.com/emberwick, tiktok.com/@emberwick" />
              <div>
                <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 block">Anything else the AI should know</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40 transition-colors min-h-[100px] resize-none"
                  placeholder="Customer complaints, what you've tried, what's working, what's not..." />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Goal */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">What do you need right now?</h1>
            <p className="text-xs text-zinc-600 mb-6">This sets the AI's focus for your first analysis.</p>
            <div className="space-y-2">
              {GOALS.map(g => (
                <button key={g.id} onClick={() => setSelectedGoal(g.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                    selectedGoal === g.id
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-[#0a0a0f] border-zinc-800/50 hover:border-red-900/30'
                  }`}>
                  <g.icon className={`w-5 h-5 flex-shrink-0 ${selectedGoal === g.id ? 'text-red-400' : 'text-zinc-700'}`} />
                  <div>
                    <p className={`text-sm font-medium ${selectedGoal === g.id ? 'text-white' : 'text-zinc-400'}`}>{g.label}</p>
                    <p className="text-[10px] text-zinc-600">{g.desc}</p>
                  </div>
                  {selectedGoal === g.id && <Check className="w-4 h-4 text-red-400 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Constraints */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">Your constraints</h1>
            <p className="text-xs text-zinc-600 mb-6">Helps the AI give realistic, not fantasy, recommendations.</p>
            <div className="space-y-4">
              <Field label="Monthly budget for marketing" value={budget} onChange={setBudget} placeholder="$500, $0 (bootstrap), etc." />
              <Field label="Hours per week available" value={timePerWeek} onChange={setTimePerWeek} placeholder="10, 20, 40+" />
              <Field label="Team size" value={teamSize} onChange={setTeamSize} placeholder="1 (solo)" />
              <Field label="Current monthly revenue" value={currentRevenue} onChange={setCurrentRevenue} placeholder="$0, $500, $2000..." />
            </div>
          </div>
        )}

        {/* STEP 5: AI Mode */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-1">How should Sterling think?</h1>
            <p className="text-xs text-zinc-600 mb-6">Pick your AI&apos;s operating style.</p>
            <div className="space-y-2">
              {AI_MODES.map(m => (
                <button key={m.id} onClick={() => setAiMode(m.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    aiMode === m.id
                      ? 'bg-red-500/5 border-red-500/30'
                      : 'bg-[#0a0a0f] border-zinc-800/50 hover:border-red-900/30'
                  }`}>
                  <p className={`text-sm font-medium ${aiMode === m.id ? 'text-white' : 'text-zinc-400'}`}>{m.label}</p>
                  <p className="text-[10px] text-zinc-600">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-900/50">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <button onClick={() => router.push('/')} className="text-xs text-zinc-600 hover:text-white transition-colors">Cancel</button>
          )}

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(step + 1)} disabled={!canNext}
              className="text-xs bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-500 transition-all
                shadow-[0_0_15px_rgba(220,38,38,0.2)] border border-red-500/50 disabled:opacity-30 flex items-center gap-1.5">
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={handleCreate} disabled={creating || !name.trim()}
              className="text-xs bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-500 transition-all
                shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50 disabled:opacity-30 flex items-center gap-1.5">
              {creating ? 'Creating...' : <><Crosshair className="w-3.5 h-3.5" /> Launch Analysis</>}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1.5 block">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0a0a0f] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/40 transition-colors"
        placeholder={placeholder} />
    </div>
  );
}
