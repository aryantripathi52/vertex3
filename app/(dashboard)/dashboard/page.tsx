"use client";

import React from "react";
import { 
  Trophy, 
  Users, 
  Search, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  ArrowRight,
  Flame,
  CheckCircle2,
  Star,
  Crown,
  Plus
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BuilderCard from "@/components/cards/BuilderCard";
import HackathonCard from "@/components/cards/HackathonCard";
import TeamCard from "@/components/cards/TeamCard";
import BadgeIcon from "@/components/badges/BadgeIcon";

// Mock Data
const RECOMMENDED_BUILDERS = [
  {
    id: "1",
    username: "the_aryan",
    full_name: "Aryan Tripathi",
    avatar_url: "https://github.com/aryantripathi52.png",
    college: "IIT Bombay",
    city: "Mumbai",
    skills: ["Next.js", "Supabase", "UI/UX", "Python"],
    badge_type: "verified" as const,
  },
  {
    id: "2",
    username: "priya_dev",
    full_name: "Priya Sharma",
    avatar_url: "",
    college: "BITS Pilani",
    city: "Hyderabad",
    skills: ["React Native", "Firebase", "Node.js", "FastAPI"],
    badge_type: "influencer" as const,
  },
  {
    id: "3",
    username: "sam_smith",
    full_name: "Sam Smith",
    avatar_url: "",
    college: "DTU Delhi",
    city: "Delhi",
    skills: ["Blockchain", "Solidity", "Web3", "Smart Contracts"],
    badge_type: "elite" as const,
  }
];

const OPEN_TEAMS = [
  {
    id: "1",
    name: "Nexus AI",
    idea: "Building a decentralized marketplace for AI models focused on small enterprises.",
    hackathon_title: "Smart India Hackathon 2024",
    members: [
      { id: "1", full_name: "Aryan T.", avatar_url: "https://github.com/aryantripathi52.png" },
      { id: "2", full_name: "Priya S.", avatar_url: "" }
    ],
    max_members: 4,
    required_skills: ["Python", "TensorFlow", "React", "Node.js"],
    is_open: true,
  },
  {
    id: "2",
    name: "FinFlow",
    idea: "Unified interface for managing multi-chain DeFi investments with risk analysis.",
    hackathon_title: "Hack India Web3",
    members: [
      { id: "1", full_name: "Sam S.", avatar_url: "" }
    ],
    max_members: 3,
    required_skills: ["Solidity", "Rust", "Web3.js"],
    is_open: true,
  }
];

const CLOSING_HACKATHONS = [
  {
    id: "1",
    title: "HackVerse 3.0",
    organizer: "NITK Surathkal",
    location: "Online",
    mode: "Online" as const,
    start_date: "2024-05-20",
    end_date: "2024-05-22",
    prize_pool: "₹2,50,000",
    tags: ["AI", "Cloud", "SaaS"],
    is_featured: true,
    is_verified: true,
    website_url: "#",
  }
];

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Feed (Left) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Welcome Header */}
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-white mb-2">Hello, {user?.firstName || "Builder"}! 👋</h1>
            <p className="text-[#6b7280]">Welcome back. Here's what's happening in your builder network.</p>
          </div>

          {/* Recommended Builders Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#6c47ff]" />
                <h2 className="text-xl font-bold text-white tracking-tight">Recommended Builders</h2>
              </div>
              <Button variant="ghost" className="text-xs text-[#6b7280] hover:text-[#f0f0ff] uppercase tracking-widest font-extrabold group">
                View All <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {RECOMMENDED_BUILDERS.map(builder => (
                <BuilderCard key={builder.id} user={builder} />
              ))}
            </div>
          </section>

          {/* Open Teams Section */}
          <section>
             <div className="flex items-center justify-between mb-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-[#00d4aa]" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Open Teams</h2>
                </div>
                <Button variant="ghost" className="text-xs text-[#6b7280] hover:text-[#f0f0ff] uppercase tracking-widest font-extrabold group">
                  Browse Teams <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {OPEN_TEAMS.map(team => (
                 <TeamCard key={team.id} team={team} />
               ))}
             </div>
          </section>

          {/* Closing Hackathons Section */}
          <section>
             <div className="flex items-center justify-between mb-6 pt-10 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-[#6c47ff]" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Closing Soon</h2>
                </div>
                <Button variant="ghost" className="text-xs text-[#6b7280] hover:text-[#f0f0ff] uppercase tracking-widest font-extrabold group">
                  All Hackathons <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
             </div>
             <div className="grid grid-cols-1 gap-6">
               {CLOSING_HACKATHONS.map(hackathon => (
                 <HackathonCard key={hackathon.id} hackathon={hackathon} />
               ))}
             </div>
          </section>
        </div>

        {/* Right Panel (Right) */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* My Reputation Card */}
          <Card className="bg-[#13131a] border-white/10 p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 h-32 w-32 bg-[#6c47ff]/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="flex items-center justify-between relative z-10">
              <h4 className="text-lg font-bold text-white">Your Reputation</h4>
              <BadgeIcon type="verified" className="shadow-lg shadow-[#00d4aa]/20" />
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                 <p className="text-2xl font-bold text-white">4</p>
                 <p className="text-[10px] text-[#6b7280] uppercase mt-1 tracking-wider font-extrabold">Badges</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center">
                 <p className="text-2xl font-bold text-white">12</p>
                 <p className="text-[10px] text-[#6b7280] uppercase mt-1 tracking-wider font-extrabold">Connections</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-extrabold flex items-center gap-2">
                Referral Progress <span className="ml-auto text-[#f0f0ff]">3 / 10</span>
              </p>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                 <div className="h-full bg-[#6c47ff] w-[30%] shadow-[0_0_15px_#6c47ff40]"></div>
              </div>
              <p className="text-xs text-[#6b7280] italic">Refer 7 more builders for Influencer badge</p>
            </div>
            
            <Button className="w-full h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all group mt-2 relative z-10">
              Share Profile <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-[#13131a] border-white/10 p-6 shadow-2xl">
            <h4 className="text-sm font-extrabold uppercase tracking-widest text-[#6b7280] mb-6 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#ef4444]" />
              Upcoming Deadlines
            </h4>
            <div className="space-y-4">
               {[
                 { title: "Vertex3 Launch", date: "May 10", left: "3 days left", color: "bg-red-500" },
                 { title: "Nitros Hackathon", date: "May 15", left: "8 days left", color: "bg-[#6c47ff]" },
                 { title: "Web3 Summit Reg.", date: "May 25", left: "18 days left", color: "bg-[#00d4aa]" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-pointer">
                    <div className={cn("h-10 w-1 bg-white/5 rounded-full overflow-hidden group-hover:bg-[#6c47ff] transition-colors relative", item.color)}></div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-sm font-bold text-[#f0f0ff] truncate group-hover:text-[#6c47ff] transition-colors">{item.title}</p>
                       <div className="flex items-center justify-between mt-1">
                          <p className="text-[10px] text-[#6b7280] font-medium">{item.date}</p>
                          <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider">{item.left}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          </Card>

          {/* Pro Upgrade Ad */}
          <Card className="bg-[#6c47ff] p-6 shadow-2xl relative overflow-hidden group border-none">
            <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl group-hover:scale-125 transition-transform"></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="h-6 w-6 text-white fill-white shadow-lg" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white">Upgrade to Pro</h4>
                <p className="text-white/80 text-xs mt-1 leading-relaxed">Get the Spotlight badge and 10x more reach.</p>
              </div>
              <Button className="w-full bg-white text-[#6c47ff] hover:bg-white/90 rounded-xl font-bold text-sm shadow-xl mt-2 transition-all">
                Upgrade Now
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
