import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";

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
    default: "NextAuth",
    template: "%s | NextAuth",
  },
  description:
    "Secure authentication example built with Next.js 15 and NextAuth, including protected routes, sessions, and modern UI.",
  keywords: [
    "nextjs",
    "nextjs 15",
    "nextauth",
    "authentication",
    "login",
    "full-stack",
    "react",
    "typescript",
  ],
  openGraph: {
    title: "NextAuth",
    description:
      "Secure authentication example built with Next.js 15 and NextAuth, including protected routes, sessions, and modern UI.",
    url: "https://next-auth-setup-iota.vercel.app/",
    siteName: "NextAuth",
    images: [
      {
        url: "/og-image.png",
        width: 700,
        height: 450,
        alt: "NextAuth",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextAuth",
    description:
      "Secure authentication example built with Next.js 15 and NextAuth, including protected routes, sessions, and modern UI.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}