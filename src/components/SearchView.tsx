import React, { useState, useEffect } from 'react';
import { Search, X, Radio, Sparkles, TrendingUp } from 'lucide-react';
import { VideoItem } from '../types';
import { ChannelLogo } from './ChannelLogo';
import { ALL_CHANNELS } from '../data/channels';
import { getAllCustomChannels } from '../utils/playlistParser';

interface SearchViewProps {
  onPlay: (video: VideoItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onPlay }) => {
  const [query, setQuery] = useState('');
  const [customChannels, setCustomChannels] = useState<VideoItem[]>([]);

  useEffect(() => {
    setCustomChannels(getAllCustomChannels());
  }, []);

  const allAvailable = [...ALL_CHANNELS, ...customChannels];

  const popularTags = ['News', 'Entertainment', 'Movies', 'Religion', '4K', 'HD', 'Sports', 'Live'];

  const results = query.trim()
    ? allAvailable.filter((c) => {
        const q = query.toLowerCase().trim();
        const titleMatch = c.title.toLowerCase().includes(q);
        const catMatch = c.category.toLowerCase().includes(q);
        const descMatch = c.description?.toLowerCase().includes(q) ?? false;
        const tagMatch = c.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return titleMatch || catMatch || descMatch || tagMatch;
      })
    : [];

  return (
    <div id="search-view" className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          id="global-search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by channel name, category, or tag (e.g., News, B4U, Live)..."
          autoFocus
          className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all shadow-xl"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
            aria-label="Clear Search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Suggested Quick Tags */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold">
          <TrendingUp size={14} className="text-red-500" />
          <span>Popular Searches</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition cursor-pointer"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {query.trim() ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-300">
              Results for <span className="text-red-400 font-semibold">"{query}"</span>
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              {results.length} channel{results.length === 1 ? '' : 's'} found
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {results.map((channel) => (
                <div
                  key={channel.id}
                  id={`search-item-${channel.id}`}
                  onClick={() => onPlay(channel)}
                  className="flex items-center gap-3.5 p-2.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl cursor-pointer group transition duration-200"
                >
                  <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                    <ChannelLogo
                      name={channel.title}
                      category={channel.category}
                      logoUrl={channel.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-black px-1 rounded flex items-center gap-0.5">
                      LIVE
                    </div>
                  </div>

                  <div className="flex-grow min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {channel.title}
                    </h3>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">{channel.category}</p>
                    {channel.viewers && (
                      <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 mt-1">
                        <Radio size={9} className="text-red-500" />
                        {channel.viewers.toLocaleString()} watching
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 p-6 max-w-md mx-auto">
              <Search size={32} className="text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No results found</h3>
              <p className="text-xs text-zinc-400 mt-1">
                We couldn't find any channels matching "{query}". Try checking for spelling errors or search a different keyword.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State with Discovery Preview */
        <div className="space-y-4 pt-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Explore All Channels
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {allAvailable.slice(0, 8).map((channel) => (
              <div
                key={channel.id}
                onClick={() => onPlay(channel)}
                className="bg-zinc-900/40 hover:bg-zinc-900 p-2.5 rounded-xl border border-zinc-800/60 hover:border-zinc-700 cursor-pointer group transition"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-zinc-950 mb-2">
                  <ChannelLogo
                    name={channel.title}
                    category={channel.category}
                    logoUrl={channel.thumbnail}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-red-400 truncate">
                  {channel.title}
                </h4>
                <p className="text-[10px] text-zinc-500 truncate">{channel.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
