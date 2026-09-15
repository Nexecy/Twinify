import type { ItemCount, ReceiptThemeId, TimeRange } from "@/types/spotify";

export const SPOTIFY_SCOPES = [
  "user-top-read",
  "playlist-modify-public",
  "playlist-modify-private",
] as const;

export const ITEM_COUNTS: ItemCount[] = [5, 10, 15, 50];

export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "Last 4 weeks" },
  { value: "medium_term", label: "Last 6 months" },
  { value: "long_term", label: "All time" },
];

export const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  short_term: "Last 4 Weeks",
  medium_term: "Last 6 Months",
  long_term: "All Time",
};

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
  accessToken: "twinify_access_token",
  refreshToken: "twinify_refresh_token",
  expiresAt: "twinify_expires_at",
  oauthState: "twinify_oauth_state",
} as const;
