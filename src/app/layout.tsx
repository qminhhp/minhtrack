import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import TrackingScript from "@/components/tracking/tracking-script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "User Behavior Tracking System",
  description:
    "A comprehensive analytics dashboard that tracks and displays user behavior across client websites",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <TrackingScript />
        </ThemeProvider>
        <TempoInit />
      </body>
    </html>
  );
}
