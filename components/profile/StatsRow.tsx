"use client";

import React from "react";
import { Users, Trophy, Rocket, Share2, Code2, Terminal } from "lucide-react";

interface StatsRowProps {
  connectionsCount: number;
  hackathonsCount: number;
  winsCount: number;
  referralCount: number;
  githubScore?: number;
  leetcodeRating?: number;
  codeforcesRating?: number;
}

export default function StatsRow({
  connectionsCount = 0,
  hackathonsCount = 0,
  winsCount = 0,
  referralCount = 0,
  githubScore,
  leetcodeRating,
  codeforcesRating
}: StatsRowProps) {
  const stats = [
    { label: "Connections", value: connectionsCount, icon: Users, color: "text-blue-400" },
    { label: "Hackathons", value: hackathonsCount, icon: Rocket, color: "text-purple-400" },
    { label: "Wins", value: winsCount, icon: Trophy, color: "text-yellow-400" },
    { label: "Referrals", value: referralCount, icon: Share2, color: "text-green-400" },
  ];

  const ratings = [
    { label: "GitHub Score", value: githubScore, icon: Code2, color: "text-white" },
    { label: "LeetCode", value: leetcodeRating, icon: Terminal, color: "text-orange-400" },
    { label: "Codeforces", value: codeforcesRating, icon: Terminal, color: "text-red-400" },
  ].filter(r => r.value !== undefined);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
            <stat.icon className={`h-5 w-5 mb-2 ${stat.color}`} />
            <span className="text-xl font-bold text-[#f0f0ff]">{stat.value}</span>
            <span className="text-[10px] uppercase tracking-wider text-[#6b7280] font-medium">{stat.label}</span>
          </div>
        ))}
      </div>

      {ratings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ratings.map((rating, idx) => (
            <div key={idx} className="bg-[#13131a] border border-white/10 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 ${rating.color}`}>
                  <rating.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-[#6b7280]">{rating.label}</span>
              </div>
              <span className="text-sm font-bold text-[#f0f0ff]">{rating.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
