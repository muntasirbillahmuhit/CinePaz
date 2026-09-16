CinePaz

A modern web-based live TV streaming interface built with React, TypeScript, Vite, Tailwind CSS, and HLS.js.

Features

- Modern dark-themed interface
- Live TV channel browsing
- HLS (".m3u8") video playback
- Full-screen video player
- Search functionality
- Channel categories
- Favorite channels
- Custom playlists
- Responsive mobile-friendly UI
- Smooth animations and transitions
- Bottom navigation
- Video loading skeletons
- Multiple stream source support

Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion
- HLS.js
- Lucide React
- Google Gemini SDK

Project Structure

cinepaz/
├── src/
│   ├── components/
│   │   ├── BottomNavBar.tsx
│   │   ├── ChannelLogo.tsx
│   │   ├── ChannelRow.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── LiveChannelsView.tsx
│   │   ├── PlayerModal.tsx
│   │   ├── PlaylistsView.tsx
│   │   ├── SearchView.tsx
│   │   ├── VideoSkeleton.tsx
│   │   └── YouTubeChannelCard.tsx
│   ├── data/
│   │   └── channels.ts
│   ├── utils/
│   │   └── playlistParser.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .env.example
└── README.md

Requirements

Before running the project, make sure you have:

- Node.js 20 or newer
- npm

Installation

Clone the repository and install dependencies:

npm install

Environment Variables

If the project requires Gemini API functionality, create a ".env.local" file based on ".env.example".

Do not commit API keys, tokens, passwords, private URLs, or other secrets to GitHub.

Example:

GEMINI_API_KEY=your_api_key_here

Keep ".env.local" private.

Run Development Server

npm run dev

The Vite development server will start locally.

Build for Production

npm run build

The production files will be generated in the "dist" directory.

Preview Production Build

npm run preview

Type Checking

npm run lint

Adding Channels

Channel information is maintained in:

src/data/channels.ts

A channel generally contains information such as:

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

Only add streams that you are authorized to use or that are legally available for redistribution.

Custom Playlists

CinePaz supports custom playlists through the playlist parser located at:

src/utils/playlistParser.ts

Playlist-related functionality is integrated with the application and can be accessed from the Playlists section.

Security

Never expose sensitive credentials in:

- "README.md"
- Source code
- Git commits
- Public GitHub repositories
- Client-side JavaScript
- Screenshots
- Issue reports

Use environment variables or a secure server-side mechanism for secrets.

If a secret has already been committed publicly, rotate/revoke it and replace it with a new credential.

Disclaimer

CinePaz is a streaming interface/application project.

The application itself does not claim ownership of third-party channels, logos, trademarks, video streams, or other third-party content.

Users are responsible for ensuring that the streams and content they add or access are legally permitted in their jurisdiction.

License

This project does not currently specify a project-wide open-source license.

If you intend to publish or distribute CinePaz as open-source software, add an appropriate "LICENSE" file before doing so.

Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application locally.
5. Commit your changes.
6. Open a pull request.

Author

CinePaz

Built with React, TypeScript, Vite, and modern web technologies.
