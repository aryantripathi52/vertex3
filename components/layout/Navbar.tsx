"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function DashboardNavbar({ onMenuClick }: NavbarProps) {
  const { user } = useUser();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between pointer-events-auto">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 -ml-2 rounded-xl text-[#6b7280] hover:text-[#f0f0ff] hover:bg-white/5 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
          <Input 
            placeholder="Search for builders or hackathons..."
            className="bg-white/5 border-white/10 pl-10 text-[#f0f0ff] h-10 rounded-xl focus-visible:ring-[#6c47ff]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 text-[#6b7280] hover:text-[#f0f0ff] transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-[#0a0a0f]"></span>
        </button>

        {/* User Button */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
             <p className="text-xs font-semibold text-[#f0f0ff]">{user.firstName}</p>
             <p className="text-[10px] text-[#6b7280]">Developer</p>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-11 w-11 border border-[#6c47ff]/20",
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
