import React from 'react';
import { Home, Tv, Search, ListPlus } from 'lucide-react';
import { motion } from 'motion/react';
import { NavTab } from '../types';

interface BottomNavBarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  customCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  customCount = 0
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'live', label: 'Live TV', icon: Tv },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'playlists', label: 'Playlists', icon: ListPlus, badge: customCount > 0 ? customCount : undefined }
  ];

  return (
    <nav
      id="bottom-nav-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/40 backdrop-blur-3xl border-t border-white/5 px-2 sm:px-6 py-1.5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-md sm:max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[64px] py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none group ${
                isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active Tab Ambient Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-indicator"
                  className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-red-600/5 rounded-xl border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-transform duration-200 z-10 ${
                    isActive ? 'scale-110 text-red-500' : 'group-hover:scale-105'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center z-20 shadow-md">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 font-medium z-10 transition-colors duration-200 ${
                  isActive ? 'font-bold text-white' : 'text-zinc-400 group-hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
