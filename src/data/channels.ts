import { Channel, VideoItem, CategorySection } from '../types';

export const RAW_CHANNELS: Channel[] = [
  {
    id: "thikana-tv",
    name: "Thikana",
    url: "https://5dd3981940faa.streamlock.net:443/thikanatv/thikanatv/playlist.m3u8",
    category: "Entertainment",
    logoUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop&q=60",
    protocol: "HLS",
    description: "A multi-genre broadcast showcasing classical songs, global Bengali community updates, lifestyle series, and critical opinions.",
    isFavorite: false
  },
  {
    id: "sony-aath-vip",
    name: "Sony Aath",
    url: "https://live20.bozztv.com/giatvplayout7/giatv-209611/index.m3u8",
    urls: [
      "https://live20.bozztv.com/giatvplayout7/giatv-209611/index.m3u8",
      "https://sm-monirul.top/toffee/play/sonyaath.m3u8"
    ],
    category: "Entertainment",
    logoUrl: "https://images.toffeelive.com/images/program/343/logo/240x240/mobile_logo_496322001666780228.png",
    protocol: "HLS",
    description: "Leading Bengali-language entertainment channel broadcasting popular comedy series, family dramas, classic films, and kids animated programs.",
    isFavorite: true
  },
  {
    id: "star-international",
    name: "Star International",
    url: "https://livestar.siliconweb.com/starvod/star_int/star_int.m3u8",
    category: "Entertainment",
    logoUrl: "https://i.imgur.com/Hp0stVQ.png",
    protocol: "HLS",
    description: "Full program feed of Star International featuring major musical programs and South Asian entertainment serials.",
    isFavorite: false
  },
  {
    id: "colors-bangla-vip",
    name: "Colors Bangla",
    url: "https://yupptvcatchupire.yuppcdn.net/preview/colorsbanglahd/800.m3u8",
    category: "Entertainment",
    logoUrl: "https://dl.dropbox.com/s/44vdhjj6fja02co/CBHD.jpg",
    protocol: "HLS",
    description: "Vibrant modern television network broadcasting premium fiction serials, non-fiction games, family talk sessions, and regional blockbusters.",
    isFavorite: false
  },
  {
    id: "b4u-movies-vip",
    name: "B4U Movies",
    url: "https://amg00877-b4unew-amg00877c2-xiaomi-in-5489.playouts.now.amagi.tv/playlist.m3u8",
    category: "Movies",
    logoUrl: "https://i.postimg.cc/13nLvxQx/20250630_050504.png",
    protocol: "HLS",
    description: "Vast array of high-quality Bollywood hits, classic drama cinema, and retro cinematic releases.",
    isFavorite: false
  },
  {
    id: "movie-bangla",
    name: "Movie Bangla",
    url: "https://app24.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/moviebanglalink2.stream/tracks-v1a1/mono.m3u8",
    category: "Movies",
    logoUrl: "https://i.postimg.cc/wBN1BtXk/20251127_095813.png",
    protocol: "HLS",
    description: "Endless collection of celebrated Bengali classics, general-audience feature films, and modern regional movies.",
    isFavorite: false
  },
  {
    id: "ntv-bangladeshi",
    name: "NTV",
    url: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/ntvuk00332211.stream/live-orgin/ntvuk00332211.stream/chunks.m3u8",
    urls: [
      "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/ntvuk00332211.stream/live-orgin/ntvuk00332211.stream/chunks.m3u8",
      "https://tvsen5.aynaott.com/xV4jEKf3D9zc/index.m3u8"
    ],
    category: "News",
    logoUrl: "https://play-lh.googleusercontent.com/VL2R8JVwHx4PtQPmNYG2oP7o22HOuGDy3mQZXa-uEhjRLAqpgZjL5yk0vlBaGnt7KQ",
    protocol: "HLS",
    description: "Leading Bangladeshi private satellite television channel providing real-time international news bulletins, popular Bengali serials, talk shows, and high-fidelity cultural entertainment.",
    isFavorite: true
  },
  {
    id: "deshi-tv",
    name: "Deshi Tv",
    url: "https://deshitv.deshitv24.net/live/myStream/playlist.m3u8",
    category: "News",
    logoUrl: "https://www.deshitv.com/images//bangla_logo/DeshTV24-BanglaLogo.png",
    protocol: "HLS",
    description: "Bringing you community, cultural celebrations, and national Bengali dramas.",
    isFavorite: false
  },
  {
    id: "jago-news-24",
    name: "Jago News 24",
    url: "https://app.ncare.live/live-orgin/jagonews24.stream/playlist.m3u8",
    category: "News",
    logoUrl: "https://www.jagobd.com/wp-content/uploads/2024/08/pran-RFL.png",
    protocol: "HLS",
    description: "24/7 live news coverage, community headlines, and international updates from Bangladesh.",
    isFavorite: false
  },
  {
    id: "oman-tv-news",
    name: "Oman TV",
    url: "https://partneta.cdn.mgmlcdn.com/omantv/smil:omantv.stream.smil/chunklist_b900000.m3u8",
    category: "News",
    logoUrl: "https://static.wikia.nocookie.net/logopedia/images/8/8c/1317_1.png",
    protocol: "HLS",
    description: "State news and international culture broadcaster of the Sultanate of Oman.",
    isFavorite: false
  },
  {
    id: "dw-english",
    name: "DW English",
    url: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8",
    category: "News",
    logoUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=150&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    protocol: "HLS",
    description: "Deutsche Welle is Germany's public international broadcaster, delivering high-quality news and analysis from Europe and around the world.",
    isFavorite: false
  },
  {
    id: "madina-live",
    name: "Madina Live 24/7",
    url: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8",
    category: "Religion",
    logoUrl: "https://images-na.ssl-images-amazon.com/images/I/71CywdrFaZL.png",
    protocol: "HLS",
    description: "High-fidelity live stream 24/7 from the Sunnah Mosque and Prophet's Mosque in Madina Al-Munawwarah.",
    isFavorite: false
  },
  {
    id: "quran-tv",
    name: "Quran TV",
    url: "https://live.kwikmotion.com/sharjahtvquranlive/shqurantv.smil/playlist.m3u8",
    category: "Religion",
    logoUrl: "https://e7.pngegg.com/pngimages/407/223/png-clipart-quran-mecca-television-channel-television-show-the-holy-quran-miscellaneous-television.png",
    protocol: "HLS",
    description: "Direct recitation broadcasts and theological lessons on continuous loop.",
    isFavorite: false
  },
  {
    id: "peace-tv-bangla",
    name: "Peace TV Bangla",
    url: "https://dzkyvlfyge.erbvr.com/PeaceTvBangla/tracks-v2a1/mono.m3u8",
    category: "Religion",
    logoUrl: "https://i.ibb.co/Gfw89mC/20240804-033102.png",
    protocol: "HLS",
    description: "Religious broadcast on Peace TV Bangla.",
    isFavorite: false
  },
  {
    id: "abn",
    name: "ABN",
    url: "https://mediaserver.abnvideos.com/streams/abnurdu.m3u8",
    category: "Religion",
    logoUrl: "https://s3.aynaott.com/storage/9882913a8d68aa99c0501b64749d6320",
    protocol: "HLS",
    description: "ABN informational network.",
    isFavorite: false
  },
  {
    id: "cmac-tv",
    name: "CMAC TV",
    url: "https://reflect-vod-cmac.cablecast.tv/live-11/live/stream-2/live.m3u8",
    category: "Religion",
    logoUrl: "https://s3.aynaott.com/storage/14a329b450239b9a4beaa4953c33367b",
    protocol: "HLS",
    description: "CMAC TV informational broadcasting channel.",
    isFavorite: false
  },
  {
    id: "accuweather",
    name: "AccuWeather",
    url: "https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00684-accuweather-accuweather-plex/playlist.m3u8",
    category: "Weather",
    logoUrl: "https://s3.aynaott.com/storage/21992f5e8529a9d2a94b6edf917dbd8f",
    protocol: "HLS",
    description: "AccuWeather live stream.",
    isFavorite: false
  },
  {
    id: "fox-weather",
    name: "Fox Weather",
    url: "https://247wlive.foxweather.com/stream/index.m3u8",
    category: "Weather",
    logoUrl: "https://s3.aynaott.com/storage/6dd20ecde19ea3f6b6cf6c040701973e",
    protocol: "HLS",
    description: "Fox Weather live streaming.",
    isFavorite: false
  },
  {
    id: "weather-spy",
    name: "Weather SPY",
    url: "https://jukin-weatherspy-2-in.samsung.wurl.tv/playlist.m3u8",
    category: "Weather",
    logoUrl: "https://s3.aynaott.com/storage/b0bdea4df810e2d46f689cbb6c990c91",
    protocol: "HLS",
    description: "Weather SPY network.",
    isFavorite: false
  },
  {
    id: "srk-tv",
    name: "SRK TV",
    url: "https://srknowapp.ncare.live/srktvhlswodrm/srktv.stream/playlist.m3u8",
    category: "Entertainment",
    logoUrl: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1746005940155.png",
    protocol: "HLS",
    description: "SRK TV live broadcast.",
    isFavorite: false
  },
  {
    id: "atn-bangla",
    name: "ATN Bangla",
    url: "https://tvsen5.aynaott.com/atnbangla/index.m3u8",
    category: "Entertainment",
    logoUrl: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1740553740665.png",
    protocol: "HLS",
    description: "ATN Bangla live broadcast.",
    isFavorite: false
  },
  {
    id: "bangla-vision",
    name: "Bangla Vision",
    url: "https://tvsen5.aynaott.com/banglavision/index.m3u8",
    category: "Entertainment",
    logoUrl: "https://tstatic.akash-go.com/cms-ui/images/custom-content/1735561344354.png",
    protocol: "HLS",
    description: "Bangla Vision live broadcast.",
    isFavorite: false
  }
];

