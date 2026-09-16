import React from 'react';
import { Radio, CheckCircle2, Play } from 'lucide-react';
import { VideoItem } from '../types';
import { ChannelLogo } from './ChannelLogo';

interface YouTubeChannelCardProps {
  video: VideoItem;
  isActive?: boolean;
  onSelect: (video: VideoItem) => void;
}

export const YouTubeChannelCard: React.FC<YouTubeChannelCardProps> = ({
  video,
  isActive = false,
  onSelect
}) => {
  const viewerCountFormatted = (video.viewers || 15000).toLocaleString();

  return (
    <div
      id={`yt-card-${video.id}`}
      onClick={() => onSelect(video)}
      className={`group flex items-start gap-3 p-2.5 rounded-2xl cursor-pointer transition-all duration-200 ${
        isActive
          ? 'glass-card border-red-500/40 shadow-lg shadow-red-950/20'
          : 'hover:bg-white/[0.04] border border-transparent hover:border-white/10'
      }`}
    >
      {/* 16:9 Thumbnail preview with live badge */}
      <div className="relative w-36 sm:w-44 aspect-video shrink-0 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-sm group-hover:border-white/20">
        <img
          src={video.cover || video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Small center logo watermark / fallback */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] group-hover:bg-black/10 transition-colors">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-950/80 p-1 border border-white/10 shadow-md">
            <ChannelLogo name={video.title} category={video.category} logoUrl={video.thumbnail} />
          </div>
        </div>

        {/* Live badge in bottom right (like YouTube) with glass styling */}
        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 bg-red-600/90 backdrop-blur-md border border-red-500/30 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md tracking-wider shadow-md">
          <Radio size={9} className="animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Hover play overlay with frosted glass */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
            <Play size={14} fill="white" className="ml-0.5" />
          </div>
        </div>

        {isActive && (
          <div className="absolute top-1.5 left-1.5 bg-red-600/90 backdrop-blur-md border border-red-500/40 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            Playing
          </div>
        )}
      </div>

      {/* Video / Channel Metadata */}
      <div className="flex-1 min-w-0 pr-1">
        <h4 className="text-xs sm:text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
          {video.title}
        </h4>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] sm:text-xs text-zinc-400">
          <span className="truncate">{video.title} Official</span>
          <CheckCircle2 size={12} className="text-zinc-400 shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 mt-1 text-[11px] text-zinc-400">
          <span className="font-semibold text-red-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
            {viewerCountFormatted} watching
          </span>
          <span className="text-zinc-600">•</span>
          <span className="glass-pill text-zinc-400 px-1.5 py-0.2 rounded text-[10px]">
            {video.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export { YouTubeCardSkeleton, YouTubeListSkeleton } from './VideoSkeleton';
