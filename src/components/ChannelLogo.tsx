import React from 'react';
import {
  Award,
  CircleHelp,
  CloudSun,
  Compass,
  GraduationCap,
  Sparkles,
  Earth,
  Tv
} from 'lucide-react';

interface ChannelLogoProps {
  name: string;
  category: string;
  logoUrl?: string;
  className?: string;
}

function isGenericOrPlaceholder(url?: string): boolean {
  if (!url) return true;
  const lower = url.toLowerCase();
  if (
    lower.includes("unsplash.com") ||
    lower.includes("ui-avatars.com") ||
    lower.includes("placeholder") ||
    lower.includes("avatar")
  ) {
    return true;
  }
  return false;
}

interface LogoStyle {
  line1: string;
  line2: string;
  gradientClasses: string;
  accentBorder: string;
  badgeColor: string;
  IconComponent: React.ComponentType<{ size?: number; className?: string }>;
}

function computeChannelBadge(name: string, category: string): LogoStyle {
  let clean = name
    .trim()
    .toUpperCase()
    .replace(" BANGLADESHI", "")
    .replace(" BANGLA", "")
    .replace(" NETWORK", "")
    .replace(" CHANNEL", "")
    .replace(" GLOBAL", "")
    .replace(" DIRECT", "")
    .trim();

  if (clean.includes("FIFA WORLD CUP")) clean = "FIFA 2026";
  else if (clean.includes("BEIN SPORTS")) clean = clean.includes("4K") ? "beIN 4K" : "beIN SPORTS";
  else if (clean.includes("CAZÉTV")) clean = "CAZÉ TV";
  else if (clean.includes("THIKANA")) clean = "THIKANA";
  else if (clean.includes("ENTER 10")) clean = "ENTER 10";
  else if (clean.includes("DW ENGLISH")) clean = "DW NEWS";
  else if (clean.includes("MY TV")) clean = "MY TV";
  else if (clean.includes("WIN SPORTS")) clean = "WIN SPORTS";
  else if (clean.includes("SKY SPORTS")) clean = "SKY";
  else if (clean.includes("STAR SPORTS")) clean = "STAR SPORTS";
  else if (clean.includes("DISCOVERY")) clean = "DISCOVERY";
  else if (clean.includes("ACCUWEATHER")) clean = "ACCU WEATHER";
  else if (clean.includes("FOX WEATHER")) clean = "FOX WEATHER";

  let line1 = clean;
  let line2 = "";
  const parts = clean.split(" ");
  if (parts.length > 1 && clean.length > 8) {
    line1 = parts[0];
    line2 = parts.slice(1).join(" ");
  }

  const catLower = category.toLowerCase();
  let gradientClasses = "from-zinc-900 to-zinc-950 text-zinc-300";
  let accentBorder = "border-zinc-800";
  let badgeColor = "bg-zinc-800 text-zinc-400";
  let IconComponent = CircleHelp;

  if (catLower.includes("sports")) {
    gradientClasses = "from-orange-600 via-red-600 to-zinc-950 text-white";
    accentBorder = "border-red-500/20";
    badgeColor = "bg-black/40 text-rose-300";
    IconComponent = Award;
  } else if (catLower.includes("news")) {
    gradientClasses = "from-indigo-900 via-slate-900 to-black text-white";
    accentBorder = "border-indigo-500/20";
    badgeColor = "bg-indigo-600/30 text-indigo-200 border border-indigo-500/20";
    IconComponent = Earth;
  } else if (catLower.includes("religion") || catLower.includes("spiritual")) {
    gradientClasses = "from-teal-900 via-emerald-950 to-zinc-950 text-emerald-100";
    accentBorder = "border-emerald-500/20";
    badgeColor = "bg-emerald-950 text-emerald-400 border border-emerald-500/30";
    IconComponent = Compass;
  } else if (catLower.includes("science") || catLower.includes("education")) {
    gradientClasses = "from-sky-900 via-slate-950 to-zinc-950 text-sky-100";
    accentBorder = "border-sky-500/20";
    badgeColor = "bg-sky-950 text-sky-300 border border-sky-500/30";
    IconComponent = GraduationCap;
  } else if (catLower.includes("weather")) {
    gradientClasses = "from-blue-700 via-cyan-900 to-slate-950 text-white";
    accentBorder = "border-blue-400/20";
    badgeColor = "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20";
    IconComponent = CloudSun;
  } else if (catLower.includes("kids")) {
    gradientClasses = "from-amber-500 via-orange-600 to-zinc-950 text-white";
    accentBorder = "border-amber-500/25";
    badgeColor = "bg-amber-500/15 text-yellow-300 border border-amber-500/25";
    IconComponent = Sparkles;
  } else {
    gradientClasses = "from-fuchsia-900 via-purple-950 to-zinc-950 text-fuchsia-100";
    accentBorder = "border-fuchsia-500/20";
    badgeColor = "bg-purple-950/80 text-fuchsia-300 border border-fuchsia-500/20";
    IconComponent = Tv;
  }

  return { line1, line2, gradientClasses, accentBorder, badgeColor, IconComponent };
}

export const ChannelLogo: React.FC<ChannelLogoProps> = ({
  name,
  category,
  logoUrl,
  className = "w-full h-full"
}) => {
  if (!isGenericOrPlaceholder(logoUrl) && logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className={`${className} object-cover`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const sibling = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (sibling) sibling.style.display = 'flex';
        }}
      />
    );
  }

  const { line1, line2, gradientClasses, accentBorder, IconComponent } = computeChannelBadge(name, category);

  return (
    <div
      className={`${className} relative flex flex-col items-center justify-center p-3 select-none overflow-hidden bg-gradient-to-br ${gradientClasses} ${accentBorder} border`}
    >
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/5" />
      <div className="absolute top-0 bottom-0 left-4 w-[1px] bg-white/5 pointer-events-none" />

      <div className="absolute top-2 right-2 p-1 rounded-md bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center border border-white/5 shadow-inner">
        <IconComponent size={11} className="text-white/60" />
      </div>

      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-sm border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <span className="text-[7px] font-extrabold tracking-widest text-zinc-400">TV</span>
      </div>

      <div className="text-center mt-3 flex flex-col items-center justify-center z-10 px-2">
        <div className="text-sm sm:text-base font-black text-white tracking-tighter uppercase drop-shadow-md font-sans">
          {line1}
        </div>
        {line2 && (
          <div className="text-[9px] sm:text-[10px] font-bold text-zinc-300/90 tracking-wide uppercase mt-0.5 bg-black/35 px-1.5 py-0.5 rounded border border-white/5">
            {line2}
          </div>
        )}
      </div>

      <div className="absolute -bottom-4 -left-3 text-zinc-500/10 font-black text-4xl select-none uppercase pointer-events-none tracking-widest leading-none">
        LIVE
      </div>
    </div>
  );
};
