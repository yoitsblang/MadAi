// Psychological Triggers Knowledge Library
// Deep understanding of the psychological mechanisms that drive buying behavior

export interface PsychologicalTrigger {
  trigger: string;
  description: string;
  ethicalUse: string;
  manipulativeUse: string;
  bestFor: string;
}

export interface PsychologyCategory {
  identity: PsychologicalTrigger[];
  belonging: PsychologicalTrigger[];
  aspiration: PsychologicalTrigger[];
  novelty: PsychologicalTrigger[];
  urgency: PsychologicalTrigger[];
  lossAversion: PsychologicalTrigger[];
  relief: PsychologicalTrigger[];
  status: PsychologicalTrigger[];
  taboo: PsychologicalTrigger[];
  scarcity: PsychologicalTrigger[];
  curiosity: PsychologicalTrigger[];
  validation: PsychologicalTrigger[];
  transformation: PsychologicalTrigger[];
}

export const PSYCHOLOGY_LIBRARY: PsychologyCategory = {
  identity: [
    {
      trigger: 'Identity Reinforcement',
      description: 'People buy products that reinforce who they believe they are or want to be. A purchase is a vote for a version of yourself. When a product aligns with self-identity, the buying decision feels like self-expression rather than spending.',
      ethicalUse: 'Helping customers find products that genuinely align with their values and self-image. Marketing that says "this is for people who care about X" when you genuinely serve that community.',
      manipulativeUse: 'Creating false identity associations to sell unrelated products. Implying someone is not a "real" professional, parent, or enthusiast unless they buy your product.',
      bestFor: 'Personal brands, lifestyle products, creator economy, coaching, premium goods, niche communities.',
    },
    {
      trigger: 'Identity Threat Response',
      description: 'When people feel their identity is threatened or questioned, they become highly motivated to take action that reaffirms it. Marketing that highlights a gap between who someone is and who they claim to be creates powerful motivation.',
      ethicalUse: 'Gently highlighting the gap between current behavior and stated values, then offering a genuine path to alignment. "You care about your health but have not had a checkup in 3 years."',
      manipulativeUse: 'Attacking self-image to create insecurity that your product promises to fix. Shaming people into purchases by questioning their identity.',
      bestFor: 'Health and wellness, education, professional development, sustainability products.',
    },
    {
      trigger: 'Tribal Identity Signaling',
      description: 'Products serve as signals of group membership. Wearing, using, or displaying certain brands tells others "I am part of this tribe." The product is secondary to the signal it sends.',
      ethicalUse: 'Building genuine communities around shared values and creating products that honestly represent those values. The signal matches the substance.',
      manipulativeUse: 'Selling tribal signals without the substance behind them. Creating artificial in-group/out-group dynamics to pressure purchases.',
      bestFor: 'Fashion, technology, fitness brands, creator merchandise, luxury goods, subculture products.',
    },
    {
      trigger: 'Self-Concept Consistency',
      description: 'People are strongly motivated to act consistently with their past actions and stated beliefs. Once someone identifies as a customer, supporter, or member, they will continue to act in alignment with that identity.',
      ethicalUse: 'Helping customers see how a purchase aligns with commitments they have already made. "You already started learning guitar. This course is the natural next step."',
      manipulativeUse: 'Using small initial commitments to trap people into escalating purchases they did not intend. The foot-in-the-door technique taken too far.',
      bestFor: 'Subscription services, membership programs, course ladders, loyalty programs, community-based businesses.',
    },
    {
      trigger: 'Future Self Projection',
      description: 'People make purchase decisions based on who they want to become, not just who they are now. Marketing that helps prospects vividly imagine their future self after using the product bridges the gap between desire and action.',
      ethicalUse: 'Painting realistic pictures of achievable outcomes that your product genuinely delivers. Showing real transformations with honest timelines.',
      manipulativeUse: 'Promising unrealistic transformations. Using extreme before/after scenarios that misrepresent typical outcomes.',
      bestFor: 'Education, fitness, coaching, career services, personal development, financial products.',
    },
  ],

  belonging: [
    {
      trigger: 'Community Inclusion',
      description: 'The desire to belong to a group is one of the deepest human motivations. Products that grant access to a community of like-minded people sell the belonging as much as the product itself.',
      ethicalUse: 'Building genuine communities where members support each other and the product facilitates real connection. The community has value independent of the product.',
      manipulativeUse: 'Creating artificial exclusivity to exploit loneliness. Making people feel they need the product to have friends or belonging.',
      bestFor: 'Membership sites, online courses with cohorts, brand communities, local businesses, hobby products.',
    },
    {
      trigger: 'Fear of Social Exclusion',
      description: 'The fear of being left out, behind, or excluded from what peers are experiencing drives significant purchasing behavior. This is distinct from FOMO in that it is about social standing, not missing an event.',
      ethicalUse: 'Honestly communicating that a community or opportunity exists and that the prospect would benefit from joining. Sharing genuine enthusiasm from existing members.',
      manipulativeUse: 'Exaggerating how many people are participating to make non-participants feel excluded. "Everyone in your industry is already using this."',
      bestFor: 'Professional tools, social platforms, industry events, educational programs, trend-based products.',
    },
    {
      trigger: 'Shared Experience Bonding',
      description: 'Going through an experience together creates bonds stronger than almost any other social mechanism. Products that create shared experiences (challenges, cohorts, live events) leverage this for retention and referral.',
      ethicalUse: 'Designing genuinely valuable shared experiences where participants benefit from being together. The bonding is a natural byproduct of the value delivered.',
      manipulativeUse: 'Manufacturing intense emotional experiences (high-pressure seminars, trauma bonding in sales events) to create artificial loyalty.',
      bestFor: 'Cohort-based courses, group coaching, fitness challenges, events, subscription boxes with community elements.',
    },
    {
      trigger: 'In-Group Language and Symbols',
      description: 'Every community develops its own language, references, and inside jokes. Using this language in marketing signals "we are one of you" and creates instant connection with community members.',
      ethicalUse: 'Using authentic community language because you genuinely participate in and understand the community. Speaking their language because it is also your language.',
      manipulativeUse: 'Appropriating community language to sell to a group you do not understand or genuinely serve. This is eventually detected and creates strong backlash.',
      bestFor: 'Niche marketing, creator-led brands, hobby products, professional services to specific industries.',
    },
  ],

  aspiration: [
    {
      trigger: 'Aspirational Gap Motivation',
      description: 'The distance between where someone is and where they want to be creates motivational energy. Products positioned as bridges across this gap tap into powerful forward momentum.',
      ethicalUse: 'Helping people honestly assess where they are and showing a genuine path to where they want to be. Your product is a real step on that path.',
      manipulativeUse: 'Exaggerating the gap to create anxiety, or implying the destination is only reachable through your product.',
      bestFor: 'Education, coaching, career services, fitness, personal development, business tools.',
    },
    {
      trigger: 'Role Model Association',
      description: 'People are drawn to products used or endorsed by people they admire. This extends to micro-influencers, industry leaders, and even peers who represent where the prospect wants to be.',
      ethicalUse: 'Authentic endorsements from people who genuinely use and benefit from the product. Case studies of real people achieving real results.',
      manipulativeUse: 'Paid endorsements that are not disclosed. Using aspirational figures who have never used the product. Implying that buying the product makes you like the endorser.',
      bestFor: 'Consumer products, courses, tools, software, fashion, fitness products.',
    },
    {
      trigger: 'Progress Visualization',
      description: 'Showing someone their potential progress makes the aspiration concrete and immediate. Vague desires become actionable when visualized through projections, simulations, or before/after previews.',
      ethicalUse: 'Providing realistic projections based on actual data. Showing typical results, not best-case outliers.',
      manipulativeUse: 'Using hand-picked extreme results as typical. Showing AI-generated or photoshopped projections that misrepresent likely outcomes.',
      bestFor: 'Fitness apps, financial tools, education platforms, design services, health products.',
    },
    {
      trigger: 'Aspirational Proximity',
      description: 'People are most motivated by aspirations that feel close enough to reach. Too far away feels hopeless. Too close feels unnecessary. The sweet spot is achievable-but-stretching.',
      ethicalUse: 'Honestly assessing what is achievable for a specific customer and setting realistic, motivating targets.',
      manipulativeUse: 'Making distant goals feel artificially close to drive purchases. "Six-figure income in 30 days" when the realistic timeline is years.',
      bestFor: 'Coaching, courses, financial products, career services, skill development tools.',
    },
  ],

  novelty: [
    {
      trigger: 'Novelty Seeking',
      description: 'Humans are neurologically wired to pay attention to new things. Novel products, approaches, and experiences trigger dopamine release. In marketing, novelty captures attention in a way that familiar approaches cannot.',
      ethicalUse: 'Genuinely innovating and presenting real new approaches, features, or perspectives. Being new because you actually created something different.',
      manipulativeUse: 'Repackaging old ideas with new names to create artificial novelty. Constant unnecessary product updates designed to trigger upgrade purchases.',
      bestFor: 'Tech products, fashion, food and beverage, entertainment, creator content.',
    },
    {
      trigger: 'First-Mover Desire',
      description: 'Some customers strongly desire to be the first to discover, use, or share new products. Being early is part of their identity. Marketing that positions a product as undiscovered or ahead of its time appeals to this drive.',
      ethicalUse: 'Giving genuine early access and special treatment to early adopters who take the risk. Acknowledging and rewarding their pioneering spirit.',
      manipulativeUse: 'Creating fake scarcity or artificial exclusivity around products that are widely available. Using "early access" for standard releases.',
      bestFor: 'Technology, software, creator economy, fashion, food trends, investment products.',
    },
    {
      trigger: 'Pattern Interruption',
      description: 'When marketing breaks expected patterns, it recaptures attention that habitual scrolling has numbed. Unexpected formats, surprising claims, or unconventional presentations force the brain to pay attention.',
      ethicalUse: 'Using creative, unexpected marketing approaches that are honest and relevant. Surprising the audience with genuine value or perspective.',
      manipulativeUse: 'Clickbait that does not deliver. Shock value for attention without substance. Misleading thumbnails or headlines.',
      bestFor: 'Social media marketing, ad creative, content marketing, email subject lines, packaging.',
    },
    {
      trigger: 'Curiosity Gap',
      description: 'When people sense a gap between what they know and what they want to know, they are strongly motivated to close it. Marketing that opens curiosity loops drives clicks and engagement.',
      ethicalUse: 'Opening genuine curiosity loops that your content actually satisfies. The payoff matches the promise.',
      manipulativeUse: 'Perpetual curiosity loops that never resolve. Bait-and-switch where the curiosity hook is unrelated to the content.',
      bestFor: 'Email marketing, content headlines, social media hooks, video thumbnails, ad copy.',
    },
  ],

  urgency: [
    {
      trigger: 'Genuine Deadline Pressure',
      description: 'Real deadlines force decisions that would otherwise be postponed indefinitely. The human tendency to procrastinate means that without urgency, even motivated buyers delay action until interest fades.',
      ethicalUse: 'Using real deadlines tied to genuine constraints: enrollment closes because the cohort starts, prices increase because costs are increasing, limited seats because the venue is finite.',
      manipulativeUse: 'Fake countdown timers that reset. Artificial deadlines on evergreen products. "Offer ends tonight" on an offer that runs every week.',
      bestFor: 'Launches, cohort-based programs, events, seasonal products, limited production runs.',
    },
    {
      trigger: 'Fear of Missing Out',
      description: 'The anxiety that others are enjoying an experience or opportunity that you are missing drives immediate action. FOMO is most powerful when the opportunity is visible, social, and time-limited.',
      ethicalUse: 'Sharing genuine results and experiences that current customers are having. Honestly communicating that an opportunity exists and will not last forever.',
      manipulativeUse: 'Fabricating social activity. Creating artificial FOMO for always-available products.',
      bestFor: 'Events, community programs, limited-edition products, live experiences, group offers.',
    },
    {
      trigger: 'Decision Fatigue Bypass',
      description: 'When faced with too many choices, people default to inaction. Urgency narrows the decision to a binary (act now or miss out) which is cognitively easier than evaluating multiple options over an indefinite timeline.',
      ethicalUse: 'Simplifying genuinely complex decisions by creating clear, time-bound evaluation windows with easy reversibility.',
      manipulativeUse: 'Creating artificial time pressure specifically to prevent thoughtful evaluation.',
      bestFor: 'Complex purchases, subscription services, B2B software, consulting engagements.',
    },
    {
      trigger: 'Momentum Urgency',
      description: 'When someone is in a state of high motivation, urgency captures that motivation before it fades. Emotion dissipates over time; urgency leverages the peak moment.',
      ethicalUse: 'Presenting offers at moments of genuine motivation when the customer will benefit from acting quickly.',
      manipulativeUse: 'Engineering emotional highs specifically to exploit the resulting urgency. High-pressure sales environments designed to prevent rational evaluation.',
      bestFor: 'Post-webinar offers, event sales, follow-up to consultations, retargeting after engagement.',
    },
  ],

  lossAversion: [
    {
      trigger: 'Loss Framing',
      description: 'Humans feel losses approximately twice as intensely as equivalent gains. Framing a marketing message in terms of what the prospect will lose by not acting is more motivating than framing what they will gain.',
      ethicalUse: 'Honestly communicating real costs of inaction when this is genuinely true and quantifiable.',
      manipulativeUse: 'Fabricating or exaggerating losses. Creating fear about consequences that are unlikely or exaggerated.',
      bestFor: 'B2B sales, insurance, security products, health services, financial products, efficiency tools.',
    },
    {
      trigger: 'Sunk Cost Leverage',
      description: 'Once someone has invested time, money, or effort into something, they are reluctant to abandon it. This can be used ethically to encourage completion and full utilization of purchased products.',
      ethicalUse: 'Reminding customers of progress they have made to encourage completion. "You are 70% through the course. Finishing will unlock the certification."',
      manipulativeUse: 'Trapping customers in escalating commitments. Making cancellation difficult because of sunk costs.',
      bestFor: 'Education platforms, SaaS retention, fitness programs, any subscription with progressive value.',
    },
    {
      trigger: 'Endowment Effect',
      description: 'People value things they already possess more than equivalent things they do not yet own. Free trials and samples leverage this by putting the product in the customers hands before asking them to pay.',
      ethicalUse: 'Offering genuine free trials that let customers experience real value. Making the trial good enough to create genuine dependency on the value provided.',
      manipulativeUse: 'Making cancellation deliberately difficult. Dark patterns in trial-to-paid conversions.',
      bestFor: 'SaaS, subscription services, physical product samples, service businesses, digital products.',
    },
    {
      trigger: 'Status Quo Bias Disruption',
      description: 'People default to maintaining their current situation even when changing would be objectively better. To drive action, you must make the cost of inaction more painful than the effort of change.',
      ethicalUse: 'Honestly illustrating the compounding cost of the status quo over time. Showing that doing nothing is itself a choice with consequences.',
      manipulativeUse: 'Catastrophizing the status quo to create panic-driven decisions.',
      bestFor: 'Enterprise software, professional services, health products, financial planning, business consulting.',
    },
  ],

  relief: [
    {
      trigger: 'Pain Point Resolution',
      description: 'The strongest purchase motivation is the relief of an existing, active pain. Products that promise to eliminate a specific, felt frustration convert at higher rates than products that promise to add new pleasure.',
      ethicalUse: 'Identifying genuine pain points and offering solutions that actually resolve them. Being specific about which pain you fix.',
      manipulativeUse: 'Exaggerating pain to make your solution seem more valuable. Creating anxiety about problems the customer does not actually have.',
      bestFor: 'Productivity tools, health products, professional services, home improvement, B2B solutions.',
    },
    {
      trigger: 'Anxiety Reduction',
      description: 'Many purchases are motivated by the desire to reduce anxiety rather than achieve a goal. Insurance, backup systems, and safety products sell peace of mind.',
      ethicalUse: 'Addressing real risks and providing genuine protection. Helping customers make informed decisions about risk management.',
      manipulativeUse: 'Inflating risks to sell unnecessary protection. Fearmongering about unlikely scenarios.',
      bestFor: 'Insurance, cybersecurity, health products, financial products, home security, backup services.',
    },
    {
      trigger: 'Simplification Appeal',
      description: 'In an increasingly complex world, products that promise simplicity and clarity are deeply appealing. The relief of not having to figure something out yourself is a powerful motivator.',
      ethicalUse: 'Genuinely simplifying something that is unnecessarily complex. Providing real clarity and reducing cognitive load.',
      manipulativeUse: 'Oversimplifying complex decisions to prevent informed choice.',
      bestFor: 'SaaS tools, consulting services, financial planning, health and wellness, education, done-for-you services.',
    },
    {
      trigger: 'Delegation Desire',
      description: 'The relief of handing off a task or responsibility to someone competent is worth significant money. People pay premium prices not for the outcome alone but for not having to think about the process.',
      ethicalUse: 'Offering genuine expertise and taking real responsibility off the customers plate.',
      manipulativeUse: 'Creating artificial complexity to make delegation seem more necessary than it is.',
      bestFor: 'Agencies, managed services, done-for-you offers, concierge services, professional services.',
    },
  ],

  status: [
    {
      trigger: 'Status Signaling',
      description: 'Purchases serve as visible markers of achievement, wealth, taste, or social position. The signaling value of a product can exceed its functional value.',
      ethicalUse: 'Creating genuinely superior products that justify their status associations. The status signal is earned through real quality.',
      manipulativeUse: 'Selling overpriced, low-quality products wrapped in status signaling. Creating artificial exclusivity for products that do not justify premium positioning.',
      bestFor: 'Luxury goods, premium services, business tools, fashion, cars, real estate, education credentials.',
    },
    {
      trigger: 'Status Leapfrogging',
      description: 'Some products allow people to display a higher status than their current position warrants. Accessible luxury and premium positioning at mid-range prices tap into the desire to appear more successful.',
      ethicalUse: 'Making genuine quality accessible to a broader market. Democratizing access to premium experiences.',
      manipulativeUse: 'Selling cheap imitations of luxury specifically to exploit status anxiety.',
      bestFor: 'Affordable luxury, premium-positioned mid-range products, experience-based businesses, professional tools.',
    },
    {
      trigger: 'Competitive Status',
      description: 'In contexts where people compare themselves to peers, products that help someone get ahead of their peer group are powerful motivators.',
      ethicalUse: 'Providing genuine competitive advantages through skill building, quality tools, or authentic differentiation.',
      manipulativeUse: 'Manufacturing peer comparison anxiety. Creating leaderboards designed to trigger competitive spending rather than genuine improvement.',
      bestFor: 'Professional development, business tools, fitness tech, educational courses, networking platforms.',
    },
    {
      trigger: 'Hidden Status Markers',
      description: 'Sophisticated consumers often prefer subtle status signals that only their peer group recognizes. The most powerful luxury is invisible to outsiders and visible to insiders.',
      ethicalUse: 'Building genuine quality and reputation that insiders recognize organically. Subtle branding that rewards knowledge.',
      manipulativeUse: 'Creating artificial insider knowledge to make outsiders feel excluded and pressured to buy their way in.',
      bestFor: 'Luxury brands, niche communities, professional tools, artisanal products, specialist services.',
    },
  ],

  taboo: [
    {
      trigger: 'Taboo Market Dynamics',
      description: 'Products addressing embarrassing, stigmatized, or private needs benefit from reduced competition and high willingness to pay. The taboo creates a barrier to entry that protects incumbents.',
      ethicalUse: 'Destigmatizing genuine health, personal, or social issues. Creating safe spaces and discreet solutions that help people without judgment.',
      manipulativeUse: 'Exploiting shame and embarrassment to charge excessive premiums. Reinforcing stigma to maintain pricing power.',
      bestFor: 'Sexual health, mental health, addiction recovery, personal hygiene, debt management, hair loss, weight management.',
    },
    {
      trigger: 'Permission to Address the Unspoken',
      description: 'When a brand gives people permission to acknowledge and address something they feel they cannot talk about, it creates intense loyalty. Being the brand that says "it is okay to have this problem" is immensely powerful.',
      ethicalUse: 'Genuine normalization of common but stigmatized experiences. Creating marketing that makes people feel seen and understood.',
      manipulativeUse: 'Pretending to destigmatize while actually reinforcing shame to drive purchases.',
      bestFor: 'Health and wellness, mental health services, relationship products, financial services, personal care.',
    },
    {
      trigger: 'Private Purchasing Behavior',
      description: 'For taboo products, the purchasing experience itself must be designed for privacy. Discreet packaging, private billing, and anonymous browsing are features, not just logistics.',
      ethicalUse: 'Respecting customer privacy as a genuine service. Making the purchasing experience comfortable and judgment-free.',
      manipulativeUse: 'Using privacy as a way to avoid accountability. Making returns difficult because the customer does not want to publicly acknowledge the purchase.',
      bestFor: 'Adult products, medical products, mental health services, addiction recovery, personal care.',
    },
    {
      trigger: 'Counter-Cultural Appeal',
      description: 'Products that openly address what mainstream culture avoids create a rebellious, authentic brand identity. Being willing to discuss taboo topics attracts customers who feel underserved by polished, mainstream brands.',
      ethicalUse: 'Genuinely serving underserved markets with honesty and respect. Breaking taboos that harm people when left unaddressed.',
      manipulativeUse: 'Using shock value for attention without genuine commitment to the community.',
      bestFor: 'Sexual wellness brands, mental health platforms, alternative lifestyle products, harm reduction services.',
    },
  ],

  scarcity: [
    {
      trigger: 'Genuine Supply Scarcity',
      description: 'When a product is genuinely limited in supply, scarcity creates urgency and increases perceived value. Real scarcity is the most ethical and effective form.',
      ethicalUse: 'Communicating real constraints honestly. Limited editions that are genuinely limited. Capacity caps that reflect actual delivery limits.',
      manipulativeUse: 'Creating artificial scarcity for digital products with zero marginal cost. Lying about stock levels.',
      bestFor: 'Handmade products, small-batch goods, service businesses, live events, physical products with genuine production limits.',
    },
    {
      trigger: 'Time Scarcity',
      description: 'Offers available for a limited time create urgency by attaching a deadline to desire. The effectiveness is proportional to how genuine and visible the deadline is.',
      ethicalUse: 'Real promotional windows tied to genuine business reasons: launch pricing, seasonal relevance, cohort enrollment.',
      manipulativeUse: 'Fake countdown timers, evergreen webinars pretending to be live, perpetual "last chance" emails.',
      bestFor: 'Course launches, seasonal businesses, event-based marketing, promotional campaigns.',
    },
    {
      trigger: 'Exclusivity Scarcity',
      description: 'Access restricted to qualified applicants creates scarcity of opportunity rather than scarcity of supply. Being chosen is more motivating than being sold to.',
      ethicalUse: 'Genuine qualification criteria that ensure fit and protect both the business and the customer.',
      manipulativeUse: 'Application processes designed to accept everyone while creating the illusion of selectivity.',
      bestFor: 'High-ticket coaching, mastermind groups, premium services, membership communities.',
    },
    {
      trigger: 'Social Proof Scarcity',
      description: 'When people see others acquiring something in limited supply, the combination of social proof and scarcity creates intense desire. "Selling fast" is more powerful than either signal alone.',
      ethicalUse: 'Showing real sales velocity for genuinely popular and limited products.',
      manipulativeUse: 'Fake purchase notifications. Manufactured waitlists for products with unlimited supply.',
      bestFor: 'E-commerce, launches, limited-edition products, event tickets, popular services.',
    },
  ],

  curiosity: [
    {
      trigger: 'Information Gap Theory',
      description: 'When people become aware of a gap between what they know and what they want to know, they experience discomfort that motivates them to close the gap. This is the fundamental mechanism behind all curiosity-driven marketing.',
      ethicalUse: 'Creating genuine information gaps that your content or product actually resolves. The promise of the hook matches the delivery.',
      manipulativeUse: 'Perpetual cliffhangers that never resolve. Clickbait that promises revelations and delivers nothing.',
      bestFor: 'Content marketing, email subject lines, video thumbnails, social media hooks, ad creative.',
    },
    {
      trigger: 'Specificity Curiosity',
      description: 'Specific, unexpected details trigger more curiosity than vague promises. "The 3-word phrase that doubled our sales" is more curiosity-inducing than "How to increase sales." Specificity implies insider knowledge.',
      ethicalUse: 'Using specific, accurate details that genuinely exist in your content.',
      manipulativeUse: 'Fabricating specific details for curiosity value that your content does not support.',
      bestFor: 'Headlines, email subject lines, ad copy, content titles, webinar titles.',
    },
    {
      trigger: 'Contrarian Curiosity',
      description: 'Statements that contradict common beliefs trigger strong curiosity because they threaten existing mental models. People need to resolve the cognitive dissonance by learning the reasoning.',
      ethicalUse: 'Sharing genuinely contrarian insights backed by evidence and reasoning.',
      manipulativeUse: 'Making deliberately provocative claims without substance to drive engagement.',
      bestFor: 'Thought leadership, content marketing, social media, podcasts, industry publications.',
    },
    {
      trigger: 'Incomplete Pattern Recognition',
      description: 'Humans compulsively complete patterns. Presenting an incomplete framework, partial list, or unfinished story creates an itch that can only be scratched by consuming the full content.',
      ethicalUse: 'Sharing the beginning of a genuinely valuable framework and delivering the rest in your content.',
      manipulativeUse: 'Creating artificial incompleteness for content that has no meaningful pattern.',
      bestFor: 'Educational content, email sequences, course marketing, content series, social media carousels.',
    },
  ],

  validation: [
    {
      trigger: 'External Validation Seeking',
      description: 'People crave confirmation that they are making the right choice, doing things correctly, and meeting standards. Products that provide validation, assessment, or benchmarking tap into this deep need.',
      ethicalUse: 'Providing honest, useful feedback that helps people improve. Assessments that accurately reflect strengths and growth areas.',
      manipulativeUse: 'Assessment tools designed to always show a gap that only your product can fill.',
      bestFor: 'Assessment tools, coaching, education, professional certifications, health tracking, business audits.',
    },
    {
      trigger: 'Expert Approval',
      description: 'Approval from a recognized authority figure validates personal choices and reduces decision anxiety. When an expert says "this is the right choice," the buyer feels confident.',
      ethicalUse: 'Genuine expert endorsements based on actual evaluation.',
      manipulativeUse: 'Buying endorsements from experts who have not evaluated the product. Using fake credentials.',
      bestFor: 'Health products, financial services, education, technology, professional tools.',
    },
    {
      trigger: 'Peer Validation',
      description: 'Knowing that people similar to you have made the same choice provides powerful validation. This is about risk reduction through similarity.',
      ethicalUse: 'Showing genuine testimonials from customers who represent the target audience accurately.',
      manipulativeUse: 'Using actors or fabricated personas. Cherry-picking outlier results as typical.',
      bestFor: 'Any product with a specific target audience. Especially effective when the purchase feels risky.',
    },
    {
      trigger: 'Progress Validation',
      description: 'Confirming that someone is making progress toward their goals reinforces continued engagement and investment. Progress indicators and milestone celebrations fulfill this need.',
      ethicalUse: 'Measuring and celebrating genuine progress. Providing honest feedback about trajectory.',
      manipulativeUse: 'Gamifying progress in ways that feel rewarding but do not reflect genuine advancement.',
      bestFor: 'Fitness apps, learning platforms, habit trackers, coaching programs, financial tools.',
    },
  ],

  transformation: [
    {
      trigger: 'Before/After Narrative',
      description: 'The most compelling marketing narrative is transformation: here is where someone was, here is what they did, here is where they are now. People do not buy products; they buy the transformation the product enables.',
      ethicalUse: 'Documenting real transformations with honest timelines, genuine challenges, and typical results.',
      manipulativeUse: 'Fabricated transformations, compressed timelines, photoshopped results, or presenting rare extreme outcomes as typical.',
      bestFor: 'Fitness, education, coaching, personal development, health, financial services, career services.',
    },
    {
      trigger: 'Identity Transformation Promise',
      description: 'The deepest transformation is not external but internal: become confident, become a leader, become free. Products that promise identity-level transformation command the highest prices and loyalty.',
      ethicalUse: 'Promising transformations your product can genuinely facilitate while acknowledging the customer does the real work.',
      manipulativeUse: 'Promising identity transformation through a product alone without genuine developmental content.',
      bestFor: 'Coaching, personal development, education, therapy, spiritual products, career transition services.',
    },
    {
      trigger: 'Transformation Timeline',
      description: 'People need to know how long transformation takes. Specific timelines make the transformation feel achievable and create commitment energy.',
      ethicalUse: 'Providing realistic timelines based on actual customer data. Including caveats about individual variation.',
      manipulativeUse: 'Compressing timelines to make transformation seem easier than it is.',
      bestFor: 'Fitness programs, courses, coaching, skill development, business development, health products.',
    },
    {
      trigger: 'Micro-Transformation Stacking',
      description: 'Large transformations feel overwhelming. Breaking them into small, achievable steps creates momentum through compounding small wins.',
      ethicalUse: 'Designing genuinely progressive experiences where each step builds real capability.',
      manipulativeUse: 'Designing micro-steps that feel productive but do not lead to meaningful outcomes.',
      bestFor: 'Online courses, fitness programs, coaching, skill development, habit formation.',
    },
    {
      trigger: 'Transformation Community',
      description: 'Seeing others at different stages of the same transformation makes the journey feel real and achievable. The community is living proof that transformation is possible.',
      ethicalUse: 'Building genuine communities where members at all stages support each other. Celebrating real wins and discussing challenges honestly.',
      manipulativeUse: 'Curating community to show only success stories while hiding members who struggle.',
      bestFor: 'Fitness communities, course cohorts, coaching groups, recovery communities, professional development.',
    },
  ],
} as const;
