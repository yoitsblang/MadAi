// Business Foundations Knowledge Library
// Core principles of value creation, pricing, positioning, and business economics

export interface BusinessPrinciple {
  name: string;
  principle: string;
  whenToUse: string;
  example: string;
  tradeoff: string;
}

export interface BusinessCategory {
  valueCreation: BusinessPrinciple[];
  pricing: BusinessPrinciple[];
  customerLifetimeValue: BusinessPrinciple[];
  margins: BusinessPrinciple[];
  offerArchitecture: BusinessPrinciple[];
  positioning: BusinessPrinciple[];
  trustFormation: BusinessPrinciple[];
  operationalBottlenecks: BusinessPrinciple[];
}

export const BUSINESS_LIBRARY: BusinessCategory = {
  valueCreation: [
    {
      name: 'Product-Market Fit Signal Detection',
      principle: 'True product-market fit is not when people say they like your product. It is when they panic at the thought of losing it. Measure pull (inbound demand, word-of-mouth, retention) not push (ad spend, outreach volume).',
      whenToUse: 'When evaluating whether a product or offer is ready to scale, or when diagnosing why growth feels forced.',
      example: 'A meal prep service gets 40% of new customers from referrals and sees 80% month-over-month retention. That is pull. A competing service spends $50/customer on ads and sees 30% churn. That is push masquerading as traction.',
      tradeoff: 'Waiting for true pull can mean slower early growth. Some markets require education before pull emerges, so premature abandonment of a good idea is a risk.',
    },
    {
      name: 'Minimum Viable Offer',
      principle: 'The smallest version of your offer that someone will actually pay for reveals whether your value proposition works. It is not about building less. It is about isolating the single transformation or outcome people will exchange money for.',
      whenToUse: 'Pre-launch, pivot stage, or when resources are constrained. Also useful when an established business wants to test a new market segment.',
      example: 'A fitness coach sells a single 4-week program PDF for $29 before building a subscription app. If people buy and complete it, the core value is validated.',
      tradeoff: 'A minimum offer can underrepresent the full experience. If your value requires a holistic system, a stripped version may fail even when the full product would succeed.',
    },
    {
      name: 'Value Testing Before Building',
      principle: 'Sell the outcome before you build the delivery mechanism. If people will not pay for the promise, they will not pay for the product. Pre-sales, waitlists with deposits, and landing page tests with real payment intent are the fastest validators.',
      whenToUse: 'Before investing significant time or money in product development. Especially critical for digital products, courses, and SaaS.',
      example: 'A developer describes a SaaS tool on a landing page with a $10/month pre-order button. 200 people pay before a single line of code is written. That is validation.',
      tradeoff: 'Pre-selling creates delivery pressure and reputational risk if you cannot fulfill. It also selects for early adopters who may not represent the broader market.',
    },
    {
      name: 'Value Perception Over Value Reality',
      principle: 'Customers pay based on perceived value, not objective value. Two identical products with different framing, context, and presentation will command wildly different prices. The wrapper is part of the product.',
      whenToUse: 'When a good product is underperforming commercially. When competitors with inferior products are outperforming you. When you need to increase prices without changing the core deliverable.',
      example: 'A consultant charging $100/hour repackages the same work as a $5,000 strategic audit with a branded report, executive summary, and implementation roadmap. Same expertise, 10x the revenue.',
      tradeoff: 'Over-investing in perception without substance creates fragile businesses. Customers eventually discover the gap between promise and delivery.',
    },
    {
      name: 'Jobs To Be Done',
      principle: 'People do not buy products. They hire solutions to make progress in their lives. Understanding the functional, emotional, and social jobs your customer is hiring your product for reveals the true competitive landscape and pricing power.',
      whenToUse: 'When defining or refining your offer. When you are losing to unexpected competitors. When your marketing messages are not landing.',
      example: 'A milkshake company discovers their morning customers are not comparing them to other milkshakes. They are comparing to bagels and bananas. The job is a satisfying, easy commute breakfast, not a dessert.',
      tradeoff: 'JTBD analysis can lead to over-abstraction. Sometimes people do just want a milkshake. Balance functional analysis with direct customer language.',
    },
    {
      name: 'Asymmetric Value Creation',
      principle: 'The most profitable businesses create value that costs them little to deliver but is worth a lot to the recipient. Information products, software, and expertise-based services have the highest asymmetry potential.',
      whenToUse: 'When designing business models and offer structures. When looking for leverage in an existing business.',
      example: 'A tax strategist creates a $497 course that saves each student $5,000-$20,000 per year. The course costs pennies per student to deliver after creation. The value ratio is enormous.',
      tradeoff: 'High-asymmetry products often require significant upfront investment in creation and expertise. They also face piracy and commoditization pressure.',
    },
  ],

  pricing: [
    {
      name: 'Value-Based Pricing',
      principle: 'Price based on the value delivered to the customer, not the cost to produce. If your service saves someone $100,000, charging $10,000 is a bargain regardless of whether it took you 2 hours or 200 hours.',
      whenToUse: 'When you can quantify or clearly demonstrate the outcome your product delivers. Best for B2B, consulting, and high-stakes consumer decisions.',
      example: 'A conversion rate optimizer charges 10% of the incremental revenue generated rather than an hourly rate. A 1% conversion improvement on a $1M/year store is worth $100,000+.',
      tradeoff: 'Requires the ability to measure and attribute value. Customers may dispute the attribution. Also requires confidence and positioning that supports premium pricing.',
    },
    {
      name: 'Price Anchoring',
      principle: 'The first price a customer sees becomes the reference point for all subsequent prices. A $2,000 option makes a $500 option feel affordable. Always present the highest-value option first.',
      whenToUse: 'On pricing pages, in sales conversations, when presenting proposals. Especially effective with tiered offers.',
      example: 'A SaaS tool shows Enterprise at $299/month first, then Pro at $99/month, then Starter at $29/month. Most buyers choose Pro because it feels like a deal relative to Enterprise.',
      tradeoff: 'If the anchor is too high, it can scare away price-sensitive customers before they see the lower option. The anchor must feel plausible, not absurd.',
    },
    {
      name: 'Strategic Tiering',
      principle: 'Three tiers is not just a pricing structure. It is a psychological architecture. The bottom tier exists to make the middle look smart. The top tier exists to make the middle look affordable. Most revenue comes from the middle.',
      whenToUse: 'For any productized service, SaaS, or digital product. Less effective for commodities or single-SKU physical products.',
      example: 'A coaching program offers: DIY Course at $197, Group Coaching at $997, and Private Mentorship at $5,000. 60% of revenue comes from Group Coaching because it balances value and investment.',
      tradeoff: 'Too many tiers create decision paralysis. Too few remove the anchoring benefit. Three is the sweet spot for most businesses.',
    },
    {
      name: 'Bundling and Unbundling',
      principle: 'Bundling increases perceived value by combining items that feel more valuable together. Unbundling increases accessibility by letting customers buy only what they need. The right strategy depends on market maturity and customer sophistication.',
      whenToUse: 'Bundle when you need to increase average order value or when individual components feel too small. Unbundle when customers feel forced to pay for things they do not want.',
      example: 'A design agency bundles logo, website, and brand guidelines into a $10,000 brand package (vs $3,000 + $5,000 + $3,000 = $11,000 individually). The bundle feels like a deal and simplifies the sale.',
      tradeoff: 'Bundling can hide poor-quality components behind strong ones. Unbundling can make each piece feel too small to justify purchasing.',
    },
    {
      name: 'Psychological Price Points',
      principle: 'Prices ending in 7 or 9 outperform round numbers for impulse and mid-range purchases. Round numbers outperform for premium and luxury positioning. The number communicates as much as the amount.',
      whenToUse: '$97 and $997 for info products and digital goods. $100 and $1,000 for premium services and luxury goods. $9.99 for commodity retail.',
      example: 'An online course at $497 outsells the same course at $500 because $497 signals a calculated, value-engineered price. A luxury watch at $5,000 outsells at $4,997 because the round number signals premium quality.',
      tradeoff: 'Over-reliance on charm pricing can feel manipulative to sophisticated buyers. The effect diminishes for high-ticket B2B where buyers are trained negotiators.',
    },
    {
      name: 'Freemium as Market Entry',
      principle: 'Giving away a genuinely useful free tier creates distribution, builds habit, and generates word-of-mouth. The free tier must be good enough to create dependency but limited enough to create upgrade desire.',
      whenToUse: 'When the marginal cost of serving a free user is near zero. When network effects exist. When the market is crowded and you need distribution leverage.',
      example: 'A project management tool offers free accounts for up to 3 users. Teams adopt it, embed it in their workflow, then hit the limit and upgrade when the 4th person joins.',
      tradeoff: 'Freemium can attract users who will never pay. If free is too good, conversion suffers. If free is too weak, adoption suffers. The line is hard to find and constantly shifts.',
    },
  ],

  customerLifetimeValue: [
    {
      name: 'CLV as Strategic Compass',
      principle: 'Customer Lifetime Value is not just a metric. It is a strategic decision framework. If you know a customer is worth $3,000 over 3 years, you can rationally spend $500 to acquire them. Without CLV, all acquisition spending is guessing.',
      whenToUse: 'When setting ad budgets, evaluating channel ROI, making hiring decisions, or deciding between growth strategies.',
      example: 'A subscription box with $40/month revenue and 14-month average retention has a CLV of $560. Spending $100 on acquisition is profitable at scale even if the first month is a loss.',
      tradeoff: 'CLV calculations require historical data you may not have yet. Early-stage businesses must estimate and iterate. Overestimating CLV leads to overspending on acquisition.',
    },
    {
      name: 'Retention Over Acquisition',
      principle: 'Acquiring a new customer costs 5-25x more than retaining an existing one. A 5% increase in retention can increase profits by 25-95%. Yet most businesses spend 80% of their marketing budget on acquisition and 20% on retention.',
      whenToUse: 'When growth is stalling despite consistent acquisition. When churn is above 5% monthly for subscriptions. When you have product-market fit but cannot scale profitably.',
      example: 'An online education platform reduces monthly churn from 8% to 5% by adding a community forum, weekly live sessions, and progress tracking. Average customer lifespan jumps from 12.5 to 20 months.',
      tradeoff: 'Some businesses are inherently transactional with limited repeat potential. Investing in retention for a wedding photography business has less impact than for a software product.',
    },
    {
      name: 'Acquisition Cost Rationality',
      principle: 'Your maximum Customer Acquisition Cost should be no more than one-third of CLV for sustainable growth. This leaves room for delivery costs, overhead, and profit. Violating this ratio is the most common cause of growth-induced bankruptcy.',
      whenToUse: 'When evaluating paid advertising, affiliate programs, sales team costs, or any growth channel.',
      example: 'A SaaS with $2,400 CLV can afford $800 CAC. If Facebook ads cost $200 per trial signup and 25% convert, the effective CAC is $800. This channel is at the maximum sustainable level.',
      tradeoff: 'The 3:1 ratio is conservative and can slow growth. Venture-backed companies may rationally operate at 1:1 or worse to capture market share, but this requires external capital.',
    },
    {
      name: 'Expansion Revenue',
      principle: 'The easiest revenue to generate is from existing happy customers. Upsells, cross-sells, and usage-based expansion can exceed initial purchase value. Design your product and offer architecture to naturally expand.',
      whenToUse: 'When you have a satisfied customer base but flat revenue per customer. When acquisition channels are maxed out or too expensive.',
      example: 'A web hosting company starts each customer at $10/month shared hosting. Over 3 years, the average customer upgrades to VPS ($40/month), adds domains ($12/month each), and buys SSL certificates. Average revenue triples.',
      tradeoff: 'Aggressive upselling erodes trust and increases churn. The line between helpful expansion and annoying upselling is thin and customer-specific.',
    },
    {
      name: 'Cohort-Based CLV Analysis',
      principle: 'Average CLV hides critical information. Different acquisition channels, customer segments, and time periods produce radically different CLV profiles. Analyze CLV by cohort to find your best customers and double down.',
      whenToUse: 'When scaling marketing spend. When choosing between customer segments to target. When evaluating which products or features drive the most long-term value.',
      example: 'A fitness app discovers that customers acquired through YouTube content have 2.5x the CLV of customers from Instagram ads. They shift 40% of their ad budget to YouTube creator partnerships.',
      tradeoff: 'Cohort analysis requires data infrastructure and patience. You need at least 6-12 months of data per cohort to draw meaningful conclusions.',
    },
  ],

  margins: [
    {
      name: 'Gross Margin as Business Model Indicator',
      principle: 'Gross margin reveals the fundamental economics of your business model. Software and digital products have 80-95% margins. Physical products have 30-60%. Services have 50-70%. Your margin determines how much you can invest in growth.',
      whenToUse: 'When choosing a business model, evaluating product mix, or deciding between growth strategies.',
      example: 'A baker with 40% gross margins cannot outspend a SaaS competitor with 90% margins on customer acquisition. The baker must compete on local presence, relationships, and experience instead.',
      tradeoff: 'High-margin businesses attract more competition. Low-margin businesses have natural competitive moats through operational complexity that deters new entrants.',
    },
    {
      name: 'Cost Structure Awareness',
      principle: 'Fixed costs create leverage in both directions. High fixed costs with low variable costs mean each additional sale is highly profitable but breakeven is high. Low fixed costs with high variable costs mean lower risk but less leverage.',
      whenToUse: 'When deciding between business models, scaling strategies, or investment timing.',
      example: 'A software company with $50,000/month in fixed costs and near-zero variable costs is losing money at 100 customers ($30/month each) but highly profitable at 2,000 customers. The path between those points is the danger zone.',
      tradeoff: 'High fixed cost businesses fail spectacularly if they cannot reach scale. Low fixed cost businesses survive easily but rarely achieve exponential returns.',
    },
    {
      name: 'Scaling Economics',
      principle: 'Not all businesses benefit equally from scale. Digital products have near-perfect scaling economics. Services degrade because they require proportional labor. Physical products improve with purchasing power but hit logistics complexity.',
      whenToUse: 'When evaluating long-term business potential or deciding how to invest in growth infrastructure.',
      example: 'An online course generates $100,000 with 1,000 students or $1,000,000 with 10,000 students. The cost barely changes. A consulting firm at $1,000,000 needs roughly 10x the consultants of one at $100,000.',
      tradeoff: 'Scalable businesses often have lower per-customer engagement and higher competition. Non-scalable businesses can command premium pricing through scarcity and personalization.',
    },
    {
      name: 'Contribution Margin Thinking',
      principle: 'Each product or service line should be evaluated on its contribution margin: revenue minus its direct variable costs. Products with negative contribution margins lose more money the more you sell them, regardless of total revenue.',
      whenToUse: 'When auditing product lines, deciding which offerings to promote or discontinue, or when total revenue is growing but profits are shrinking.',
      example: 'A bakery discovers their popular $3 cookie has a $0.10 contribution margin after ingredients and packaging, while their $5 scone has a $2.50 margin. Shifting marketing focus to scones dramatically improves profitability.',
      tradeoff: 'Killing low-margin products can reduce traffic that feeds high-margin purchases. Loss leaders exist for a reason. Analyze the full customer journey, not just individual SKU margins.',
    },
    {
      name: 'Margin Expansion Through Productization',
      principle: 'Converting custom work into standardized products or systems increases margins by reducing variable labor per unit of revenue. The first delivery is expensive; the template is nearly free.',
      whenToUse: 'When a service business is hitting capacity limits. When similar work is being repeated for different clients. When growth requires hiring at a rate that erodes margins.',
      example: 'A web design agency charges $10,000 per custom site (50% margin). They create 5 industry-specific templates and sell them at $5,000 each (85% margin). Revenue per project drops but margin dollars increase and capacity expands.',
      tradeoff: 'Productization sacrifices customization and premium positioning. It can also commoditize your expertise in ways that attract lower-value clients.',
    },
  ],

  offerArchitecture: [
    {
      name: 'Value Ladder',
      principle: 'A value ladder is a sequence of offers at increasing price points and value levels. Each step builds trust and demonstrates competence, making the next purchase feel safe. The ladder guides customers from free to premium.',
      whenToUse: 'When designing your overall business model. When you have one offer and want to increase revenue per customer. When your premium offer has a long sales cycle.',
      example: 'A marketing consultant offers: Free newsletter, $47 template pack, $497 self-paced course, $2,000 group mastermind, $10,000 private consulting. Each step pre-qualifies and warms up customers for the next.',
      tradeoff: 'Too many steps create complexity and dilute focus. Too few miss revenue opportunities. Most businesses need 3-4 tiers maximum.',
    },
    {
      name: 'Front-End vs Back-End Offers',
      principle: 'Front-end offers acquire customers, often at break-even or a loss. Back-end offers generate profit from the trust and relationship built through the front-end. The real money is almost never in the first sale.',
      whenToUse: 'When your primary offer is too expensive or complex for cold traffic. When you have a high-trust product that requires relationship-building first.',
      example: 'A supplement company sells a trial pack at cost ($9.99 with $8 shipping cost) to acquire customers. Their subscription model generates $2,400 CLV. The front-end loses money but the back-end creates a profitable business.',
      tradeoff: 'Front-end losses require cash reserves to fund the gap between acquisition cost and back-end revenue. Cash flow timing can kill businesses with great unit economics.',
    },
    {
      name: 'Offer Stacking',
      principle: 'An irresistible offer combines a core deliverable with bonuses that increase perceived value far beyond the price. Each bonus should address a different objection or desire. The stack should feel disproportionately valuable.',
      whenToUse: 'For launches, promotions, and high-converting landing pages. When you need to justify a price increase or compete on value rather than price.',
      example: 'A $997 online course includes: the core training ($997 value), templates ($297 value), private community ($497 value), monthly Q&A calls ($1,200 value), and a bonus workshop ($497 value). Total stated value is $3,488 for $997.',
      tradeoff: 'Offer stacking can feel manipulative if the stated values are inflated. It works best when each bonus has genuine standalone value. Overuse trains customers to wait for deals.',
    },
    {
      name: 'Guarantee Architecture',
      principle: 'A strong guarantee reverses risk from buyer to seller. The more specific and bold the guarantee, the more powerful it is. Paradoxically, stronger guarantees typically reduce refund rates because they signal confidence.',
      whenToUse: 'For any offer where the customer cannot fully evaluate before purchasing. Especially important for digital products, coaching, and services where trust is the primary barrier.',
      example: 'A copywriting course offers a double-your-money-back guarantee: if you complete the course and do not land a client within 60 days, you get 2x your money back. Refund rate: 3%, down from 8% with a standard money-back guarantee.',
      tradeoff: 'Guarantees attract refund abusers. Conditional guarantees (must complete X to qualify) reduce abuse but also reduce conversion power. Find the balance for your market.',
    },
    {
      name: 'Downsell and Save Sequences',
      principle: 'When a customer declines your primary offer, a strategically lower-priced alternative captures revenue that would otherwise be lost. The downsell should feel like a natural subset, not a lesser version.',
      whenToUse: 'On checkout pages after cart abandonment, in email sequences after a sales call that did not close, or as an exit-intent popup.',
      example: 'A customer abandons a $2,000 coaching program checkout. An automated email offers a $497 self-study version of the same material. 15% of abandoners purchase the downsell, recovering significant revenue.',
      tradeoff: 'If customers learn that declining leads to better offers, they will always decline first. The downsell must be genuinely different (less access, fewer features) not just cheaper.',
    },
    {
      name: 'Ascension Offer Timing',
      principle: 'The moment after a customer achieves a result with your product is the highest-converting time to offer the next level. Satisfaction plus momentum creates buying energy. Design your delivery to create natural upgrade moments.',
      whenToUse: 'When building post-purchase sequences, onboarding flows, or curriculum-based products.',
      example: 'A language learning app presents the premium conversation practice feature immediately after a user completes their first level and feels the rush of progress. Conversion rate at that moment is 3x the average in-app prompt.',
      tradeoff: 'Mistiming the ascension offer (before the result is felt) comes across as pushy and erodes trust. Patience in the sequence is critical.',
    },
  ],

  positioning: [
    {
      name: 'Category of One',
      principle: 'Instead of competing in an existing category, create a new one where you are the default choice. Redefine the problem or the solution in a way that makes comparison impossible. Category creators capture 76% of the total market value.',
      whenToUse: 'When you are entering a crowded market with a genuinely different approach. When competing on features or price is a losing game.',
      example: 'Salesforce did not sell better software. They created the Cloud CRM category and became synonymous with it. Every competitor was now a Salesforce alternative rather than an equal.',
      tradeoff: 'Category creation requires significant market education spending. If the market does not adopt the new frame, you have wasted resources on a distinction nobody cares about.',
    },
    {
      name: 'Anti-Positioning',
      principle: 'Define yourself by what you are not. In a market full of complexity, be simple. In a market full of cheap, be premium. Position against the dominant players shortcomings, not their strengths.',
      whenToUse: 'When the market leader has clear weaknesses that frustrate a segment of customers. When you are smaller and cannot compete on resources.',
      example: 'Basecamp positioned against enterprise project management tools: no Gantt charts, no resource allocation, no complexity. For small teams overwhelmed by bloated tools, this was exactly right.',
      tradeoff: 'Anti-positioning limits your addressable market to people who share your criticism of the status quo. As you grow, the anti-position can become constraining.',
    },
    {
      name: 'Specificity as Differentiation',
      principle: 'The more specific your target customer and use case, the more powerful your positioning. A general solution for everyone is a weak solution for anyone. Narrow positioning creates perceived expertise.',
      whenToUse: 'When you are a generalist competing against other generalists. When you want to charge premium prices. When you need word-of-mouth in a specific community.',
      example: 'An accountant repositions from general tax services to tax optimization for Shopify store owners doing $500K-$2M. Same expertise, 3x the rates, because now they speak the specific language of a specific customer.',
      tradeoff: 'Narrow positioning reduces your total addressable market. If the niche is too small, you hit a ceiling. Plan for strategic expansion once you own the niche.',
    },
    {
      name: 'Positioning Through Constraints',
      principle: 'Intentional limitations create positioning. By choosing what you will not do, you become more credible at what you will do. Constraints signal commitment and expertise.',
      whenToUse: 'When differentiating in a market where everyone claims to do everything. When you need to build specialist credibility quickly.',
      example: 'A designer only works with SaaS companies on pricing page redesigns. Nothing else. This extreme constraint makes them the obvious choice for that specific high-value project.',
      tradeoff: 'Constraints require turning away revenue, which is psychologically difficult and financially painful in the short term. The discipline must be maintained even when cash is tight.',
    },
    {
      name: 'Reframe the Competition',
      principle: 'If you cannot beat the competition in their frame, change the frame. Redefine what matters so your strengths become the criteria and their strengths become irrelevant or even weaknesses.',
      whenToUse: 'When you are losing on conventional metrics like features, price, or brand recognition. When you have a genuine advantage that the market has not yet recognized.',
      example: 'A small CRM cannot compete with Salesforce on features. So they reframe the decision: Salesforce requires 3 months of onboarding and a dedicated admin. We require 15 minutes and zero training. The comparison criteria shifted from feature count to time-to-value.',
      tradeoff: 'Reframing only works if the new criteria genuinely matter to enough customers. You cannot force people to care about what they do not care about.',
    },
  ],

  trustFormation: [
    {
      name: 'Progressive Trust Architecture',
      principle: 'Trust is not binary. It forms through a sequence of small positive experiences. Each interaction should deliver slightly more than expected, building a compounding trust balance. Design your customer journey as a trust escalation ladder.',
      whenToUse: 'When designing onboarding, sales sequences, or customer journeys. When high-ticket conversions are low despite good traffic.',
      example: 'A financial advisor offers a free portfolio review, then a $50 one-hour consultation, then a $500 financial plan, then ongoing management at 1% AUM. Each step proves competence before asking for deeper commitment.',
      tradeoff: 'Too many trust steps slow down the path to revenue. Some customers are ready to buy immediately and will leave if forced through unnecessary steps.',
    },
    {
      name: 'Social Proof Layering',
      principle: 'Different types of social proof serve different trust functions. Quantity (10,000 customers) establishes normalcy. Quality (Fortune 500 logos) establishes aspiration. Similarity (people like me) establishes relevance. Layer all three.',
      whenToUse: 'On landing pages, sales pages, email sequences, and pitch decks. Any moment where a prospect is evaluating whether to trust you.',
      example: 'A B2B software page shows: 5,000+ companies trust us (quantity), logos of known brands (quality), a video testimonial from someone in the visitor industry (similarity). Each addresses a different trust need.',
      tradeoff: 'Fake or exaggerated social proof destroys more trust than no social proof at all. If you do not have impressive numbers, lead with specific, detailed testimonials instead.',
    },
    {
      name: 'Vulnerability as Trust Signal',
      principle: 'Admitting limitations, sharing failures, and being transparent about what you are not good at builds more trust than a polished facade. In an era of marketing skepticism, honesty is the most disruptive positioning.',
      whenToUse: 'In content marketing, sales conversations, and about pages. Especially powerful for personal brands and service businesses.',
      example: 'A software company publishes a page titled What We Are Bad At. It lists features they intentionally do not build and types of customers they do not serve well. Conversion rate from that page is 2x their homepage.',
      tradeoff: 'Vulnerability requires genuine substance behind it. Manufactured vulnerability is worse than polished marketing. It also does not work in all cultures or industries.',
    },
    {
      name: 'Demonstration Over Declaration',
      principle: 'Showing your competence through free value, case studies, and transparent results builds more trust than claiming competence through credentials and testimonials. Let prospects experience your value before asking for commitment.',
      whenToUse: 'When your offer is expertise-based. When prospects have been burned by overpromising competitors. When trust is the primary conversion barrier.',
      example: 'A marketing agency publishes detailed case studies with exact strategies, metrics, and even the failures along the way. Prospects think: if they give this away for free, imagine what the paid work is like.',
      tradeoff: 'Giving away too much expertise can reduce perceived need for the paid service. Find the line between demonstrating competence and giving away the implementation.',
    },
    {
      name: 'Speed as Trust Builder',
      principle: 'Responding quickly to inquiries, delivering fast first results, and over-communicating during delivery builds trust more than almost any other factor. Speed signals that you care and that you are competent.',
      whenToUse: 'In the first 48 hours of any new customer relationship. When competing against larger, slower competitors. When retention is a problem.',
      example: 'A freelancer responds to every inquiry within 30 minutes during business hours and delivers a small quick-win within the first day of an engagement. Referral rate is 3x industry average.',
      tradeoff: 'Speed expectations can become unsustainable at scale. Set clear expectations early rather than training customers to expect instant responses forever.',
    },
    {
      name: 'Consistency Compounds Trust',
      principle: 'A predictable, reliable pattern of delivery builds deeper trust than occasional excellence. Showing up every day for a year beats one viral moment. Trust is a function of consistency multiplied by time.',
      whenToUse: 'When building a brand, content strategy, or service reputation. When you are in a market where trust takes time to develop.',
      example: 'A newsletter writer publishes every Tuesday at 8 AM for two years without missing a week. Open rates climb from 20% to 45%. The consistency itself becomes the value proposition.',
      tradeoff: 'Consistency requires systems and discipline that can feel uninspired. The pressure to maintain a schedule can reduce quality if not managed carefully.',
    },
  ],

  operationalBottlenecks: [
    {
      name: 'Founder Dependency',
      principle: 'When the business cannot function without the founder doing key tasks, growth is capped at the founders personal capacity. The first bottleneck to remove is yourself from the delivery chain.',
      whenToUse: 'When you are working 60+ hours and growth is flat. When taking a vacation would stop the business. When you are the best at everything and cannot find good help.',
      example: 'A consultant records their methodology into a training program for junior consultants, creating a delivery playbook. This allows them to serve 4x the clients while spending time on sales and strategy.',
      tradeoff: 'Removing yourself from delivery often means accepting lower quality initially. The first hires will not be as good as you. This is a necessary stage, not a failure.',
    },
    {
      name: 'Premature Scaling',
      principle: 'Scaling before product-market fit, reliable delivery systems, or positive unit economics is the most common cause of startup death. Growth amplifies everything including problems. Scale what works, not what you hope will work.',
      whenToUse: 'When considering a large investment in growth: hiring, ad spend, new markets, or physical expansion.',
      example: 'A restaurant with inconsistent food quality spends $50,000 on marketing. They get a flood of new customers who experience the inconsistency and leave negative reviews. Growth actually accelerated the decline.',
      tradeoff: 'Being too cautious about scaling can mean missing market windows. The balance is to scale incrementally and validate at each stage rather than making large bets.',
    },
    {
      name: 'Delivery System Design',
      principle: 'Your delivery system should be designed for the customer volume you want, not the volume you have. Building systems at 10 customers that work at 1,000 prevents the painful transition that kills momentum.',
      whenToUse: 'When you are past product-market fit and preparing for growth. When delivery quality degrades as volume increases.',
      example: 'An agency moves from custom proposals (2 hours each) to a productized intake form with automated scoping, reducing proposal time to 15 minutes. This allows them to handle 8x the inquiry volume.',
      tradeoff: 'Building systems too early wastes resources on processes that may change. Wait until you have enough pattern repetition to know what to systematize.',
    },
    {
      name: 'Cash Flow Timing',
      principle: 'Profitable businesses die from cash flow gaps more often than from lack of profitability. The time between paying for delivery and receiving payment is the most dangerous gap in business operations.',
      whenToUse: 'When planning growth investments, managing payment terms, or when profitable on paper but struggling to pay bills.',
      example: 'A manufacturing company with 60-day payment terms from retailers needs to fund $200,000 in inventory before seeing revenue. A $100,000 order can bankrupt them if they cannot bridge the gap.',
      tradeoff: 'Asking for upfront payment or shorter terms can cost you clients. Offering generous payment terms is a competitive advantage if you can afford it.',
    },
    {
      name: 'Quality Degradation Under Load',
      principle: 'Every business has a load threshold beyond which quality degrades. Identifying this threshold before you hit it allows you to build systems, hire, or limit growth proactively rather than reactively.',
      whenToUse: 'When customer complaints increase during growth periods. When team stress and turnover correlate with revenue growth.',
      example: 'A home cleaning service can maintain quality with 50 weekly cleanings. At 60, customer satisfaction drops because the same crew is rushing. They cap at 50 per crew and hire a second team before growing past it.',
      tradeoff: 'Self-imposed capacity limits feel counterintuitive during growth. The discipline to say no to revenue until systems support it requires long-term thinking.',
    },
    {
      name: 'Hiring Ahead of Revenue',
      principle: 'The right time to hire is before you desperately need someone, because desperate hiring produces bad hires. Budget for the role 3-6 months before the revenue justifies it, and use the gap to train and integrate.',
      whenToUse: 'When growth trajectory is predictable and current team is at 80%+ capacity. When the cost of a bad hire is higher than the cost of an early hire.',
      example: 'A growing agency hires a project manager when they have 6 clients, knowing they will have 10 within 3 months. The PM is trained and effective by the time the crunch arrives, preventing quality collapse.',
      tradeoff: 'Hiring ahead of revenue is a cash bet on continued growth. If growth stalls, the premature hire becomes a financial burden. Conservative businesses hire late and accept temporary quality dips.',
    },
  ],
} as const;
