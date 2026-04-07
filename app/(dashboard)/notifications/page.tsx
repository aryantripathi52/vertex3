"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, Check, MessageSquare, UserPlus, 
  Trophy, Star, CreditCard, Clock, 
  ArrowRight, Loader2, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { format, isToday, isThisWeek } from "date-fns";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, loading, markAllAsRead, markAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'connection_request': return <UserPlus className="h-5 w-5 text-blue-400" />;
      case 'connection_accepted': return <Check className="h-5 w-5 text-emerald-400" />;
      case 'message': return <MessageSquare className="h-5 w-5 text-purple-400" />;
      case 'team_invite': return <UserPlus className="h-5 w-5 text-orange-400" />;
      case 'hackathon_deadline': return <Clock className="h-5 w-5 text-red-400" />;
      case 'badge_earned': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'subscription': return <CreditCard className="h-5 w-5 text-indigo-400" />;
      default: return <Bell className="h-5 w-5 text-[#6c47ff]" />;
    }
  };

  const getLink = (notification: any) => {
    const { type, reference_id } = notification;
    switch (type) {
      case 'connection_request':
      case 'connection_accepted': return `/explore`; // Could be specific user profile if username was in meta
      case 'message': return `/messages/${reference_id}`;
      case 'team_invite': return `/teams/${reference_id}`;
      case 'hackathon_deadline': return `/hackathons`;
      case 'badge_earned': return `/profile`;
      case 'subscription': return `/upgrade`;
      default: return '#';
    }
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.is_read) {
      await markAsRead(n.id);
    }
    const link = getLink(n);
    if (link !== '#') router.push(link);
  };

  const today = notifications.filter(n => isToday(new Date(n.created_at)));
  const thisWeek = notifications.filter(n => !isToday(new Date(n.created_at)) && isThisWeek(new Date(n.created_at)));
  const earlier = notifications.filter(n => !isToday(new Date(n.created_at)) && !isThisWeek(new Date(n.created_at)));

  const renderSection = (title: string, items: any[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#6b7280] px-1">{title}</h3>
        <div className="space-y-3">
          {items.map((n) => (
            <Card 
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={cn(
                "p-4 border-white/10 cursor-pointer transition-all hover:bg-white/5 relative overflow-hidden group",
                !n.is_read ? "bg-[#6c47ff]/5 border-[#6c47ff]/20 shadow-[0_0_20px_rgba(108,71,255,0.05)]" : "bg-[#13131a]"
              )}
            >
              {!n.is_read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6c47ff]" />
              )}
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm font-semibold truncate",
                      !n.is_read ? "text-[#f0f0ff]" : "text-[#f0f0ff]/80"
                    )}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-[#6b7280] whitespace-nowrap">
                      {format(new Date(n.created_at), "h:mm a")}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                    {n.body}
                  </p>
                </div>
                <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-[#6c47ff]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#f0f0ff] mb-2">Notifications</h1>
          <p className="text-[#6b7280]">Stay updated with your connections and teams.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <Button 
            variant="ghost" 
            onClick={markAllAsRead}
            className="text-xs text-[#6c47ff] hover:bg-[#6c47ff]/10 rounded-xl"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#6c47ff]" />
          <p className="text-sm text-[#6b7280]">Fetching your updates...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-10">
          {renderSection("Today", today)}
          {renderSection("This Week", thisWeek)}
          {renderSection("Earlier", earlier)}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#13131a] border border-white/10 rounded-3xl space-y-4">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-white/10">
            <Bell className="h-10 w-10 text-[#6b7280]" />
          </div>
          <h3 className="text-xl font-bold text-[#f0f0ff]">You're all caught up!</h3>
          <p className="text-[#6b7280] max-w-xs mx-auto">No new notifications at the moment. We'll let you know when something exciting happens.</p>
        </div>
      )}
    </div>
  );
}
