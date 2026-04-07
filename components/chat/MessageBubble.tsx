"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: any;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = format(new Date(message.created_at), "h:mm a");

  return (
    <div className={cn(
      "flex flex-col mb-4 max-w-[80%] sm:max-w-[70%]",
      isOwn ? "ml-auto items-end" : "mr-auto items-start"
    )}>
      <div className={cn(
        "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
        isOwn 
          ? "bg-[#6c47ff] text-white rounded-br-none" 
          : "bg-[#13131a] border border-white/10 text-[#f0f0ff] rounded-bl-none"
      )}>
        {message.type === 'image' ? (
          <img 
            src={message.content} 
            alt="Message attachment" 
            className="rounded-lg max-h-60 w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" 
          />
        ) : message.type === 'voice' ? (
          <div className="flex items-center gap-2 min-w-[150px]">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-[#6c47ff] animate-pulse" />
            </div>
            <div className="flex-1 h-1 bg-white/20 rounded-full relative">
              <div className="absolute inset-0 bg-white/40 rounded-full w-1/3" />
            </div>
            <span className="text-[10px] opacity-70">Voice</span>
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      
      <div className="mt-1 flex items-center gap-1.5 px-1">
        <span className="text-[10px] text-[#6b7280] font-medium">
          {time}
        </span>
        {isOwn && (
          message.read ? (
            <CheckCheck className="h-3 w-3 text-[#6c47ff]" />
          ) : (
            <Check className="h-3 w-3 text-[#6b7280]" />
          )
        )}
      </div>
    </div>
  );
}
