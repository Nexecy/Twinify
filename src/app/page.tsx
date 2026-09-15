"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "Spotify login was cancelled.",
  missing_code: "Login failed: missing authorization code.",
  invalid_state: "Login failed: invalid session state. Try again.",
  token_exchange: "Could not complete Spotify login. Check app credentials.",
};

function LandingContent() {
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error");
  const errorMessage = errorKey
    ? (ERROR_MESSAGES[errorKey] ?? `Login error: ${errorKey}`)
    : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
        <div
          className="glow-orb pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-600/35 blur-3xl sm:h-72 sm:w-72"
          aria-hidden
        />
        <div
          className="glow-orb pointer-events-none absolute bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl sm:h-64 sm:w-64"
          aria-hidden
        />

        <section className="relative flex w-full flex-col items-center text-center">
          <h1 className="brand-mark animate-fade-up text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Twinify
          </h1>
          <p className="animate-fade-up-delay mx-auto mt-4 max-w-md text-base leading-relaxed text-brand-100/85 sm:mt-5 sm:text-lg md:text-xl">
              Your Spotify taste, printed as a receipt, then turned into a real
              playlist in one tap.
            </p>

          {errorMessage ? (
            <p
              className="animate-fade-up-delay mt-4 w-full max-w-md rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200"
              role="alert"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="animate-fade-up-delay-2 mt-7 flex w-full justify-center sm:mt-8">
            <a
              href="/api/auth/login"
              className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/40 transition hover:bg-brand-500 hover:shadow-brand-500/50 sm:w-auto"
            >
              <SpotifyIcon />
              Login with Spotify
            </a>
          </div>

          <div className="animate-fade-up-delay relative mt-10 w-full max-w-[280px] sm:mt-12 sm:max-w-[300px]">
            <DemoReceipt />
          </div>

          <ul className="mt-10 space-y-2 text-sm text-brand-200/80">
            <li>Top tracks, artists & genres · Last month / 6 months / all time</li>
            <li>Create a playlist from your top tracks</li>
            <li>Export a shareable receipt image</li>
          </ul>

          <aside className="mt-14 w-full max-w-md border-t border-white/10 pt-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
              About
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/80 sm:text-base">
              Twinify was built by{" "}
              <a
                href="https://github.com/Nexecy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white underline decoration-brand-400/60 underline-offset-4 transition hover:decoration-brand-300"
              >
                Nexecy
              </a>
              , a developer who likes turning everyday Spotify listening into
              something you can print, share, and play back as a real playlist.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-brand-100/80 sm:text-base">
              The purple branding and the name Twinify both come from his
              girlfriend: twin energy, her favorite color, and a little love
              built into every receipt.
            </p>
          </aside>
        </section>
      </main>

      <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-brand-300/60">
        Twinify is not affiliated with Spotify. Requires a Spotify account.
      </footer>
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.021zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

function DemoReceipt() {
  const demo = [
    { rank: "01", title: "Blinding Lights", artist: "The Weeknd" },
    { rank: "02", title: "As It Was", artist: "Harry Styles" },
    { rank: "03", title: "Levitating", artist: "Dua Lipa" },
    { rank: "04", title: "good 4 u", artist: "Olivia Rodrigo" },
    { rank: "05", title: "Stay", artist: "The Kid LAROI, Justin Bieber" },
  ];

  return (
    <div
      className="receipt rotate-1 transition duration-500 hover:rotate-0"
      data-theme="classic"
    >
      <header className="text-center">
        <p className="brand-mark text-2xl font-extrabold" style={{ color: "var(--r-accent)" }}>
          TWINIFY
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-80">
          Sample Receipt
        </p>
      </header>
      <hr className="receipt-dashed" />
      <ol className="m-0 list-none space-y-2 p-0">
        {demo.map((row) => (
          <li key={row.rank} className="flex gap-2 text-left text-xs">
            <span className="w-6 text-right opacity-60">{row.rank}</span>
            <div className="min-w-0">
              <p className="truncate font-medium">{row.title}</p>
              <p className="truncate text-[10px] opacity-60">{row.artist}</p>
            </div>
          </li>
        ))}
      </ol>
      <hr className="receipt-dashed" />
      <p className="text-center text-[9px] uppercase tracking-[0.18em] opacity-60">
        Login to print yours
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-brand-200">
          Loading…
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
