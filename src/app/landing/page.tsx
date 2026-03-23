'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Brain,
  Target,
  Gem,
  Cog,
  Shield,
  Search,
  Scale,
  Map,
  ClipboardList,
  Pencil,
  Clock,
  FlaskConical,
  BookOpen,
  MessageSquare,
  ArrowRight,
  ChevronDown,
  Zap,
  MessageCircle,
  BarChart3,
  Store,
  Code,
  Palette,
  Coffee,
  Heart,
  Building,
  Utensils,
  Camera,
  Users,
  Briefcase,
  ShieldCheck,
  Gauge,
  SlidersHorizontal,
  Swords,
  Rocket,
  CheckCircle,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ─── Intersection Observer hook for scroll animations ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const children = el.querySelectorAll('.reveal-on-scroll');
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Module data ───
interface ModuleInfo {
  icon: LucideIcon;
  name: string;
  description: string;
  group: string;
}

const modules: ModuleInfo[] = [
  { icon: Target, name: 'Strategic Intake', description: 'Smart intake that diagnoses your real situation', group: 'Foundation' },
  { icon: Gem, name: 'Value Diagnosis', description: 'Uncover your real value proposition', group: 'Foundation' },
  { icon: Cog, name: 'Business Logic', description: 'Map your revenue engine and fix what\'s broken', group: 'Foundation' },
  { icon: Shield, name: 'Platform Power', description: 'Analyze platform dependency and build sovereignty', group: 'Analysis' },
  { icon: Search, name: 'Market Research', description: 'Live competitive and market intelligence', group: 'Analysis' },
  { icon: Brain, name: 'Psychology Engine', description: 'Model real audience decision drivers', group: 'Analysis' },
  { icon: Scale, name: 'Ethics Layer', description: 'Evaluate tactics for effectiveness AND legitimacy', group: 'Analysis' },
  { icon: Map, name: 'Macro Strategy', description: 'Big-picture positioning and market strategy', group: 'Strategy' },
  { icon: ClipboardList, name: 'Meso Strategy', description: 'Campaign and channel-level planning', group: 'Strategy' },
  { icon: Pencil, name: 'Micro Execution', description: 'Specific tactics, copy, and creative direction', group: 'Strategy' },
  { icon: Clock, name: 'Timing Intelligence', description: 'When to launch, pivot, and double down', group: 'Advanced' },
  { icon: FlaskConical, name: 'Innovation Lab', description: 'Test unconventional approaches safely', group: 'Advanced' },
  { icon: BookOpen, name: 'Teaching Mode', description: 'Learn the frameworks behind the strategy', group: 'Advanced' },
  { icon: MessageSquare, name: 'General Strategy', description: 'Open-ended strategic conversation', group: 'Advanced' },
];

const groupColors: Record<string, string> = {
  Foundation: 'from-primary to-primary-light',
  Analysis: 'from-accent-blue to-primary',
  Strategy: 'from-accent-green to-accent-blue',
  Advanced: 'from-accent-amber to-accent-green',
};

const groupOrder = ['Foundation', 'Analysis', 'Strategy', 'Advanced'];

// ─── Business types ───
const businessTypes = [
  { icon: Code, name: 'SaaS' },
  { icon: Camera, name: 'Creator Brands' },
  { icon: Store, name: 'Local Business' },
  { icon: Briefcase, name: 'E-commerce' },
  { icon: MessageCircle, name: 'Coaching' },
  { icon: Users, name: 'Freelance' },
  { icon: Heart, name: 'Adult Content' },
  { icon: Building, name: 'Nonprofits' },
  { icon: Palette, name: 'Agencies' },
  { icon: Utensils, name: 'Food & Bev' },
  { icon: Coffee, name: 'Art & Creative' },
];

// ─── Ethical stances ───
const ethicalStances = [
  { icon: ShieldCheck, name: 'Ethical-First', description: 'Maximum integrity. Every tactic passes the "front page" test.', color: 'text-accent-green', border: 'border-accent-green/30' },
  { icon: SlidersHorizontal, name: 'Balanced', description: 'Effective marketing with clear ethical guardrails.', color: 'text-accent-blue', border: 'border-accent-blue/30' },
  { icon: Swords, name: 'Aggressive-but-Defensible', description: 'Push boundaries while staying legally and ethically defensible.', color: 'text-accent-amber', border: 'border-accent-amber/30' },
  { icon: Gauge, name: 'Max Performance', description: 'Full toolkit. You decide the limits. We flag the risks.', color: 'text-accent-red', border: 'border-accent-red/30' },
];

