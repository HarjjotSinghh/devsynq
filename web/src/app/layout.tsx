import type { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevSynq - Sync Your MCP Config Across All AI IDEs",
  description:
    "DevSynq syncs your MCP servers, API keys, and projects across Cursor, Windsurf, VS Code, and more. One config. All your IDEs.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI IDE",
    "Cursor",
    "Windsurf",
    "VS Code",
    "IDE sync",
    "developer tools",
    "AI development",
  ],
  authors: [{ name: "Harjot Singh", url: "https://github.com/HarjjotSinghh" }],
  creator: "Harjot Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devsynq.com",
    title: "DevSynq - Sync Your MCP Config Across All AI IDEs",
    description:
      "DevSynq syncs your MCP servers, API keys, and projects across Cursor, Windsurf, VS Code, and more. One config. All your IDEs.",
    siteName: "DevSynq",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DevSynq - Sync Your MCP Config Across All AI IDEs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevSynq - Sync Your MCP Config Across All AI IDEs",
    description:
      "DevSynq syncs your MCP servers, API keys, and projects across Cursor, Windsurf, VS Code, and more. One config. All your IDEs.",
    images: ["/og-image.png"],
    creator: "@harjjotsinghh",
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
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${manrope.variable} ${jetbrains.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
      <Analytics />
    </html>
  );
}
