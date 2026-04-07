"use client";

import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import BadgeIcon from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ConversationListProps {
  conversations: any[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  loading
}: ConversationListProps) {
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(c => 
    c.otherUser?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.otherUser?.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#13131a] border-r border-white/10">
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="pl-9 bg-white/5 border-white/10 text-sm focus:ring-[#6c47ff]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#6c47ff]" />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-4 transition-colors border-b border-white/5",
                selectedId === conv.id ? "bg-[#6c47ff]/10 border-r-2 border-r-[#6c47ff]" : "hover:bg-white/5"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border border-white/10">
                  <AvatarImage src={conv.otherUser?.avatar_url} />
                  <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] font-bold">
                    {conv.otherUser?.full_name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {conv.otherUser?.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#13131a]" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-semibold text-[#f0f0ff] truncate">
                      {conv.otherUser?.full_name}
                    </span>
                    {conv.otherUser?.badge && (
                      <BadgeIcon type={conv.otherUser.badge} size="xs" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#6b7280] font-medium shrink-0">
                    {conv.lastMessage?.created_at && format(new Date(conv.lastMessage.created_at), "h:mm a")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    "text-xs truncate",
                    conv.unreadCount > 0 ? "text-[#f0f0ff] font-semibold" : "text-[#6b7280]"
                  )}>
                    {conv.lastMessage?.content || "No messages yet"}
                  </p>
                  {conv.unreadCount > 0 && (
                    <div className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#6c47ff] text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-[#6c47ff]/20">
                      {conv.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-[#6b7280]">No conversations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
