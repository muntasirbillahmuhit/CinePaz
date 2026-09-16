import React from 'react';

/**
 * Shimmering effect overlay for premium skeleton loaders
 */
export const ShimmerOverlay: React.FC = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
);

/**
 * Skeleton for a single video/channel card in a grid (e.g., Live TV Hub)
 */
export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="relative bg-zinc-900/40 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-full shadow-md">
      {/* 16:9 Thumbnail skeleton */}
      <div className="relative aspect-video w-full bg-zinc-900/80 overflow-hidden">
        <ShimmerOverlay />
        {/* Top-left badge placeholder */}
        <div className="absolute top-3 left-3 w-16 h-4 bg-zinc-800/80 rounded" />
        {/* Bottom-right viewers badge placeholder */}
        <div className="absolute bottom-3 right-3 w-20 h-5 bg-zinc-800/80 rounded" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-2.5">
          {/* Category tag & resolution indicator */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-zinc-800 rounded" />
            <div className="h-3 w-12 bg-zinc-800/60 rounded" />
          </div>
          {/* Title line */}
          <div className="h-4 w-4/5 bg-zinc-800 rounded" />
          {/* Description lines */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full bg-zinc-800/60 rounded" />
            <div className="h-3 w-2/3 bg-zinc-800/40 rounded" />
          </div>
        </div>

        {/* Footer with tag pills & play button placeholder */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-900/60">
          <div className="flex gap-1.5">
            <div className="h-4 w-12 bg-zinc-800/60 rounded" />
            <div className="h-4 w-14 bg-zinc-800/40 rounded" />
          </div>
          <div className="w-7 h-7 rounded-full bg-zinc-800/60" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for the full video grid (Live TV Hub or multi-card list)
 */
export const VideoGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <VideoCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Skeleton for YouTubeChannelCard (e.g., Up Next sidebar in PlayerModal)
 */
export const YouTubeCardSkeleton: React.FC = () => {
  return (
    <div className="relative flex items-start gap-3 p-2 rounded-xl animate-pulse">
      {/* 16:9 Thumbnail skeleton */}
      <div className="relative w-36 sm:w-44 aspect-video shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/70">
        <ShimmerOverlay />
        <div className="absolute bottom-1.5 right-1.5 w-10 h-3.5 bg-zinc-800 rounded" />
      </div>

      {/* Metadata skeleton */}
      <div className="flex-1 min-w-0 space-y-2 py-1">
        <div className="h-3.5 w-11/12 bg-zinc-800 rounded" />
        <div className="h-3 w-2/3 bg-zinc-800/70 rounded" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-3 w-16 bg-zinc-800/60 rounded" />
          <div className="h-3 w-12 bg-zinc-800/40 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * List of Up Next / YouTube-style skeleton cards
 */
export const YouTubeListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, idx) => (
        <YouTubeCardSkeleton key={idx} />
      ))}
    </div>
  );
};

/**
 * Skeleton for Search Match Card (Top search result highlight on Home screen)
 */
export const SearchMatchSkeleton: React.FC = () => {
  return (
    <div className="mb-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-3 w-36 bg-zinc-800 rounded mb-2 ml-1" />
      <div className="flex flex-col md:flex-row items-stretch bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden p-2 gap-4">
        <div className="relative w-full md:w-80 aspect-[16/9] md:aspect-video rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
          <ShimmerOverlay />
        </div>
        <div className="p-2 flex flex-col justify-between flex-grow space-y-3">
          <div className="space-y-2">
            <div className="h-5 w-3/4 bg-zinc-800 rounded" />
            <div className="h-3.5 w-full bg-zinc-800/60 rounded" />
            <div className="h-3.5 w-2/3 bg-zinc-800/40 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-24 bg-zinc-800 rounded" />
            <div className="h-8 w-24 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};
