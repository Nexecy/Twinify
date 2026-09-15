"use client";

import { ITEM_COUNTS, RECEIPT_THEMES, TIME_RANGES } from "@/lib/constants";
import { useTwinifyStore } from "@/store/twinify-store";
import type { ItemCount, ItemType, TimeRange } from "@/types/spotify";

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="w-full space-y-2">
      <legend className="w-full text-center text-xs font-medium uppercase tracking-[0.14em] text-brand-300">
        {label}
      </legend>
      <div className="flex flex-wrap justify-center gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                  : "bg-white/5 text-brand-100 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function DashboardControls() {
  const itemType = useTwinifyStore((s) => s.itemType);
  const count = useTwinifyStore((s) => s.count);
  const timeRange = useTwinifyStore((s) => s.timeRange);
  const receiptTheme = useTwinifyStore((s) => s.receiptTheme);
  const setItemType = useTwinifyStore((s) => s.setItemType);
  const setCount = useTwinifyStore((s) => s.setCount);
  const setTimeRange = useTwinifyStore((s) => s.setTimeRange);
  const setReceiptTheme = useTwinifyStore((s) => s.setReceiptTheme);

  return (
    <div className="w-full space-y-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-5">
      <Segmented<ItemType>
        label="Show"
        value={itemType}
        onChange={setItemType}
        options={[
          { value: "tracks", label: "Top Songs" },
          { value: "artists", label: "Top Artists" },
        ]}
      />

      <Segmented<ItemCount>
        label="Count"
        value={count}
        onChange={setCount}
        options={ITEM_COUNTS.map((c) => ({
          value: c,
          label: String(c),
        }))}
      />

      <Segmented<TimeRange>
        label="Time range"
        value={timeRange}
        onChange={setTimeRange}
        options={TIME_RANGES}
      />

      <fieldset className="w-full space-y-2">
        <legend className="w-full text-center text-xs font-medium uppercase tracking-[0.14em] text-brand-300">
          Receipt theme
        </legend>
        <p className="text-center text-xs text-brand-200/70">
          Affects the receipt only — site chrome stays Twinify purple.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {RECEIPT_THEMES.map((theme) => {
            const active = theme.id === receiptTheme;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setReceiptTheme(theme.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30"
                    : "bg-white/5 text-brand-100 hover:bg-white/10"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-white/30"
                  style={{ background: theme.swatch }}
                  aria-hidden
                />
                {theme.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
