"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell, Check, MessageSquare, UserPlus,
  Trophy, Star, CreditCard, Clock,
  ArrowRight, Loader2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { format, isToday, isThisWeek } from "date-fns";

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, loading, markAllAsRead, markAsRead, removeNotification, dbUserId } =
    useNotifications();
  const [responding, setResponding] = useState<Record<string, "accepting" | "rejecting">>({});

  /* ─── Icon per type ─── */
  const getIcon = (type: string) => {
    switch (type) {
      case "connection_request":  return <UserPlus className="h-5 w-5 text-blue-400" />;
      case "connection_accepted": return <Check className="h-5 w-5 text-emerald-400" />;
      case "message":             return <MessageSquare className="h-5 w-5 text-purple-400" />;
      case "team_invite":         return <UserPlus className="h-5 w-5 text-orange-400" />;
      case "hackathon_deadline":  return <Clock className="h-5 w-5 text-red-400" />;
      case "badge_earned":        return <Star className="h-5 w-5 text-yellow-400" />;
      case "subscription":        return <CreditCard className="h-5 w-5 text-indigo-400" />;
      default:                    return <Bell className="h-5 w-5 text-[#6c47ff]" />;
    }
  };

  const getLink = (n: any) => {
    switch (n.type) {
      case "connection_accepted": return `/explore`;
      case "message":             return `/messages/${n.reference_id}`;
      case "team_invite":         return `/teams/${n.reference_id}`;
      case "hackathon_deadline":  return `/hackathons`;
      case "badge_earned":        return `/profile`;
      case "subscription":        return `/upgrade`;
      default:                    return "#";
    }
  };

  /* ─── Accept / Reject handler ─── */
  const handleRespond = async (
    e: React.MouseEvent,
    notif: any,
    action: "accept" | "reject"
  ) => {
    e.stopPropagation(); // don't trigger card click
    if (!dbUserId) return;

    setResponding((prev) => ({
      ...prev,
      [notif.id]: action === "accept" ? "accepting" : "rejecting",
    }));

    try {
      const res = await fetch("/api/connections/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connection_id: notif.reference_id,
          action,
          current_user_db_id: dbUserId,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Remove this notification card after response
      removeNotification(notif.id);
      // Mark the notification as read in the DB (cleanup)
      await markAsRead(notif.id);
    } catch (err) {
      console.error("Respond error:", err);
    } finally {
      setResponding((prev) => {
        const next = { ...prev };
        delete next[notif.id];
        return next;
      });
    }
  };

  const handleNotificationClick = async (n: any) => {
    if (n.type === "connection_request") return; // handled by buttons
    if (!n.is_read) await markAsRead(n.id);
    const link = getLink(n);
    if (link !== "#") router.push(link);
  };

  /* ─── Section grouping ─── */
  const today    = notifications.filter((n) => isToday(new Date(n.created_at)));
  const thisWeek = notifications.filter((n) => !isToday(new Date(n.created_at)) && isThisWeek(new Date(n.created_at)));
  const earlier  = notifications.filter((n) => !isToday(new Date(n.created_at)) && !isThisWeek(new Date(n.created_at)));

  const renderNotification = (n: any) => {
    const isConnectionRequest = n.type === "connection_request";
    const busy = responding[n.id];

    return (
      <Card
        key={n.id}
        onClick={() => handleNotificationClick(n)}
        className={cn(
          "p-4 border-white/10 relative overflow-hidden group transition-all",
          !n.is_read
            ? "bg-[#6c47ff]/5 border-[#6c47ff]/20 shadow-[0_0_20px_rgba(108,71,255,0.05)]"
            : "bg-[#13131a]",
          !isConnectionRequest && "cursor-pointer hover:bg-white/5"
        )}
      >
        {!n.is_read && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6c47ff] rounded-l-xl" />
        )}

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
            {getIcon(n.type)}
          </div>

          {/* Text */}
          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className={cn(
                "text-sm font-semibold truncate",
                !n.is_read ? "text-[#f0f0ff]" : "text-[#f0f0ff]/80"
              )}>
                {n.title}
              </p>
              <span className="text-[10px] text-[#6b7280] whitespace-nowrap shrink-0">
                {format(new Date(n.created_at), "h:mm a")}
              </span>
            </div>
            <p className="text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
              {n.body}
            </p>

            {/* Accept / Reject buttons for connection requests */}
            {isConnectionRequest && (
              <div className="flex items-center gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={(e) => handleRespond(e, n, "accept")}
                  disabled={!!busy}
                  className="h-8 px-4 rounded-xl bg-[#6c47ff] hover:bg-[#5535ee] text-white text-xs font-semibold shadow-lg shadow-[#6c47ff]/20"
                >
                  {busy === "accepting" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Check className="h-3 w-3 mr-1" />
                  )}
                  Accept
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => handleRespond(e, n, "reject")}
                  disabled={!!busy}
                  variant="ghost"
                  className="h-8 px-4 rounded-xl bg-white/5 border border-white/10 text-[#6b7280] hover:bg-white/10 hover:text-white text-xs font-semibold"
                >
                  {busy === "rejecting" ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <X className="h-3 w-3 mr-1" />
                  )}
                  Decline
                </Button>
              </div>
            )}
          </div>

          {/* Arrow for non-connection-request notifications */}
          {!isConnectionRequest && (
            <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="h-4 w-4 text-[#6c47ff]" />
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderSection = (title: string, items: any[]) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#6b7280] px-1">
          {title}
        </h3>
        <div className="space-y-3">{items.map(renderNotification)}</div>
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
        {notifications.some((n) => !n.is_read) && (
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
          <p className="text-[#6b7280] max-w-xs mx-auto">
            No new notifications. When someone sends you a connection request, it'll appear here.
          </p>
        </div>
      )}
    </div>
  );
}
