"use client";

import React from "react";
import { 
  Trophy, 
  MapPin, 
  Calendar, 
  Tag, 
  ChevronRight, 
  Bookmark, 
  ExternalLink,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HackathonCardProps {
  hackathon: {
    id: string;
    title: string;
    organizer: string;
    location: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    start_date: string;
    end_date: string;
    prize_pool: string;
    tags: string[];
    is_featured?: boolean;
    is_verified?: boolean;
    website_url: string;
  };
  className?: string;
}

export default function HackathonCard({ hackathon, className }: HackathonCardProps) {
  return (
    <Card className={cn(
      "bg-[#13131a] border-white/10 overflow-hidden group transition-all duration-300 hover:border-white/20 shadow-xl",
      hackathon.is_featured && "border-[#6c47ff]/40 shadow-[0_0_30px_-10px_#6c47ff40] relative",
      className
    )}>
      {hackathon.is_featured && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-[#6c47ff] text-white text-[10px] font-extrabold uppercase tracking-widest rounded-bl-xl z-10 shadow-lg">
          Featured
        </div>
      )}

      <CardHeader className="p-6 pb-0 flex flex-row items-start justify-between">
        <div className="flex-1 overflow-hidden pr-8">
          <div className="flex items-center gap-2 mb-1 overflow-hidden">
            <h3 className="text-xl font-bold text-[#f0f0ff] line-clamp-1 group-hover:text-[#6c47ff] transition-colors">{hackathon.title}</h3>
            {hackathon.is_verified && (
              <Badge className="bg-[#00d4aa]/10 text-[#00d4aa] border-[#00d4aa]/20 text-[10px] py-0 px-1.5 h-4 font-bold tracking-wider shrink-0 uppercase">Verified</Badge>
            )}
          </div>
          <p className="text-sm text-[#6b7280] font-medium truncate">by {hackathon.organizer}</p>
        </div>
        <button className="h-9 w-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#6b7280] hover:text-[#6c47ff] hover:bg-[#6c47ff]/10 hover:border-[#6c47ff]/30 transition-all">
          <Bookmark className="h-4 w-4" />
        </button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-[#f0f0ff] font-medium">
             <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
               <Trophy className="h-3.5 w-3.5 text-amber-500" />
             </div>
             <div className="overflow-hidden">
               <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Prize Pool</p>
               <p className="truncate text-[#f0f0ff]">{hackathon.prize_pool}</p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#f0f0ff] font-medium">
             <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
               <MapPin className="h-3.5 w-3.5 text-[#6c47ff]" />
             </div>
             <div className="overflow-hidden">
               <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-semibold">Mode</p>
               <p className="truncate text-[#f0f0ff]">{hackathon.mode}</p>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2 overflow-hidden items-center h-6">
          {hackathon.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
              {tag}
            </span>
          ))}
          {hackathon.tags.length > 3 && (
            <span className="text-[10px] text-[#6b7280] ml-1 font-medium italic">+{hackathon.tags.length - 3}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3 border-t border-white/5 pt-4">
        <Button variant="ghost" className="flex-1 h-10 text-xs border border-white/10 hover:bg-white/5 hover:text-[#f0f0ff] rounded-xl font-semibold transition-all">
          View Teams
          <Users className="h-3.5 w-3.5 ml-2" />
        </Button>
        <Button className="flex-1 h-10 text-xs bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl font-semibold transition-all shadow-lg shadow-[#6c47ff]/20">
          Apply Now
          <ExternalLink className="h-3.5 w-3.5 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
