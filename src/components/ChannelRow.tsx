import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion } from 'motion/react';
import { VideoItem } from '../types';
import { ChannelLogo } from './ChannelLogo';
import { ShimmerOverlay } from './VideoSkeleton';

interface ChannelRowProps {
  title: string;
  videos: VideoItem[];
  onPlay: (video: VideoItem) => void;
}

export const ChannelRow: React.FC<ChannelRowProps> = ({ title, videos, onPlay }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    checkScroll();
    const ro = new ResizeObserver(() => checkScroll());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [videos]);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-2 relative group/row">
      <div className="px-4 text-base sm:text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
        <span>{title}</span>
        <span className="glass-pill text-[10px] text-zinc-400 font-medium px-2 py-0.5 rounded-full select-none shadow-sm">
          {videos.length} channels
        </span>
      </div>

      <div className="relative px-4">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-xl"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center cursor-pointer opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-xl"
            aria-label="Scroll Right"
          >
            <ChevronRight size={20} />
          </button>
        )}

        <div
          ref={rowRef}
          className="flex overflow-x-auto hide-scrollbar gap-3.5 pb-4 snap-x snap-mandatory will-change-scroll scroll-smooth"
        >
          {videos.map((video, idx) => (
            <motion.div
              layoutId={`player-container-${video.id}`}
              id={`channel-card-${video.id}`}
              key={video.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "100px" }}
              transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.25), ease: [0.25, 0.1, 0.25, 1] }}
              className="relative flex-none w-[170px] sm:w-[230px] aspect-[16/9] rounded-xl overflow-hidden snap-start cursor-pointer group active:scale-95 transition-all duration-250 shadow-lg shadow-black/60 border border-white/10 hover:border-white/25 hover:shadow-2xl hover:shadow-black/80"
              onClick={() => onPlay(video)}
            >
              <ChannelLogo
                name={video.title}
                category={video.category}
                logoUrl={video.thumbnail}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform font-sans"
              />

              {video.isLive && (
                <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-md border border-red-500/40 shadow text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 text-white">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}

              {/* Glass Frosted Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent mt-auto opacity-90 group-hover:opacity-100 transition-opacity" />

              {/* Card Metadata with subtle glass backdrop */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3 bg-black/40 backdrop-blur-sm border-t border-white/5">
                <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-sm">
                  {video.title}
                </p>
                {video.viewers && (
                  <p className="text-[10px] sm:text-xs text-zinc-400 font-medium flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                    {video.viewers.toLocaleString()} watching
                  </p>
                )}
              </div>

              {/* Play Button Hover with Frosted Glass Ring */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-black/70 border border-white/25 backdrop-blur-xl flex items-center justify-center shadow-xl shadow-black">
                  <Play size={16} fill="white" className="text-white ml-0.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const RowSkeleton: React.FC = () => {
  return (
    <div className="space-y-3 px-4 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-44 bg-zinc-800 rounded-md" />
        <div className="h-4 w-16 bg-zinc-800/50 rounded-full" />
      </div>
      <div className="flex overflow-x-auto hide-scrollbar gap-3.5 pb-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="relative flex-none w-[170px] sm:w-[230px] aspect-[16/9] rounded-md bg-zinc-900 border border-zinc-900/60 p-2.5 flex flex-col justify-between overflow-hidden"
          >
            <ShimmerOverlay />
            <div className="h-3 w-8 bg-zinc-800 rounded self-end mb-2" />
            <div className="space-y-1.5 mt-auto">
              <div className="h-3.5 w-11/12 bg-zinc-800 rounded" />
              <div className="h-3 w-3/5 bg-zinc-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
