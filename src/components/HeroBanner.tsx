import React, { useState } from 'react';
import { Play, Plus, Check, Radio } from 'lucide-react';
import { VideoItem } from '../types';
import { ShimmerOverlay } from './VideoSkeleton';

interface HeroBannerProps {
  featuredVideo: VideoItem | null;
  onPlay: (video: VideoItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredVideo, onPlay }) => {
  const [isSavedToList, setIsSavedToList] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleToggleMyList = (video: VideoItem) => {
    const next = !isSavedToList;
    setIsSavedToList(next);
    setToastMessage(next ? `Added "${video.title}" to My List` : `Removed from My List`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!featuredVideo) {
    return (
      <div id="hero-fallback" className="h-[65vh] sm:h-[70vh] w-full bg-zinc-950 flex items-center justify-center text-zinc-500">
        No Content Available
      </div>
    );
  }

  return (
    <div id="hero-banner-container" className="relative h-[68vh] sm:h-[74vh] w-full bg-zinc-950 overflow-hidden">
      <img
        src={featuredVideo.cover}
        className="w-full h-full object-cover scale-105"
        alt={featuredVideo.title}
      />
      {/* Cinematic dark gradient with frosted transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/20 to-transparent hidden sm:block" />

      {/* Floating Frosted Glass Hero Card */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 pt-28 flex flex-col items-center sm:items-start text-center sm:text-left">
        <div className="glass-panel p-5 sm:p-6 rounded-2xl max-w-xl w-full sm:w-auto shadow-2xl backdrop-blur-2xl">
          {/* Glass Badges */}
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md shadow-red-600/30">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE NOW
            </div>
            <span className="glass-pill text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full">
              4K ULTRA HD
            </span>
            {featuredVideo.viewers && (
              <span className="glass-pill text-[10px] font-mono text-zinc-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Radio size={10} className="text-red-400 animate-pulse" />
                {featuredVideo.viewers.toLocaleString()} watching
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 tracking-tight text-white drop-shadow-md">
            {featuredVideo.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 mb-5 max-w-md line-clamp-2 leading-relaxed">
            {featuredVideo.description}
          </p>

          <div className="flex gap-3 w-full justify-center sm:justify-start max-w-xs">
            <button
              id="hero-play-button"
              onClick={() => onPlay(featuredVideo)}
              className="flex-1 bg-white hover:bg-zinc-100 text-black py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Play size={16} fill="currentColor" /> Watch Live
            </button>
            <button
              id="hero-mylist-button"
              onClick={() => handleToggleMyList(featuredVideo)}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-95 ${
                isSavedToList
                  ? 'bg-red-600/30 text-red-200 border border-red-500/40 backdrop-blur-md shadow-lg'
                  : 'glass-button text-white'
              }`}
            >
              {isSavedToList ? (
                <>
                  <Check size={16} className="text-red-400" /> In My List
                </>
              ) : (
                <>
                  <Plus size={16} /> My List
                </>
              )}
            </button>
          </div>
        </div>

        {/* In-app Toast feedback */}
        {toastMessage && (
          <div className="glass-panel mt-3 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-200 border border-white/20 shadow-xl animate-fade-in flex items-center gap-2">
            <Check size={13} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="relative h-[65vh] sm:h-[70vh] w-full bg-zinc-950/80 animate-pulse flex flex-col justify-end px-4 sm:px-8 pb-12 overflow-hidden">
      <ShimmerOverlay />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
      <div className="relative z-10 max-w-xl space-y-4">
        <div className="h-5 w-24 bg-zinc-800 rounded-sm" />
        <div className="h-10 sm:h-14 w-3/4 sm:w-full bg-zinc-800 rounded-md" />
        <div className="flex gap-3">
          <div className="h-4 w-12 bg-zinc-800 rounded" />
          <div className="h-4 w-8 bg-zinc-800 rounded" />
          <div className="h-4 w-28 bg-zinc-800 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800/80 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800/80 rounded" />
        </div>
        <div className="flex gap-4 w-full max-w-xs pt-2">
          <div className="h-9 flex-1 bg-zinc-800 rounded-md" />
          <div className="h-9 flex-1 bg-zinc-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};
