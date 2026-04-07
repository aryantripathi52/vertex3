"use client";

import React from "react";
import { 
  Users, 
  Lightbulb, 
  Trophy, 
  ArrowRight, 
  UserPlus, 
  CheckCircle2, 
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    idea: string;
    hackathon_title: string;
    members: { id: string; avatar_url?: string; full_name: string }[];
    max_members: number;
    required_skills: string[];
    is_open: boolean;
  };
  className?: string;
}

export default function TeamCard({ team, className }: TeamCardProps) {
  const currentMembers = team.members?.length || 0;
  const remainingSlots = team.max_members - currentMembers;

  return (
    <Card className={cn(
      "bg-[#13131a] border-white/10 overflow-hidden group hover:border-[#6c47ff]/50 transition-all duration-300 shadow-xl",
      className
    )}>
      <CardHeader className="p-6 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 overflow-hidden h-7">
             <div className="h-6 w-6 rounded-md bg-[#6c47ff]/10 flex items-center justify-center shrink-0">
               <Trophy className="h-3 w-3 text-[#6c47ff]" />
             </div>
             <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-extrabold truncate">{team.hackathon_title || "General Team"}</p>
          </div>
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider h-5 flex items-center shrink-0",
             team.is_open ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
          )}>
            {team.is_open ? `Open (${remainingSlots} slots)` : "Closed"}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-[#f0f0ff] line-clamp-1 group-hover:text-[#6c47ff] transition-colors">{team.name}</CardTitle>
        <CardDescription className="text-sm text-[#6b7280] line-clamp-2 mt-2 leading-relaxed min-h-[40px]">
          {team.idea}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6 overflow-hidden h-20">
          <p className="text-[10px] text-[#6b7280] uppercase tracking-wider font-extrabold mb-3">Looking For</p>
          <div className="flex flex-wrap gap-1.5 h-12 overflow-hidden">
             {team.required_skills?.slice(0, 4).map((skill) => (
               <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-[#f0f0ff]">
                 {skill}
               </span>
             ))}
             {team.required_skills?.length > 4 && (
               <span className="text-xs text-[#6b7280] mt-1 font-medium italic">+{team.required_skills.length - 4}</span>
             )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5 h-12">
          <div className="flex items-center -space-x-2">
            {team.members?.slice(0, 3).map((member, i) => (
              <Avatar key={member.id} className={cn(
                "h-7 w-7 border-2 border-[#13131a] ring-1 ring-white/10",
                i === 0 && "z-30", i === 1 && "z-20", i === 2 && "z-10"
              )}>
                <AvatarImage src={member.avatar_url} />
                <AvatarFallback className="bg-white/5 text-[#f0f0ff] text-[10px] font-bold">{member.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members?.length > 3 && (
              <div className="h-7 w-7 rounded-full bg-white/5 border-2 border-[#13131a] ring-1 ring-white/10 flex items-center justify-center text-[10px] text-[#6b7280] font-bold z-0">
                +{team.members.length - 3}
              </div>
            )}
            {remainingSlots > 0 && (
               <div className="h-7 w-7 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-[#6b7280] hover:text-[#6c47ff] hover:bg-[#6c47ff]/10 hover:border-[#6c47ff]/30 transition-all cursor-pointer">
                 <Plus className="h-3 w-3" />
               </div>
            )}
          </div>
          <p className="text-xs text-[#6b7280] font-medium uppercase tracking-wider">{currentMembers}/{team.max_members} Members</p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Link href={`/teams/${team.id}`} className="w-full">
          <Button className="w-full h-11 bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl font-bold transition-all shadow-lg shadow-[#6c47ff]/20">
            View Team Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
