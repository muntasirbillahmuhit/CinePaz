import React, { useState, useEffect } from 'react';
import { Radio, Search, Tv, Filter } from 'lucide-react';
import { VideoItem } from '../types';
import { ChannelLogo } from './ChannelLogo';
import { ALL_CHANNELS, CATEGORIES } from '../data/channels';
import { getAllCustomChannels } from '../utils/playlistParser';

interface LiveChannelsViewProps {
  onPlay: (video: VideoItem) => void;
}

export const LiveChannelsView: React.FC<LiveChannelsViewProps> = ({ onPlay }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [customChannels, setCustomChannels] = useState<VideoItem[]>([]);

  useEffect(() => {
    const sync = () => {
      setCustomChannels(getAllCustomChannels());
    };
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('cinepaz_custom_playlists_updated', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('cinepaz_custom_playlists_updated', sync);
    };
  }, []);

  const combinedChannels = [...ALL_CHANNELS, ...customChannels];

  const categories = [
    { id: 'all', label: 'All Channels', count: combinedChannels.length },
    { id: 'Entertainment', label: 'Entertainment', count: combinedChannels.filter(c => c.category === 'Entertainment' || c.category === 'Movies').length },
    { id: 'News', label: 'News', count: combinedChannels.filter(c => c.category === 'News' || c.category === 'Weather').length },
    { id: 'Religion', label: 'Religion', count: combinedChannels.filter(c => c.category === 'Religion').length },
    ...(customChannels.length > 0
      ? [{ id: 'Custom', label: 'Custom Playlists', count: customChannels.length }]
      : [])
  ];

  const filteredChannels = combinedChannels.filter((c) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'Custom' && c.tags?.includes('custom')) ||
      (selectedCategory === 'Entertainment' && (c.category === 'Entertainment' || c.category === 'Movies')) ||
      (selectedCategory === 'News' && (c.category === 'News' || c.category === 'Weather')) ||
      c.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.description?.toLowerCase().includes(q) ?? false);

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="live-channels-view" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
              <Tv size={22} />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Live TV Channel Guide</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Browse and stream uninterrupted live broadcasts with instant failover routing
          </p>
        </div>

        {/* Quick Search within Live view */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            id="live-filter-input"
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter channels..."
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-pill-${cat.id.toLowerCase()}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50 font-bold'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.id ? 'bg-red-700/80 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Channel Grid */}
      {filteredChannels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              id={`live-card-${channel.id}`}
              onClick={() => onPlay(channel)}
              className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-2xl flex flex-col"
            >
              {/* Thumbnail / Logo Aspect Ratio Box */}
              <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                <ChannelLogo
                  name={channel.title}
                  category={channel.category}
                  logoUrl={channel.thumbnail}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>

                {channel.viewers && (
                  <div className="absolute bottom-1.5 right-2 text-[10px] font-mono text-zinc-300 flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    <Radio size={9} className="text-red-400 animate-pulse" />
                    {channel.viewers.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1">
                    {channel.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {channel.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800/60 p-6 max-w-md mx-auto">
          <Search size={32} className="text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No matching channels</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Try adjusting your search query or selecting a different category tab.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchFilter('');
            }}
            className="mt-4 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
