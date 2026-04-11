import React from "react";
import { CheckCircle2, Flame, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = 'verified' | 'influencer' | 'spotlight' | 'elite';

interface BadgeIconProps {
  type: BadgeType;
  showText?: boolean;
  className?: string;
}

const badgeConfig = {
  verified: {
    icon: CheckCircle2,
    color: "text-[#00d4aa]",
    glow: "shadow-[0_0_12px_#00d4aa]",
    bg: "bg-[#00d4aa]/10",
    border: "border-[#00d4aa]/20",
    label: "Verified"
  },
  influencer: {
    icon: Flame,
    color: "text-amber-500",
    glow: "shadow-[0_0_12px_#f59e0b]",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Influencer"
  },
  spotlight: {
    icon: Star,
    color: "text-slate-400",
    glow: "shadow-[0_0_12px_#94a3b8]",
    bg: "bg-slate-400/10",
    border: "border-slate-400/20",
    label: "Spotlight"
  },
  elite: {
    icon: Crown,
    color: "text-purple-500",
    glow: "shadow-[0_0_12px_#a855f7]",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    label: "Elite"
  }
};

export default function BadgeIcon({ type, showText = false, className }: BadgeIconProps) {
  const config = (badgeConfig as any)[type];
  if (!config) return null;
  const Icon = config.icon;

  if (showText) {
    return (
      <div className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider",
        config.bg,
        config.border,
        config.color,
        config.glow,
        className
      )}>
        <Icon className="h-3 w-3" />
        {config.label}
      </div>
    );
  }

  return (
    <div className={cn(
      "w-fit p-1 rounded-full border",
      config.bg,
      config.border,
      config.color,
      config.glow,
      className
    )}>
      <Icon className="h-4 w-4" />
    </div>
  );
}
