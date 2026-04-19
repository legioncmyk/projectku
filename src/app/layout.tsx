import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zall TopUp Game Murah & Cepat",
  description: "Top up game murah, cepat, dan terpercaya. MLBB, FF, PUBG, Valorant, Genshin Impact, dan 60+ game lainnya. Proses instan 24 jam.",
  keywords: "top up game murah, diamond ml, ff murah, top up cepat, top up pubg mobile, top up free fire, top up mobile legends, top up genshin impact, top up valorant, zall topup",
  authors: [{ name: "Zall Store" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
  openGraph: {
    title: "Zall TopUp - Top Up Game Murah & Cepat",
    description: "Top up game murah, cepat, dan terpercaya. 60+ game tersedia dengan proses instan.",
    type: "website",
    locale: "id_ID",
    siteName: "Zall TopUp",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zall TopUp - Top Up Game Murah & Cepat",
    description: "Top up game murah, cepat, dan terpercaya. 60+ game tersedia dengan proses instan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://zalltopup.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
