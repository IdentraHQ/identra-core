import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Navbar } from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://identra.dev"),
  title: {
    default: "Identra — The OS That Remembers",
    template: "%s | Identra",
  },
  description: "A confidential AI operating layer built for deep focus, persistent context, and secure workflows.",
  keywords: [
    "AI Operating System",
    "Confidential AI",
    "Local-first AI",
    "Secure Workflows",
    "Developer Tools",
    "Identra"
  ],
  authors: [{ name: "Identra" }],
  creator: "Identra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://identra.dev",
    title: "Identra — The OS That Remembers",
    description: "A confidential AI operating layer built for deep focus, persistent context, and secure workflows.",
    siteName: "Identra",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Identra - Confidential AI Operating Layer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Identra — The OS That Remembers",
    description: "A confidential AI operating layer built for deep focus, persistent context, and secure workflows.",
    images: ["/og-image.png"],
    creator: "@IdentraHQ",
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
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased text-foreground `}
      >
        <Navbar />
        <SmoothScroll />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
