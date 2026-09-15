# Twinify

Spotify stats and playlist generator styled as a printable receipt, inspired by Receiptify, with playlist creation built in.

## Features

- **Spotify OAuth** (Authorization Code flow) with httpOnly cookie token storage and automatic refresh
- **Top songs / top artists** with count (5 / 10 / 15 / 50) and time range (4 weeks / 6 months / all time)
- **Create Playlist** from your current top tracks selection
- **Receipt printout** with perforated edges, monospace type, barcode flourish
- **Receipt themes** (classic, purple, neon, pastel, dark, vinyl); independent of site chrome
- **Save as Image**, copy to clipboard, and share

## Setup

1. Create a Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Add redirect URI: `http://localhost:3000/api/auth/callback`
3. Copy env vars:

```bash
cp .env.example .env.local
```

4. Fill in `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, and URIs in `.env.local`
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required Spotify scopes

- `user-top-read`
- `playlist-modify-public`
- `playlist-modify-private`

## Project structure

```
src/
  app/
    page.tsx                 # Landing
    dashboard/page.tsx       # Controls + receipt
    api/auth/*               # OAuth login/callback/logout/me
    api/spotify/*            # Top items + playlist creation
  components/
    receipt/Receipt.tsx
    dashboard/*              # Controls, export, playlist modal
  lib/                       # Spotify client, auth cookies, constants
  store/twinify-store.ts     # Zustand state
  types/spotify.ts
```

## Notes

- Client secret stays on the server; tokens live in httpOnly cookies (not localStorage).
- Empty listening history for a time range returns a friendly message instead of failing hard.
- Receipt themes only style the `.receipt` node via `data-theme`; the purple brand UI is site-wide.
