'use client';

import React, { useState } from 'react';
import { ModuleIcon } from '@/lib/icons';
import { BookOpen } from 'lucide-react';

type LibraryCategory = 'business' | 'marketing' | 'psychology' | 'channels' | 'industries' | 'patterns' | 'antipatterns' | 'power' | 'ai2026';

const CATEGORIES: { id: LibraryCategory; label: string; icon: string; description: string }[] = [
  { id: 'business', label: 'Business Foundations', icon: 'Cog', description: 'Value creation, pricing, margins, offer architecture, positioning, trust' },
  { id: 'marketing', label: 'Marketing Frameworks', icon: 'Megaphone', description: 'Funnels, demand gen, direct response, brand, launches, community growth' },
  { id: 'psychology', label: 'Psychological Triggers', icon: 'Brain', description: 'Identity, belonging, aspiration, urgency, scarcity, curiosity, transformation' },
  { id: 'channels', label: 'Channel Knowledge', icon: 'Smartphone', description: 'Instagram, TikTok, YouTube, SEO, GEO/LLM visibility, email, paid ads' },
  { id: 'industries', label: 'Industry Patterns', icon: 'Factory', description: 'What works in food, beauty, SaaS, coaching, adult content, and 20+ industries' },
  { id: 'patterns', label: 'What Works', icon: 'CheckCircle', description: 'Proven patterns for impulse buys, premium services, creator monetization' },
  { id: 'antipatterns', label: 'What Fails', icon: 'XCircle', description: 'Oversaturated tactics, fake urgency, platform addiction, content-for-content\'s-sake' },
  { id: 'power', label: 'Platform Power Critique', icon: 'Shield', description: 'Rent extraction, algorithmic dependence, creator exploitation, walled gardens' },
  { id: 'ai2026', label: 'AI & 2026 Landscape', icon: 'Bot', description: 'AI search, GEO, content saturation, zero-click results, and the new marketing stack' },
];

