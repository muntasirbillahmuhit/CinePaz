import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem, CategorySection } from '../types';
import { HeroBanner, HeroSkeleton } from './HeroBanner';
import { ChannelRow, RowSkeleton } from './ChannelRow';
import { ChannelLogo } from './ChannelLogo';
import { SearchMatchSkeleton } from './VideoSkeleton';
import { CATEGORIES, FEATURED_VIDEO, RAW_CHANNELS } from '../data/channels';
import { getAllCustomChannels } from '../utils/playlistParser';

interface HomeScreenProps {
  onPlay: (video: VideoItem) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onPlay, searchQuery, setSearchQuery }) => {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [customChannels, setCustomChannels] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    const syncChannels = () => {
      const stored = localStorage.getItem('streamio_hidden_channels');
      if (stored) {
        try {
          setHiddenIds(JSON.parse(stored));
        } catch {
          setHiddenIds([]);
        }
      } else {
        setHiddenIds([]);
      }
      setCustomChannels(getAllCustomChannels());
    };
    syncChannels();
    window.addEventListener('storage', syncChannels);
    window.addEventListener('streamio_channels_updated', syncChannels);
    window.addEventListener('cinepaz_custom_playlists_updated', syncChannels);
    return () => {
      window.removeEventListener('storage', syncChannels);
      window.removeEventListener('streamio_channels_updated', syncChannels);
      window.removeEventListener('cinepaz_custom_playlists_updated', syncChannels);
    };
  }, []);

  // Deduplicate custom channels against built-in channels
  const builtInIds = new Set(RAW_CHANNELS.map((c) => c.id));
  const builtInUrls = new Set(RAW_CHANNELS.map((c) => c.url));
  const uniqueCustomChannels = customChannels.filter(
    (c) => !builtInIds.has(c.id) && !builtInUrls.has(c.url)
  );

  // Merge built-in categories with unique custom playlist channels
  const allCategories: CategorySection[] = [...CATEGORIES];
  if (uniqueCustomChannels.length > 0) {
    allCategories.unshift({
      id: 'cat-custom-playlists',
      title: '📺 Custom Playlists (M3U / M3U8)',
      videos: uniqueCustomChannels
    });
  }

  const isSearching = searchQuery.trim().length > 0;

  let activeFeatured: VideoItem | null = FEATURED_VIDEO;
  if (hiddenIds.includes(FEATURED_VIDEO.id)) {
    const firstAvailable = allCategories.find((c) => c.videos.length > 0);
    activeFeatured = firstAvailable && firstAvailable.videos.length > 0 ? firstAvailable.videos[0] : null;
  }

  const isFeaturedMatch = activeFeatured
    ? !searchQuery ||
      activeFeatured.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      activeFeatured.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (activeFeatured.description?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ?? false)
    : false;

  const filteredCategories: CategorySection[] = allCategories.map((cat) => {
    let unhidden = cat.videos.filter((v) => !hiddenIds.includes(v.id));
    // When searching and top match card is displayed, prevent showing the exact same channel duplicate in the row below
    if (isSearching && activeFeatured && isFeaturedMatch) {
      unhidden = unhidden.filter((v) => v.id !== activeFeatured!.id);
    }
    const matched = unhidden.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      const titleMatch = v.title.toLowerCase().includes(q);
      const descMatch = v.description?.toLowerCase().includes(q) ?? false;
      const catMatch = v.category.toLowerCase().includes(q);
      const tagMatch = v.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      return titleMatch || descMatch || catMatch || tagMatch;
    });
    return {
      ...cat,
      videos: matched
    };
  }).filter((cat) => cat.videos.length > 0);

  return (
    <div id="home-screen-root" className="pb-24">
      {!isSearching &&
        (isLoading ? (
          <HeroSkeleton />
        ) : (
          <HeroBanner featuredVideo={activeFeatured} onPlay={onPlay} />
        ))}

      <div
        id="main-content-area"
        className={`space-y-8 pb-6 transition-all duration-300 ${
          isSearching ? 'pt-[90px] px-4' : 'mt-6'
        }`}
      >
        {isSearching && (
          <div id="search-results-header" className="mb-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Search Results</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Showing channels matching{' '}
              <span className="text-red-500 font-semibold">"{searchQuery}"</span>
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-8">
            {isSearching && <SearchMatchSkeleton />}
            <RowSkeleton />
            <RowSkeleton />
            <RowSkeleton />
          </div>
        ) : (
          <>
            {isSearching && activeFeatured && isFeaturedMatch && (
              <div id="featured-search-match-section" className="mb-8 max-w-4xl mx-auto">
                <div className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest flex items-center gap-1.5 mb-2 ml-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Top Match • Live Featured
                </div>
                <div
                  id="featured-search-card"
                  onClick={() => onPlay(activeFeatured!)}
                  className="relative flex flex-col md:flex-row items-stretch bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 p-2 gap-4"
                >
                  <div className="relative w-full md:w-80 aspect-[16/9] md:aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950">
                    <ChannelLogo
                      name={activeFeatured.title}
                      category={activeFeatured.category}
                      logoUrl={activeFeatured.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 font-sans"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      LIVE NOW
                    </div>
                  </div>

                  <div className="p-2 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-500 transition duration-300">
                        {activeFeatured.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 mb-2 text-xs text-zinc-400 font-semibold">
                        <span className="text-green-500 font-bold">New</span>
                        <span className="bg-zinc-800 px-1 py-0.5 rounded text-[9px] text-zinc-300">
                          HD
                        </span>
                        <span>{activeFeatured.viewers?.toLocaleString()} watching</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                        {activeFeatured.description}
                      </p>
                    </div>

                    {activeFeatured.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {activeFeatured.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] bg-zinc-800/70 text-zinc-300 px-2 py-0.5 rounded font-semibold tracking-wide"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {filteredCategories.length > 0 ? (
              <div id="filtered-channels-container" className="space-y-6">
                {filteredCategories.map((category, idx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1, margin: "50px" }}
                    transition={{ duration: 0.5, delay: Math.min(idx * 0.1, 0.3), ease: "easeOut" }}
                  >
                    <ChannelRow
                      title={category.title}
                      videos={category.videos}
                      onPlay={onPlay}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              isSearching && (
                <div
                  id="no-results-placeholder"
                  className="flex flex-col items-center justify-center py-16 px-4 text-center bg-zinc-900/20 border border-zinc-900/60 rounded-2xl max-w-md mx-auto"
                >
                  <Search size={36} className="text-zinc-600 mb-4 animate-pulse" />
                  <h3 className="text-base font-bold text-zinc-200">No channels found</h3>
                  <p className="text-xs text-zinc-400 max-w-xs mt-2 leading-relaxed">
                    We couldn't find any channels matching{' '}
                    <span className="font-semibold text-zinc-300">"{searchQuery}"</span>. Try
                    searching for keywords like "news", "classics", or "movies".
                  </p>
                  <button
                    id="reset-search-btn"
                    onClick={() => setSearchQuery('')}
                    className="mt-5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              )
            )}

            {/* Clean subtle footer */}
            <div className="pt-10 pb-4 border-t border-zinc-900/40 flex items-center justify-center select-none text-center">
              <p className="text-[11px] text-zinc-500 font-medium tracking-wide">
                Live TV Streams
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
