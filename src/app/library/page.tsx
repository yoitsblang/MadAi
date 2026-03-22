'use client';

import React, { useState } from 'react';

type LibraryCategory = 'business' | 'marketing' | 'psychology' | 'channels' | 'industries' | 'patterns' | 'antipatterns' | 'power';

const CATEGORIES: { id: LibraryCategory; label: string; icon: string; description: string }[] = [
  { id: 'business', label: 'Business Foundations', icon: '⚙️', description: 'Value creation, pricing, margins, offer architecture, positioning, trust' },
  { id: 'marketing', label: 'Marketing Frameworks', icon: '📣', description: 'Funnels, demand gen, direct response, brand, launches, community growth' },
  { id: 'psychology', label: 'Psychological Triggers', icon: '🧠', description: 'Identity, belonging, aspiration, urgency, scarcity, curiosity, transformation' },
  { id: 'channels', label: 'Channel Knowledge', icon: '📱', description: 'Instagram, TikTok, YouTube, SEO, GEO/LLM visibility, email, paid ads' },
  { id: 'industries', label: 'Industry Patterns', icon: '🏭', description: 'What works in food, beauty, SaaS, coaching, adult content, and 20+ industries' },
  { id: 'patterns', label: 'What Works', icon: '✅', description: 'Proven patterns for impulse buys, premium services, creator monetization' },
  { id: 'antipatterns', label: 'What Fails', icon: '❌', description: 'Oversaturated tactics, fake urgency, platform addiction, content-for-content\'s-sake' },
  { id: 'power', label: 'Platform Power Critique', icon: '🏰', description: 'Rent extraction, algorithmic dependence, creator exploitation, walled gardens' },
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

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-text-muted hover:text-text transition-colors">←</a>
            <div>
              <h1 className="text-lg font-bold text-text">📚 Strategy Library</h1>
              <p className="text-xs text-text-muted">The intellectual backbone of MadAi</p>
            </div>
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search library..."
            className="bg-surface-light border border-border rounded-lg px-3 py-1.5 text-sm text-text
              placeholder:text-text-muted/50 w-64 focus:outline-none focus:border-primary"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6">
        {/* Category sidebar */}
        <div className="w-56 flex-shrink-0">
          <div className="sticky top-20 space-y-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors
                  ${activeCategory === cat.id
                    ? 'bg-primary/15 text-primary-light border border-primary/20'
                    : 'text-text-muted hover:bg-surface-light hover:text-text'
                  }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-text flex items-center gap-2">
              {CATEGORIES.find(c => c.id === activeCategory)?.icon}
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            <p className="text-sm text-text-muted mt-1">
              {CATEGORIES.find(c => c.id === activeCategory)?.description}
            </p>
          </div>

          <div className="space-y-3">
            {filtered.map((entry, i) => (
              <div key={i} className="bg-surface-light border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-text mb-2">{entry.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{entry.content}</p>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-text-muted">
                No entries match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
