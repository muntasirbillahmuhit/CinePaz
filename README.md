# CinePaz

A modern, web-based live TV streaming interface built with React, TypeScript, Vite, Tailwind CSS, and HLS.js.

## Features

- Dark-themed, responsive, mobile-friendly UI
- Live channel browsing with categories and search
- HLS (`.m3u8`) playback with a full-screen player
- Favorite channels and custom playlists
- Multiple stream source support
- Smooth animations, loading skeletons, and bottom navigation

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS · Motion · HLS.js · Lucide React

## Adding Channels

Channels are defined in `src/data/channels.ts`:

```ts
{
  id: "example-channel",
  name: "Example Channel",
  url: "STREAM_URL",
  category: "Entertainment",
  logoUrl: "LOGO_URL",
  protocol: "HLS",
  description: "Channel description.",
  isFavorite: false
}
```

> Only add streams you are authorized to use or that are legally available for redistribution.

## Custom Playlists

Use the **Playlists** section in the app to load your own playlists. Parsing logic lives in `src/utils/playlistParser.ts`.

## Security

Never commit secrets to a public repository, including API keys, access tokens, passwords, private URLs, credentials, or personal information. If a secret has been exposed, revoke or rotate it immediately.

## Disclaimer

CinePaz is a streaming interface only. It does not claim ownership of any third-party channels, logos, trademarks, or video streams. Users are responsible for ensuring the content they add or access is legal in their jurisdiction.

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes and test locally
4. Commit and open a pull request

## License

No license is currently specified. To release CinePaz as open source, add a `LICENSE` file (e.g., MIT).
