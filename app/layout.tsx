import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"

export const metadata: Metadata = {
  title: "CHONKPUMP 9000 | Token-Gated Community Hub",
  description: "Exclusive token-gated community hub for CHONK token holders on Solana. Access forums, events, content, and governance.",
  generator: "v0.app",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://chonkpump.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "CHONKPUMP 9000",
    description: "Token-gated community hub for $CHONK holders on Solana",
    siteName: "CHONKPUMP 9000",
    images: [
      {
        url: "/chonkpump-logo.png",
        width: 512,
        height: 512,
        alt: "CHONKPUMP 9000",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CHONKPUMP 9000",
    description: "Token-gated community hub for $CHONK holders",
    images: ["/chonkpump-logo.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CHONKPUMP 9000",
  },
  icons: {
    icon: "/chonkpump-logo.png",
    apple: "/chonkpump-logo.png",
    shortcut: "/chonkpump-logo.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CHONKPUMP 9000" />
        <meta name="theme-color" content="#0052ff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CHONKPUMP 9000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" href="/chonkpump-logo.png" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          <PWAInstallPrompt />
        </Suspense>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(err => {
                    console.log('[v0] SW registration failed:', err);
                  });
                });
              }
              
              // Handle visibility changes
              document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && 'serviceWorker' in navigator) {
                  navigator.serviceWorker.controller?.postMessage({ type: 'REFRESH_DATA' });
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
