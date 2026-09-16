import React, { useState, useEffect } from 'react';
import {
  ListPlus,
  Plus,
  Trash2,
  Play,
  Upload,
  Link,
  Tv,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { VideoItem } from '../types';
import {
  CustomPlaylist,
  getCustomPlaylists,
  saveCustomPlaylist,
  deleteCustomPlaylist,
  parseM3U
} from '../utils/playlistParser';

interface PlaylistsViewProps {
  onPlay: (video: VideoItem) => void;
}

export const PlaylistsView: React.FC<PlaylistsViewProps> = ({ onPlay }) => {
  const [playlists, setPlaylists] = useState<CustomPlaylist[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [m3uTextInput, setM3uTextInput] = useState('');
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'text'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const loadPlaylists = () => {
    setPlaylists(getCustomPlaylists());
  };

  useEffect(() => {
    loadPlaylists();
    window.addEventListener('cinepaz_custom_playlists_updated', loadPlaylists);
    return () => {
      window.removeEventListener('cinepaz_custom_playlists_updated', loadPlaylists);
    };
  }, []);

  const handleImportUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      let content = '';
      const targetUrl = urlInput.trim();

      // If it looks like a direct single stream m3u8
      if (targetUrl.endsWith('.m3u8') && !targetUrl.includes('playlist.m3u8')) {
        const customName = nameInput.trim() || 'Direct Stream';
        const newPlaylist: CustomPlaylist = {
          id: `playlist-${Date.now()}`,
          name: customName,
          url: targetUrl,
          importedAt: new Date().toLocaleDateString(),
          channelsCount: 1,
          channels: [
            {
              id: `direct-${Date.now()}`,
              title: customName,
              thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80',
              cover: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
              url: targetUrl,
              urls: [targetUrl],
              category: 'Custom Streams',
              description: `Custom direct stream: ${targetUrl}`,
              isLive: true,
              viewers: 1200,
              tags: ['custom', 'm3u8', 'direct']
            }
          ]
        };

        saveCustomPlaylist(newPlaylist);
        setUrlInput('');
        setNameInput('');
        setStatusMessage({ text: `Successfully added "${customName}"!`, type: 'success' });
        setIsLoading(false);
        return;
      }

      // Otherwise fetch M3U playlist file content
      const res = await fetch(targetUrl, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status} response from URL`);
      content = await res.text();

      const parsedChannels = parseM3U(content, nameInput.trim() || 'Custom Playlist');
      if (parsedChannels.length === 0) {
        throw new Error('No valid channel entries or stream URLs found in playlist');
      }

      const newPlaylist: CustomPlaylist = {
        id: `playlist-${Date.now()}`,
        name: nameInput.trim() || `Playlist (${parsedChannels.length} channels)`,
        url: targetUrl,
        importedAt: new Date().toLocaleDateString(),
        channelsCount: parsedChannels.length,
        channels: parsedChannels
      };

      saveCustomPlaylist(newPlaylist);
      setUrlInput('');
      setNameInput('');
      setStatusMessage({ text: `Imported ${parsedChannels.length} channels successfully!`, type: 'success' });
    } catch (err: any) {
      // Fallback: If CORS blocked the browser fetch of the raw playlist file, save it as a direct link stream
      const customName = nameInput.trim() || 'Custom Stream URL';
      const fallbackPlaylist: CustomPlaylist = {
        id: `playlist-${Date.now()}`,
        name: customName,
        url: urlInput.trim(),
        importedAt: new Date().toLocaleDateString(),
        channelsCount: 1,
        channels: [
          {
            id: `custom-stream-${Date.now()}`,
            title: customName,
            thumbnail: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=80',
            cover: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&auto=format&fit=crop&q=80',
            url: urlInput.trim(),
            urls: [urlInput.trim()],
            category: 'Custom Playlists',
            description: `Live custom stream: ${urlInput.trim()}`,
            isLive: true,
            viewers: 950,
            tags: ['custom', 'm3u8']
          }
        ]
      };
      saveCustomPlaylist(fallbackPlaylist);
      setUrlInput('');
      setNameInput('');
      setStatusMessage({ text: `Added stream "${customName}" to your playlists.`, type: 'success' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const name = file.name.replace(/\.(m3u|m3u8|txt)$/i, '');
      const parsedChannels = parseM3U(content, name);

      if (parsedChannels.length > 0) {
        const newPlaylist: CustomPlaylist = {
          id: `playlist-${Date.now()}`,
          name: name,
          importedAt: new Date().toLocaleDateString(),
          channelsCount: parsedChannels.length,
          channels: parsedChannels
        };
        saveCustomPlaylist(newPlaylist);
        setStatusMessage({ text: `Imported ${parsedChannels.length} channels from ${file.name}!`, type: 'success' });
      } else {
        setStatusMessage({ text: 'No channels found in uploaded file.', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uTextInput.trim()) return;

    const parsedChannels = parseM3U(m3uTextInput, nameInput.trim() || 'Pasted Playlist');
    if (parsedChannels.length > 0) {
      const newPlaylist: CustomPlaylist = {
        id: `playlist-${Date.now()}`,
        name: nameInput.trim() || `Pasted List (${parsedChannels.length} channels)`,
        importedAt: new Date().toLocaleDateString(),
        channelsCount: parsedChannels.length,
        channels: parsedChannels
      };
      saveCustomPlaylist(newPlaylist);
      setM3uTextInput('');
      setNameInput('');
      setStatusMessage({ text: `Imported ${parsedChannels.length} channels successfully!`, type: 'success' });
    } else {
      setStatusMessage({ text: 'Could not parse channels from text.', type: 'error' });
    }
  };

  return (
    <div id="playlists-view" className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-8">
      {/* View Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
        <span className="p-2.5 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
          <ListPlus size={24} />
        </span>
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Custom M3U / M3U8 Playlists</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Import and manage your personal IPTV playlists and custom live stream feeds
          </p>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/60 border border-red-500/40 text-red-300'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Import Box */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <button
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'url' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Link size={13} /> Playlist URL / Stream
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'file' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload size={13} /> Upload .M3U File
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'text' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText size={13} /> Raw Text / Paste
          </button>
        </div>

        {activeTab === 'url' && (
          <form onSubmit={handleImportUrl} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Playlist / Channel Name (Optional)"
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
              />
              <input
                type="url"
                required
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/playlist.m3u8 or stream URL"
                className="sm:col-span-2 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-950/50"
            >
              <Plus size={15} /> {isLoading ? 'Importing Playlist...' : 'Import Playlist'}
            </button>
          </form>
        )}

        {activeTab === 'file' && (
          <div className="border-2 border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-center transition">
            <Upload size={28} className="text-zinc-500 mx-auto mb-2" />
            <p className="text-xs text-zinc-300 font-semibold">Select an .m3u or .m3u8 playlist file</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Files are parsed locally in your browser</p>
            <label className="mt-3 inline-block px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer transition">
              Browse File
              <input type="file" accept=".m3u,.m3u8,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {activeTab === 'text' && (
          <form onSubmit={handlePasteSubmit} className="space-y-3">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Playlist Name"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
            />
            <textarea
              required
              rows={4}
              value={m3uTextInput}
              onChange={(e) => setM3uTextInput(e.target.value)}
              placeholder="#EXTM3U&#10;#EXTINF:-1 tvg-name=&quot;Channel 1&quot;,Channel 1&#10;https://stream.url/index.m3u8"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500 resize-none"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={15} /> Save Text Playlist
            </button>
          </form>
        )}
      </div>

      {/* Saved Playlists Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
          <span>Saved Playlists</span>
          <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
            {playlists.length}
          </span>
        </h2>

        {playlists.length > 0 ? (
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-red-600/20 text-red-500 rounded">
                      <Tv size={14} />
                    </span>
                    <h3 className="text-sm font-bold text-white">{playlist.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400">
                    <span>{playlist.channelsCount} channels</span>
                    <span>•</span>
                    <span>Imported {playlist.importedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {playlist.channels.length > 0 && (
                    <button
                      onClick={() => onPlay(playlist.channels[0])}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Play size={12} fill="white" /> Play First ({playlist.channels[0].title})
                    </button>
                  )}
                  <button
                    onClick={() => deleteCustomPlaylist(playlist.id)}
                    className="p-2 bg-zinc-800/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 rounded-lg transition cursor-pointer"
                    aria-label="Delete Playlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-zinc-900/20 rounded-xl border border-zinc-800/50 p-6">
            <Tv size={28} className="text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-400">No custom playlists added yet.</p>
            <p className="text-[11px] text-zinc-600 mt-1">
              Add your IPTV M3U links or live stream URLs above to access them anywhere.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
