"use client";

import { TIME_RANGE_LABELS } from "@/lib/constants";
import type {
  ItemType,
  ReceiptThemeId,
  SpotifyArtist,
  SpotifyTrack,
  TimeRange,
} from "@/types/spotify";

export interface ReceiptItem {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  imageUrl?: string;
}

interface ReceiptProps {
  theme: ReceiptThemeId;
  itemType: ItemType;
  timeRange: TimeRange;
  items: ReceiptItem[];
  userName?: string | null;
  receiptRef?: React.RefObject<HTMLDivElement | null>;
}

export function tracksToReceiptItems(tracks: SpotifyTrack[]): ReceiptItem[] {
  return tracks.map((track, index) => ({
    id: track.id,
    rank: index + 1,
    title: track.name,
    subtitle: track.artists.map((a) => a.name).join(", "),
    imageUrl: track.album.images[2]?.url ?? track.album.images[0]?.url,
  }));
}

export function artistsToReceiptItems(
  artists: SpotifyArtist[],
): ReceiptItem[] {
  return artists.map((artist, index) => ({
    id: artist.id,
    rank: index + 1,
    title: artist.name,
    subtitle: artist.genres?.slice(0, 2).join(" · ") || "Artist",
    imageUrl: artist.images?.[2]?.url ?? artist.images?.[0]?.url,
  }));
}

function Barcode() {
  const bars = Array.from({ length: 42 }, (_, i) => i);
  return (
    <div className="receipt-barcode" aria-hidden>
      {bars.map((i) => (
        <span key={i} style={{ height: `${60 + ((i * 17) % 40)}%` }} />
      ))}
    </div>
  );
}

export function Receipt({
  theme,
  itemType,
  timeRange,
  items,
  userName,
  receiptRef,
}: ReceiptProps) {
  const now = new Date();
  const timestamp = now.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const heading = itemType === "tracks" ? "TOP TRACKS" : "TOP ARTISTS";
  const rangeLabel = TIME_RANGE_LABELS[timeRange].toUpperCase();

  return (
    <div
      ref={receiptRef}
      className="receipt"
      data-theme={theme}
      role="img"
      aria-label={`Twinify receipt of ${items.length} ${itemType}`}
    >
      <header className="text-center">
        <p
          className="brand-mark text-2xl font-extrabold tracking-tight"
          style={{ color: "var(--r-accent)" }}
        >
          TWINIFY
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] opacity-80">
          Spotify Listening Receipt
        </p>
        {userName ? (
          <p className="mt-2 text-xs" style={{ color: "var(--r-muted)" }}>
            {userName}
          </p>
        ) : null}
      </header>

      <hr className="receipt-dashed" />

      <div className="flex justify-between text-[10px] uppercase tracking-wider">
        <span>{heading}</span>
        <span style={{ color: "var(--r-muted)" }}>{rangeLabel}</span>
      </div>

      <hr className="receipt-dashed" />

      <ol className="m-0 list-none space-y-2.5 p-0">
        {items.map((item) => (
          <li key={item.id} className="flex gap-2 text-left">
            <span
              className="w-6 shrink-0 text-right text-xs tabular-nums"
              style={{ color: "var(--r-muted)" }}
            >
              {String(item.rank).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium leading-snug">
                {item.title}
              </p>
              <p
                className="truncate text-[10px] leading-snug"
                style={{ color: "var(--r-muted)" }}
              >
                {item.subtitle}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <hr className="receipt-dashed" />

      <footer className="space-y-1 text-[10px]">
        <div className="flex justify-between uppercase tracking-wider">
          <span>Total items</span>
          <span className="font-semibold">{items.length}</span>
        </div>
        <div
          className="flex justify-between"
          style={{ color: "var(--r-muted)" }}
        >
          <span>Printed</span>
          <span>{timestamp}</span>
        </div>
        <p
          className="pt-2 text-center text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "var(--r-muted)" }}
        >
          Thank you for listening
        </p>
        <Barcode />
        <p
          className="text-center text-[9px] tracking-widest"
          style={{ color: "var(--r-muted)" }}
        >
          *** twinify.app ***
        </p>
      </footer>
    </div>
  );
}
