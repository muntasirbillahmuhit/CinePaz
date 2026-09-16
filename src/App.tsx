/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { VideoItem, NavTab } from './types';
import { HomeScreen } from './components/HomeScreen';
import { LiveChannelsView } from './components/LiveChannelsView';
import { SearchView } from './components/SearchView';
import { PlaylistsView } from './components/PlaylistsView';
import { BottomNavBar } from './components/BottomNavBar';
import { PlayerModal } from './components/PlayerModal';
import { getCustomPlaylists } from './utils/playlistParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
  const [customPlaylistsCount, setCustomPlaylistsCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      setCustomPlaylistsCount(getCustomPlaylists().length);
    };
    updateCount();
    window.addEventListener('cinepaz_custom_playlists_updated', updateCount);
    return () => {
      window.removeEventListener('cinepaz_custom_playlists_updated', updateCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-red-500/30 relative overflow-x-hidden">
      {/* Ambient background light gradients for authentic frosted glass refraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-red-600/[0.07] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-zinc-700/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-red-900/[0.08] rounded-full blur-[130px]" />
      </div>

      {/* Global Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/40 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 flex items-center justify-center">
            {/* Glowing background aura */}
            <div className="absolute inset-0 bg-red-600/30 rounded-full blur-md" />
            
            {/* Custom SVG Logo */}
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-full h-full drop-shadow-xl">
              {/* Background Plate */}
              <rect x="4" y="8" width="22" height="22" rx="6" fill="url(#grad1)" />
              {/* Foreground Plate */}
              <rect x="10" y="4" width="22" height="22" rx="6" fill="url(#grad2)" fillOpacity="0.95" style={{ mixBlendMode: 'screen' }} />
              {/* White Play Button */}
              <path d="M16 11.5L25 16.5L16 21.5V11.5Z" fill="white" />
              
              <defs>
                <linearGradient id="grad1" x1="4" y1="8" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#991B1B" />
                  <stop offset="1" stopColor="#450A0A" />
                </linearGradient>
                <linearGradient id="grad2" x1="10" y1="4" x2="32" y2="26" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EF4444" />
                  <stop offset="1" stopColor="#991B1B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="text-[22px] font-black tracking-tighter text-white">
            CINE<span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700">PAZ</span>
          </span>
        </div>
      </header>

      {/* Main Content Area based on Active Tab */}
      <main className="relative z-10 pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="tab-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <HomeScreen
                onPlay={(v) => setPlayingVideo(v)}
                searchQuery=""
                setSearchQuery={() => {}}
              />
            </motion.div>
          )}

          {activeTab === 'live' && (
            <motion.div
              key="tab-live"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <LiveChannelsView onPlay={(v) => setPlayingVideo(v)} />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="tab-search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <SearchView onPlay={(v) => setPlayingVideo(v)} />
            </motion.div>
          )}

          {activeTab === 'playlists' && (
            <motion.div
              key="tab-playlists"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <PlaylistsView onPlay={(v) => setPlayingVideo(v)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        customCount={customPlaylistsCount}
      />

      {/* Full-Screen Stream Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <PlayerModal
            key="player"
            video={playingVideo}
            onClose={() => setPlayingVideo(null)}
            onSelectVideo={(v) => setPlayingVideo(v)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
