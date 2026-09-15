import type {
  ItemCount,
  ItemType,
  ReceiptFont,
  ReceiptThemeId,
  TimeRange,
} from "@/types/spotify";

export const SPOTIFY_SCOPES = [
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
] as const;

export const ITEM_COUNTS: ItemCount[] = [5, 10, 15, 50];

export const LENGTH_OPTIONS: { value: ItemCount; label: string }[] = [
  { value: 5, label: "Top 5" },
  { value: 10, label: "Top 10" },
  { value: 15, label: "Top 15" },
  { value: 50, label: "Top 50" },
];

export const METRIC_OPTIONS: { value: ItemType; label: string }[] = [
  { value: "tracks", label: "Top Tracks" },
  { value: "artists", label: "Top Artists" },
  { value: "genres", label: "Top Genres" },
  { value: "stats", label: "Stats" },
];

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "Last Month" },
  { value: "medium_term", label: "Last 6 Months" },
  { value: "long_term", label: "All Time" },
];

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  short_term: "Last Month",
  medium_term: "Last 6 Months",
  long_term: "All Time",
};

export const RECEIPT_FONTS: {
  id: ReceiptFont;
  label: string;
  className: string;
}[] = [
  { id: "classic", label: "Thermal", className: "font-receipt-classic" },
  {
    id: "international",
    label: "Clear Type",
    className: "font-receipt-intl",
  },
];

export const RECEIPT_THEMES: {
  id: ReceiptThemeId;
  label: string;
  swatch: string;
}[] = [
  { id: "classic", label: "Classic", swatch: "#f5f5f0" },
  { id: "purple", label: "Purple", swatch: "#7c3aed" },
  { id: "neon", label: "Neon", swatch: "#ff00aa" },
  { id: "pastel", label: "Pastel", swatch: "#f9c5d1" },
  { id: "dark", label: "Dark", swatch: "#1a1a1a" },
  { id: "vinyl", label: "Vinyl", swatch: "#c4a574" },
];

export const COOKIE_NAMES = {
  accessToken: "twynify_access_token",
  refreshToken: "twynify_refresh_token",
  expiresAt: "twynify_expires_at",
  oauthState: "twynify_oauth_state",
} as const;
