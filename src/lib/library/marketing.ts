// Marketing Frameworks Knowledge Library
// Comprehensive marketing strategy patterns, tactics, and frameworks

export interface MarketingFramework {
  name: string;
  principle: string;
  whenToUse: string;
  example: string;
  tradeoff: string;
}

export interface MarketingCategory {
  awarenessLadders: MarketingFramework[];
  funnelTypes: MarketingFramework[];
  demandGeneration: MarketingFramework[];
  directResponse: MarketingFramework[];
  brandMarketing: MarketingFramework[];
  launchLogic: MarketingFramework[];
  creatorLedMarketing: MarketingFramework[];
  communityLedGrowth: MarketingFramework[];
  referralSystems: MarketingFramework[];
  partnershipStrategy: MarketingFramework[];
  eventBasedMarketing: MarketingFramework[];
  localBusinessTactics: MarketingFramework[];
  b2bTrustCycles: MarketingFramework[];
  socialProofSystems: MarketingFramework[];
}

export const MARKETING_LIBRARY: MarketingCategory = {
  awarenessLadders: [
    {
      name: 'Eugene Schwartz Awareness Spectrum',
      principle: 'Prospects exist on a spectrum from completely unaware of their problem to fully aware of your specific solution. Your marketing message must match their current awareness level. Selling to an unaware audience requires education first, not a pitch.',
      whenToUse: 'When crafting any marketing message, ad, or content piece. The awareness level of the audience determines the entire angle.',
      example: 'For a productivity app: Unaware audience gets content about why they feel burned out. Problem-aware gets content about time management challenges. Solution-aware gets comparisons. Product-aware gets offers and social proof.',
      tradeoff: 'Creating content for every awareness level requires more resources. Most businesses should focus on 1-2 levels where their audience concentrates and let the funnel handle transitions.',
    },
    {
      name: 'Awareness Escalation Through Content',
      principle: 'Content marketing is most powerful as an awareness escalation tool. Each piece of content should move the reader one step up the awareness ladder, from unaware to problem-aware to solution-aware to product-aware to most-aware.',
      whenToUse: 'When building content strategy, email nurture sequences, or educational marketing funnels.',
      example: 'A cybersecurity company publishes a blog about recent data breaches (unaware to problem-aware), then an email about common vulnerabilities (solution-aware), then a comparison guide (product-aware), then a case study with ROI (most-aware).',
      tradeoff: 'This approach is slow. Direct response to already-aware audiences converts faster. Use escalation for top-of-funnel growth and direct response for bottom-of-funnel conversion.',
    },
    {
      name: 'Market Sophistication Matching',
      principle: 'The more marketing a market has been exposed to, the more sophisticated your approach must be. First movers can use simple claims. Late entrants must use mechanisms, stories, or identity-based appeals because simple claims are no longer believed.',
      whenToUse: 'When entering an established market. When your straightforward marketing messages are not converting despite being true.',
      example: 'The first weight loss pill could say "Lose weight fast." The tenth must explain the mechanism: "Blocks carb absorption using a patented enzyme extract." The hundredth must use identity: "For women who have tried everything and refuse to give up."',
      tradeoff: 'Sophisticated messaging requires deeper customer understanding and more creative resources. It is also harder to test and iterate because the variables are more nuanced.',
    },
    {
      name: 'Problem Agitation Before Solution',
      principle: 'Before presenting a solution, agitate the problem until the audience deeply feels the pain. People do not buy solutions to problems they do not feel. The depth of felt need determines willingness to pay.',
      whenToUse: 'In sales pages, webinar pitches, and video ads. Whenever the audience is problem-aware but not yet motivated to act.',
      example: 'A financial planning service does not start with their features. They start with the anxiety of not knowing if you can retire, the embarrassment of living paycheck to paycheck despite a good income, and the fear of leaving your family unprotected.',
      tradeoff: 'Over-agitation feels manipulative and can repel sophisticated audiences. The agitation must reflect genuine pain the prospect already feels, not manufactured anxiety.',
    },
  ],

  funnelTypes: [
    {
      name: 'Lead Magnet Funnel',
      principle: 'Exchange valuable free content for contact information, then nurture through email toward a purchase. The lead magnet must solve a real, specific problem to attract qualified leads rather than freebie seekers.',
      whenToUse: 'For considered purchases, B2B, education, and coaching businesses. When the sales cycle is longer than one touchpoint.',
      example: 'A CPA firm offers a free tax savings calculator that requires email entry. Leads receive a 7-email sequence with tax tips, then an invitation to a free strategy call. 5% of leads book calls, 40% of calls convert.',
      tradeoff: 'Lead magnet funnels have low conversion rates per lead. You need volume. The lead magnet quality directly determines lead quality, so a weak magnet fills your list with people who will never buy.',
    },
    {
      name: 'Webinar Funnel',
      principle: 'A live or automated webinar serves as a trust-building and selling event. 60-90 minutes of genuine value followed by a pitch leverages reciprocity, demonstration, and time investment to achieve high conversion rates.',
      whenToUse: 'For products priced $200-$5,000. When the offer requires explanation. When the audience needs to see you in action before buying.',
      example: 'A business coach runs a weekly live webinar teaching one strategy in depth for 45 minutes, then pitches a $2,000 program for the last 15 minutes. Attendees convert at 8-12%, which is dramatically higher than a cold sales page.',
      tradeoff: 'Webinars require strong presentation skills and consistent execution. Automated webinars lose the live energy that drives conversion. The format is also becoming saturated in some markets.',
    },
    {
      name: 'Tripwire Funnel',
      principle: 'A very low-priced offer ($1-$49) converts a prospect into a buyer. Once someone has made any purchase, the psychological barrier to subsequent purchases drops dramatically. The tripwire funds acquisition and qualifies buyers.',
      whenToUse: 'When you have a high-value backend offer and need to identify buyers from a large audience. For e-commerce, digital products, and membership sites.',
      example: 'A photography education business sells a $7 Lightroom preset pack via Facebook ads. Buyers then receive an upsell for a $197 editing course, then a $997 business course. The $7 product breaks even on ads while identifying buyers.',
      tradeoff: 'Tripwire buyers may be deal-seekers who do not upgrade. The quality of the tripwire must be genuinely good or it damages trust for the upsell. Low prices can also attract the wrong customer profile.',
    },
    {
      name: 'Application Funnel',
      principle: 'For high-ticket offers, making prospects apply creates scarcity, qualifies leads, and reverses the power dynamic. The seller evaluates the buyer rather than the reverse. This works because high-ticket buyers want exclusivity.',
      whenToUse: 'For offers above $3,000. For coaching, consulting, agencies, and mastermind groups where client fit matters.',
      example: 'A business accelerator program requires a detailed application covering revenue, goals, and challenges. Only 30% are accepted. Accepted applicants convert at 60%+ because the acceptance itself creates commitment and perceived value.',
      tradeoff: 'Application funnels reduce volume dramatically. If your market is not prestige-oriented, applications feel like unnecessary friction. This works for premium positioning but fails for mass-market offers.',
    },
    {
      name: 'Challenge Funnel',
      principle: 'A free multi-day challenge delivers quick wins through daily actions, building momentum, community, and trust. The pitch at the end converts participants who have already experienced a transformation and want more.',
      whenToUse: 'For launches, list building, and community creation. Best for fitness, education, creative, and self-improvement markets.',
      example: 'A meal prep brand runs a free 5-Day Clean Eating Challenge. Participants receive daily recipes, join a Facebook group, and share their meals. On day 5, they are offered a $149 12-week meal plan. 15% of completers buy.',
      tradeoff: 'Challenge funnels require significant daily content creation and community management. Completion rates are typically 20-30%, so most registrants never see the offer. They are also time-intensive to run.',
    },
  ],

  demandGeneration: [
    {
      name: 'Content-Led Demand Generation',
      principle: 'Creating educational content that addresses industry problems generates demand by shaping how prospects think about their challenges. When they decide to buy, they choose the brand that taught them the framework they are using to evaluate options.',
      whenToUse: 'For complex B2B products, professional services, and any market where the buyer journey involves significant research.',
      example: 'HubSpot created the inbound marketing category through years of educational content. When businesses decided they needed marketing software, HubSpot was the default because they had already adopted the HubSpot framework.',
      tradeoff: 'Content-led demand generation takes 12-24 months to produce meaningful results. It requires consistent investment before seeing returns and does not work for simple, impulse purchases.',
    },
    {
      name: 'Problem Amplification',
      principle: 'Make the cost of the status quo viscerally clear. People will not seek solutions for problems they have normalized. Demand generation starts with de-normalizing the pain.',
      whenToUse: 'When your target market has accepted their current painful state as normal. When the problem is real but not urgent in their minds.',
      example: 'A time tracking tool creates content showing that the average knowledge worker loses 21.8 hours per week to meetings, email, and context switching. The financial cost at their salary: $50,000/year wasted. Suddenly, a $200/year tool seems obvious.',
      tradeoff: 'Problem amplification can come across as fearmongering. The line between education and manipulation depends on whether the problem and costs are real and whether your solution genuinely addresses them.',
    },
    {
      name: 'Demand Capture vs Demand Creation',
      principle: 'Demand capture targets people already searching for solutions (SEO, Google Ads, comparison content). Demand creation targets people who do not yet know they need you (social content, thought leadership, education). Most businesses need both but should sequence them.',
      whenToUse: 'When prioritizing marketing budget. Capture existing demand first for immediate revenue, then invest in demand creation for long-term growth.',
      example: 'A CRM startup spends 70% of their budget on Google Ads capturing existing search demand for CRM software, and 30% on LinkedIn content creating demand among businesses that have not realized they need a CRM.',
      tradeoff: 'Demand capture is competitive and expensive because everyone is fighting for the same intent. Demand creation is cheaper per impression but slower to convert and harder to attribute.',
    },
    {
      name: 'Category Education Strategy',
      principle: 'When your product creates a new category, you must educate the market on the category before you can sell the product. This is expensive but creates a massive first-mover advantage because you define the evaluation criteria.',
      whenToUse: 'When your product solves a problem people do not know they have, or solves it in a fundamentally new way that has no existing comparison.',
      example: 'When Drift launched conversational marketing, they spent two years creating content, events, and a community around the concept before aggressively selling their product. They defined the category and captured most of its value.',
      tradeoff: 'Category education is the most expensive form of marketing and benefits all players, including future competitors. You must convert education investment into brand association quickly.',
    },
  ],

  directResponse: [
    {
      name: 'AIDA Framework',
      principle: 'Attention, Interest, Desire, Action. Every direct response piece must grab attention, build interest with relevant information, create desire through benefits and proof, then provide a clear call to action. Skip any step and conversion drops.',
      whenToUse: 'For sales pages, email campaigns, video ads, and any marketing piece with a specific conversion goal.',
      example: 'A headline grabs attention with a bold claim. The opening story builds interest. Testimonials and benefit stacks create desire. A limited-time offer with a clear button drives action.',
      tradeoff: 'AIDA is formulaic and can feel manipulative to sophisticated audiences. Modern variations integrate these elements more subtly through storytelling and value-first approaches.',
    },
    {
      name: 'Direct Response Copy Principles',
      principle: 'Write to one person, not an audience. Lead with the biggest benefit. Use specificity over vagueness. Make the offer irresistible. Create urgency that is real. Remove all risk. Tell them exactly what to do next.',
      whenToUse: 'When writing any sales-oriented copy: ads, emails, landing pages, sales pages, or pitch scripts.',
      example: 'Instead of "Our software helps businesses grow," write "Add $47,000 in monthly recurring revenue within 90 days, or your money back. Join 2,347 SaaS founders who already have."',
      tradeoff: 'Aggressive direct response copy can damage brand perception in markets where subtlety is expected. B2B enterprise and luxury markets often require a more understated approach.',
    },
    {
      name: 'Offer-First Marketing',
      principle: 'An irresistible offer converts more than brilliant copy on a mediocre offer. Start with the offer, make it genuinely valuable, add risk reversal, and the copy writes itself. Most conversion problems are offer problems, not copy problems.',
      whenToUse: 'Before investing in copywriters or ad creative. When conversion rates are low despite good traffic.',
      example: 'A gym struggling with $50/month memberships restructures: $1 for the first 30 days, personal training assessment included, cancel anytime, plus a free protein shaker. Same gym, same equipment, 3x the signups.',
      tradeoff: 'Irresistible offers can attract bargain hunters. The backend must be strong enough to retain and monetize the customers the front-end offer attracts.',
    },
    {
      name: 'Response Mechanism Optimization',
      principle: 'The easier you make it to respond, the more responses you get. Every click, form field, and decision point between the prospect and the conversion is a leak in your funnel. Reduce friction ruthlessly.',
      whenToUse: 'When auditing any conversion flow. When you have good traffic and engagement but poor conversion rates.',
      example: 'An insurance quote form reduces from 12 fields to 3 (name, email, zip code) and adds a "Get Quotes" button above the fold. Completion rate increases from 8% to 23%. Remaining info is collected after initial engagement.',
      tradeoff: 'Reducing friction can lower lead quality. Fewer qualification steps mean more unqualified leads, increasing sales team workload. Balance ease of response with lead quality.',
    },
    {
      name: 'Split Testing Discipline',
      principle: 'Test one variable at a time with sufficient sample size. Most businesses make decisions on insufficient data or test too many variables simultaneously. A statistically significant 5% improvement compounding over 20 tests doubles conversion.',
      whenToUse: 'When you have enough traffic to achieve statistical significance (typically 200+ conversions per variation). When you want to systematically improve an existing funnel.',
      example: 'An e-commerce store tests headlines first (2 weeks), then hero images (2 weeks), then CTA button color and text (2 weeks), then price presentation. Each test improves conversion 3-8%. After 6 months, overall conversion has doubled.',
      tradeoff: 'Testing requires patience and volume. With low traffic, tests take months. Some businesses benefit more from big strategic changes than incremental testing.',
    },
  ],

  brandMarketing: [
    {
      name: 'Brand as Trust Infrastructure',
      principle: 'A brand reduces the cognitive cost of choosing you. In a world of infinite options, a recognized brand is a shortcut that says this is safe, this is good, I do not need to research further. Brand marketing builds this shortcut over time.',
      whenToUse: 'When competing in crowded markets. When your product is not dramatically different from competitors. When customer acquisition costs keep rising.',
      example: 'Apple does not compete on specs. They compete on the trust that anything with an Apple logo will be well-designed and work seamlessly. This trust, built over decades, allows premium pricing and reduces sales friction.',
      tradeoff: 'Brand marketing is slow and hard to measure. The ROI is real but diffuse, making it difficult to justify to stakeholders who want immediate, attributable returns.',
    },
    {
      name: 'Brand Positioning Through Consistency',
      principle: 'Brand is not what you say. It is what you repeatedly do. Consistent visual identity, tone, quality, and values across every touchpoint compounds into brand recognition and trust. Inconsistency destroys brand faster than anything.',
      whenToUse: 'When creating brand guidelines, evaluating marketing execution, or diagnosing why brand perception does not match intent.',
      example: 'A craft coffee brand maintains the same warm, educational tone across packaging, social media, emails, and in-store experience. After 2 years, customers describe the brand exactly as intended: knowledgeable, approachable, artisanal.',
      tradeoff: 'Consistency can become rigidity. Brands must evolve, but evolution should feel like growth, not inconsistency. The balance between consistency and freshness requires constant attention.',
    },
    {
      name: 'Emotional Brand Association',
      principle: 'The strongest brands are not associated with products. They are associated with feelings. Nike is not shoes; it is empowerment. Patagonia is not jackets; it is environmental values. Build emotional associations that transcend the product.',
      whenToUse: 'When building long-term brand strategy. When you want customers to choose you for reasons beyond features and price.',
      example: 'A pet food brand builds their entire marketing around the emotional bond between owners and pets. They never lead with ingredients or price. Every touchpoint reinforces: we love your pet as much as you do.',
      tradeoff: 'Emotional branding without product substance creates backlash when the product fails to deliver. The emotion must be earned through genuine quality and aligned business practices.',
    },
    {
      name: 'Brand Storytelling',
      principle: 'Stories are how humans process and remember information. A brand with a compelling origin story, mission narrative, and customer transformation stories is stickier, more shareable, and more trusted than one with only product information.',
      whenToUse: 'In about pages, pitch decks, social media, PR, and any context where you need to create emotional connection and memorability.',
      example: 'TOMS Shoes built their entire brand on the story of giving a pair for every pair sold. The story was simple, shareable, and gave customers a reason to choose TOMS beyond the product itself.',
      tradeoff: 'Stories must be genuine. Fabricated or exaggerated origin stories are discovered and punished by modern consumers. Authentic stories are more powerful but require real substance.',
    },
  ],

  launchLogic: [
    {
      name: 'Pre-Launch Audience Building',
      principle: 'The launch is not the start of marketing. It is the culmination. Build an audience, email list, and anticipation months before launch. The most successful launches sell out on day one because the demand was built before the product existed.',
      whenToUse: 'Starting 3-6 months before any product or service launch. When you want a strong launch rather than a slow ramp.',
      example: 'An author builds a 10,000-person email list over 6 months through guest posts and a free chapter. On launch day, 3,000 copies sell immediately, hitting bestseller lists and creating organic momentum.',
      tradeoff: 'Pre-launch building requires patience and resources with no immediate revenue. If the product changes significantly during development, the pre-built audience may not align.',
    },
    {
      name: 'Launch Window Urgency',
      principle: 'A defined launch window with a real open-close date creates genuine urgency. Enrollment opens Monday and closes Friday is more effective than always available. Scarcity and deadlines drive action because humans procrastinate by default.',
      whenToUse: 'For courses, coaching programs, membership sites, and any offer where batch enrollment is feasible. Especially effective for digital products.',
      example: 'A course opens for enrollment twice per year for 5 days each time. Revenue per launch is 4x what the always-available version generated monthly, because the deadline forces decisions.',
      tradeoff: 'Closed-cart models sacrifice continuous revenue for burst revenue. They also require significant launch energy each cycle and can miss customers who discover you between launches.',
    },
    {
      name: 'Seed Launch Strategy',
      principle: 'Sell a small first version to a small group, deliver live, incorporate feedback, then use results and testimonials for the full launch. The seed launch validates the product and creates case studies simultaneously.',
      whenToUse: 'For a first-time launch of any offer. When you do not have testimonials or proven results yet. When you want to minimize risk.',
      example: 'A fitness coach sells a 6-week beta program to 10 people at 50% off. She delivers it live, adjusts based on feedback, and gets 8 transformation testimonials. The full launch at full price converts at 3x the rate.',
      tradeoff: 'Seed launches are small and may not generate meaningful revenue. They work best as a step toward a larger launch, not as a standalone strategy.',
    },
    {
      name: 'Launch Sequence Email Architecture',
      principle: 'A launch email sequence follows a precise emotional arc: story and connection, education and value, objection handling, social proof, urgency and deadline. Each email serves a specific psychological function in the conversion journey.',
      whenToUse: 'For any email-list-based launch. The core framework applies to live launches, evergreen funnels, and seasonal promotions.',
      example: 'Day 1: Origin story and why this matters. Day 2: Teaching a framework from the course. Day 3: FAQ and objection busting. Day 4: Case studies and testimonials. Day 5: Last chance with deadline reminder. Day 6: Final hours.',
      tradeoff: 'Launch sequences require a warm list. Sending aggressive sales sequences to a cold list burns trust fast. The relationship must predate the pitch.',
    },
    {
      name: 'Post-Launch Momentum',
      principle: 'The work after launch matters more than the launch itself. Convert launch energy into ongoing content, case studies, and referral systems. The launch is a spike; post-launch systems create sustainable growth.',
      whenToUse: 'Immediately after any launch. When initial launch excitement fades and you need ongoing traction.',
      example: 'After launching a course, the creator publishes weekly student wins, turns module content into blog posts, and implements a referral program giving students a bonus for each enrollment they drive.',
      tradeoff: 'Post-launch work is less exciting than launch preparation and easy to neglect. Many businesses go from launch to launch without building the connective tissue between them.',
    },
  ],

  creatorLedMarketing: [
    {
      name: 'Personal Brand as Distribution',
      principle: 'A personal brand with audience trust can launch any product into an existing market of believers. The creator IS the marketing channel. This is the most capital-efficient go-to-market strategy available to individuals.',
      whenToUse: 'When an individual has expertise and is willing to be the face of the business. Best for coaching, consulting, courses, and creator economy businesses.',
      example: 'A fitness creator with 100K followers launches a supplement brand. No paid ads needed. The first batch sells out in 48 hours because the audience trusts their recommendations.',
      tradeoff: 'Personal brands create key-person risk. The business cannot function without the creator. Burnout, controversy, or the creator wanting to step back can be existential threats.',
    },
    {
      name: 'Authority Through Teaching',
      principle: 'Teaching what you know for free in public establishes authority faster than any credential. Consistent, specific, useful content positions you as the expert in your field. The audience learns from you, then pays you for implementation.',
      whenToUse: 'When building a service business, consulting practice, or course-based business. When you have expertise but no existing reputation.',
      example: 'A tax strategist posts daily threads on tax optimization tips. After 6 months, she has 50K followers and a waitlist for her $5,000 tax planning service. Her content was the sales pitch and the proof.',
      tradeoff: 'Teaching publicly means competitors learn your methods. The advantage is in execution and relationship, not information monopoly. You must be comfortable with this.',
    },
    {
      name: 'Content Flywheel',
      principle: 'One piece of long-form content becomes multiple short-form pieces across platforms. A podcast episode becomes clips, quotes, blog posts, and newsletter content. This multiplier effect makes consistent content creation sustainable.',
      whenToUse: 'When a creator needs to maintain presence across multiple platforms without creating unique content for each one.',
      example: 'A business coach records one 60-minute weekly YouTube video. The team creates 5 short clips for TikTok/Reels, 3 Twitter threads, 1 newsletter, and 1 blog post from each episode. One creation session feeds all channels.',
      tradeoff: 'Repurposed content can feel repetitive to followers on multiple platforms. Adaptation for each platform format and culture is essential. Direct copy-paste across platforms underperforms.',
    },
    {
      name: 'Audience-First Product Development',
      principle: 'Build the audience before the product. An engaged audience tells you what they want to buy, validates ideas in real-time, and provides built-in distribution for launch. The product is the last step, not the first.',
      whenToUse: 'For any creator considering a product launch. When you do not yet know what to sell but have subject matter expertise.',
      example: 'A design educator grows a newsletter to 20K subscribers while teaching free design principles. She surveys the list, discovers 60% want a brand identity course, pre-sells it, and delivers to 500 paying students.',
      tradeoff: 'Audience-building is slow and requires content creation without immediate monetization. There is also a risk that the audience you build wants free content, not paid products.',
    },
    {
      name: 'Parasocial Trust Mechanics',
      principle: 'Audiences develop one-directional relationships with creators, feeling they know and trust them personally. This parasocial trust is a genuine business asset but comes with ethical responsibility. It must be earned through authenticity and honored through honesty.',
      whenToUse: 'When leveraging personal brand for product sales. Understanding this dynamic helps you sell responsibly and avoid exploiting audience trust.',
      example: 'A YouTube creator recommends a product and gets 10x the conversion rate of a traditional ad because viewers feel they trust a friend, not a marketer. The creator tests every product personally before recommending it.',
      tradeoff: 'Parasocial trust is fragile and asymmetric. One dishonest recommendation can destroy years of trust. The creator must maintain genuine standards, not just the appearance of them.',
    },
  ],

  communityLedGrowth: [
    {
      name: 'Community as Competitive Moat',
      principle: 'Products can be copied. Features can be replicated. A thriving community of engaged members who help each other is nearly impossible to compete with. The community becomes the product, and the product becomes the platform.',
      whenToUse: 'When your product benefits from network effects. When customer success depends on peer support. When you want to build a defensible, long-term business.',
      example: 'A project management tool builds an active user community where members share templates, workflows, and troubleshooting tips. New users join for the tool but stay for the community. Competitors cannot poach the community.',
      tradeoff: 'Communities require dedicated management, moderation, and energy. A neglected community is worse than no community. Plan for ongoing investment in community health.',
    },
    {
      name: 'User-Generated Content Engine',
      principle: 'When community members create content about your product (reviews, tutorials, use cases), they generate authentic marketing that no brand-created content can match. Design systems that make UGC easy and rewarding.',
      whenToUse: 'When you have active users who love your product. When you need to scale content creation beyond your team capacity.',
      example: 'A Notion-like tool creates a template gallery where users submit their own templates. Each template links back to the creator and the tool. Users market the tool to their own audiences while contributing to the gallery.',
      tradeoff: 'UGC quality varies wildly. Curation is necessary but can discourage participation if too strict. The balance between quality and quantity requires ongoing attention.',
    },
    {
      name: 'Community-Led Onboarding',
      principle: 'Peer onboarding is more effective than company-led onboarding because new users trust existing users more than they trust the brand. Build systems where experienced members guide newcomers.',
      whenToUse: 'When onboarding is complex and churn is highest in the first 30 days. When you cannot afford 1:1 onboarding for all users.',
      example: 'A SaaS tool pairs each new user with a community buddy who has similar use cases. Retention at 30 days increases from 65% to 82% because the buddy provides contextual, personalized help.',
      tradeoff: 'Buddy systems depend on the quality of the buddies. Poorly matched or unmotivated buddies can make the experience worse. Incentive design and matching algorithms matter.',
    },
    {
      name: 'Community Feedback Loop',
      principle: 'Active communities provide real-time market research. Feature requests, pain points, and use cases surface naturally through community discussion. This eliminates guesswork in product development.',
      whenToUse: 'When planning product roadmap, evaluating feature requests, or trying to understand why customers churn.',
      example: 'A fitness app uses their private community to test new feature ideas before development. A 48-hour discussion thread on a proposed feature generates more actionable feedback than 3 months of formal user research.',
      tradeoff: 'Community feedback represents your most engaged users, who may have very different needs from your average user. Vocal minority bias is real. Validate community insights with broader data.',
    },
  ],

  referralSystems: [
    {
      name: 'Incentive-Aligned Referral Design',
      principle: 'The best referral programs reward both parties: the referrer and the referred. One-sided incentives feel transactional. Mutual benefit creates a gift dynamic where the referrer feels they are helping a friend, not selling to them.',
      whenToUse: 'When designing any formal referral program. When word-of-mouth exists informally and you want to accelerate it.',
      example: 'A subscription box gives both the referrer and referred a free box. The referrer feels they are giving a friend a gift, not extracting a commission. Referral rates are 3x a referrer-only incentive.',
      tradeoff: 'Double-sided incentives cost more per referral. The economics must support the cost. If your CLV is low, double-sided referrals may not be sustainable.',
    },
    {
      name: 'Referral Timing Windows',
      principle: 'Referral likelihood peaks at specific moments: right after a positive experience, right after achieving a result, and right after receiving exceptional service. Ask for referrals at these peaks, not at arbitrary intervals.',
      whenToUse: 'When building automated referral asks into customer journeys. When your referral program exists but underperforms.',
      example: 'A language learning app asks for referrals immediately after a user completes a milestone level and sees their progress summary. Referral rate at this moment is 5x the average in-app referral prompt.',
      tradeoff: 'Peak-moment referral asks must be tasteful and brief. Heavy-handed asks at emotional moments feel exploitative. The request should feel natural, not transactional.',
    },
    {
      name: 'Viral Mechanics Design',
      principle: 'Products that are inherently shared as part of their use have built-in viral loops. The referral mechanism is the product itself, not a bolt-on program. Design sharing into the core experience.',
      whenToUse: 'During product design phase. When you want organic growth without a formal referral program.',
      example: 'A collaborative document tool grows every time a user shares a document with a non-user. The non-user must create an account to collaborate, becoming a new user who then shares with their colleagues.',
      tradeoff: 'Forced virality (requiring accounts to view shared content) frustrates users. The best viral loops create genuine value for the sharer and the recipient.',
    },
    {
      name: 'Referral Program as Trust Transfer',
      principle: 'A referral is fundamentally a trust transfer. The referrer is lending their credibility to your brand. This is why referral customers have higher CLV and lower acquisition cost: they arrive pre-trusted.',
      whenToUse: 'When evaluating acquisition channels. When trying to reduce CAC in high-trust markets.',
      example: 'A financial advisor finds that referred clients have 2x the retention and 3x the asset under management compared to clients from advertising. She restructures her practice around referral generation.',
      tradeoff: 'Referral-dependent businesses grow slowly and are subject to network limits. Eventually you exhaust your existing customers social circles and must find other growth channels.',
    },
  ],

  partnershipStrategy: [
    {
      name: 'Complementary Audience Partnerships',
      principle: 'Partner with businesses that serve the same audience with non-competing products. You share audiences, and both parties benefit. The key is finding partners where the value exchange is balanced.',
      whenToUse: 'When you need to reach a new audience without paid advertising. When you have an established audience that is valuable to potential partners.',
      example: 'A wedding photographer partners with a florist, a venue, and a caterer. Each recommends the others to their clients. The photographer gets 40% of their bookings from partner referrals at zero acquisition cost.',
      tradeoff: 'Partner quality reflects on your brand. A bad experience with a partner damages your reputation. Vet partners carefully and create clear quality expectations.',
    },
    {
      name: 'Joint Venture Launches',
      principle: 'Two or more businesses co-create and co-promote a product, sharing both the work and the audience. Each partner brings their strengths: one might have the product expertise, the other the distribution.',
      whenToUse: 'When you have expertise but lack audience, or vice versa. When launching into a new market where you have no existing presence.',
      example: 'A well-known fitness influencer and a nutrition scientist co-create a meal planning app. The influencer provides distribution (500K followers); the scientist provides credibility (PhD, published research). Both contribute what the other lacks.',
      tradeoff: 'Joint ventures require clear agreements on revenue split, decision-making, and brand usage. Most JV failures come from misaligned expectations, not bad ideas.',
    },
    {
      name: 'Affiliate as Partnership',
      principle: 'Well-structured affiliate programs align incentives between you and your partners. Pay enough to make promotion worth their effort, provide them with assets that make promotion easy, and treat affiliates as partners, not channels.',
      whenToUse: 'When you have a proven offer with good margins. When you want to scale distribution without scaling your team.',
      example: 'A SaaS tool offers 30% recurring commission to affiliates. Top affiliates earn $5,000+/month and treat the tool as a core part of their content strategy. The tool gets customers at a fixed percentage of revenue rather than speculative ad spend.',
      tradeoff: 'Affiliates may use aggressive tactics that damage your brand. Clear terms of service and active monitoring are essential. Recurring commissions are expensive but create alignment.',
    },
    {
      name: 'Strategic Co-Marketing',
      principle: 'Co-marketing amplifies reach for both partners without the commitment of a joint venture. Shared webinars, guest content swaps, and joint giveaways expose each brand to the others audience at minimal cost.',
      whenToUse: 'When you want to test partnership potential before committing to deeper collaboration. When you need to grow your audience but lack budget for paid acquisition.',
      example: 'Two non-competing SaaS tools co-host a monthly webinar. Each promotes to their email list. Both lists grow by 500-1,000 per event, with each new subscriber being pre-qualified by the partner endorsement.',
      tradeoff: 'Co-marketing effectiveness depends on audience quality match. If your partner has a large but unaligned audience, the leads will not convert regardless of volume.',
    },
  ],

  eventBasedMarketing: [
    {
      name: 'Seasonal and Cultural Moment Marketing',
      principle: 'Tying your marketing to cultural events, seasons, holidays, or trending moments gives your message contextual relevance and natural urgency. The hook already exists in the publics attention; you just need to connect your offer to it.',
      whenToUse: 'When planning content calendars, promotions, and campaign timing. When you need urgency that does not feel manufactured.',
      example: 'A tax preparation service runs their biggest campaign in January, when New Years resolutions and W-2 arrivals create natural demand. The urgency is real, not manufactured.',
      tradeoff: 'Everyone competes for attention during major cultural moments. Standing out during Christmas or Black Friday requires either massive budget or a genuinely creative angle.',
    },
    {
      name: 'Milestone-Based Campaigns',
      principle: 'Use business milestones (10,000 customers, 5-year anniversary, product updates) as marketing events. Milestones create natural storytelling opportunities and reasons for celebration that include the audience.',
      whenToUse: 'When you need a promotional hook that is not a holiday or manufactured deadline. When you want to celebrate with your community while driving sales.',
      example: 'A SaaS tool celebrates 10,000 users with a 48-hour 40% discount. The milestone feels genuine, the celebration feels inclusive, and the urgency is real because it is a one-time event.',
      tradeoff: 'Milestone celebrations lose impact if overused. An anniversary sale every month is not a milestone. Save these events for genuinely notable achievements.',
    },
    {
      name: 'Live Event Energy',
      principle: 'Live events (webinars, workshops, live streams, in-person events) create a unique energy that recorded content cannot match. The combination of real-time interaction, social proof from other attendees, and fear of missing out drives action.',
      whenToUse: 'For high-ticket sales, community building, and brand awareness. When you need to create excitement and urgency around a launch.',
      example: 'A business coach fills a 200-seat live event for $997/ticket. At the event, 30% of attendees upgrade to a $10,000 mastermind. The live environment creates a decision-making context that email never could.',
      tradeoff: 'Live events are logistically complex, expensive, and risky. Low attendance is embarrassing and financially painful. Start small and build a track record before scaling event investments.',
    },
    {
      name: 'Reactive Marketing',
      principle: 'Responding quickly to current events, news, and cultural moments with relevant, brand-aligned content captures disproportionate attention. Speed and relevance beat production quality in reactive marketing.',
      whenToUse: 'When a relevant news event or trend aligns with your expertise or product. When you have the agility to create and publish content within hours.',
      example: 'When a major data breach hits the news, a cybersecurity company publishes a breakdown of what happened and actionable steps for businesses within 4 hours. The post gets 100x their normal traffic.',
      tradeoff: 'Reactive marketing requires speed, judgment, and a willingness to be imperfect. Getting it wrong (tone-deaf, inaccurate, or opportunistic) creates backlash.',
    },
  ],

  localBusinessTactics: [
    {
      name: 'Google Business Profile Optimization',
      principle: 'For local businesses, Google Business Profile is often the single most important marketing asset. A fully optimized profile with regular posts, photos, and active review management dominates local search results.',
      whenToUse: 'For any business with a physical location or service area. This should be the first marketing investment for local businesses.',
      example: 'A plumber optimizes their GBP with 50+ photos, weekly posts showing completed jobs, and a system for requesting reviews after every service call. They rank in the top 3 local results and get 80% of their leads from Google.',
      tradeoff: 'GBP optimization is free but requires consistent effort. Google regularly changes algorithms and features. What works today may not work in 6 months.',
    },
    {
      name: 'Local Social Proof Amplification',
      principle: 'In local markets, word-of-mouth and visible social proof are disproportionately powerful. Everyone knows everyone, and a reputation spreads fast in both directions. Invest heavily in making positive experiences visible.',
      whenToUse: 'For any local business that relies on community trust. Especially important for services where trust is a prerequisite.',
      example: 'A local dentist photographs every satisfied patient (with permission) and posts to Instagram with the location tag. The consistent stream of real, local faces builds trust faster than any ad campaign.',
      tradeoff: 'Local social proof requires genuine quality. Negative local word-of-mouth spreads even faster than positive. One bad experience can undo months of reputation building.',
    },
    {
      name: 'Hyper-Local Partnerships',
      principle: 'Local businesses thrive through dense networks of cross-referrals. A web of partnerships with complementary local businesses creates an ecosystem where customers flow between trusted partners.',
      whenToUse: 'For any local business looking to reduce acquisition costs and build community presence.',
      example: 'A yoga studio partners with a juice bar, a massage therapist, and an organic grocery store. Each displays the others business cards and offers mutual discounts. New customer acquisition cost drops to nearly zero.',
      tradeoff: 'Local partnerships require relationship maintenance and quality monitoring. A partners bad service reflects on you.',
    },
    {
      name: 'Neighborhood Content Strategy',
      principle: 'Creating content about the local area, events, and community positions a business as a community member, not just a vendor. This builds organic local search presence and emotional connection simultaneously.',
      whenToUse: 'When building a local SEO and social media strategy. When you want to be seen as part of the community, not just a business in the community.',
      example: 'A real estate agent blogs about local restaurant openings, school ratings, park updates, and neighborhood events. They become the go-to local resource, and when someone needs an agent, they are top of mind.',
      tradeoff: 'Community content takes time to produce and may not directly drive sales. The ROI is indirect but real.',
    },
  ],

  b2bTrustCycles: [
    {
      name: 'Multi-Stakeholder Trust Building',
      principle: 'B2B purchases involve multiple decision makers with different concerns. The user cares about functionality, the manager cares about ROI, and the CTO cares about integration. Your marketing must address all stakeholders.',
      whenToUse: 'When selling to businesses with complex buying committees. When deals stall after initial enthusiasm from one champion.',
      example: 'A SaaS company creates separate content tracks: product demos for users, ROI calculators for managers, security whitepapers for IT, and case studies with recognizable logos for executives.',
      tradeoff: 'Multi-stakeholder marketing requires more content, longer sales cycles, and deeper account understanding. Small teams may not have resources to serve all stakeholders equally.',
    },
    {
      name: 'Thought Leadership as B2B Lead Generation',
      principle: 'In B2B, the company with the best public thinking wins the client. Publishing original research, frameworks, and perspectives positions your team as the experts who should be hired, not just evaluated.',
      whenToUse: 'For any B2B service or product where expertise is a buying criterion. Especially effective for consulting, agencies, and enterprise software.',
      example: 'A cybersecurity firm publishes a quarterly industry threat report. It gets cited by media, shared by CISOs, and used in board presentations. When those companies need cybersecurity help, the firm is already trusted.',
      tradeoff: 'Genuine thought leadership requires original thinking and data, not recycled advice. Most thought leadership is actually noise. Standing out requires real intellectual investment.',
    },
    {
      name: 'Account-Based Marketing',
      principle: 'Instead of casting a wide net, identify your highest-value target accounts and create personalized marketing for each. ABM treats each target company as a market of one, with tailored content, outreach, and relationship building.',
      whenToUse: 'For high-ticket B2B products and services where a few large accounts can make your year. When your total addressable market is hundreds of companies, not thousands.',
      example: 'A B2B SaaS company identifies 50 target accounts and creates custom landing pages, personalized email sequences, and LinkedIn ad campaigns for each. Close rate is 20% vs 2% for generic marketing.',
      tradeoff: 'ABM is resource-intensive and only works when the deal size justifies the investment. A $500/month product does not justify custom marketing per account.',
    },
    {
      name: 'Long Sales Cycle Nurture',
      principle: 'B2B sales cycles can be 3-18 months. The business that stays useful and visible throughout the entire cycle wins. Nurture sequences must provide value at every stage, not just remind prospects you exist.',
      whenToUse: 'When your average deal takes more than 30 days to close. When prospects go cold and re-emerge months later.',
      example: 'An enterprise software company sends monthly industry analysis emails to all prospects, regardless of deal stage. When budget cycles come around, they are the vendor that has been consistently helpful.',
      tradeoff: 'Long nurture sequences require significant content investment for uncertain payoff. Tracking attribution over 12+ month cycles is difficult, making ROI measurement challenging.',
    },
  ],

  socialProofSystems: [
    {
      name: 'Strategic Testimonial Collection',
      principle: 'The best testimonials are specific, outcome-oriented, and address common objections. A generic "great service" testimonial is worthless. A testimonial that says "I was skeptical because X but then Y happened and now Z" is gold.',
      whenToUse: 'When building sales pages, case studies, or any trust-building marketing material. Collect testimonials systematically, not randomly.',
      example: 'A course creator sends a specific testimonial request: What was your biggest hesitation before joining? What specific result did you achieve? What would you tell someone considering it? Each response addresses a different objection.',
      tradeoff: 'Solicited testimonials can feel less authentic than organic ones. Use them as a complement to organic reviews, not a replacement. Never fabricate or significantly edit testimonials.',
    },
    {
      name: 'Case Study Architecture',
      principle: 'A case study should follow the narrative arc: situation, challenge, solution, result, with specific numbers. The reader should see themselves in the situation, feel the pain of the challenge, and want the result.',
      whenToUse: 'For B2B marketing, agency portfolios, high-ticket services, and any complex sale where proof of results is critical.',
      example: 'An SEO agency publishes case studies showing: starting traffic, specific strategies used, timeline, resulting traffic, and revenue impact. Each case study targets a different industry to show range while being specific.',
      tradeoff: 'Good case studies require client cooperation, specific data, and writing skill. Many clients are unwilling to share detailed results publicly. Anonymized case studies are less powerful but still useful.',
    },
    {
      name: 'Social Proof Placement Strategy',
      principle: 'Social proof should appear at decision points, not just in a testimonials section. Place relevant proof next to the specific claim it supports, near the call to action, and at every moment where doubt might arise.',
      whenToUse: 'When designing landing pages, sales pages, checkout flows, and email sequences.',
      example: 'Next to the price, show "Trusted by 5,000+ companies." Next to the feature list, show a relevant testimonial. At the checkout, show a recent purchase notification. Each proof point addresses the doubt specific to that moment.',
      tradeoff: 'Over-saturating a page with social proof can feel desperate. Use the minimum effective dose at each decision point.',
    },
    {
      name: 'Real-Time Social Proof',
      principle: 'Showing live activity (recent purchases, active users, live viewer counts) creates urgency and validation simultaneously. Knowing others are buying right now makes the prospect feel safer and more motivated.',
      whenToUse: 'On high-traffic landing pages and e-commerce sites. During launches and time-limited promotions.',
      example: 'An e-commerce site shows "Sarah from Austin purchased this 3 minutes ago" notifications. Conversion rate increases 15% because each notification is both social proof and urgency.',
      tradeoff: 'Fake real-time notifications are obvious and destroy trust. Only use genuine data. Low-volume businesses should not use this tactic because infrequent notifications highlight lack of demand.',
    },
    {
      name: 'Authority Borrowing',
      principle: 'Associating your brand with recognized authorities (media mentions, celebrity users, expert endorsements, institutional logos) borrows their credibility. As Featured In sections and recognizable client logos do heavy trust-building work.',
      whenToUse: 'On homepages, above the fold on landing pages, and in pitch decks. Anywhere you need to establish credibility quickly.',
      example: 'A startup places "As seen in Forbes, TechCrunch, and The Wall Street Journal" above the fold on their homepage. Even a brief mention in these outlets provides years of trust leverage.',
      tradeoff: 'Authority borrowing only works if the association is genuine. Exaggerating a mention or implying endorsement that does not exist is easily discovered and damages credibility.',
    },
  ],
} as const;
