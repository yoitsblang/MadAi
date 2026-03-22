// Anti-Patterns Knowledge Library
// Common marketing and business mistakes that waste resources, damage trust, and prevent growth

export interface AntiPattern {
  name: string;
  description: string;
  whyItFails: string;
  whatToDoInstead: string;
  howToRecognize: string;
}

export const ANTIPATTERNS_LIBRARY: AntiPattern[] = [
  {
    name: 'Oversaturated Tactics',
    description: 'Using the exact same tactics everyone else in your space is using. The same webinar funnels, the same "free masterclass" hooks, the same 10X messaging, the same Instagram carousel templates. When everyone runs the same playbook, the playbook stops working.',
    whyItFails: 'When every competitor uses identical tactics, audiences develop blindness and fatigue. Response rates decline across the entire category. You are competing for attention with the exact same stimulus, which means only the loudest or earliest wins.',
    whatToDoInstead: 'Study what everyone else does, then do something meaningfully different. Borrow proven frameworks from adjacent or completely unrelated industries. Use contrarian positioning. If everyone does webinars, do a written challenge. If everyone is polished, be raw.',
    howToRecognize: 'Your marketing is visually and structurally identical to 5+ competitors. Your audience has seen this exact funnel format before. Conversion rates are declining over time despite no changes to your process. Prospects say "I have seen this before."',
  },
  {
    name: 'Fake Urgency',
    description: 'Countdown timers that reset on page refresh, "only X left" labels on unlimited digital products, "ending soon" offers that never actually end, and manufactured scarcity for products with infinite supply.',
    whyItFails: 'Works for the first impression but destroys trust when customers discover the deception. Creates compounding reputation debt. Savvy audiences immediately recognize fake urgency and associate your brand with manipulation. Fake urgency also trains your audience to ignore real urgency when you actually need it.',
    whatToDoInstead: 'Use real deadlines tied to genuine constraints: enrollment closes because the cohort starts, prices increase because your costs are increasing, limited seats because the venue has a physical capacity. If the offer is good enough, real urgency appears naturally. If you need fake urgency to sell, the offer itself needs work.',
    howToRecognize: 'Your countdown timer resets on page refresh. Your "limited time" offer has been running continuously for months. Your scarcity claim does not match your actual inventory or capacity. You would be embarrassed if a customer pointed out the deception publicly.',
  },
  {
    name: 'Bad Offers Behind Slick Ads',
    description: 'Investing heavily in ad creative, copywriting, and paid distribution while the underlying offer is weak, confusing, undifferentiated, or does not match what the audience actually wants. The marketing is excellent but the product fails to deliver.',
    whyItFails: 'You can drive unlimited traffic to a bad offer and it still will not convert profitably. And if it does convert through the sheer force of persuasion, refunds, complaints, and negative reviews follow. The better the marketing on a bad offer, the faster the reputation damage compounds.',
    whatToDoInstead: 'Fix the offer first. Make it clear, compelling, and genuinely valuable. Test the offer with warm audiences before spending on cold traffic. If the offer does not convert through email to your existing list, it will not convert through paid ads to strangers.',
    howToRecognize: 'High click-through rates on ads but low landing page conversion. Good traffic volume but poor sales numbers. Lots of questions and confusion from prospects. High refund rates after purchase. The gap between marketing promise and product reality is obvious to anyone who experiences both.',
  },
  {
    name: 'Platform Addiction',
    description: 'All revenue and visibility depends on a single platform\'s algorithm. No email list, no owned website with traffic, no diversification of audience or revenue sources. The entire business exists as a tenant on rented digital land.',
    whyItFails: 'Algorithm changes, platform policy shifts, or account bans can destroy the business overnight. You have zero negotiating power. You cannot contact your own audience without the platform\'s permission. You are a digital sharecropper building value for the landlord, not yourself.',
    whatToDoInstead: 'Build an email list from day one — this is the single most important defensive action. Create presence on 2-3 platforms. Drive traffic to owned properties (website, newsletter). Treat every platform as a distribution channel, never as your home base. The platform is the highway; your email list is your house.',
    howToRecognize: '90%+ of your traffic or revenue comes from one platform. You have no email list or it has fewer than 500 subscribers. You cannot reach your audience if the platform disappears tomorrow. You spend more time worrying about algorithm changes than about product quality.',
  },
  {
    name: 'Low-Trust Positioning',
    description: 'Marketing that accidentally signals untrustworthiness through a combination of small mistakes: typos, broken links, stock photos of smiling people in suits, vague claims without evidence, no social proof, inconsistent branding, and an unprofessional overall impression.',
    whyItFails: 'Trust is formed in microseconds based on visual and textual signals. One signal of incompetence or shadiness undoes paragraphs of persuasion. In a world of scams, sophisticated buyers are looking for reasons to dismiss you. Low-trust positioning gives them the excuse they are looking for.',
    whatToDoInstead: 'Audit every customer touchpoint for trust signals. Fix the basics first: professional, error-free copy. Real photos of real people and real work. Specific, verifiable claims instead of vague superlatives. Visible reviews and testimonials. Working links and fast loading pages. Consistent brand presentation.',
    howToRecognize: 'Website uses stock photos instead of real team and product photos. No testimonials or social proof on key pages. Claims like "best in class" and "world-class" without any evidence. Broken links on the website. Typos in ads or on the landing page. The website looks like it was built in a weekend.',
  },
  {
    name: 'Message Confusion',
    description: 'The business tries to be everything to everyone. No clear positioning, no focused value proposition, no defined target audience. Different pages on the website seem like different businesses. The elevator pitch changes every time someone asks.',
    whyItFails: 'Confused prospects do not buy. If you cannot explain what you do and who it is for in one sentence, neither can your customers. Confused customers cannot refer you because they do not know how to describe what you do. Message confusion also makes all marketing less effective because there is no consistent signal to amplify.',
    whatToDoInstead: 'Choose one audience, one problem, one solution. Narrow your positioning until it feels uncomfortable, then narrow more. You can always expand later once you own a specific territory. Write one sentence that answers: what do you do, for whom, and what is the result? Use that sentence everywhere.',
    howToRecognize: 'You cannot explain your business in one clear sentence. Different pages on your site seem like different businesses. Prospects say "I am not sure what you do." You are attracting wildly different types of customers with no pattern. Your team describes the business differently.',
  },
  {
    name: 'Chasing Impressions Without Intent',
    description: 'Optimizing for views, likes, followers, and reach instead of actual business outcomes. Celebrating vanity metrics while revenue stays flat. Creating content designed to go viral rather than to attract and convert ideal customers.',
    whyItFails: 'Viral content often attracts the wrong audience. 1 million views from people who will never buy is worth less than 1,000 views from ideal customers with purchase intent. Impressions feel good but do not pay bills. The correlation between social media engagement and revenue is often near zero.',
    whatToDoInstead: 'Track business metrics: email signups, qualified leads, sales calls booked, revenue per content piece. Optimize for intent and conversion, not vanity. Ask: did this content bring me closer to a sale? Create content that your ideal customer would engage with, even if it means smaller numbers.',
    howToRecognize: 'Growing follower count but flat revenue. Viral posts that do not correlate with sales spikes. You celebrate reach metrics in team meetings instead of revenue metrics. You cannot trace any significant revenue to your social media efforts.',
  },
  {
    name: 'Pretty Branding with No Conversion Path',
    description: 'A beautiful website, polished brand identity, consistent aesthetic, and professional photography — with zero mechanism for turning visitors into customers. No clear call to action, no lead capture, no obvious next step.',
    whyItFails: 'Design without strategy is decoration. A gorgeous website that confuses visitors about what to do next converts at 0%. An ugly landing page with a clear call to action and compelling offer will outperform a beautiful website with no direction every time.',
    whatToDoInstead: 'Start with conversion logic: What should the visitor DO? Then design around that action. Every page needs one clear next step. Every piece of content needs a call to action. The design should serve the conversion path, not the other way around.',
    howToRecognize: 'Your website has no obvious call to action above the fold. Visitors compliment the design but do not buy or sign up. You invested more money and time in brand design than in offer development. Your bounce rate is high despite praise for the aesthetic.',
  },
  {
    name: 'Overreliance on Paid Ads',
    description: 'All growth comes from paid traffic. No organic search presence, no referral system, no email marketing, no content strategy, no word of mouth. Turn off the ads and revenue drops to zero within days.',
    whyItFails: 'Customer acquisition cost rises as competition increases in your category. You are renting growth at prices set by platforms that have every incentive to raise those prices. When ad costs exceed your margins, the business becomes structurally unprofitable. This is not a scalable long-term strategy.',
    whatToDoInstead: 'Pair paid acquisition with organic channels. Build email marketing for retention and repeat purchases. Create referral systems that leverage existing customer satisfaction. Use paid ads to accelerate what already works organically, not as the sole engine of growth.',
    howToRecognize: 'Turning off ads causes revenue to drop to near zero. Customer acquisition cost is rising quarter over quarter. No organic traffic, referrals, or word-of-mouth sales. More than 70% of revenue is attributable to paid advertising.',
  },
  {
    name: 'Underpriced Custom Work',
    description: 'Selling hours for less than they are worth, often driven by fear of losing clients, imposter syndrome, or not understanding the true value delivered. Charging $50/hour for work that saves clients $5,000.',
    whyItFails: 'Trading time for money at low rates creates burnout, prevents investment in growth, and ironically signals low value to sophisticated clients. The best clients pay premium rates and are the easiest to work with. The worst clients demand the lowest prices and create the most problems.',
    whatToDoInstead: 'Raise prices — you will lose some clients but make more money and work less. Productize services into packages with defined scopes and outcomes. Shift from hourly billing to value-based or project-based pricing. Anchor your pricing to the value you deliver, not the time you spend.',
    howToRecognize: 'You are working 60+ hours per week but barely covering expenses. You have not raised prices in years. You are afraid to charge what competitors charge. Clients treat your time as disposable because the price signals it is cheap. You resent the work because the pay does not match the effort.',
  },
  {
    name: 'Content for Content\'s Sake',
    description: 'Posting daily across multiple platforms with no strategy, no conversion path, no measurement, and no clear purpose. Activity masquerading as progress. The content calendar is full but the bank account is empty.',
    whyItFails: 'Engagement without intent is just entertainment for someone else\'s platform. Without a clear path from content to trust to conversion, you are building engagement for the platform, not revenue for yourself. Random content creates random results.',
    whatToDoInstead: 'Every piece of content should serve one of three purposes: attract (discovery), nurture (trust building), or convert (drive action). Map each piece to a funnel stage. Include calls to action. Measure which content actually drives business outcomes and create more of that.',
    howToRecognize: 'You post daily but cannot trace any revenue to your content. High engagement metrics but no email signups, leads, or sales. No call to action in any content. You are exhausted from creating but cannot point to any business results.',
  },
  {
    name: 'Weak Delivery Masquerading as Marketing Failure',
    description: 'Blaming marketing for poor results when the real problem is that the product, service, or fulfillment does not meet the expectations set by the marketing. The diagnosis is wrong, so the treatment fails.',
    whyItFails: 'No amount of marketing fixes a genuinely disappointing product. If customers are not satisfied, they will not return, they will not refer others, and they will leave negative reviews that undermine all future marketing. Marketing amplifies what exists — if what exists is bad, marketing amplifies the damage.',
    whatToDoInstead: 'Talk to customers directly. Read reviews and complaints with an open mind. If the product or service is genuinely not delivering on its promise, fix the delivery before spending another dollar on marketing. The honest assessment is painful but necessary.',
    howToRecognize: 'First-time purchases happen but repeat purchases do not. Refund rate is above 5%. Reviews consistently mention disappointment or unmet expectations. NPS score is below 30. You are acquiring customers but they churn fast.',
  },
] as const;
