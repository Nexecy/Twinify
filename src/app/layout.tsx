import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Share_Tech_Mono, Syne } from "next/font/google";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const receiptIntl = IBM_Plex_Mono({
  variable: "--font-receipt-intl",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const receiptClassic = Share_Tech_Mono({
  variable: "--font-receipt-classic",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Twynify - Your Spotify Receipt",
  description:
    "View your top Spotify tracks and artists as a printable receipt, then turn them into a real playlist.",
  icons: {
    icon: [
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f0618",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${receiptIntl.variable} ${receiptClassic.variable} h-full antialiased`}
      style={{ backgroundColor: "#0f0618" }}
    >
      <body
        className="site-bg flex min-h-dvh flex-col text-foreground"
        style={{ backgroundColor: "#0f0618" }}
      >
        {children}
      </body>
    </html>
  );
}
