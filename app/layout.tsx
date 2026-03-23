import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Mika Auto – Autobazar | Kvalitní ojeté vozy",
  description: "Najděte svůj ideální ojetý vůz v našem autobazaru. Široká nabídka prověřených vozů s filtrem podle značky, modelu a ceny.",
  keywords: "autobazar, ojeté vozy, Škoda, Volkswagen, Hyundai, auto prodej",
  openGraph: {
    title: "Mika Auto - Autobazar",
    description: "Kvalitní ojeté vozy za skvělé ceny.",
    images: ["https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={`${sans.variable} ${display.variable} flex min-h-screen flex-col font-sans text-slate-100`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

