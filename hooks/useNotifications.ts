"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function useNotifications() {
  const supabase = createClient();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dbUserId, setDbUserId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      // Get auth user then look up DB row to get the correct DB id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: dbUser } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", user.id)
        .single();

      if (!dbUser) {
        setLoading(false);
        return;
      }

      const uid = dbUser.id;
      setDbUserId(uid);

      // Fetch initial notifications for this DB user
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
      setLoading(false);

      // Real-time: new notifications
      const channel = supabase
        .channel(`notifications:${uid}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            setNotifications((prev) => [payload.new, ...prev]);
            setUnreadCount((prev) => prev + 1);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${uid}`,
          },
          (payload) => {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n))
            );
            setUnreadCount((prev) => {
              if (
                payload.old.is_read === false &&
                payload.new.is_read === true
              ) {
                return Math.max(0, prev - 1);
              }
              return prev;
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanup = init();
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, [supabase]);

  const markAllAsRead = useCallback(async () => {
    if (!dbUserId) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", dbUserId)
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [supabase, dbUserId]);

  const markAsRead = useCallback(async (id: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, [supabase]);

  /** Remove a notification from local state (after accept/reject) */
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const n = prev.find((x) => x.id === id);
      if (n && !n.is_read) setUnreadCount((c) => Math.max(0, c - 1));
      return prev.filter((x) => x.id !== id);
    });
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    markAsRead,
    removeNotification,
    dbUserId,
  };
}
