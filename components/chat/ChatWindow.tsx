"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Image as ImageIcon, Mic, Smile, 
  MoreVertical, Phone, Video, Loader2, ArrowLeft, X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BadgeIcon from "@/components/badges/BadgeIcon";
import { useMessages } from "@/hooks/useMessages";
import MessageBubble from "./MessageBubble";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversation: any;
  currentUser: any;
  onBack?: () => void;
}

export default function ChatWindow({ conversation, currentUser, onBack }: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const { messages, loading, sendMessage, messagesEndRef } = useMessages(conversation?.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    try {
      await sendMessage(text);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Revert input if needed or show error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full bg-[#0a0a0f] text-center p-8">
        <div className="h-20 w-20 rounded-full bg-[#13131a] border border-white/10 flex items-center justify-center mb-4">
          <Send className="h-8 w-8 text-[#6c47ff]" />
        </div>
        <h3 className="text-xl font-bold text-[#f0f0ff] mb-2">Your Messages</h3>
        <p className="text-[#6b7280] max-w-xs">Select a conversation from the list to start chatting with other builders.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#13131a]">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="lg:hidden mr-1">
            <ArrowLeft className="h-5 w-5 text-[#f0f0ff]" />
          </Button>
          <div className="relative">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarImage src={conversation.otherUser?.avatar_url} />
              <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] font-bold">
                {conversation.otherUser?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            {conversation.otherUser?.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#13131a]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#f0f0ff] text-sm sm:text-base">
                {conversation.otherUser?.full_name}
              </span>
              {conversation.otherUser?.badge && (
                <BadgeIcon type={conversation.otherUser.badge} size="xs" />
              )}
            </div>
            <span className="text-[10px] text-emerald-500 font-medium">
              {conversation.otherUser?.isOnline ? "Online now" : "Recently active"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#f0f0ff]">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#f0f0ff]">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#f0f0ff]">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col"
      >
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#6c47ff]" />
          </div>
        ) : messages.length > 0 ? (
          <>
            <div className="flex-1" /> {/* Spacer to push messages to bottom */}
            {messages.map((msg, idx) => (
              <MessageBubble 
                key={msg.id || idx} 
                message={msg} 
                isOwn={msg.sender_id === currentUser?.id} 
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
              <Smile className="h-8 w-8 text-[#6b7280]" />
            </div>
            <div>
              <p className="text-[#f0f0ff] font-medium">No messages yet</p>
              <p className="text-xs text-[#6b7280]">Send a message to start the conversation!</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-[#13131a] border-t border-white/10">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-1 mb-1">
            <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#6c47ff] hover:bg-[#6c47ff]/10">
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "text-[#6b7280] hover:text-[#6c47ff] hover:bg-[#6c47ff]/10",
                currentUser?.subscription_tier === 'free' && "opacity-50"
              )}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 pr-12 text-sm text-[#f0f0ff] focus:ring-2 focus:ring-[#6c47ff] outline-none resize-none max-h-32 custom-scrollbar"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
              }}
            />
            <Button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              size="icon"
              className="absolute right-2 bottom-1.5 h-8 w-8 bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl shadow-lg shadow-[#6c47ff]/20"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "text-[#6b7280] hover:text-[#6c47ff] hover:bg-[#6c47ff]/10",
                currentUser?.subscription_tier !== 'elite' && "opacity-50"
              )}
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {currentUser?.subscription_tier === 'free' && (
          <p className="text-[10px] text-[#6b7280] text-center mt-2">
            Upgrade to <span className="text-[#6c47ff] font-bold">Pro</span> to send images and voice notes.
          </p>
        )}
      </div>
    </div>
  );
}
