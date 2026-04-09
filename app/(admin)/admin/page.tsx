"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Users, Trophy, Award, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity,
  Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeHackathons: 0,
    awardedBadges: 0,
    totalTeams: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // In a real app, these would be proper count queries
      // For now we'll simulate some dashboard data
      const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: hackathonCount } = await supabase.from('hackathons').select('*', { count: 'exact', head: true });
      
      setStats({
        totalUsers: userCount || 0,
        activeHackathons: hackathonCount || 0,
        awardedBadges: 842,
        totalTeams: 156
      });
      setLoading(false);
    }
    fetchStats();
  }, [supabase]);

  const chartData = [
    { name: 'Mon', users: 400 },
    { name: 'Tue', users: 600 },
    { name: 'Wed', users: 550 },
    { name: 'Thu', users: 900 },
    { name: 'Fri', users: 1100 },
    { name: 'Sat', users: 1300 },
    { name: 'Sun', users: 1200 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="bg-[#13131a] border-white/10 overflow-hidden group hover:border-[#6c47ff]/50 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <div className={`h-10 w-10 rounded-xl bg-${color}/10 flex items-center justify-center text-${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">{title}</p>
              <h3 className="text-2xl font-black text-[#f0f0ff] mt-1">{loading ? "---" : value}</h3>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold",
            trend > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
          )}>
            {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingUp className="h-3 w-3 rotate-180" />}
            {Math.abs(trend)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-[#f0f0ff] tracking-tight">System Overview</h1>
        <p className="text-[#6b7280] font-medium">Real-time platform metrics and user growth tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Builders" value={stats.totalUsers.toLocaleString()} icon={Users} trend={12.5} color="[#6c47ff]" />
        <StatCard title="Live Hackathons" value={stats.activeHackathons} icon={Trophy} trend={8.2} color="emerald-400" />
        <StatCard title="Badges Issued" value={stats.awardedBadges} icon={Award} trend={24.1} color="amber-400" />
        <StatCard title="Active Teams" value={stats.totalTeams} icon={Activity} trend={-2.4} color="sky-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#13131a] border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">User Growth (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c47ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6c47ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#13131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#f0f0ff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#6c47ff" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#13131a] border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent System Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {[
                { event: "New User Registered", time: "2 mins ago", icon: Users, color: "text-[#6c47ff]" },
                { event: "Hackathon Created: Meta-Build 24", time: "1 hour ago", icon: Trophy, color: "text-emerald-400" },
                { event: "Subscription Payment Failed", time: "3 hours ago", icon: AlertCircle, color: "text-red-400" },
                { event: "Elite Badge Awarded (@aryan)", time: "5 hours ago", icon: CheckCircle2, color: "text-purple-400" },
                { event: "New Server Deployment", time: "12 hours ago", icon: Clock, color: "text-sky-400" },
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className={cn("p-2 rounded-lg bg-white/5", log.color)}>
                    <log.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#f0f0ff] truncate mb-0.5">{log.event}</p>
                    <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">{log.time}</p>
                  </div>
                  <ArrowUpRight className="h-3 w-3 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
            <button className="w-full py-4 text-xs font-bold text-[#6c47ff] hover:bg-[#6c47ff]/10 transition-colors uppercase tracking-widest border-t border-white/5">
              View Full Audit Trail
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Minimal cn implementation to ensure it works without external dependencies if needed
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
