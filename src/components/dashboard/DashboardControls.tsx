"use client";

import {
  LENGTH_OPTIONS,
  METRIC_OPTIONS,
  RECEIPT_FONTS,
  RECEIPT_THEMES,
  TIME_RANGES,
} from "@/lib/constants";
import { useTwynifyStore } from "@/store/twynify-store";
import type { ItemCount, ItemType, ReceiptFont, TimeRange } from "@/types/spotify";

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-left text-sm font-semibold text-white">
      {children}
    </p>
  );
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns,
}: {
  label: string;
  options: { value: T; label: string; fontClass?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3 | 4;
}) {
  const grid =
    columns === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : columns === 4
          ? "grid-cols-2"
          : "grid-cols-1";

  return (
    <div className="w-full">
      <ControlLabel>{label}</ControlLabel>
      <div className={`grid gap-2 ${grid}`}>
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`min-h-12 rounded-full border px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${
                opt.fontClass ?? ""
              } ${
                active
                  ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "border-white/20 bg-transparent text-brand-50 hover:bg-white/10"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardControls() {
  const itemType = useTwynifyStore((s) => s.itemType);
  const count = useTwynifyStore((s) => s.count);
  const timeRange = useTwynifyStore((s) => s.timeRange);
  const receiptTheme = useTwynifyStore((s) => s.receiptTheme);
  const receiptFont = useTwynifyStore((s) => s.receiptFont);
  const setItemType = useTwynifyStore((s) => s.setItemType);
  const setCount = useTwynifyStore((s) => s.setCount);
  const setTimeRange = useTwynifyStore((s) => s.setTimeRange);
  const setReceiptTheme = useTwynifyStore((s) => s.setReceiptTheme);
  const setReceiptFont = useTwynifyStore((s) => s.setReceiptFont);

  return (
    <div className="w-full space-y-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:p-6">
      <h2 className="brand-mark text-left text-2xl font-extrabold text-white sm:text-3xl">
        Customize Receipt
      </h2>

      <div className="w-full">
        <ControlLabel>Metric</ControlLabel>
        <label className="sr-only" htmlFor="metric-select">
          Metric
        </label>
        <select
          id="metric-select"
          value={itemType}
          onChange={(e) => setItemType(e.target.value as ItemType)}
          className="min-h-12 w-full appearance-none rounded-xl border border-white/20 bg-[#1a0b2e] bg-[length:1rem] bg-[right_0.9rem_center] bg-no-repeat px-4 py-3 text-base font-medium text-white outline-none ring-brand-500 focus:ring-2"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%c4b5fd'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
          }}
        >
          {METRIC_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <Segmented<TimeRange>
        label="Time Period"
        value={timeRange}
        onChange={setTimeRange}
        options={TIME_RANGES}
        columns={3}
      />

      {itemType !== "stats" && itemType !== "genres" ? (
        <Segmented<ItemCount>
          label="Length"
          value={count}
          onChange={setCount}
          options={LENGTH_OPTIONS}
          columns={4}
        />
      ) : null}

      <Segmented<ReceiptFont>
        label="Font"
        value={receiptFont}
        onChange={setReceiptFont}
        columns={2}
        options={RECEIPT_FONTS.map((f) => ({
          value: f.id,
          label: f.label,
          fontClass:
            f.id === "classic" ? "font-receipt-classic" : "font-receipt-intl",
        }))}
      />

      <div className="w-full">
        <ControlLabel>Receipt Theme</ControlLabel>
        <p className="mb-2 text-left text-xs text-brand-200/70">
          Colors the receipt only. Twynify stays purple.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {RECEIPT_THEMES.map((theme) => {
            const active = theme.id === receiptTheme;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setReceiptTheme(theme.id)}
                className={`flex min-h-12 items-center justify-center gap-2 rounded-full border px-3 py-3 text-sm font-semibold transition active:scale-[0.98] ${
                  active
                    ? "border-brand-500 bg-brand-600 text-white shadow-md shadow-brand-600/30"
                    : "border-white/20 bg-transparent text-brand-50 hover:bg-white/10"
                }`}
              >
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-white/30"
                  style={{ background: theme.swatch }}
                  aria-hidden
                />
                {theme.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
