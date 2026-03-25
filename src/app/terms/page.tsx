'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-3xl font-bold text-text mb-2">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: March 24, 2026 (Version 2026-03-24-v1)</p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account or using MadAi ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. You must be at least 18 years old to create an account.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">2. Description of Service</h2>
            <p>MadAi is an AI-powered strategic marketing intelligence platform that provides business analysis, strategy generation, and actionable planning. The Service uses artificial intelligence to generate insights, recommendations, and strategic plans based on information you provide.</p>
            <p className="mt-2"><strong className="text-text">Important:</strong> AI-generated content is advisory in nature. It should not be treated as professional legal, financial, or business advice. You are solely responsible for decisions made based on the Service's output.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">3. Accounts and Security</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms. One account per person; sharing credentials is prohibited.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">4. Credits and Billing</h2>
            <p><strong className="text-text">Free Tier:</strong> New accounts receive 50 credits at no cost. Free credits have no cash value and are non-transferable.</p>
            <p className="mt-2"><strong className="text-text">Paid Subscriptions:</strong> Credits are replenished monthly on your billing anniversary. Unused credits do not roll over between billing periods. Subscription pricing is subject to change with 30 days notice.</p>
            <p className="mt-2"><strong className="text-text">Refunds:</strong> Subscription charges are non-refundable except where required by law. If the Service is unavailable for an extended period, we may issue pro-rated credits at our discretion.</p>
            <p className="mt-2"><strong className="text-text">Credit Costs:</strong> Different actions consume different credit amounts. Chat messages cost 1 credit, analyses cost 2 credits, research costs 3 credits, and strategy briefs cost 5 credits. We reserve the right to adjust credit costs with reasonable notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">5. Your Data and Privacy</h2>
            <p>You retain ownership of all business information and data you provide to the Service. We process your data to provide the Service and improve our AI models. See our <a href="/privacy" className="text-primary-light hover:underline">Privacy Policy</a> for full details on data handling.</p>
            <p className="mt-2">We do not sell your personal information to third parties. Business data you input is used exclusively to provide you with strategic analysis and is not shared with other users.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">6. Acceptable Use</h2>
            <p>You agree not to: (a) use the Service for any illegal purpose; (b) attempt to reverse-engineer, hack, or exploit the Service; (c) manipulate credit balances or abuse the billing system; (d) create multiple free accounts to circumvent credit limits; (e) use the Service to generate content that is harmful, fraudulent, or deceptive; (f) automate access without written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">7. Intellectual Property</h2>
            <p><strong className="text-text">Your Content:</strong> You own all business plans, strategies, and documents generated through the Service based on your input.</p>
            <p className="mt-2"><strong className="text-text">Our Platform:</strong> The MadAi platform, AI models, prompts, UI design, and underlying technology remain our intellectual property.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">8. Limitation of Liability</h2>
            <p>The Service is provided "as is" without warranties of any kind. We are not liable for any business decisions made based on AI-generated recommendations. Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">9. Termination</h2>
            <p>You may close your account at any time. We may terminate or suspend your account for violation of these terms. Upon termination, your access to the Service will end and your data will be deleted within 30 days, unless retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">10. Changes to Terms</h2>
            <p>We may update these terms with reasonable notice. Continued use of the Service after changes constitutes acceptance. Material changes will be communicated via email or in-app notification.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">11. Contact</h2>
            <p>Questions about these terms? Contact us at <a href="mailto:legal@madai.app" className="text-primary-light hover:underline">legal@madai.app</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
