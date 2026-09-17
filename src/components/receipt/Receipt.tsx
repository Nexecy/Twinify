"use client";

import { TIME_RANGE_LABELS } from "@/lib/constants";
import type {
  ItemType,
  ReceiptFont,
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
  amount: string;
  amountValue: number;
  imageUrl?: string;
}

interface ReceiptProps {
  theme: ReceiptThemeId;
  font: ReceiptFont;
  itemType: ItemType;
  timeRange: TimeRange;
  items: ReceiptItem[];
  userName?: string | null;
  receiptRef?: React.RefObject<HTMLDivElement | null>;
}

export function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function tracksToReceiptItems(tracks: SpotifyTrack[]): ReceiptItem[] {
  return tracks.map((track, index) => ({
    id: track.id,
    rank: index + 1,
    title: track.name.toUpperCase(),
    subtitle: track.artists.map((a) => a.name).join(", "),
    amount: formatDuration(track.duration_ms),
    amountValue: track.duration_ms,
    imageUrl: track.album.images[2]?.url ?? track.album.images[0]?.url,
  }));
}

export function artistsToReceiptItems(
  artists: SpotifyArtist[],
): ReceiptItem[] {
  return artists.map((artist, index) => {
    const popularity =
      typeof artist.popularity === "number" && !isNaN(artist.popularity)
        ? Math.round(artist.popularity)
        : 50;
    return {
      id: artist.id,
      rank: index + 1,
      title: artist.name.toUpperCase(),
      subtitle: "",
      amount: String(popularity),
      amountValue: popularity,
      imageUrl: artist.images?.[2]?.url ?? artist.images?.[0]?.url,
    };
  });
}

export function genresToReceiptItems(
  artists: SpotifyArtist[],
  limit: number = 10,
): ReceiptItem[] {
  if (artists.length === 0) return [];

  const counts = new Map<string, number>();
  const totalArtists = artists.length;

  for (const artist of artists) {
    const seen = new Set<string>();
    for (const genre of artist.genres ?? []) {
      const clean = genre.trim().toUpperCase();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        counts.set(clean, (counts.get(clean) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre, count], index) => {
      const pct = (count / totalArtists) * 100;
      const pctFormatted = pct.toFixed(2);
      return {
        id: `genre-${index + 1}-${encodeURIComponent(genre)}`,
        rank: index + 1,
        title: genre,
        subtitle: "",
        amount: `${pctFormatted}%`,
        amountValue: pct,
      };
    });
}

function Barcode() {
  const bars = Array.from({ length: 52 }, (_, i) => i);
  return (
    <div className="receipt-barcode" aria-hidden>
      {bars.map((i) => (
        <span key={i} style={{ height: `${58 + ((i * 23) % 42)}%` }} />
      ))}
    </div>
  );
}

export function Receipt({
  theme,
  font,
  itemType,
  timeRange,
  items,
  userName,
  receiptRef,
}: ReceiptProps) {
  const now = new Date();
  const dateLabel = now
    .toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toUpperCase();
  const rangeLabel = TIME_RANGE_LABELS[timeRange].toUpperCase();
  const orderNum =
    timeRange === "short_term"
      ? "0001"
      : timeRange === "medium_term"
        ? "0002"
        : "0003";
  const year = now.getFullYear();
  const listener = (userName || "TWYNIFY").toUpperCase();

  const totalLabel =
    itemType === "tracks"
      ? formatDuration(items.reduce((sum, i) => sum + i.amountValue, 0))
      : itemType === "genres" || itemType === "stats"
        ? items.reduce((sum, i) => sum + i.amountValue, 0).toFixed(2)
        : String(items.reduce((sum, i) => sum + i.amountValue, 0));

  const fontClass =
    font === "classic" ? "font-receipt-classic" : "font-receipt-intl";

  return (
    <div
      ref={receiptRef}
      className="receipt-container"
    >
      <div
        className={`receipt ${fontClass}`}
        data-theme={theme}
        data-font={font}
        role="img"
        aria-label={`Twynify receipt of ${items.length} ${itemType}`}
      >
        <div className="receipt-crinkle" aria-hidden />
        <div className="receipt-body">
          <header className="text-center">
            <p className="text-[1.7rem] font-bold leading-none tracking-[0.08em]">
              TWYNIFY
            </p>
            {itemType !== "genres" ? (
              <p className="mt-2.5 text-[10px] uppercase tracking-[0.18em]">
                {rangeLabel}
              </p>
            ) : null}
            <p
              className={`${
                itemType !== "genres" ? "mt-3" : "mt-2.5"
              } text-[10px] uppercase tracking-[0.06em]`}
            >
              ORDER #{orderNum} FOR {listener}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.04em]">
              {dateLabel}
            </p>
          </header>

        <hr className="receipt-dashed" />

        <div
          className="grid grid-cols-[1.85rem_minmax(0,1fr)_auto] items-center gap-x-2 text-[10px] font-semibold uppercase tracking-[0.12em]"
          style={{ color: "var(--r-muted)" }}
        >
          <span>Qty</span>
          <span>Item</span>
          <span className="text-right">Amt</span>
        </div>

        <hr className="receipt-dashed" />

        <ol className="m-0 list-none space-y-2.5 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[1.85rem_minmax(0,1fr)_auto] items-start gap-x-2 text-left"
            >
              <span className="text-[11px] tabular-nums leading-snug">
                {String(item.rank).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium leading-snug tracking-[0.01em]">
                  {item.title}
                </p>
                {itemType === "tracks" && item.subtitle ? (
                  <p
                    className="truncate text-[9px] leading-snug tracking-[0.01em]"
                    style={{ color: "var(--r-muted)" }}
                  >
                    {item.subtitle}
                  </p>
                ) : null}
              </div>
              <span className="whitespace-nowrap text-right text-[11px] tabular-nums leading-snug">
                {item.amount}
              </span>
            </li>
          ))}
        </ol>

        <hr className="receipt-dashed" />

        <footer className="space-y-1 text-[10px]">
          <div className="flex justify-between uppercase tracking-[0.08em]">
            <span>Item Count</span>
            <span className="tabular-nums">{items.length}</span>
          </div>
          <div className="flex justify-between text-[12px] font-semibold uppercase tracking-[0.08em]">
            <span>Total</span>
            <span className="tabular-nums">{totalLabel}</span>
          </div>

          <div
            className="space-y-0.5 pt-3 tracking-[0.04em]"
            style={{ color: "var(--r-muted)" }}
          >
            <p>CARD #: **** **** **** {year}</p>
            <p>AUTH CODE: 123421</p>
            <p className="truncate">CARDHOLDER: {listener}</p>
          </div>

          <p className="pt-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em]">
            Thank you for visiting!
          </p>
          <Barcode />
          <p
            className="text-center text-[9px] tracking-[0.22em]"
            style={{ color: "var(--r-muted)" }}
          >
            twynify.vercel.app
          </p>
        </footer>
      </div>
    </div>
    </div>
  );
}