// ─── Page Component ───
export default function LandingPage() {
  const revealRef = useScrollReveal();

  const scrollToFeatures = () => {
    document.getElementById('what-makes-different')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={revealRef} className="min-h-screen bg-surface text-text overflow-x-hidden">
      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-on-scroll:nth-child(2) { transition-delay: 0.08s; }
        .reveal-on-scroll:nth-child(3) { transition-delay: 0.16s; }
        .reveal-on-scroll:nth-child(4) { transition-delay: 0.24s; }
        .reveal-on-scroll:nth-child(5) { transition-delay: 0.32s; }
        .reveal-on-scroll:nth-child(6) { transition-delay: 0.4s; }

        @keyframes heroGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .hero-glow {
          animation: heroGlow 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .float-animation {
          animation: float 4s ease-in-out infinite;
        }

        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.4);
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--color-primary-light), var(--color-accent-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glow-border {
          position: relative;
        }
        .glow-border::after {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent-blue));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .glow-border:hover::after {
          opacity: 1;
        }

        .group-pill {
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
      `}</style>

      {/* ═══════════ NAV ═══════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" className="flex items-center gap-2.5 group">
            <Brain className="w-7 h-7 text-primary-light group-hover:text-primary transition-colors" />
            <span className="text-lg font-bold tracking-tight">MadAi</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-text-muted hover:text-text transition-colors px-3 py-2">
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-glow absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="hero-glow absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-blue/15 rounded-full blur-[100px]" style={{ animationDelay: '3s' }} />
          <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="reveal-on-scroll revealed">
            <div className="inline-flex items-center gap-2 text-sm text-text-muted bg-surface-light/60 border border-border/50 rounded-full px-4 py-1.5 mb-8">
              <Zap className="w-3.5 h-3.5 text-accent-amber" />
              Strategic marketing intelligence
            </div>
          </div>

          <h1 className="reveal-on-scroll revealed text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Stop guessing.{' '}
            <span className="gradient-text">Start strategizing.</span>
          </h1>

          <p className="reveal-on-scroll revealed text-lg sm:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            MadAi is a strategic marketing intelligence system that thinks like a senior strategist, challenges your assumptions, and builds real action plans — for any business type.
          </p>

          <div className="reveal-on-scroll revealed flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Start Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              onClick={scrollToFeatures}
              className="flex items-center gap-2 text-text-muted hover:text-text border border-border hover:border-primary/40 px-8 py-3.5 rounded-xl transition-all"
            >
              See How It Works
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="reveal-on-scroll revealed float-animation">
            <div className="inline-flex items-center gap-6 text-xs text-text-muted">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent-green" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent-green" /> 14 strategy modules</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent-green" /> Any business type</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT MAKES THIS DIFFERENT ═══════════ */}
      <section id="what-makes-different" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              Not another AI tool.{' '}
              <span className="gradient-text">A strategy system.</span>
            </h2>
            <p className="reveal-on-scroll text-text-muted text-lg max-w-2xl mx-auto">
              Not a content generator. Not a chatbot. A system that thinks about your business the way a senior strategist would.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                bad: 'Most AI tools give you generic advice',
                good: 'MadAi asks probing questions, challenges your assumptions, and builds strategy specific to YOUR situation',
              },
              {
                bad: 'Most AI tools help you write content',
                good: 'MadAi diagnoses why your content isn\'t converting and fixes the strategy underneath',
              },
              {
                bad: 'Most AI tools work in isolation',
                good: 'MadAi connects market research, psychology, platform analysis, and execution into one coherent system',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal-on-scroll bg-surface-light border border-border rounded-2xl p-6 card-hover"
              >
                <div className="flex items-start gap-3 mb-4 text-text-muted">
                  <X className="w-5 h-5 text-accent-red/60 mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed">{item.bad}</p>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed text-text">{item.good}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 14-MODULE SYSTEM ═══════════ */}
      <section className="py-28 px-6 bg-surface-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              The <span className="gradient-text">14-Module</span> System
            </h2>
            <p className="reveal-on-scroll text-text-muted text-lg max-w-2xl mx-auto">
              Every angle of your marketing, analyzed by a specialized intelligence module.
            </p>
          </div>

          {/* Group labels + module grid */}
          <div className="space-y-12">
            {groupOrder.map((group) => (
              <div key={group}>
                <div className="reveal-on-scroll flex items-center gap-3 mb-5">
                  <span className={`group-pill bg-gradient-to-r ${groupColors[group]} bg-clip-text text-transparent`}>
                    {group}
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {modules
                    .filter((m) => m.group === group)
                    .map((mod) => {
                      const Icon = mod.icon;
                      return (
                        <div
                          key={mod.name}
                          className="reveal-on-scroll bg-surface border border-border rounded-xl p-5 card-hover glow-border"
                        >
                          <Icon className="w-6 h-6 text-primary-light mb-3" />
                          <h3 className="font-semibold text-sm mb-1.5">{mod.name}</h3>
                          <p className="text-xs text-text-muted leading-relaxed">{mod.description}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PHILOSOPHY ═══════════ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              Built on real frameworks,{' '}
              <span className="gradient-text">not vibes</span>
            </h2>
            <p className="reveal-on-scroll text-text-muted text-lg max-w-2xl mx-auto">
              Every strategic recommendation traces back to validated frameworks and research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: 'The Personal MBA',
                source: 'Josh Kaufman',
                text: 'Every business runs on 5 processes \u2014 Value Creation, Marketing, Sales, Delivery, Finance. We diagnose which is broken.',
              },
              {
                title: 'Technofeudalism',
                source: 'Yanis Varoufakis',
                text: 'Platforms extract rent from your business. We analyze your dependency and build sovereignty.',
              },
              {
                title: 'Behavioral Psychology',
                source: '',
                text: 'We model your audience\'s real decision drivers \u2014 identity, status, fear, aspiration \u2014 to frame genuine value effectively.',
              },
              {
                title: 'Direct Response Marketing',
                source: '',
                text: 'Every recommendation is measurable, testable, and traceable to a specific business outcome.',
              },
              {
                title: 'Platform Economics',
                source: '',
                text: 'We understand how algorithms, AI search, and platform power dynamics shape your visibility and revenue.',
              },
              {
                title: 'Ethical Intelligence',
                source: '',
                text: 'Every tactic is evaluated for both effectiveness AND legitimacy. You choose your stance.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal-on-scroll bg-surface-light border border-border rounded-xl p-6 card-hover"
              >
                <h3 className="font-bold text-base mb-1">
                  {item.title}
                  {item.source && <span className="font-normal text-text-muted text-sm ml-2">({item.source})</span>}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-28 px-6 bg-surface-light/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: MessageCircle,
                title: 'Tell us about your business',
                text: 'Smart intake that asks the RIGHT questions. Not a form. A conversation that diagnoses your real situation.',
              },
              {
                step: '02',
                icon: Brain,
                title: 'Get deep strategic analysis',
                text: '14 specialized modules analyze every angle. Live market research. Psychology modeling. Platform power analysis.',
              },
              {
                step: '03',
                icon: Rocket,
                title: 'Execute with a real plan',
                text: 'Action plans with tasks, timelines, and metrics. Track progress. Iterate with AI guidance.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="reveal-on-scroll text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl mb-5">
                    <Icon className="w-7 h-7 text-primary-light" />
                  </div>
                  <div className="text-xs font-bold text-primary-light tracking-widest mb-2">{item.step}</div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FOR EVERY BUSINESS TYPE ═══════════ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              For <span className="gradient-text">every</span> business type
            </h2>
            <p className="reveal-on-scroll text-text-muted text-lg max-w-xl mx-auto">
              From lemonade stands to SaaS. No restrictions. No judgment. Just strategy.
            </p>
          </div>

          <div className="reveal-on-scroll flex flex-wrap justify-center gap-3">
            {businessTypes.map((biz) => {
              const Icon = biz.icon;
              return (
                <div
                  key={biz.name}
                  className="flex items-center gap-2.5 bg-surface-light border border-border rounded-full px-5 py-2.5 card-hover"
                >
                  <Icon className="w-4 h-4 text-primary-light" />
                  <span className="text-sm font-medium">{biz.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ ETHICS LAYER ═══════════ */}
      <section className="py-28 px-6 bg-surface-light/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="reveal-on-scroll text-3xl sm:text-4xl font-bold mb-4">
              Not a manipulation engine.{' '}
              <span className="gradient-text">You control the dial.</span>
            </h2>
            <p className="reveal-on-scroll text-text-muted text-lg max-w-2xl mx-auto">
              Every recommendation comes with an ethical evaluation. Choose the stance that matches your values.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ethicalStances.map((stance) => {
              const Icon = stance.icon;
              return (
                <div
                  key={stance.name}
                  className={`reveal-on-scroll bg-surface border ${stance.border} rounded-xl p-5 card-hover`}
                >
                  <Icon className={`w-6 h-6 ${stance.color} mb-3`} />
                  <h3 className="font-semibold text-sm mb-1.5">{stance.name}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{stance.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="reveal-on-scroll text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">
            Ready to stop{' '}
            <span className="gradient-text">guessing?</span>
          </h2>
          <p className="reveal-on-scroll text-text-muted text-lg mb-10">
            No credit card. No catch. Just better strategy.
          </p>
          <div className="reveal-on-scroll">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-primary/25"
            >
              Start Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-primary-light" />
            <span className="font-bold text-sm">MadAi</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/login" className="hover:text-text transition-colors">Login</Link>
            <Link href="/register" className="hover:text-text transition-colors">Register</Link>
            <Link href="/library" className="hover:text-text transition-colors">Library</Link>
            <Link href="/templates" className="hover:text-text transition-colors">Templates</Link>
          </div>

          <p className="text-xs text-text-muted">
            Built with strategic intelligence, not artificial hype.
          </p>
        </div>
      </footer>
    </div>
  );
}