export const formatChannelToVideoItem = (channelId: string): VideoItem => {
  const channel = RAW_CHANNELS.find(c => c.id === channelId);
  if (!channel) {
    throw new Error(`Channel with id ${channelId} not found`);
  }

  let viewers = 4200;
  if (channel.isFavorite) {
    viewers = Math.floor(Math.random() * 45000) + 15000;
  } else {
    viewers = Math.floor(Math.random() * 8000) + 1200;
  }

  let coverImage = channel.logoUrl;
  if (channel.id === 'sony-aath-vip') {
    coverImage = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80";
  } else if (channel.category === 'News') {
    coverImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=80";
  } else if (channel.category === 'Entertainment' || channel.category === 'Movies') {
    coverImage = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";
  } else if (channel.category === 'Religion') {
    coverImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80";
  }

  return {
    id: channel.id,
    title: channel.name,
    thumbnail: channel.logoUrl,
    cover: coverImage,
    url: channel.url,
    urls: channel.urls || [channel.url],
    category: channel.category,
    description: channel.description || `${channel.name} live broadcast.`,
    isLive: true,
    viewers: viewers,
    tags: [channel.category.toLowerCase(), channel.protocol.toLowerCase(), channel.isFavorite ? 'featured' : 'live']
  };
};

export const FEATURED_VIDEO: VideoItem = formatChannelToVideoItem("sony-aath-vip");

