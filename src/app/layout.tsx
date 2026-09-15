import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Syne } from "next/font/google";
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

const receipt = IBM_Plex_Mono({
  variable: "--font-receipt",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Twinify — Your Spotify Receipt",
  description:
    "View your top Spotify tracks and artists as a printable receipt, then turn them into a real playlist.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${receipt.variable} h-full antialiased`}
    >
      <body className="site-bg min-h-full flex flex-col text-foreground">
        {children}
      </body>
    </html>
  );
}
