export type TimeRange = "short_term" | "medium_term" | "long_term";
export type ItemType = "tracks" | "artists" | "genres" | "stats";
export type ItemCount = 5 | 10 | 15 | 50;
export type ReceiptFont = "classic" | "international";

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  tempo: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness?: number;
  liveness?: number;
}

export type ReceiptThemeId =
  | "classic"
  | "neon"
  | "pastel"
  | "dark"
  | "vinyl"
  | "purple";

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  external_urls: { spotify: string };
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  popularity?: number;
  external_urls: { spotify: string };
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
}

export interface SpotifyUser {
  id: string;
  display_name: string | null;
  email?: string;
  images: SpotifyImage[];
  external_urls: { spotify: string };
}

export interface TopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
}

export interface TopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreatedPlaylist {
  id: string;
  name: string;
  description: string | null;
  external_urls: { spotify: string };
  uri: string;
}

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
