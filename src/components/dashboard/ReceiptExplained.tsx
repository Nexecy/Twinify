"use client";

import { useTwinifyStore } from "@/store/twinify-store";

export function ReceiptExplained() {
  const itemType = useTwinifyStore((s) => s.itemType);

  const amtLabel =
    itemType === "tracks"
      ? "the length of the song"
      : itemType === "artists"
        ? "a popularity score from 0–100"
        : "how often that genre shows up in your top artists";

  const qtySubject =
    itemType === "tracks"
      ? "track"
      : itemType === "artists"
        ? "artist"
        : "genre";

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
      <h2 className="text-xl font-bold text-white sm:text-2xl">
        Receipt Explained
      </h2>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed text-brand-100/85 sm:text-base">
        <div>
          <dt className="inline font-bold text-white">QTY: </dt>
          <dd className="inline">
            The ranking of a {qtySubject} in your most-played list. Higher on
            the receipt means you listened more.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold text-white">AMT: </dt>
          <dd className="inline">The &quot;amount&quot; is {amtLabel}.</dd>
        </div>
      </dl>
    </section>
  );
}
