"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { TIME_RANGE_LABELS } from "@/lib/constants";
import type { CreatedPlaylist, TimeRange } from "@/types/spotify";

interface PlaylistModalProps {
  open: boolean;
  onClose: () => void;
  defaultName: string;
  defaultDescription: string;
  trackUris: string[];
}

export function PlaylistModal({
  open,
  onClose,
  defaultName,
  defaultDescription,
  trackUris,
}: PlaylistModalProps) {
  const titleId = useId();
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<CreatedPlaylist | null>(null);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setDescription(defaultDescription);
      setError(null);
      setPlaylist(null);
      setSubmitting(false);
    }
  }, [open, defaultName, defaultDescription]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const create = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/spotify/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          isPublic,
          trackUris,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create playlist");
      }
      setPlaylist(data.playlist as CreatedPlaylist);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, [name, description, isPublic, trackUris]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md animate-fade-up rounded-2xl border border-white/10 bg-[#1a0b2e] p-6 shadow-2xl shadow-brand-900/50">
        {playlist ? (
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">
              Playlist created
            </p>
            <h2 id={titleId} className="brand-mark text-2xl font-bold">
              {playlist.name}
            </h2>
            <p className="text-sm text-brand-100/70">
              Your Twynify playlist is live on Spotify.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <a
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500"
              >
                Open in Spotify
              </a>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-brand-100 hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-300">
                New playlist
              </p>
              <h2 id={titleId} className="brand-mark mt-1 text-2xl font-bold">
                Create from top songs
              </h2>
              <p className="mt-1 text-sm text-brand-100/70">
                {trackUris.length} tracks will be added.
              </p>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-brand-300">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-brand-300">
                Description
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-brand-100">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="accent-brand-500"
              />
              Public playlist
            </label>

            {error ? (
              <p className="rounded-lg bg-red-500/15 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={create}
                disabled={submitting || !name.trim()}
                className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Creating…" : "Create playlist"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function buildPlaylistDefaults(count: number, timeRange: TimeRange) {
  const range = TIME_RANGE_LABELS[timeRange];
  return {
    name: `Twynify - My Top ${count} (${range})`,
    description: `Auto-generated by Twynify from my top ${count} songs · ${range}`,
  };
}
