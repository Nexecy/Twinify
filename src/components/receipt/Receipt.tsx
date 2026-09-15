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
    title: track.name,
    subtitle: track.artists.map((a) => a.name).join(", "),
    amount: formatDuration(track.duration_ms),
    amountValue: track.duration_ms,
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
    amount: String(artist.popularity ?? 0),
    amountValue: artist.popularity ?? 0,
    imageUrl: artist.images?.[2]?.url ?? artist.images?.[0]?.url,
  }));
}

export function genresToReceiptItems(
  artists: SpotifyArtist[],
  limit: number,
): ReceiptItem[] {
  const counts = new Map<string, number>();
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([genre, count], index) => ({
      id: genre,
      rank: index + 1,
      title: genre,
      subtitle: count === 1 ? "1 artist" : `${count} artists`,
      amount: String(count),
      amountValue: count,
    }));
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
  const dateLabel = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const rangeLabel = TIME_RANGE_LABELS[timeRange].toUpperCase();
  const orderNum = String((items.length * 17 + 41) % 10000).padStart(4, "0");
  const year = now.getFullYear();
  const listener = (userName || "LISTENER").toUpperCase();

  const totalLabel =
    itemType === "tracks"
      ? formatDuration(items.reduce((sum, i) => sum + i.amountValue, 0))
      : String(items.reduce((sum, i) => sum + i.amountValue, 0));

  const fontClass =
    font === "classic" ? "font-receipt-classic" : "font-receipt-intl";

  return (
    <div
      ref={receiptRef}
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
          <p className="mt-2.5 text-[10px] uppercase tracking-[0.18em]">
            {rangeLabel}
          </p>
          <p className="mt-3 text-[10px] uppercase tracking-[0.06em]">
            ORDER #{orderNum}
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.04em]">
            FOR {listener}
          </p>
          <p className="mt-2 text-[10px] tabular-nums tracking-wide">
            {dateLabel} · {timeLabel}
          </p>
        </header>

        <hr className="receipt-dashed" />

        <div
          className="grid grid-cols-[2.1rem_minmax(0,1fr)_2.9rem] gap-x-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
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
              className="grid grid-cols-[2.1rem_minmax(0,1fr)_2.9rem] items-start gap-x-1.5 text-left"
            >
              <span className="text-[11px] tabular-nums leading-snug">
                {String(item.rank).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium leading-snug tracking-[0.01em]">
                  {item.title}
                </p>
                {itemType !== "genres" ? (
                  <p
                    className="truncate text-[9px] leading-snug tracking-[0.01em]"
                    style={{ color: "var(--r-muted)" }}
                  >
                    {item.subtitle}
                  </p>
                ) : null}
              </div>
              <span className="text-right text-[11px] tabular-nums leading-snug">
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
            <p>AUTH CODE: {orderNum}</p>
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
  );
}
