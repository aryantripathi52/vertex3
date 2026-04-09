"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Search, 
  MessageSquare, 
  Trophy, 
  Bell, 
  UserCircle, 
  Zap, 
  LayoutDashboard,
  LogOut,
  ChevronRight,
  X
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgeIcon from "@/components/badges/BadgeIcon";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "Messages", href: "/messages", icon: MessageSquare },
  { label: "Hackathons", href: "/hackathons", icon: Trophy },
  { label: "Teams", href: "/teams", icon: Users },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: UserCircle },
  { label: "Upgrade", href: "/upgrade", icon: Zap },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();

  if (!user) return null;

  return (
    <aside className="w-64 h-screen bg-[#0a0a0f] border-r border-white/10 flex flex-col p-4 fixed left-0 top-0 z-50 lg:static">
      {/* Branding & Mobile Close */}
      <div className="flex items-center justify-between mb-10 px-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white"></div>
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#f0f0ff]">Vertex3</span>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg bg-white/5 text-[#6b7280] hover:text-[#f0f0ff]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Info & Badge */}
      <div className="mb-8 p-3 rounded-2xl bg-[#13131a] border border-white/10 flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-[#6c47ff]/20">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-white/5 text-[#f0f0ff]">{user.fullName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-sm font-semibold text-[#f0f0ff] truncate">{user.fullName}</span>
            <BadgeIcon type="verified" className="h-3 w-3 shrink-0" />
          </div>
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-medium">Free Tier</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-[#6c47ff]/10 text-[#6c47ff] border border-[#6c47ff]/20" 
                  : "text-[#6b7280] hover:text-[#f0f0ff] hover:bg-white/5 border border-transparent"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[#6c47ff]" : "text-[#6b7280] group-hover:text-[#f0f0ff]")} />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#6c47ff]" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Sign Out */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <SignOutButton>
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[#ef4444] hover:bg-red-500/5 transition-colors">
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
