import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service | I Ching Oracle" };

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="glass p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gradient mb-8">Terms of Service</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Last updated: June 2026</p>

          <div className="prose text-sm max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing I Ching Oracle, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>

            <h2>2. Service Description</h2>
            <p>I Ching Oracle provides AI-powered divination based on the ancient Chinese Book of Changes. The service is intended for <strong>entertainment and self-reflection purposes only</strong>.</p>

            <h2>3. Disclaimer</h2>
            <p>The readings and interpretations provided by I Ching Oracle do <strong>not</strong> constitute professional advice (medical, legal, financial, or otherwise). You are solely responsible for any decisions or actions you take based on the readings.</p>

            <h2>4. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when registering.</p>

            <h2>5. Premium Subscriptions</h2>
            <p>Premium features require payment. Payments are processed through third-party providers. Refund requests are handled on a case-by-case basis. Contact support for refund inquiries.</p>

            <h2>6. Acceptable Use</h2>
            <p>You agree not to misuse the service, including but not limited to: automated scraping, submitting illegal content, or attempting to disrupt the service.</p>

            <h2>7. Intellectual Property</h2>
            <p>The I Ching Oracle website, branding, and custom code are the property of the service owner. The I Ching text itself is in the public domain.</p>

            <h2>8. Limitation of Liability</h2>
            <p>I Ching Oracle is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of the service.</p>

            <h2>9. Changes to Terms</h2>
            <p>We may update these terms at any time. Continued use of the service after changes constitutes acceptance.</p>

            <h2>10. Contact</h2>
            <p>For questions: <span className="text-[var(--gold)]">1276143251@qq.com</span></p>
          </div>

          <Link href="/" className="btn btn-secondary btn-sm mt-8">← Back</Link>
        </div>
      </div>
    </div>
  );
}
