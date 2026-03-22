// Platform Power Critique Knowledge Library
// Critical analysis of how platforms extract value from businesses and strategies for sovereignty

export interface PowerConcept {
  concept: string;
  description: string;
  howItAffectsBusiness: string;
  signsYoureAffected: string[];
  counterStrategies: string[];
  realWorldExample: string;
}

export const POWER_LIBRARY: Record<string, PowerConcept> = {
  platformRentExtraction: {
    concept: 'Platform Rent Extraction',
    description: 'Platforms charge fees of 15-45% for access to customers, functioning as digital landlords rather than neutral marketplaces. This is the core mechanism of technofeudalism: platforms extract rent from economic activity without creating the underlying value. The platform captures an ever-increasing share of the value that sellers and creators produce.',
    howItAffectsBusiness: 'Your margins are permanently reduced by platform fees that you have no power to negotiate. You cannot lower prices to compete because the platform takes its cut regardless. Your pricing power is constrained by the platform\'s rules. As the platform grows more powerful, fees tend to increase rather than decrease.',
    signsYoureAffected: [
      'Platform fees consume 20%+ of your gross revenue',
      'You cannot contact your own customers directly — the platform owns the relationship',
      'The platform dictates your pricing options, refund policies, and business terms',
      'You cannot differentiate on service or experience because the platform controls the customer interface',
      'Fee increases are announced unilaterally with no negotiation possible',
    ],
    counterStrategies: [
      'Build a direct sales channel alongside your marketplace presence from day one',
      'Use marketplaces for discovery but systematically drive repeat customers to your own platform',
      'Price marketplace listings higher to account for fees, making your direct channel the better deal',
      'Build an email list from every marketplace customer where platform rules allow',
      'Invest in brand recognition so customers search for you directly, bypassing the platform',
    ],
    realWorldExample: 'Amazon sellers pay 15-45% in combined fees while being unable to email their own customers or differentiate on shipping experience. Sellers who build their own Shopify store alongside Amazon retain 85%+ of revenue on direct sales and own the customer relationship permanently.',
  },
  algorithmicDependence: {
    concept: 'Algorithmic Dependence',
    description: 'Your visibility to potential customers is controlled entirely by algorithms you do not own, cannot predict, and cannot negotiate with. A single algorithm update can dramatically increase or destroy your business overnight with no explanation or recourse.',
    howItAffectsBusiness: 'You cannot plan reliably because your distribution is unpredictable. Growth feels random and disconnected from effort. You are forced to chase algorithm trends and platform features instead of building lasting business value. Your strategy becomes reactive to platform changes rather than proactive toward your goals.',
    signsYoureAffected: [
      'Revenue or traffic swings 30%+ month over month without any clear cause',
      'You spend significant time trying to reverse-engineer the algorithm',
      'You change your content strategy every time the platform announces an update',
      'Your best content performs unpredictably — quality does not correlate with results',
      'You have built internal expertise around algorithm gaming rather than customer value',
    ],
    counterStrategies: [
      'Diversify across 3+ discovery channels so no single algorithm controls your fate',
      'Build your email list as your primary business asset — no algorithm between you and subscribers',
      'Create evergreen content that works regardless of which algorithm version is current',
      'Invest in direct relationships through community, referrals, and word of mouth',
      'Treat algorithm-driven platforms as bonus discovery, not your primary growth strategy',
    ],
    realWorldExample: 'Instagram creators who saw 80% reach drops when the algorithm shifted toward Reels. Those who had built email lists and websites barely noticed the change. Their revenue was insulated because their customer relationships existed outside the platform.',
  },
  attentionCapture: {
    concept: 'Attention Capture',
    description: 'Platforms are architecturally optimized to keep users ON the platform, not to direct them to your business. The platform\'s core incentive is maximizing user engagement time and ad impressions, which structurally works against your goal of converting platform users into your customers.',
    howItAffectsBusiness: 'Your content competes with infinite other content for attention within a system designed to minimize the attention directed outside the platform. Posts with external links are algorithmically suppressed. The platform wants users to scroll endlessly, not to visit your website and buy your product.',
    signsYoureAffected: [
      'Posts with links get significantly less reach than posts without them',
      'High engagement on platform but very low website traffic from that platform',
      'Platform features (shops, built-in tools) increasingly compete with your own offerings',
      'The platform is your customer\'s primary experience — your brand is secondary',
      'You spend more time creating content for the platform than building your own assets',
    ],
    counterStrategies: [
      'Use the platform for awareness and trust building, then sell through DMs, email, or bio links',
      'Create content that builds brand memory so people search for you directly on Google',
      'Use bio links and indirect calls-to-action strategically rather than in-post links',
      'Build content that delivers genuine value within the platform while creating desire for more',
      'Train your audience to check your email newsletter or website for the "real" content',
    ],
    realWorldExample: 'Instagram actively suppresses posts with links in captions. Smart creators use "link in bio" combined with DM automation tools. When a follower comments a keyword, they automatically receive a direct link via DM, bypassing the algorithm penalty.',
  },
  creatorExploitation: {
    concept: 'Creator Exploitation Dynamics',
    description: 'Creators produce the content that makes platforms valuable, but platforms capture the vast majority of the economic value. The platform gets advertising revenue, user data, engagement metrics, and cultural relevance. The creator gets variable payouts, "exposure," and the privilege of producing free content that enriches the platform.',
    howItAffectsBusiness: 'You are producing free labor for the platform. Your content trains their recommendation algorithms and attracts their advertisers. You bear all production costs, creative risk, and burnout while the platform controls monetization terms. Revenue share rates decline over time as the platform gains leverage.',
    signsYoureAffected: [
      'Platform ad revenue share keeps decreasing or becoming harder to qualify for',
      'Your content keeps users on the platform but you see minimal direct revenue from it',
      'The platform launches competing features that replicate or commoditize your value',
      'You cannot take your audience with you if you decide to leave the platform',
      'The platform uses your content in AI training or other products without compensation',
    ],
    counterStrategies: [
      'Treat platform content as marketing for your own products, never as the product itself',
      'Convert platform followers to email subscribers at every opportunity',
      'Create products and services the platform cannot replicate or compete with',
      'Diversify revenue to never depend on platform payouts for more than 20% of income',
      'Build your personal brand stronger than your platform presence',
    ],
    realWorldExample: 'YouTube creators earn $2-5 per 1,000 views while YouTube keeps the majority of advertising revenue. Creators who use YouTube primarily for authority building and sell their own courses, products, or services earn 10-100x more per viewer than those who depend on ad revenue.',
  },
  marketplaceCommoditization: {
    concept: 'Marketplace Commoditization',
    description: 'Marketplaces present all sellers as equivalent, interchangeable options within a standardized listing format. Your brand identity, unique story, and differentiated value are flattened into a marketplace listing that looks identical to every competitor. The only remaining dimensions of competition are price and reviews.',
    howItAffectsBusiness: 'Customers compare you purely on price and star ratings. Your brand story, unique value proposition, and meaningful differentiation are invisible within the marketplace interface. This creates a structural race to the bottom on price. Customer loyalty belongs to the marketplace, not to your brand.',
    signsYoureAffected: [
      'Customers do not know your brand name — they think they "bought it on Amazon" or "found it on Etsy"',
      'You are competing primarily on price because the marketplace eliminates other differentiation',
      'Your listings look structurally identical to every competitor in your category',
      'Customer loyalty is to the marketplace, not to your brand — they will buy from whoever is cheapest next time',
      'The marketplace uses your sales data to identify profitable niches and launch competing products',
    ],
    counterStrategies: [
      'Build brand recognition outside the marketplace through content, social media, and community',
      'Include branded packaging and inserts that drive customers to your own website and email list',
      'Create product differentiators that are visible and meaningful within the listing format',
      'Use the marketplace for discovery and initial traction, then migrate relationships to owned channels',
      'Develop brand elements (story, design, community) that create loyalty beyond the transaction',
    ],
    realWorldExample: 'Amazon\'s private label strategy directly copies successful products from its own marketplace sellers, using their sales data to identify profitable opportunities. The only defense is a brand that customers actively seek out and prefer regardless of what Amazon offers.',
  },
  surveillanceIncentives: {
    concept: 'Surveillance Incentives',
    description: 'Platforms profit from collecting, analyzing, and monetizing user data. Every interaction, click, purchase, and even scroll speed becomes data that the platform uses to improve ad targeting, develop new products, and sell insights. Your customers\' behavior on the platform enriches the platform, not you.',
    howItAffectsBusiness: 'The platform knows more about your customers than you do and uses that information to sell access to competitors. Your advertising costs are partially determined by how well the platform has profiled your audience — and they charge you for that access. The data asymmetry grows over time.',
    signsYoureAffected: [
      'You cannot see who visited your marketplace listing or what they did before and after',
      'The platform shows "customers also bought" from your direct competitors on your listings',
      'You receive only aggregate demographic data, never individual customer insights',
      'The platform knows your conversion rates and margins better than you do',
      'Competitors can target your exact audience using the platform\'s data tools',
    ],
    counterStrategies: [
      'Collect first-party data through your own website, surveys, and email engagement tracking',
      'Use post-purchase surveys to learn about your customers directly',
      'Build direct customer relationships where you control the interaction and data',
      'Implement your own analytics alongside any platform analytics',
      'Own the customer journey from discovery to purchase on your own properties where possible',
    ],
    realWorldExample: 'Meta knows more about your advertising audience than you will ever know. When you stop paying for ads, all that intelligence stays with Meta, not with you. A business that builds its own email list with engagement tracking and purchase history owns that customer intelligence permanently.',
  },
  contentModerationConstraints: {
    concept: 'Content Moderation Constraints',
    description: 'Platform rules determine what you can and cannot say, show, or sell. These rules change frequently, are enforced inconsistently and often by automated systems, and can result in account bans or shadowbans without meaningful appeal processes. Entire business categories face structural discrimination.',
    howItAffectsBusiness: 'Your marketing strategy is permanently constrained by platform policies that you did not agree to and cannot negotiate. Entire business categories (adult wellness, cannabis, firearms, supplements) face shadowbanning or deplatforming. You self-censor proactively to avoid algorithmic punishment, limiting your messaging effectiveness.',
    signsYoureAffected: [
      'Posts about your product are regularly flagged, removed, or reach-limited',
      'Your industry has specific platform restrictions that competitors in other categories do not face',
      'You use coded language, euphemisms, or workarounds to avoid content filters',
      'You have had an account suspended, restricted, or shadowbanned',
      'You cannot advertise your core product through the platform\'s paid ad system',
    ],
    counterStrategies: [
      'Build primary marketing channels on platforms with more permissive policies for your category',
      'Own your website and email list — no moderation gatekeeper can restrict your own channels',
      'Maintain backup accounts and cross-platform presence to survive any single platform action',
      'Know each platform\'s written policies for your category and operate strategically within them',
      'Build your audience and revenue on channels where your business is not structurally disadvantaged',
    ],
    realWorldExample: 'Adult content creators being systematically deplatformed from Instagram and TikTok lost their entire audiences and marketing channels overnight. Those who had built email lists, own websites, and presence on permissive platforms (X/Twitter) continued operating without interruption.',
  },
  visibilityFragility: {
    concept: 'Visibility Fragility',
    description: 'Your ability to be seen by potential customers depends on systems you do not control and cannot predict. Platform algorithm changes, search engine updates, AI model training decisions, or content moderation policy shifts can make you invisible to your market overnight with no warning or recourse.',
    howItAffectsBusiness: 'There is no guaranteed baseline of visibility. What works today may not work next month. Long-term marketing planning is difficult when your primary distribution channel is fragile. Revenue projections become unreliable because the inputs are outside your control.',
    signsYoureAffected: [
      'Your traffic from a major source dropped 50%+ without any change on your end',
      'You are not sure exactly how most customers find you anymore',
      'SEO traffic is declining as AI-generated search answers reduce click-through rates',
      'Algorithm changes have materially impacted your revenue in the past 12 months',
      'Your visibility plan depends on a single channel continuing to work as it currently does',
    ],
    counterStrategies: [
      'Build multiple independent discovery channels so no single failure is catastrophic',
      'Invest in direct brand awareness — people searching for you by name cannot be algorithmically blocked',
      'Create remarkable experiences that generate genuine word of mouth independent of any platform',
      'Build AI/LLM visibility (GEO) alongside traditional SEO as the search landscape shifts',
      'Maintain an owned community as a stable, platform-independent visibility base',
    ],
    realWorldExample: 'Google\'s AI Overviews reduced click-through rates for informational searches by 40-60% for many content sites. Businesses that had built direct brand recognition, email lists, and diversified traffic sources were insulated from the change.',
  },
  walledGardenEconomics: {
    concept: 'Walled Garden Economics',
    description: 'Platforms make it easy to build inside their ecosystem and systematically hard to leave. Your audience, content, reputation, reviews, business tools, and operational workflows become locked inside the platform\'s walls. The longer you build, the higher the switching costs become.',
    howItAffectsBusiness: 'Switching costs increase over time as a function of your investment. The longer you build on a platform, the harder and more expensive it becomes to leave. Your investment in the platform compounds — but it compounds for the platform\'s benefit as much as yours. Leaving means starting from zero on everything the platform owns.',
    signsYoureAffected: [
      'Your customer reviews exist only on the platform and cannot be exported or displayed elsewhere',
      'Your content is optimized for one platform\'s format and does not translate to other channels',
      'Your business tools, analytics, and operations are platform-specific',
      'Leaving the platform would effectively mean starting the business over from scratch',
      'You have years of data, relationships, and reputation locked inside the platform',
    ],
    counterStrategies: [
      'Cross-pollinate content and audience to owned channels continuously',
      'Export data regularly wherever the platform allows it',
      'Build reputation, reviews, and presence outside any single platform',
      'Use platform-agnostic tools where possible to maintain operational portability',
      'Create content in formats that work across multiple platforms, not just one',
    ],
    realWorldExample: 'Shopify merchants can export their complete customer database and move to any platform. Amazon sellers cannot access their customer list at all. The choice of platform determines long-term business sovereignty — and this difference is worth hundreds of thousands of dollars over time.',
  },
  directAudienceOwnership: {
    concept: 'Direct Audience Ownership vs Platform Tenancy',
    description: 'The fundamental strategic question every business must answer: Do you own the relationship with your customers, or does a platform own it? Every business decision should be evaluated through the lens of whether it moves you toward greater audience ownership or deeper platform dependency.',
    howItAffectsBusiness: 'Owned audience equals a resilient business. Rented audience equals a fragile business. The ratio between owned and rented audience determines how much of your strategy, pricing, and growth you truly control. Businesses with owned audiences survive platform changes. Businesses with rented audiences do not.',
    signsYoureAffected: [
      'You have 100K social media followers but fewer than 1,000 email subscribers',
      'Revenue would drop 80%+ if one platform disappeared or banned your account',
      'You cannot message your customers directly without going through a platform',
      'Your "audience" is actually the platform\'s audience that temporarily sees your content',
      'You have no website that generates meaningful traffic independent of social platforms',
    ],
    counterStrategies: [
      'Build your email list as the number one strategic priority above all other marketing activities',
      'Create a website as your permanent home base that you fully control',
      'Build community on platforms you own or can export from (email, Discord, own forum)',
      'Make every platform interaction an opportunity to capture a direct contact',
      'Measure success by owned audience growth, not follower count — subscribers over followers',
    ],
    realWorldExample: 'Newsletter businesses like Morning Brew and The Hustle were acquired for hundreds of millions of dollars because they OWNED their audience through email lists. Instagram accounts with comparable reach were worth a fraction of that because the audience belongs to Meta, not to the account holder.',
  },
} as const;
