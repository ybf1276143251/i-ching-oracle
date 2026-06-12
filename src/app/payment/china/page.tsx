import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "升级 Premium - 支付宝",
  description: "扫码支付 ¥9.9 升级易经占卜 Premium 会员",
};

export default function ChinaPaymentPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="card text-center">
        <span className="text-5xl block mb-4">⭐</span>
        <h1 className="text-2xl font-bold text-gradient mb-2">升级 Premium</h1>

        <div className="my-6">
          <p className="text-4xl font-bold text-gradient">¥9.9</p>
          <p className="text-sm text-[var(--muted)] mt-1">终身会员 · 一次购买，永久使用</p>
        </div>

        {/* Alipay QR */}
        <div className="bg-white rounded-xl p-6 mx-auto max-w-[280px] mb-6">
          <img
            src="/alipay-qr.jpg"
            alt="支付宝收款码"
            className="w-full rounded-lg"
          />
          <p className="text-zinc-500 text-xs mt-2 text-center">微信/支付宝扫码支付</p>
        </div>

        <div className="bg-[var(--bg)] rounded-lg p-4 mb-6 text-left text-sm space-y-3">
          <h3 className="font-bold text-[var(--gold)] text-center">📋 付款后请发送以下信息</h3>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-[var(--gold)] font-bold shrink-0">1.</span>
              <span>支付截图（含订单号）</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[var(--gold)] font-bold shrink-0">2.</span>
              <span>注册时使用的邮箱地址</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border)] text-center">
            <p className="text-[var(--muted)] text-xs mb-1">发送到</p>
            <p className="text-[var(--gold)] font-mono text-sm">1276143251@qq.com</p>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] mb-6">
          审核通过后，我们将在 24 小时内为您开通 Premium 权限。
        </p>

        <Link href="/" className="btn btn-primary">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}