const LIBRARY_CONTENT: Record<LibraryCategory, { name: string; content: string }[]> = {
  business: [
    { name: 'Value Creation', content: 'Every business must create something people actually want. The test is simple: would someone willingly exchange money for this? If not, everything downstream is wasted effort. Focus on the "minimum economically viable offer" — the simplest version that delivers real value.' },
    { name: 'Product-Market Fit', content: 'PMF exists when people are pulling the product from you, not when you\'re pushing it onto them. Signs: organic referrals, willingness to pay before it\'s perfect, complaints when it\'s unavailable. Anti-signs: needing to explain why they should care.' },
    { name: 'Pricing Logic', content: 'Price communicates value before anything else. Value-based pricing (charge based on outcome, not cost) almost always beats cost-plus. Anchoring, tiering, and bundling are tools. The right price makes the right customer feel it\'s a bargain and the wrong customer self-select out.' },
    { name: 'Offer Architecture', content: 'Front-end offer: low barrier, gets people in. Core offer: main revenue. Back-end offer: maximizes lifetime value. The value ladder should feel natural — each step delivers more and costs more, building trust progressively.' },
    { name: 'Trust Formation', content: 'Trust = (Credibility + Reliability + Intimacy) / Self-Interest. People buy when they trust the seller won\'t waste their money. Trust signals: testimonials, guarantees, transparency, demonstrated expertise, social proof, longevity.' },
    { name: 'Customer Lifetime Value', content: 'A customer who buys once is expensive. A customer who buys 5 times is profitable. CAC (cost to acquire) must be less than LTV (total revenue from that customer). Most businesses focus on acquisition when retention is where the money lives.' },
  ],
  marketing: [
    { name: 'Awareness Ladders', content: 'Eugene Schwartz\'s 5 levels: Unaware → Problem-aware → Solution-aware → Product-aware → Most-aware. Each level needs different messaging. Most marketers write for the most-aware audience, missing 80% of potential customers.' },
    { name: 'Direct Response Principles', content: 'Every piece of marketing should produce a measurable response. Headline → Hook → Story → Offer → CTA → Tracking. No vanity metrics. Track what matters: cost per lead, conversion rate, revenue per click.' },
    { name: 'Brand vs Performance', content: 'Brand building creates future demand (long-term, hard to measure, compounds). Performance marketing harvests existing demand (short-term, measurable, diminishing returns). The best strategy balances both — typically 60% brand / 40% performance.' },
    { name: 'Community-Led Growth', content: 'Build a community around the problem you solve, not around your product. Give value freely. The community becomes your marketing, support, and product development channel. Owned community > rented social following.' },
    { name: 'Launch Logic', content: 'Build anticipation → Open cart → Scarcity window → Close cart → Debrief → Evergreen. Pre-launch: audience building, waitlist, content seeding. Launch: concentrated attention + urgency. Post-launch: testimonials, iteration, evergreen funnel.' },
    { name: 'Social Proof Systems', content: 'Testimonials, case studies, user counts, media mentions, certifications, expert endorsements, community size, review scores. The right social proof depends on the audience\'s sophistication and the purchase risk level.' },
  ],
  psychology: [
    { name: 'Identity', content: 'People buy to become or express who they want to be. "I\'m the kind of person who..." is the most powerful purchase driver. Frame your offer as part of the identity your customer is constructing.' },
    { name: 'Loss Aversion', content: 'People feel losses ~2x more than equivalent gains. "Don\'t miss out" is stronger than "Get this benefit." Ethical use: highlight real opportunity costs. Manipulative use: fake countdown timers.' },
    { name: 'Status', content: 'Status drives more purchases than people admit. It can be aspirational (luxury), belonging (community), or contrarian (anti-mainstream). The key is knowing which status game your audience plays.' },
    { name: 'Curiosity', content: 'An information gap creates an itch to resolve it. Headlines that open a loop ("The one thing most founders miss...") drive clicks. Ethical when the payoff delivers. Manipulative when the content is empty.' },
    { name: 'Transformation', content: 'People don\'t buy products — they buy the transformation. Before/after is the universal story. Make the transformation specific, believable, and achievable.' },
    { name: 'Trust Friction', content: 'Every purchase has a "trust tax" — the mental cost of uncertainty. Reduce it: guarantees, free trials, social proof, transparency about limitations, "what you get" specificity.' },
  ],
  channels: [
    { name: 'Instagram', content: 'Visual-first platform. Best for: lifestyle, beauty, food, fashion, personal brands. Reels drive discovery, Stories drive engagement, Feed drives credibility. Algorithm favors consistency and saves/shares over likes.' },
    { name: 'TikTok', content: 'Content-first platform. The algorithm tests content regardless of follower count. Best for: entertainment, education, personality-driven brands. Raw authenticity outperforms polish. Hook in 0.5 seconds.' },
    { name: 'YouTube', content: 'Search + recommendation engine. Long-form builds deep trust. Best for: education, reviews, tutorials, thought leadership. Videos compound over years. SEO matters. Thumbnails and titles are 80% of success.' },
    { name: 'Email', content: 'The most owned channel. No algorithm between you and your audience. Best for: nurturing, selling, relationship building. 40x ROI average. Segment aggressively. Deliver value before asking for money.' },
    { name: 'SEO / Organic Search', content: 'Intent-based discovery. People actively looking for solutions. Best for: informational content, local services, products people search for. Compounds over time but slow to start. Focus on search intent, not just keywords.' },
    { name: 'GEO / LLM Visibility', content: 'Emerging channel. AI systems (ChatGPT, Gemini, Perplexity) increasingly recommend products and services. Structured content, authoritative sources, brand mentions across the web, and clear entity signals improve AI citation. This is the next SEO.' },
    { name: 'Reddit', content: 'Community-driven, extremely anti-marketing. But: authentic participation builds massive trust. Best for: niche products, tech, gaming, specific interests. Never sell directly — contribute value and let people find you.' },
    { name: 'LinkedIn', content: 'B2B and professional services goldmine. Personal posts outperform company pages 10x. Best for: consulting, SaaS, professional services, recruiting, thought leadership. Authenticity + expertise = visibility.' },
  ],
  industries: [
    { name: 'Local Services', content: 'Trust and convenience dominate. Google Business Profile is essential. Reviews are currency. Referral programs work better than ads. Hyper-local content and community involvement build the brand.' },
    { name: 'SaaS', content: 'Product-led growth or sales-led growth. Free trial/freemium reduces friction. Content marketing builds SEO. The best SaaS companies have communities. Churn is the silent killer — retention > acquisition.' },
    { name: 'Creator Economy', content: 'You are the product. Audience first, monetization second. Multiple revenue streams: ads, sponsors, digital products, coaching, community. Platform diversification is critical — don\'t be a sharecropper.' },
    { name: 'E-commerce / Physical Products', content: 'Product photography and copy are everything. Reviews drive conversion. Email retention campaigns matter more than acquisition ads. Marketplace vs own store is the fundamental strategic question.' },
    { name: 'Coaching / Consulting', content: 'Trust-heavy purchase. Long sales cycle. Content builds authority. Case studies and testimonials are essential. Premium pricing is usually better than competing on price. The offer structure (1:1, group, course, hybrid) defines scalability.' },
    { name: 'Adult Content', content: 'Platform-dependent but huge market. OnlyFans, Fansly, etc. Cross-platform promotion essential. Personality and consistency drive subscription retention. Niche-specific content outperforms generic. Brand building creates defensibility.' },
  ],
  patterns: [
    { name: 'Cheap Impulse Buys (<$30)', content: 'Low friction required. Emotional triggers dominate. Social proof and urgency work. The product image/video IS the marketing. Mobile-first checkout. Retargeting captures hesitaters.' },
    { name: 'Premium Trust-Heavy Services ($1000+)', content: 'Long consideration period. Multiple touchpoints needed. Content → Lead magnet → Nurture → Call → Proposal → Close. Case studies, guarantees, and personal connection reduce perceived risk.' },
    { name: 'Creator Monetization', content: 'Build audience with free content → Monetize with paid products/services. The key: identify what your audience values enough to pay for, separate from what they consume for free.' },
    { name: 'Strong Product, Weak Story', content: 'The product works but nobody knows or cares. Solution: invest in framing, positioning, and distribution before improving the product further. Marketing IS the bottleneck.' },
    { name: 'Weak Product, Strong Story', content: 'Great marketing but mediocre delivery. Short-term gains, long-term reputation damage. Solution: improve the product to match the promise. Otherwise it\'s a ticking time bomb.' },
    { name: 'Subscription Models', content: 'MRR is king. Churn is the enemy. Onboarding determines retention. Regular value delivery justifies recurring payments. Annual plans reduce churn by 2-3x vs monthly.' },
  ],
  antipatterns: [
    { name: 'Fake Urgency', content: 'Countdown timers that reset. "Only 3 left!" restocked daily. Destroys trust when discovered. Alternative: real deadlines, real scarcity, or honest "buy when ready" confidence.' },
    { name: 'Platform Addiction', content: 'All revenue depends on one platform\'s algorithm. Instagram reach drops, business dies. Solution: always build owned channels (email, SMS, community) alongside platform presence.' },
    { name: 'Content for Content\'s Sake', content: 'Posting daily with no strategy, no conversion path, no measurement. Activity without intention. Solution: every piece of content should serve a purpose in the funnel.' },
    { name: 'Pretty Branding, No Conversion', content: 'Beautiful website, zero sales process. Design is not strategy. Solution: ugly landing page that converts > beautiful site that confuses.' },
    { name: 'Overreliance on Paid Ads', content: 'All growth from paid traffic. CAC rises, margins compress, you\'re renting growth. Solution: pair paid with organic, build owned channels, improve conversion to reduce CAC dependence.' },
    { name: 'Underpriced Custom Work', content: 'Trading time for money at rates that don\'t support the business. Often from fear of losing clients. Solution: raise prices, productize services, or create scalable alternatives.' },
  ],
  power: [
    { name: 'Platform Rent Extraction', content: 'Platforms charge 15-45% fees (Amazon, App Store, Etsy). They control pricing, visibility, and customer relationships. You\'re a tenant on their land. Counter-strategy: build direct sales channels alongside marketplace presence.' },
    { name: 'Algorithmic Dependence', content: 'Your visibility depends on an algorithm you don\'t control and can\'t predict. One update can destroy a business overnight. Counter-strategy: diversify channels, build email list, create content that works across platforms.' },
    { name: 'Creator Exploitation', content: 'Platforms benefit from creator content but capture most of the value. Creators produce the content, platforms keep the audience data and ad revenue. Counter-strategy: own your audience relationship directly.' },
    { name: 'Walled Garden Economics', content: 'Platforms make it easy to enter and hard to leave. Your audience, content, and reputation are locked inside. Counter-strategy: always cross-pollinate to owned channels. Never let a platform be your only presence.' },
    { name: 'Attention Capture vs Value', content: 'Platforms optimize for engagement (time on platform), not for your business goals. What makes content "perform" may not be what makes your business money. Counter-strategy: optimize for business outcomes, not vanity metrics.' },
    { name: 'Data Asymmetry', content: 'Platforms know more about your customers than you do. They use this data to help competitors target your audience. Counter-strategy: collect first-party data, build direct relationships, use your own analytics.' },
  ],
  ai2026: [
    { name: 'AI Overviews & Zero-Click Search', content: 'Google AI Overviews now appear on 40%+ of searches in 2026. Many users get answers without clicking through to websites. Strategy: optimize for being cited IN the AI overview (structured content, E-E-A-T signals, authoritative sources) rather than just ranking below it. This is the biggest SEO shift since mobile-first indexing.' },
    { name: 'GEO (Generative Engine Optimization)', content: 'A new discipline alongside SEO. Focuses on ensuring your brand, products, and content are cited by AI systems (ChatGPT, Gemini, Perplexity, Claude). Key factors: brand mentions across authoritative sources, structured data, topical authority, clear entity signals, and being recommended in AI conversations. Early movers have a significant advantage.' },
    { name: 'Content Saturation & Authenticity Premium', content: 'AI tools have made it trivial to produce large volumes of generic content. The result: massive saturation of mediocre content across every niche. The winning strategy is now depth over volume — original research, genuine expertise, personal perspective, and content that AI literally cannot produce because it requires human experience and judgment.' },
    { name: 'AI as a Marketing Tool', content: 'Use AI for research, drafting, analysis, personalization, and testing — but not as a replacement for strategy or voice. The best marketers in 2026 use AI to work 3x faster while maintaining their unique perspective. Key applications: audience research, competitive analysis, A/B test copy variants, data synthesis, content repurposing across formats.' },
    { name: 'Subscription Fatigue & Pricing Shifts', content: 'Consumers are cutting subscriptions aggressively in 2026. The winners: lifetime deals, pay-per-use models, transparent pricing, and subscriptions that deliver clear monthly value. The losers: subscriptions that feel like "content access" when free content is abundant. Key insight: if your subscription can be replaced by a free AI tool, you need to rethink.' },
    { name: 'The Human Premium', content: 'As AI commoditizes information, human elements become premium: personal connection, curated communities, live experiences, mentorship, accountability, and "someone who actually knows my situation." Businesses built on human relationships and judgment are more defensible than those built on information delivery.' },
    { name: 'Short-Form Video Dominance', content: 'Short-form video (TikTok, Reels, Shorts) remains the dominant discovery channel in 2026. But the bar has risen — raw authenticity with genuine expertise beats polished production. Algorithmic discovery means any creator can reach millions, but retention and conversion require a clear funnel from content to owned channels.' },
    { name: 'First-Party Data is King', content: 'With cookie deprecation and privacy regulations, first-party data (email lists, customer data, community membership) is the most valuable marketing asset. Every touchpoint should include a value-exchange for data collection. The businesses with the best first-party data will have the lowest customer acquisition costs.' },
  ],
};

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState<LibraryCategory>('business');
  const [search, setSearch] = useState('');

  const entries = LIBRARY_CONTENT[activeCategory];
  const filtered = search
    ? entries.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.content.toLowerCase().includes(search.toLowerCase())
      )
    : entries;

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-[#050507]">
      <header className="border-b border-red-900/20 bg-[#050507]/95 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-zinc-600 hover:text-white transition-colors">&larr;</a>
            <div>
              <h1 className="text-sm font-bold text-white">Strategy Library</h1>
              <p className="text-[10px] text-zinc-700">Frameworks, principles, and intelligence</p>
            </div>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search library..."
            className="bg-[#0a0a0f] border border-red-900/20 rounded-lg px-3 py-2 text-sm text-white
              placeholder:text-zinc-700 w-48 sm:w-64 focus:outline-none focus:border-red-500/30"
          />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row gap-6">
        {/* Category sidebar */}
        <div className="sm:w-48 flex-shrink-0">
          <div className="flex sm:flex-col gap-1.5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 sm:sticky sm:top-16">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
                className={`text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center gap-2 whitespace-nowrap flex-shrink-0
                  ${activeCategory === cat.id
                    ? 'bg-red-500/10 text-white border-l-2 border-red-500'
                    : 'text-zinc-600 hover:bg-[#0a0a0f] hover:text-white'
                  }`}
              >
                <ModuleIcon name={cat.icon} className="w-3.5 h-3.5 text-current" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {activeCat && <ModuleIcon name={activeCat.icon} className="w-4 h-4 text-current" />}
              {activeCat?.label}
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              {activeCat?.description}
            </p>
          </div>

          <div className="space-y-3">
            {filtered.map((entry, i) => (
              <div key={i} className="bg-[#0a0a0f] border border-red-900/15 rounded-xl p-4 sm:p-5 relative overflow-hidden hover:border-red-500/25 transition-all">
                <div className="h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-0 left-0 right-0" />
                <h3 className="text-sm font-bold text-white mb-2">{entry.name}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{entry.content}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-zinc-600">
                No entries match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
