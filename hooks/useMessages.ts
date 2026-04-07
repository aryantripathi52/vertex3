"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export function useMessages(conversationId: string | null) {
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    async function loadMessages() {
      setLoading(true);
      try {
        const { data, error: msgError } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (msgError) throw msgError;
        setMessages(data || []);
        
        // Mark as read
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from("messages")
            .update({ read: true })
            .eq("conversation_id", conversationId)
            .neq("sender_id", user.id);
        }
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          
          // Mark as read if user is in this conversation
          supabase.auth.getUser().then(({ data: { user } }) => {
            if (user && payload.new.sender_id !== user.id) {
              supabase
                .from("messages")
                .update({ read: true })
                .eq("id", payload.new.id);
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  const sendMessage = async (content: string, type: 'text' | 'image' | 'voice' = 'text') => {
    if (!conversationId || !content.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user session");

      const newMessage = {
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        type,
        read: false,
        created_at: new Date().toISOString(),
      };

      // Optimistic UI update
      // (Not strictly necessary as realtime will catch it, but good for UX)
      // setMessages(prev => [...prev, { ...newMessage, id: 'temp-' + Date.now() }]);

      const { error: sendError } = await supabase
        .from("messages")
        .insert(newMessage);

      if (sendError) throw sendError;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return { messages, loading, error, sendMessage, messagesEndRef };
}
