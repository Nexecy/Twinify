"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { ExportActions } from "@/components/dashboard/ExportActions";
import {
  PlaylistModal,
  buildPlaylistDefaults,
} from "@/components/dashboard/PlaylistModal";
import {
  Receipt,
  artistsToReceiptItems,
  tracksToReceiptItems,
} from "@/components/receipt/Receipt";
import { SiteHeader } from "@/components/SiteHeader";
import { useTwinifyStore } from "@/store/twinify-store";
import type { SpotifyArtist, SpotifyTrack, SpotifyUser } from "@/types/spotify";

export default function DashboardPage() {
  const router = useRouter();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playlistUris, setPlaylistUris] = useState<string[]>([]);

  const user = useTwinifyStore((s) => s.user);
  const authChecked = useTwinifyStore((s) => s.authChecked);
  const itemType = useTwinifyStore((s) => s.itemType);
  const count = useTwinifyStore((s) => s.count);
  const timeRange = useTwinifyStore((s) => s.timeRange);
  const receiptTheme = useTwinifyStore((s) => s.receiptTheme);
  const tracks = useTwinifyStore((s) => s.tracks);
  const artists = useTwinifyStore((s) => s.artists);
  const loading = useTwinifyStore((s) => s.loading);
  const error = useTwinifyStore((s) => s.error);
  const setUser = useTwinifyStore((s) => s.setUser);
  const setAuthChecked = useTwinifyStore((s) => s.setAuthChecked);
  const setTracks = useTwinifyStore((s) => s.setTracks);
  const setArtists = useTwinifyStore((s) => s.setArtists);
  const setLoading = useTwinifyStore((s) => s.setLoading);
  const setError = useTwinifyStore((s) => s.setError);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          if (!cancelled) {
            setUser(null);
            setAuthChecked(true);
            router.replace("/");
          }
          return;
        }
        const data = (await res.json()) as { user: SpotifyUser };
        if (!cancelled) {
          setUser(data.user);
          setAuthChecked(true);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAuthChecked(true);
          router.replace("/");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, setUser, setAuthChecked]);

  const fetchTop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        type: itemType,
        time_range: timeRange,
        limit: String(count),
      });
      const res = await fetch(`/api/spotify/top?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load top items");
      }
      if (data.error && (!data.items || data.items.length === 0)) {
        setError(data.error as string);
        if (itemType === "tracks") setTracks([]);
        else setArtists([]);
        return;
      }
      if (itemType === "tracks") {
        setTracks(data.items as SpotifyTrack[]);
      } else {
        setArtists(data.items as SpotifyArtist[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [
    itemType,
    timeRange,
    count,
    setLoading,
    setError,
    setTracks,
    setArtists,
  ]);

  useEffect(() => {
    if (!user) return;
    void fetchTop();
  }, [user, fetchTop]);

  const receiptItems = useMemo(() => {
    if (itemType === "tracks") return tracksToReceiptItems(tracks);
    return artistsToReceiptItems(artists);
  }, [itemType, tracks, artists]);

  const playlistDefaults = useMemo(
    () => buildPlaylistDefaults(count, timeRange),
    [count, timeRange],
  );

  const openPlaylistModal = useCallback(async () => {
    setError(null);
    // Refresh top tracks for current count + time range before creating
    setLoading(true);
    try {
      const params = new URLSearchParams({
        type: "tracks",
        time_range: timeRange,
        limit: String(count),
      });
      const res = await fetch(`/api/spotify/top?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load top tracks");
      }
      const items = (data.items ?? []) as SpotifyTrack[];
      if (!items.length) {
        setError(
          (data.error as string) ||
            "No top tracks available to build a playlist.",
        );
        return;
      }
      setTracks(items);
      setPlaylistUris(items.map((t) => t.uri));
      setPlaylistOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tracks");
    } finally {
      setLoading(false);
    }
  }, [timeRange, count, setError, setLoading, setTracks]);

  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-brand-200">
        Checking session…
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader showLogout />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 w-full max-w-xl text-center sm:mb-8">
          <h1 className="brand-mark text-3xl font-extrabold text-white sm:text-4xl">
            Your receipt
          </h1>
          <p className="mt-2 text-sm text-brand-200/80 sm:text-base">
            Dial in the range, theme the printout, then save or playlist it.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
          <section className="flex w-full max-w-xl flex-col items-center gap-5 lg:max-w-md">
            <DashboardControls />

            <div className="flex w-full flex-col items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => void openPlaylistModal()}
                className="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
              >
                Create Playlist from My Top Songs
              </button>
              <ExportActions
                receiptRef={receiptRef}
                disabled={receiptItems.length === 0 || loading}
              />
            </div>

            {error ? (
              <p
                className="w-full rounded-xl bg-amber-500/15 px-4 py-3 text-center text-sm text-amber-100"
                role="alert"
              >
                {error}
              </p>
            ) : null}
          </section>

          <aside className="w-full max-w-[340px] shrink-0 lg:sticky lg:top-6">
            <div className="flex justify-center rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-6">
              {loading ? (
                <div className="flex h-64 w-full items-center justify-center text-sm text-brand-200">
                  Loading your top {itemType}…
                </div>
              ) : receiptItems.length === 0 ? (
                <div className="flex h-64 w-full items-center justify-center px-4 text-center text-sm text-brand-200">
                  No items to show for this selection.
                </div>
              ) : (
                <Receipt
                  receiptRef={receiptRef}
                  theme={receiptTheme}
                  itemType={itemType}
                  timeRange={timeRange}
                  items={receiptItems}
                  userName={user.display_name}
                />
              )}
            </div>
          </aside>
        </div>
      </main>

      <PlaylistModal
        open={playlistOpen}
        onClose={() => setPlaylistOpen(false)}
        defaultName={playlistDefaults.name}
        defaultDescription={playlistDefaults.description}
        trackUris={playlistUris}
      />
    </div>
  );
}
