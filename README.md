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

Requirements

- Node.js 20 or newer
- npm

Run Development Server

npm run dev

Build for Production

npm run build

The production files will be generated in the "dist" directory.

Preview Production Build

npm run preview

Adding Channels

Channel information is maintained in:

src/data/channels.ts

A channel can contain information such as:

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

Playlist functionality is handled by:

src/utils/playlistParser.ts

CinePaz supports custom playlist functionality through the Playlists section.

Security

Do not publish sensitive information such as:

- API keys
- Access tokens
- Passwords
- Private URLs
- Authentication credentials
- Personal information

Never commit secrets to a public GitHub repository.

If a secret has already been exposed publicly, revoke or rotate it immediately.

Disclaimer

CinePaz is a streaming interface/application project.

The application does not claim ownership of third-party channels, logos, trademarks, video streams, or other third-party content.

Users are responsible for ensuring that the streams and content they add or access are legally permitted in their jurisdiction.

License

This project does not currently specify an open-source license.

If you intend to distribute CinePaz as open-source software, add an appropriate "LICENSE" file.

Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application locally.
5. Commit your changes.
6. Open a pull request.

Author

CinePaz

Built with React, TypeScript, Vite, and modern web technologies.
