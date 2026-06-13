import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy | I Ching Oracle" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">
        <div className="glass p-8 md:p-10">
          <h1 className="text-3xl font-bold text-gradient mb-8">Privacy Policy</h1>
          <p className="text-sm text-[var(--text-muted)] mb-6">Last updated: June 2026</p>

          <div className="prose text-sm max-w-none">
            <h2>1. Information We Collect</h2>
            <p>When you use I Ching Oracle, we collect:</p>
            <ul>
              <li><strong>Account information:</strong> Email address and display name when you sign up.</li>
              <li><strong>Reading data:</strong> Questions you submit and the hexagram results generated.</li>
              <li><strong>Payment information:</strong> Payment records are processed by third-party providers (Gumroad, Alipay, WeChat). We do not store your full payment details.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>To provide and improve the divination service</li>
              <li>To manage your account and Premium subscription</li>
              <li>To communicate with you about your account or purchases</li>
              <li>We do <strong>not</strong> sell your personal data to third parties</li>
            </ul>

            <h2>3. Data Storage</h2>
            <p>Your data is stored securely on Supabase servers. Readings are associated with your account for history purposes. You may delete your readings at any time from the History page.</p>

            <h2>4. Cookies</h2>
            <p>We use essential cookies for authentication and language preferences. No tracking or advertising cookies are used.</p>

            <h2>5. Third-Party Services</h2>
            <ul>
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>DeepSeek:</strong> AI interpretation</li>
              <li><strong>Gumroad/Alipay/WeChat:</strong> Payment processing</li>
            </ul>

            <h2>6. Contact</h2>
            <p>For privacy concerns, contact: <span className="text-[var(--gold)]">1276143251@qq.com</span></p>
          </div>

          <Link href="/" className="btn btn-secondary btn-sm mt-8">← Back</Link>
        </div>
      </div>
    </div>
  );
}
