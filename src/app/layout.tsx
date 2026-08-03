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
  title: "NextAuth",
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
      "Complete authentication flow using Next.js 15 App Router and NextAuth, with sign-in, sign-out, and protected pages.",
    // url: "https://your-deployment-url.com",
    type: "website",
  },
  // metadataBase: new URL("https://your-deployment-url.com"),
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
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
