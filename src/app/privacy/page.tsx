'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <h1 className="text-3xl font-bold text-text mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: March 24, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">1. Information We Collect</h2>
            <p><strong className="text-text">Account Information:</strong> Name, email address, and hashed password (we never store plaintext passwords).</p>
            <p className="mt-2"><strong className="text-text">Business Data:</strong> Information you provide during strategic analysis sessions, including business descriptions, revenue figures, goals, and other business details you choose to share.</p>
            <p className="mt-2"><strong className="text-text">Usage Data:</strong> Credit usage, session activity, module usage patterns, and feature interactions to improve the Service.</p>
            <p className="mt-2"><strong className="text-text">Technical Data:</strong> IP address (for rate limiting and security), browser type, and device information.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">2. How We Use Your Information</h2>
            <p>We use your information to: (a) provide and improve the Service; (b) generate personalized strategic analysis; (c) manage your account and billing; (d) communicate service updates; (e) prevent fraud and abuse; (f) comply with legal obligations.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">3. AI Data Processing</h2>
            <p>Your business data is sent to third-party AI providers (currently Anthropic Claude) to generate strategic analysis. This data is transmitted securely and is subject to the AI provider's data processing terms. We do not use your business data to train AI models. Conversations are stored to provide continuity within your sessions.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">4. Data Sharing</h2>
            <p>We do not sell your personal information. We share data only with: (a) AI processing providers as necessary to deliver the Service; (b) payment processors for billing (when applicable); (c) law enforcement when required by valid legal process.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">5. Data Security</h2>
            <p>We implement industry-standard security measures including: encrypted data transmission (TLS), hashed passwords (bcrypt), rate-limited API endpoints, and atomic database operations for credit management. No system is 100% secure; we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">6. Data Retention</h2>
            <p>Account data is retained while your account is active. Session data and AI memories are retained to provide ongoing service value. Upon account deletion, all personal data is removed within 30 days. Anonymized usage statistics may be retained for analytics.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">7. Your Rights</h2>
            <p>You have the right to: (a) access your personal data; (b) correct inaccurate data; (c) request deletion of your account and data; (d) export your data; (e) withdraw consent for data processing. To exercise these rights, contact us at <a href="mailto:privacy@madai.app" className="text-primary-light hover:underline">privacy@madai.app</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">8. Cookies</h2>
            <p>We use essential cookies for authentication and session management. We do not use advertising or tracking cookies. Essential cookies cannot be disabled as they are required for the Service to function.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">9. Children's Privacy</h2>
            <p>The Service is not intended for users under 18 years of age. We do not knowingly collect data from minors.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">10. Changes to This Policy</h2>
            <p>We may update this policy periodically. Material changes will be communicated via email. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text mt-8 mb-3">11. Contact</h2>
            <p>For privacy inquiries: <a href="mailto:privacy@madai.app" className="text-primary-light hover:underline">privacy@madai.app</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
