import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "易经占卜 I Ching Oracle — AI智能解卦",
    template: "%s | 易经占卜 I Ching Oracle",
  },
  description:
    "基于易经64卦的AI智能占卜平台。输入你的问题，随机起卦，获得深度解读。融合传统智慧与现代AI技术。",
  keywords: ["易经", "占卜", "I Ching", "64卦", "AI解卦", "算命", "周易"],
  openGraph: {
    title: "易经占卜 I Ching Oracle",
    description: "基于易经64卦的AI智能占卜平台。输入你的问题，随机起卦，获得深度解读。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased`}
      >
        <ClientProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
