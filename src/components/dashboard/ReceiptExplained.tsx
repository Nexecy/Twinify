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
              {" "}— The average popularity score of your top 50 artists, from 0–100. The lower the number, the more &ldquo;obscure&rdquo; your music taste is.
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
              {" "}— The average BPM of your top tracks.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Happiness</dt>
            <dd className="inline">
              {" "}— A measure from 0 to 100 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Danceability</dt>
            <dd className="inline">
              {" "}— Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity (0 to 100).
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Energy</dt>
            <dd className="inline">
              {" "}— A measure from 0 to 100 that represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Acousticness</dt>
            <dd className="inline">
              {" "}— A confidence measure from 0 to 100 of whether the track is acoustic. 100 represents high confidence the track is acoustic.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">Instrumentalness</dt>
            <dd className="inline">
              {" "}— Predicts whether a track contains no vocals. The closer the instrumentalness value is to 100, the greater likelihood the track contains no vocal content.
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  if (itemType === "genres") {
    return (
      <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
        <h2 className="brand-mark text-xl font-bold text-white sm:text-2xl">
          Receipt Explained
        </h2>
        <dl className="mt-4 space-y-3 text-sm leading-relaxed text-brand-100/85 sm:text-base">
          <div>
            <dt className="inline font-bold text-white">QTY</dt>
            <dd className="inline">
              {" "}— The ranking of a genre in your most played artists.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">AMT</dt>
            <dd className="inline">
              {" "}— The % of your top artists that a genre appears in. For example, 25% means that 25% of your top artists fall under the genre.
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  if (itemType === "artists") {
    return (
      <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
        <h2 className="brand-mark text-xl font-bold text-white sm:text-2xl">
          Receipt Explained
        </h2>
        <dl className="mt-4 space-y-3 text-sm leading-relaxed text-brand-100/85 sm:text-base">
          <div>
            <dt className="inline font-bold text-white">QTY</dt>
            <dd className="inline">
              {" "}— The ranking of an artist in your most played. The higher up on the list, the more played it is.
            </dd>
          </div>
          <div>
            <dt className="inline font-bold text-white">AMT</dt>
            <dd className="inline">
              {" "}— The popularity of an artist, from 0–100. 100 is the most popular, and 0 is the least popular.
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left sm:p-6">
      <h2 className="brand-mark text-xl font-bold text-white sm:text-2xl">
        Receipt Explained
      </h2>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed text-brand-100/85 sm:text-base">
        <div>
          <dt className="inline font-bold text-white">QTY</dt>
          <dd className="inline">
            {" "}— The ranking of a track in your most played. Higher on the receipt means you listened more.
          </dd>
        </div>
        <div>
          <dt className="inline font-bold text-white">AMT</dt>
          <dd className="inline">
            {" "}— The length of the song (minutes and seconds).
          </dd>
        </div>
      </dl>
    </section>
  );
}
