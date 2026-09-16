export interface Channel {
  id: string;
  name: string;
  url: string;
  urls?: string[];
  category: string;
  logoUrl: string;
  protocol: string;
  description?: string;
  isFavorite?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  cover: string;
  url: string;
  urls: string[];
  category: string;
  description: string;
  isLive: boolean;
  viewers?: number;
  tags?: string[];
}

export interface CategorySection {
  id: string;
  title: string;
  videos: VideoItem[];
}

export type NavTab = 'home' | 'live' | 'search' | 'playlists';

export interface RouteLatency {
  [index: number]: number;
}

export interface DiagnosticNode {
  label: string;
  url: string;
  ok?: boolean;
  latency?: number;
  status?: number;
  error?: string | null;
}
