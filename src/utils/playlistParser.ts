import { VideoItem } from '../types';

export const CUSTOM_PLAYLISTS_STORAGE_KEY = 'cinepaz_custom_playlists';

export interface CustomPlaylist {
  id: string;
  name: string;
  url?: string;
  importedAt: string;
  channelsCount: number;
  channels: VideoItem[];
}

export function parseM3U(content: string, playlistName: string = 'Custom Playlist'): VideoItem[] {
  const lines = content.split(/\r?\n/);
  const items: VideoItem[] = [];

  let currentTitle = '';
  let currentLogo = '';
  let currentGroup = 'Custom';
  let currentId = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const tvgNameMatch = line.match(/tvg-name="([^"]+)"/i);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]+)"/i);
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      const idMatch = line.match(/tvg-id="([^"]+)"/i);

      // Title is after the last comma
      const commaIdx = line.lastIndexOf(',');
      let rawTitle = '';
      if (commaIdx !== -1) {
        rawTitle = line.substring(commaIdx + 1).trim();
      }

      currentTitle = rawTitle || (tvgNameMatch ? tvgNameMatch[1] : `Channel ${items.length + 1}`);
      currentLogo = tvgLogoMatch ? tvgLogoMatch[1].trim() : '';
      currentGroup = groupMatch ? groupMatch[1].trim() : 'Custom';
      currentId = idMatch ? idMatch[1].trim() : '';
    } else if (!line.startsWith('#')) {
      // It's a stream URL
      const streamUrl = line;
      if (streamUrl.startsWith('http://') || streamUrl.startsWith('https://')) {
        const generatedId = currentId
          ? `custom-${currentId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
          : `custom-${items.length + 1}-${Math.random().toString(36).substring(2, 7)}`;

        const channelTitle = currentTitle || `Stream ${items.length + 1}`;
        const category = currentGroup || playlistName || 'Custom';

        items.push({
          id: generatedId,
          title: channelTitle,
          thumbnail: currentLogo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80',
          cover: currentLogo || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
          url: streamUrl,
          urls: [streamUrl],
          category: category,
          description: `${channelTitle} from playlist "${playlistName}".`,
          isLive: true,
          viewers: Math.floor(Math.random() * 5000) + 500,
          tags: ['custom', 'm3u', category.toLowerCase()]
        });
      }

      // Reset info for next entry
      currentTitle = '';
      currentLogo = '';
      currentGroup = 'Custom';
      currentId = '';
    }
  }

  // Fallback: If user pasted bare stream URLs (one URL per line without #EXTINF)
  if (items.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if ((line.startsWith('http://') || line.startsWith('https://')) && (line.includes('.m3u8') || line.includes('.m3u') || line.includes('/live/') || line.includes('stream'))) {
        const num = items.length + 1;
        items.push({
          id: `custom-direct-${num}-${Math.random().toString(36).substring(2, 7)}`,
          title: `Direct Stream #${num}`,
          thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80',
          cover: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
          url: line,
          urls: [line],
          category: playlistName || 'Custom Streams',
          description: `Direct M3U8 stream #${num} from ${playlistName}.`,
          isLive: true,
          viewers: Math.floor(Math.random() * 3000) + 400,
          tags: ['custom', 'm3u8', 'direct']
        });
      }
    }
  }

  return items;
}

export function getCustomPlaylists(): CustomPlaylist[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PLAYLISTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPlaylist(playlist: CustomPlaylist): void {
  try {
    const playlists = getCustomPlaylists();
    const filtered = playlists.filter((p) => p.id !== playlist.id);
    filtered.unshift(playlist);
    localStorage.setItem(CUSTOM_PLAYLISTS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('cinepaz_custom_playlists_updated'));
    window.dispatchEvent(new Event('streamio_channels_updated'));
  } catch (err) {
    console.error('Failed to save playlist:', err);
  }
}

export function deleteCustomPlaylist(playlistId: string): void {
  try {
    const playlists = getCustomPlaylists();
    const filtered = playlists.filter((p) => p.id !== playlistId);
    localStorage.setItem(CUSTOM_PLAYLISTS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('cinepaz_custom_playlists_updated'));
    window.dispatchEvent(new Event('streamio_channels_updated'));
  } catch (err) {
    console.error('Failed to delete playlist:', err);
  }
}

export function getAllCustomChannels(): VideoItem[] {
  const playlists = getCustomPlaylists();
  const all: VideoItem[] = [];
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();

  for (const p of playlists) {
    for (const ch of p.channels) {
      if (!seenIds.has(ch.id) && !seenUrls.has(ch.url)) {
        seenIds.add(ch.id);
        seenUrls.add(ch.url);
        all.push(ch);
      }
    }
  }
  return all;
}
