import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Upgrade to Premium — Payment",
  description: "Unlock unlimited I Ching readings with a one-time payment.",
};

export default function PaymentPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-lg mx-auto px-6">
        <div className="glass glass-glow p-8 md:p-10 text-center">
          <p className="text-5xl mb-4">⭐</p>
          <h1 className="text-3xl font-bold text-gradient mb-3">Upgrade to Premium</h1>
          <p className="text-[var(--text-secondary)] text-sm mb-8">Lifetime access · Unlimited readings · Full AI interpretation</p>

          {/* Price */}
          <div className="mb-8">
            <p className="text-5xl font-bold text-gradient">$9.9</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">One-time payment · Lifetime Premium</p>
          </div>

          {/* Alipay QR */}
          <div className="bg-white rounded-2xl p-5 mx-auto max-w-[260px] mb-6">
            <img src="/alipay-qr.jpg" alt="Alipay QR Code" className="w-full rounded-xl" />
            <p className="text-zinc-500 text-xs mt-2 text-center">Alipay / WeChat Pay</p>
          </div>

          {/* Instructions */}
          <div className="bg-[rgba(255,255,255,0.03)] rounded-xl p-5 mb-6 text-left text-sm space-y-3">
            <h3 className="font-semibold text-[var(--gold)] text-center mb-3">📋 After Payment</h3>
            <div className="space-y-2 text-[var(--text-secondary)]">
              <p>1. Take a screenshot of your payment confirmation</p>
              <p>2. Include your registered email address</p>
              <p>3. Send them via one of the channels below</p>
            </div>
          </div>

          {/* Contact channels */}
          <div className="space-y-3 mb-8">
            <a
              href="https://twitter.com/ybf1276143251"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full"
            >
              🐦 Twitter / X — @ybf1276143251
            </a>
            <div className="glass p-3 text-sm text-[var(--text-secondary)]">
              📧 Email: <span className="text-[var(--gold)]">1276143251@qq.com</span>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-6">
            We manually activate Premium within 24 hours after verifying your payment.
          </p>

          <Link href="/read" className="btn btn-primary">
            ← Back to Oracle
          </Link>
        </div>
      </div>
    </div>
  );
}