export const CATEGORY_ENTERTAINMENT = RAW_CHANNELS
  .filter(c => c.category === "Entertainment" || c.category === "Movies")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const CATEGORY_NEWS = RAW_CHANNELS
  .filter(c => c.category === "News" || c.category === "Weather")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const CATEGORY_RELIGION = RAW_CHANNELS
  .filter(c => c.category === "Religion")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const CATEGORY_SCIENCE = RAW_CHANNELS
  .filter(c => c.category === "Science & Education")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const CATEGORY_MUSIC = RAW_CHANNELS
  .filter(c => c.category === "Music" || c.category === "Infotainment")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const CATEGORY_INDIAN = RAW_CHANNELS
  .filter(c => c.category === "Indian")
  .map(c => formatChannelToVideoItem(c.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const ALL_CHANNELS: VideoItem[] = RAW_CHANNELS.map(c => formatChannelToVideoItem(c.id));

export const CATEGORIES: CategorySection[] = [
  {
    id: "cat-ent",
    title: "🎬 Premium Entertainment, Movies & Dramas",
    videos: CATEGORY_ENTERTAINMENT
  },
  {
    id: "cat-news",
    title: "🌐 Global News, Local Broadcasts & Weather",
    videos: CATEGORY_NEWS
  },
  {
    id: "cat-spiritual",
    title: "✨ Spiritual, Faith & Religion",
    videos: CATEGORY_RELIGION
  },
  {
    id: "cat-indian",
    title: "🇮🇳 Indian Channels",
    videos: CATEGORY_INDIAN
  },
  {
    id: "cat-music",
    title: "🎵 Music & Infotainment",
    videos: CATEGORY_MUSIC
  },
  {
    id: "cat-edu",
    title: "🧠 Science, Nature & Education",
    videos: CATEGORY_SCIENCE
  }
].filter(cat => cat.videos.length > 0);
