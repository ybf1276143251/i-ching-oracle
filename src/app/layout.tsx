import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedLayout from "@/components/AnimatedLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#0A0A0A] text-[#F5F5F5] antialiased">
        <ClientProviders>
          <Header />
          <AnimatedLayout>{children}</AnimatedLayout>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
