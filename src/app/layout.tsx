import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedLayout from "@/components/AnimatedLayout";

export const metadata: Metadata = {
  title: { default: "I Ching Oracle — Ancient Wisdom. Modern Intelligence.", template: "%s | I Ching Oracle" },
  description: "Ancient Chinese wisdom meets modern AI. Ask any question and receive personalized guidance through the 64 hexagrams of the I Ching.",
  keywords: ["I Ching", "oracle", "divination", "AI", "wisdom", "taoism", "spirituality", "self reflection"],
  icons: { icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☯</text></svg>" },
  openGraph: {
    title: "I Ching Oracle — Ancient Wisdom. Modern Intelligence.",
    description: "Ask any question and receive personalized guidance through the wisdom of the I Ching, interpreted by advanced AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0A0A0A" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5] antialiased" style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif"}}>
        <ClientProviders>
          <Header />
          <AnimatedLayout>{children}</AnimatedLayout>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
