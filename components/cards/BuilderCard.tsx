"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare, UserPlus, MapPin, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BadgeIcon, { BadgeType } from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";

interface BuilderCardProps {
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
    college: string;
    city: string;
    skills: string[];
    badge_type?: BadgeType;
  };
  className?: string;
}

export default function BuilderCard({ user, className }: BuilderCardProps) {
  return (
    <Card className={cn(
      "bg-[#13131a] border-white/10 overflow-hidden group hover:border-[#6c47ff]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg",
      className
    )}>
      <CardHeader className="p-5 pb-0">
        <div className="flex items-start justify-between">
          <Avatar className="h-14 w-14 border-2 border-white/5 p-1 bg-white/5 ring-1 ring-white/10">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] text-xl font-bold">
              {user.full_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          {user.badge_type && (
            <BadgeIcon type={user.badge_type} className="h-4 w-4" />
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#f0f0ff] line-clamp-1">{user.full_name}</h3>
          <p className="text-xs text-[#6b7280] font-medium tracking-wide mt-0.5">@{user.username}</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-[#6b7280]">
            <GraduationCap className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.college}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#6b7280]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>{user.city}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 overflow-hidden h-7">
           {user.skills.slice(0, 3).map((skill) => (
             <span key={skill} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-[#f0f0ff]">
               {skill}
             </span>
           ))}
           {user.skills.length > 3 && (
             <span className="text-[10px] text-[#6b7280] font-medium ml-1">+{user.skills.length - 3}</span>
           )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 grid grid-cols-2 gap-3">
        <Button variant="ghost" className="h-9 text-xs border border-white/10 hover:bg-white/5 hover:text-[#f0f0ff] rounded-xl font-semibold transition-all">
          <UserPlus className="h-3.5 w-3.5 mr-2" />
          Connect
        </Button>
        <Button className="h-9 text-xs bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#6c47ff]/20">
          <MessageSquare className="h-3.5 w-3.5 mr-2" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );
}
