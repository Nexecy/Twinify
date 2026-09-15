"use client";

import { create } from "zustand";
import type {
  ItemCount,
  ItemType,
  ReceiptThemeId,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyUser,
  TimeRange,
} from "@/types/spotify";

interface TwinifyState {
  user: SpotifyUser | null;
  authChecked: boolean;
  itemType: ItemType;
  count: ItemCount;
  timeRange: TimeRange;
  receiptTheme: ReceiptThemeId;
  tracks: SpotifyTrack[];
  artists: SpotifyArtist[];
  loading: boolean;
  error: string | null;
  setUser: (user: SpotifyUser | null) => void;
  setAuthChecked: (checked: boolean) => void;
  setItemType: (type: ItemType) => void;
  setCount: (count: ItemCount) => void;
  setTimeRange: (range: TimeRange) => void;
  setReceiptTheme: (theme: ReceiptThemeId) => void;
  setTracks: (tracks: SpotifyTrack[]) => void;
  setArtists: (artists: SpotifyArtist[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTwinifyStore = create<TwinifyState>((set) => ({
  user: null,
  authChecked: false,
  itemType: "tracks",
  count: 10,
  timeRange: "medium_term",
  receiptTheme: "classic",
  tracks: [],
  artists: [],
  loading: false,
  error: null,
  setUser: (user) => set({ user }),
  setAuthChecked: (authChecked) => set({ authChecked }),
  setItemType: (itemType) => set({ itemType }),
  setCount: (count) => set({ count }),
  setTimeRange: (timeRange) => set({ timeRange }),
  setReceiptTheme: (receiptTheme) => set({ receiptTheme }),
  setTracks: (tracks) => set({ tracks }),
  setArtists: (artists) => set({ artists }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
