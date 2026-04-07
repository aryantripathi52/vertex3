"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ConversationList from "@/components/chat/ConversationList";
import ChatWindow from "@/components/chat/ChatWindow";

export default function MessagesPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setCurrentUser(userData);

      // Fetch conversations
      const { data: convs } = await supabase
        .from("conversations")
        .select(`
          id,
          created_at,
          conversation_members (user_id),
          messages (id, content, created_at, sender_id, read, type)
        `)
        .order('created_at', { ascending: false });

      if (convs) {
        const transformed = await Promise.all(convs.map(async (conv: any) => {
          const otherMember = conv.conversation_members.find((m: any) => m.user_id !== user.id);
          const otherUserId = otherMember?.user_id;

          const { data: otherUser } = await supabase
            .from("users")
            .select("id, full_name, username, avatar_url, subscription_tier")
            .eq("id", otherUserId)
            .single();

          const { data: badges } = await supabase
            .from("badges")
            .select("badge_type")
            .eq("user_id", otherUserId)
            .limit(1);

          const lastMessage = conv.messages.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0];

          const unreadCount = conv.messages.filter((m: any) => 
            m.sender_id !== user.id && !m.read
          ).length;

          return {
            id: conv.id,
            otherUser: {
              ...otherUser,
              badge: badges?.[0]?.badge_type,
            },
            lastMessage,
            unreadCount
          };
        }));
        setConversations(transformed);
      }
      setLoading(false);
    }
    init();
  }, [supabase]);

  const onSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] overflow-hidden bg-[#0a0a0f] border border-white/10 rounded-2xl">
      <div className="w-full lg:w-80 flex-shrink-0">
        <ConversationList 
          conversations={conversations}
          selectedId={null}
          onSelect={onSelectConversation}
          loading={loading}
        />
      </div>
      <div className="hidden lg:flex flex-1 min-w-0">
        <ChatWindow 
          conversation={null}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
