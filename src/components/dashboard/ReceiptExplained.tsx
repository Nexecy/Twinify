"use client";

import { useTwynifyStore } from "@/store/twynify-store";

export function ReceiptExplained() {
  const itemType = useTwynifyStore((s) => s.itemType);

  if (itemType === "stats") {
    return (
      <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
        <h2 className="brand-mark text-xl font-bold text-white sm:text-2xl">
          Receipt Explained
        </h2>
        <dl className="mt-4 space-y-3.5 text-xs leading-relaxed text-brand-100/85 sm:text-sm">
          <div>
            <dt className="inline font-bold text-white">Popularity Score</dt>
            <dd className="inline">
              {" "}— The average popularity score of your top artists and tracks, from 0–100. The lower the number, the more &ldquo;obscure&rdquo; your music taste is.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Average Track Age</dt>
            <dd className="inline">
              {" "}— The average number of years since release of each of your top tracks. The higher this number, the &ldquo;older&rdquo; your music taste is.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Tempo</dt>
            <dd className="inline">
              {" "}— The average BPM (beats per minute) of your top tracks.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Happiness</dt>
            <dd className="inline">
              {" "}— A measure from 0 to 100 describing musical positiveness conveyed by a track. Tracks with high valence sound more positive (happy, cheerful, euphoric), while tracks with low valence sound more negative (sad, depressed, angry).
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Danceability</dt>
            <dd className="inline">
              {" "}— Describes how suitable a track is for dancing based on tempo, rhythm stability, beat strength, and overall regularity (0 to 100).
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Energy</dt>
            <dd className="inline">
              {" "}— The average energy level of your top tracks out of 100. Energetic tracks feel fast, loud, and noisy.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Acousticness</dt>
            <dd className="inline">
              {" "}— Describes how acoustic a song is. A score of 100 means the song is most likely acoustic.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Instrumentalness</dt>
            <dd className="inline">
              {" "}— Predicts whether a track contains no vocals. Rap or spoken word tracks are vocal, while values closer to 100 represent instrumental music.
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  const amtLabel =
    itemType === "tracks"
      ? "the length of the song"
      : itemType === "artists"
        ? "a popularity score from 0–100"
        : "how often that genre shows up in your listening history";

  const qtySubject =
    itemType === "tracks"
      ? "track"
      : itemType === "artists"
        ? "artist"
        : "genre";

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
      <h2 className="brand-mark text-xl font-bold text-white sm:text-2xl">
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
