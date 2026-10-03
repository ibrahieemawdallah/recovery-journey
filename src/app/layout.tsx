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
  title: "Recovery Journey — رفيق التعافي",
  description: "Comprehensive recovery companion app with 12-step program, clinical tools, AI coaching, and community support. تطبيق شامل للتعافي مع برنامج الخطوات الـ12 والأدوات السريرية والمدرب الذكي.",
  keywords: ["recovery", "sobriety", "12 steps", "CBT", "DBT", "addiction", "mental health", "تعافي", "إدمان", "صحة نفسية"],
  authors: [{ name: "Recovery Journey Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Recovery Journey",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "Recovery Journey — رفيق التعافي",
    description: "Your comprehensive recovery companion. رفيقك الشامل في رحلة التعافي.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
