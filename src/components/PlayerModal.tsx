import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Server,
  Cast,
  RotateCw,
  CircleAlert,
  Check,
  Layers,
  Wifi,
  Radio,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Bell,
  CheckCircle2,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Smartphone,
  Globe,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Hls from 'hls.js';
import { VideoItem, RouteLatency } from '../types';
import { ALL_CHANNELS } from '../data/channels';
import { ChannelLogo } from './ChannelLogo';
import { YouTubeChannelCard, YouTubeListSkeleton } from './YouTubeChannelCard';

interface PlayerModalProps {
  video: VideoItem;
  onClose: () => void;
  onSelectVideo?: (video: VideoItem) => void;
}

function getRouteLabel(url: string, index?: number): string {
  if (index !== undefined) {
    if (index === 0) return "Primary Stream Route";
    return `Alternate Route Node #${index}`;
  }
  if (url.includes("master_2000") || url.includes("Expires=")) {
    return "Primary Stream Route";
  }
  return "Alternate Route Node";
}

export const PlayerModal: React.FC<PlayerModalProps> = ({ video, onClose, onSelectVideo }) => {
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(video);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHorizontalMode, setIsHorizontalMode] = useState(false);
  const [isViewportPortrait, setIsViewportPortrait] = useState(() => {
    return typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false;
  });
  const [showDescription, setShowDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor((currentVideo.viewers || 15000) * 0.12));
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'category' | 'entertainment' | 'news' | 'movies'>('all');
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const watchPageRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if parent prop changes
  useEffect(() => {
    setCurrentVideo(video);
    setLikeCount(Math.floor((video.viewers || 15000) * 0.12));
    setHasLiked(false);
    setHasDisliked(false);
    setIsLoadingRecs(true);
    const t = setTimeout(() => setIsLoadingRecs(false), 350);
    return () => clearTimeout(t);
  }, [video.id]);

  useEffect(() => {
    setIsLoadingRecs(true);
    const t = setTimeout(() => setIsLoadingRecs(false), 250);
    return () => clearTimeout(t);
  }, [selectedFilter]);

  const availableUrls = (() => {
    const raw = currentVideo.urls && currentVideo.urls.length > 0 ? currentVideo.urls : [currentVideo.url];
    const set: string[] = [];
    raw.forEach((u) => {
      if (u && !set.includes(u)) {
        set.push(u);
      }
    });
    return set;
  })();

  const [activeUrlIndex, setActiveUrlIndex] = useState(0);
  const [showServerDrawer, setShowServerDrawer] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isTestingRoutes, setIsTestingRoutes] = useState(false);
  const [routeLatencies, setRouteLatencies] = useState<RouteLatency>({});
  const [autoSwitchEnabled, setAutoSwitchEnabled] = useState(true);
  const [autoSwitchNotice, setAutoSwitchNotice] = useState<{ message: string; type: 'warning' | 'info' } | null>(null);

  const activeUrl = availableUrls[activeUrlIndex] || currentVideo.url;
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);
  const failoverAttemptsRef = useRef(0);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showServerDrawer) {
        setShowControls(false);
      }
    }, 4000);
  };

  const handleSelectRoute = (idx: number) => {
    failoverAttemptsRef.current = 0;
    setActiveUrlIndex(idx);
    setStreamError(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSwitchChannel = (newVideo: VideoItem) => {
    setCurrentVideo(newVideo);
    setActiveUrlIndex(0);
    setStreamError(null);
    setLikeCount(Math.floor((newVideo.viewers || 15000) * 0.12));
    setHasLiked(false);
    setHasDisliked(false);
    onSelectVideo?.(newVideo);

    // Smoothly scroll back to top to view the new stream
    if (watchPageRef.current) {
      watchPageRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTogglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
    resetControlsTimeout();
  };

  const handleToggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !v.muted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && v.volume === 0) {
      v.volume = 0.8;
      setVolume(0.8);
    }
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
    resetControlsTimeout();
  };

  const handleFullscreenToggle = async () => {
    const container = playerContainerRef.current;
    if (!container) return;
    
    const isEntering = !isHorizontalMode;
    setIsHorizontalMode(isEntering);

    if (isEntering) {
      showToast('Fullscreen landscape mode enabled');
      try {
        if (!document.fullscreenElement) {
          await container.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && 'lock' in screen.orientation) {
          await (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch {
        // Fallback handled by CSS rotation
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen().catch(() => {});
        }
        if (screen.orientation && 'unlock' in screen.orientation) {
          (screen.orientation as any).unlock?.();
        }
      } catch {
        // Silent catch
      }
    }
    resetControlsTimeout();
  };

  const handleBack = () => {
    if (isHorizontalMode) {
      handleFullscreenToggle();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsViewportPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isHorizontalMode) {
        setIsHorizontalMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHorizontalMode]);

  useEffect(() => {
    const onFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      if (!isFs && isHorizontalMode) {
        setIsHorizontalMode(false);
      }
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, [isHorizontalMode]);

  const triggerAutoSwitch = (nextIdx: number, reason: 'down' | 'slow') => {
    const routeName = getRouteLabel(availableUrls[nextIdx] || '', nextIdx);
    const msg =
      reason === 'down'
        ? `Stream route offline. Auto-routed to Route ${nextIdx + 1} (${routeName})`
        : `Slow connection detected. Routing to optimization layer Route ${nextIdx + 1}`;

    setAutoSwitchNotice({ message: msg, type: reason === 'down' ? 'warning' : 'info' });
    setActiveUrlIndex(nextIdx);
    setStreamError(null);

    setTimeout(() => {
      setAutoSwitchNotice((prev) => (prev?.message === msg ? null : prev));
    }, 4500);
  };

  const testRouteLatencies = async () => {
    setIsTestingRoutes(true);
    const results: RouteLatency = {};

    await Promise.all(
      availableUrls.map(async (url, idx) => {
        const start = performance.now();
        try {
          await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000), mode: 'no-cors' });
          results[idx] = Math.round(performance.now() - start);
        } catch {
          try {
            await fetch(url, { signal: AbortSignal.timeout(3000), mode: 'no-cors' });
            results[idx] = Math.round(performance.now() - start);
          } catch {
            results[idx] = 999;
          }
        }
      })
    );

    setRouteLatencies(results);
    setIsTestingRoutes(false);

    if (autoSwitchEnabled) {
      let bestIdx = activeUrlIndex;
      let lowestLatency = results[activeUrlIndex] !== undefined ? results[activeUrlIndex] : 9999;

      availableUrls.forEach((_, idx) => {
        if (results[idx] !== undefined && results[idx] < lowestLatency - 20 && results[idx] < 999) {
          lowestLatency = results[idx];
          bestIdx = idx;
        }
      });

      if (bestIdx !== activeUrlIndex) {
        triggerAutoSwitch(bestIdx, 'slow');
      }
    }
  };

  useEffect(() => {
    resetControlsTimeout();
    testRouteLatencies();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [currentVideo.id]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setStreamError(null);

    const isHlsStream =
      activeUrl.endsWith('.m3u8') ||
      activeUrl.includes('.m3u8') ||
      activeUrl.includes('m3u8') ||
      activeUrl.includes('linear') ||
      activeUrl.includes('master');

    const handleStall = () => {
      if (autoSwitchEnabled) {
        clearStallWatchdog();
        stallTimerRef.current = setTimeout(() => {
          const nextIdx = (activeUrlIndex + 1) % availableUrls.length;
          if (nextIdx !== activeUrlIndex) {
            triggerAutoSwitch(nextIdx, 'slow');
          }
        }, 5000);
      }
    };

    const clearStallWatchdog = () => {
      if (stallTimerRef.current) {
        clearTimeout(stallTimerRef.current);
        stallTimerRef.current = null;
      }
    };

    videoEl.addEventListener('waiting', handleStall);
    videoEl.addEventListener('playing', () => {
      clearStallWatchdog();
      setIsPlaying(true);
    });
    videoEl.addEventListener('pause', () => setIsPlaying(false));
    videoEl.addEventListener('canplay', clearStallWatchdog);
    videoEl.addEventListener('timeupdate', clearStallWatchdog);

    const handlePlaybackError = () => {
      clearStallWatchdog();
      if (autoSwitchEnabled && failoverAttemptsRef.current < availableUrls.length) {
        failoverAttemptsRef.current += 1;
        const nextIdx = (activeUrlIndex + 1) % availableUrls.length;
        if (nextIdx !== activeUrlIndex) {
          triggerAutoSwitch(nextIdx, 'down');
          return;
        }
      }
      setStreamError('Active stream server connection offline. Switch route below.');
    };

    if (isHlsStream) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxMaxBufferLength: 30,
          maxBufferLength: 15,
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 30,
          manifestLoadingMaxRetry: 6,
          levelLoadingMaxRetry: 6,
          fragLoadingMaxRetry: 6,
          capLevelToPlayerSize: true,
          capLevelOnFPSDrop: true
        });
        hlsRef.current = hls;

        hls.loadSource(activeUrl);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStreamError(null);
          videoEl.play().catch(() => {
            // Autoplay with audio was blocked by browser; retry muted like YouTube
            videoEl.muted = true;
            setIsMuted(true);
            videoEl.play().catch((err) => console.log('Autoplay fallback error:', err));
          });
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            clearStallWatchdog();
            if (autoSwitchEnabled && failoverAttemptsRef.current < availableUrls.length) {
              failoverAttemptsRef.current += 1;
              const nextIdx = (activeUrlIndex + 1) % availableUrls.length;
              if (nextIdx !== activeUrlIndex) {
                triggerAutoSwitch(nextIdx, 'down');
                return;
              }
            }

            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                setStreamError('Slow network loop detected. Retrying buffer...');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                setStreamError('Local feed offline or restricted. Switch stream server.');
                hls.destroy();
                break;
            }
          }
        });
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = activeUrl;
        videoEl.addEventListener('error', handlePlaybackError);
        videoEl.play().catch(() => {
          videoEl.muted = true;
          setIsMuted(true);
          videoEl.play().catch(() => {});
        });
      } else {
        setStreamError('Browser does not support HLS playback natively.');
      }
    } else {
      videoEl.src = activeUrl;
      videoEl.addEventListener('error', handlePlaybackError);
      videoEl.play().catch(() => {
        videoEl.muted = true;
        setIsMuted(true);
        videoEl.play().catch(() => {});
      });
    }

    return () => {
      clearStallWatchdog();
      if (videoEl) {
        videoEl.removeEventListener('waiting', handleStall);
        videoEl.removeEventListener('canplay', clearStallWatchdog);
        videoEl.removeEventListener('timeupdate', clearStallWatchdog);
        videoEl.removeEventListener('error', handlePlaybackError);
      }
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeUrl, autoSwitchEnabled, currentVideo.id]);

  // Filter recommendations
  const otherChannels = ALL_CHANNELS.filter((c) => c.id !== currentVideo.id);
  const filteredRecommendations = otherChannels.filter((c) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'category') return c.category === currentVideo.category;
    if (selectedFilter === 'entertainment') return c.category === 'Entertainment' || c.category === 'Movies';
    if (selectedFilter === 'news') return c.category === 'News' || c.category === 'Weather';
    if (selectedFilter === 'movies') return c.category === 'Movies';
    return true;
  });

  return (
    <motion.div
      ref={watchPageRef}
      id="youtube-watch-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-3xl text-white flex flex-col ${
        isHorizontalMode ? 'overflow-hidden' : 'overflow-y-auto'
      } hide-scrollbar`}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-zinc-100 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-zinc-700 flex items-center gap-2"
          >
            <Check size={14} className="text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP VIDEO PLAYER CONTAINER (YouTube Style) */}
      <div
        className={`w-full bg-black/90 backdrop-blur-xl sticky top-0 z-40 shadow-2xl border-b border-white/5 ${
          isHorizontalMode ? 'h-0 overflow-visible' : ''
        }`}
      >
        <div
          ref={playerContainerRef}
          id="yt-player-container"
          className={`w-full max-w-5xl mx-auto aspect-video relative flex items-center justify-center bg-black overflow-hidden group/player select-none transition-all duration-200 ${
            isHorizontalMode ? '!aspect-auto !max-w-none' : ''
          }`}
          style={
            isHorizontalMode
              ? isViewportPortrait
                ? {
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    width: '100vh',
                    height: '100vw',
                    transform: 'translate(-50%, -50%) rotate(90deg)',
                    zIndex: 9999,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    aspectRatio: 'auto',
                    backgroundColor: '#000000',
                  }
                : {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 9999,
                    maxWidth: 'none',
                    maxHeight: 'none',
                    aspectRatio: 'auto',
                    backgroundColor: '#000000',
                  }
              : {}
          }
          onClick={resetControlsTimeout}
          onMouseMove={resetControlsTimeout}
          onTouchStart={resetControlsTimeout}
        >
          <video
            ref={videoRef}
            playsInline
            className="w-full h-full object-contain cursor-pointer"
            onClick={handleTogglePlay}
          />

          {/* Fallback Unmute Banner if muted on autoplay */}
          {isMuted && isPlaying && (
            <button
              onClick={handleToggleMute}
              className="absolute top-16 left-4 z-30 bg-black/80 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 backdrop-blur-md shadow-lg cursor-pointer transition animate-bounce"
            >
              <VolumeX size={14} className="text-red-400" /> Tap to Unmute
            </button>
          )}

          {/* Auto-switch HUD */}
          <AnimatePresence>
            {autoSwitchNotice && (
              <motion.div
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-950/95 border border-amber-500/35 shadow-2xl backdrop-blur-md w-[85%] max-w-sm pointer-events-none"
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    autoSwitchNotice.type === 'warning'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-amber-500/15 text-amber-500'
                  }`}
                >
                  {autoSwitchNotice.type === 'warning' ? (
                    <CircleAlert size={12} />
                  ) : (
                    <RotateCw size={12} className="animate-spin" />
                  )}
                </div>
                <p className="text-[11px] text-zinc-200 font-medium leading-tight">
                  {autoSwitchNotice.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Screen Overlay */}
          {streamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/95 z-40 p-4 text-center">
              <CircleAlert size={36} className="text-red-500 mb-2 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Stream Currently Offline</h3>
              <p className="text-xs text-zinc-400 max-w-xs mt-1">{streamError}</p>

              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => {
                    setStreamError(null);
                    if (hlsRef.current) {
                      hlsRef.current.loadSource(activeUrl);
                      hlsRef.current.startLoad();
                    } else if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-red-950/40"
                >
                  <RotateCw size={13} /> Retry Stream
                </button>
                {availableUrls.length > 1 && (
                  <button
                    onClick={() => {
                      const next = (activeUrlIndex + 1) % availableUrls.length;
                      handleSelectRoute(next);
                    }}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                  >
                    Try Alternate Route ({activeUrlIndex + 1}/{availableUrls.length})
                  </button>
                )}
                <button
                  onClick={() => setShowServerDrawer(true)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition cursor-pointer"
                >
                  Server Relays
                </button>
              </div>
            </div>
          )}

          {/* Video Player Top Controls Bar (Cinematic Glass Overlay) */}
          <div
            className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-start justify-between z-20 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                id="yt-back-btn"
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white transition-all active:scale-95 cursor-pointer shadow-lg"
                aria-label={isHorizontalMode ? 'Exit Fullscreen' : 'Back to browse'}
                title={isHorizontalMode ? 'Exit Fullscreen' : 'Back'}
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col drop-shadow-md">
                <span className="font-bold text-sm sm:text-base text-white truncate max-w-[220px] sm:max-w-md">
                  {currentVideo.title}
                </span>
                <span className="text-[10px] text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  Live Broadcast
                </span>
              </div>
            </div>
          </div>

          {/* Center Play/Pause button on touch / hover */}
          <div
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ${
              showControls ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <button
              onClick={handleTogglePlay}
              className="pointer-events-auto w-16 h-16 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xl border border-white/20 transition-all active:scale-90 cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
          </div>

          {/* Video Player Bottom Controls Bar (Cinematic Glass Overlay) */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between z-20 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="w-8 h-8 rounded-full bg-white text-black hover:bg-zinc-200 flex items-center justify-center transition cursor-pointer shadow-md"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 transition-all">
                  <button
                    onClick={handleToggleMute}
                    className="text-white hover:text-red-400 transition cursor-pointer p-1"
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-0 opacity-0 group-hover/vol:w-16 group-hover/vol:opacity-100 sm:w-16 sm:opacity-100 h-1 bg-zinc-600 accent-white rounded-lg cursor-pointer transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFullscreenToggle}
                className="w-9 h-9 text-white bg-black/40 border border-white/10 hover:bg-black/60 transition-all cursor-pointer rounded-full flex items-center justify-center backdrop-blur-md shadow-lg"
                aria-label={isHorizontalMode || isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                title={isHorizontalMode || isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isHorizontalMode || isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT AREA UNDER PLAYER (Cinematic Layout) */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col items-center">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-3 border-b border-white/10 pb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-400 text-[10px] uppercase tracking-widest font-bold bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                      Live Broadcast
                    </span>
                    <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-medium bg-zinc-800/50 px-2 py-0.5 rounded">
                      {currentVideo.category}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                    {currentVideo.title}
                  </h1>
                </div>

                {/* Channel / Provider Pill */}
                <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 p-2 pr-4 rounded-full shadow-inner w-max">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-white/10">
                    <ChannelLogo
                      name={currentVideo.title}
                      category={currentVideo.category}
                      logoUrl={currentVideo.thumbnail}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 font-bold text-sm text-zinc-100">
                      {currentVideo.title}
                      <CheckCircle2 size={12} className="text-amber-500 fill-amber-500/20" />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium">Verified Source</span>
                  </div>
                </div>
              </div>

              {/* Viewers & Action Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-400">
                  <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">
                    <Radio size={14} className="text-red-500 animate-pulse" />
                    <span className="text-white font-bold">{(currentVideo.viewers || 15000).toLocaleString()}</span>
                    <span>watching now</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Share & Save */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('Link copied to clipboard!');
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition border border-white/5"
                    title="Share"
                  >
                    <Share2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setIsSaved(!isSaved);
                      showToast(isSaved ? 'Removed from favorites' : 'Added to favorites');
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition border border-white/5"
                    title="Favorite"
                  >
                    <Bookmark size={16} className={isSaved ? 'fill-amber-400 text-amber-400' : ''} />
                  </button>
                  
                  {/* Server Route Control */}
                  <button
                    onClick={() => setShowServerDrawer(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 transition shadow-lg shadow-amber-500/10 font-bold text-xs"
                  >
                    <Globe size={14} />
                    <span>Route {activeUrlIndex + 1}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div
              onClick={() => setShowDescription(!showDescription)}
              className="bg-zinc-900/30 border border-white/5 hover:border-white/10 rounded-2xl p-5 text-sm text-zinc-300 transition cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between font-bold text-white">
                <span className="flex items-center gap-2">
                  <Activity size={16} className="text-zinc-400" />
                  Stream Details
                </span>
                <span className="text-xs text-zinc-500 flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md">
                  {showDescription ? 'Show less' : 'Read more'}
                  {showDescription ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </div>
              <p className={`leading-relaxed text-zinc-400 font-medium ${showDescription ? '' : 'line-clamp-2'}`}>
                {currentVideo.description ||
                  `Experience ${currentVideo.title} live in premium high definition.`}
              </p>

              {showDescription && (
                <div className="pt-3 mt-2 border-t border-white/10 text-[11px] text-zinc-400 space-y-1.5">
                  <p>
                    <strong className="text-zinc-200">Protocol:</strong> HLS Adaptive Bitrate
                  </p>
                  <p>
                    <strong className="text-zinc-200">Current Relay:</strong> {getRouteLabel(activeUrl, activeUrlIndex)}
                  </p>
                  <p>
                    <strong className="text-zinc-200">Category:</strong> {currentVideo.category}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="glass-pill text-red-400 px-2 py-0.5 rounded-full">#LiveStream</span>
                    <span className="glass-pill text-red-400 px-2 py-0.5 rounded-full">#{currentVideo.category.replace(/\s+/g, '')}</span>
                    <span className="glass-pill text-zinc-400 px-2 py-0.5 rounded-full">#LiveTV</span>
                    <span className="glass-pill text-zinc-400 px-2 py-0.5 rounded-full">#BengaliTelevision</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIDE / UNDER COLUMN: "Others channel like yt video" (YouTube Recommendation Feed) */}
          <div className="lg:col-span-1 space-y-3">
            {/* Filter Chips Bar (like YouTube mobile/web) */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'category', label: `More ${currentVideo.category}` },
                { id: 'entertainment', label: 'Entertainment' },
                { id: 'news', label: 'News' },
                { id: 'movies', label: 'Movies' }
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setSelectedFilter(chip.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 active:scale-95 ${
                    selectedFilter === chip.id
                      ? 'glass-pill-active text-white'
                      : 'glass-button text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" /> Up Next • Live Channels
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {filteredRecommendations.length} available
              </span>
            </div>

            {/* List of YouTube Video Cards */}
            <div className="space-y-1 sm:space-y-2">
              {isLoadingRecs ? (
                <YouTubeListSkeleton count={5} />
              ) : (
                <>
                  {filteredRecommendations.map((channel) => (
                    <YouTubeChannelCard
                      key={channel.id}
                      video={channel}
                      isActive={channel.id === currentVideo.id}
                      onSelect={handleSwitchChannel}
                    />
                  ))}

                  {filteredRecommendations.length === 0 && (
                    <div className="py-8 text-center text-zinc-500 text-xs">
                      No other channels in this filter.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Server relays drawer (Side Modal) */}
      <AnimatePresence>
        {showServerDrawer && (
          <>
            <div
              className="fixed inset-0 bg-black/60 z-50 transition-opacity backdrop-blur-sm"
              onClick={() => setShowServerDrawer(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-84 max-w-full glass-panel border-l border-white/10 z-50 p-5 flex flex-col justify-between shadow-2xl backdrop-blur-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Server className="text-amber-400 animate-pulse" size={16} />
                    <h3 className="font-bold text-sm text-white tracking-tight uppercase">
                      Stream CDN Relays
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowServerDrawer(false)}
                    className="text-xs font-bold text-zinc-300 hover:text-white glass-button px-2.5 py-1 rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                    Channel Playing
                  </span>
                  <div className="text-zinc-100 font-bold text-xs truncate max-w-[260px]">
                    {currentVideo.title}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Server size={16} className="text-amber-500" />
                    Stream Relays
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono bg-zinc-900/50 px-2 py-0.5 rounded-full border border-white/5 shadow-inner">
                    {availableUrls.length} Available
                  </span>
                </div>

                {/* Network Quality Controls */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="glass-card rounded-xl p-3 flex flex-col justify-between relative overflow-hidden border border-white/5 bg-zinc-900/40">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-200">Auto-Switch</span>
                        <span className="text-[9px] text-zinc-500 mt-0.5 leading-tight">Failover optimizer</span>
                      </div>
                      <button
                        onClick={() => setAutoSwitchEnabled(!autoSwitchEnabled)}
                        className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          autoSwitchEnabled ? 'bg-amber-500 shadow-lg shadow-amber-500/20' : 'bg-zinc-800'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                            autoSwitchEnabled ? 'translate-x-3' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={testRouteLatencies}
                    disabled={isTestingRoutes}
                    className="glass-card rounded-xl p-3 flex flex-col items-start justify-between relative overflow-hidden border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition text-left cursor-pointer group"
                  >
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                      {isTestingRoutes ? 'Pinging...' : 'Test Latency'}
                    </span>
                    <span className="text-[9px] text-zinc-500 mt-0.5 leading-tight flex items-center gap-1">
                      <Activity size={10} className={isTestingRoutes ? 'animate-pulse text-amber-500' : ''} />
                      Find fastest route
                    </span>
                  </button>
                </div>

                {/* Server List */}
                <div className="space-y-2 max-h-[48vh] overflow-y-auto pr-1 hide-scrollbar">
                  {availableUrls.map((u, idx) => {
                    const isSelected = activeUrlIndex === idx;
                    const routeLabel = getRouteLabel(u, idx);
                    const latency = routeLatencies[idx];
                    
                    let signalColor = "text-zinc-500";
                    let signalBars = 1;
                    
                    if (latency) {
                       if (latency < 100) { signalColor = "text-emerald-400"; signalBars = 4; }
                       else if (latency < 250) { signalColor = "text-amber-400"; signalBars = 3; }
                       else if (latency < 500) { signalColor = "text-orange-400"; signalBars = 2; }
                       else if (latency < 999) { signalColor = "text-red-500"; signalBars = 1; }
                       else { signalColor = "text-zinc-600"; signalBars = 0; }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectRoute(idx)}
                        className={`w-full p-3 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer relative overflow-hidden active:scale-[0.98] ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                            : 'bg-zinc-900/40 border-white/5 hover:border-white/15 hover:bg-zinc-900/60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-zinc-800 text-zinc-400'
                            }`}>
                                <Globe size={14} />
                            </div>
                            <div className="flex flex-col items-start text-left min-w-0">
                                <div className="flex items-center gap-1.5 w-full">
                                    <span className={`text-xs font-bold font-mono tracking-tight truncate ${isSelected ? 'text-amber-500' : 'text-zinc-200'}`}>
                                        {routeLabel}
                                    </span>
                                    {idx === 0 && (
                                        <span className="text-[8px] uppercase tracking-wider font-bold bg-white/10 text-zinc-300 px-1.5 py-0.5 rounded shrink-0">
                                            Primary
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                    <Layers size={10} /> {u.includes('m3u8') ? 'HLS Stream' : 'Direct Media'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0 ml-3">
                            {isSelected ? (
                                <div className="flex items-center gap-1 bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    <Check size={10} strokeWidth={3} /> Active
                                </div>
                            ) : (
                                <div className={`flex items-end gap-0.5 ${signalColor}`}>
                                    {[1,2,3,4].map(bar => (
                                        <div key={bar} className={`w-1 rounded-t-sm ${bar <= signalBars ? 'bg-current opacity-100' : 'bg-zinc-700 opacity-50'}`} style={{ height: `${bar * 3 + 4}px` }} />
                                    ))}
                                </div>
                            )}
                            
                            {latency !== undefined && !isSelected && (
                                <span className={`text-[9px] font-mono font-medium ${signalColor}`}>
                                    {latency < 999 ? `${latency}ms` : 'Timeout'}
                                </span>
                            )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[9px] text-zinc-400 font-semibold font-mono border-t border-zinc-800 pt-3 flex justify-between items-center bg-[#181818]">
                <span>Adaptive HLS Engine</span>
                <span>StreamCore v1.4</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
