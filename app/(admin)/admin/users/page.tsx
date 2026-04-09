"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Users, Search, Shield, Award, 
  MapPin, GraduationCap, CheckCircle2, 
  XCircle, MoreHorizontal, UserCheck,
  Zap, Crown, Filter, Loader2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function AdminUsers() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    
    setUsers(data || []);
    setLoading(false);
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.college?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierIcon = (plan: string) => {
    if (plan === "pro") return <Zap className="h-3 w-3 text-[#6c47ff] fill-[#6c47ff]/20" />;
    if (plan === "elite") return <Crown className="h-3 w-3 text-purple-400 fill-purple-400/20" />;
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f0f0ff] tracking-tight">User Management</h1>
          <p className="text-[#6b7280] font-medium">Moderate builders, verify profiles, and manage permissions.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="border-white/10 bg-white/5 text-[#f0f0ff] hover:bg-white/10 h-11 rounded-xl">
             <Filter className="mr-2 h-4 w-4" /> Export CSV
           </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
          <Input 
            placeholder="Search by name, @username, email, or college..." 
            className="pl-12 h-14 bg-[#13131a] border-white/10 rounded-2xl text-lg focus:ring-2 focus:ring-[#6c47ff]/20 transition-all font-medium"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 w-14 border-white/10 bg-[#13131a] rounded-2xl hover:bg-white/5">
          <Filter className="h-6 w-6 text-[#6b7280]" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#13131a] rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-[#6b7280]">
                    <th className="px-6 py-4">Builder Profile</th>
                    <th className="px-6 py-4">Reputation</th>
                    <th className="px-6 py-4">Tier / Status</th>
                    <th className="px-6 py-4">College & Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-transparent group-hover:ring-[#6c47ff]/20 transition-all">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback className="bg-[#6c47ff]/10 text-[#6c47ff] font-bold">
                              {user.full_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-bold text-[#f0f0ff] truncate">{user.full_name || "New Builder"}</p>
                            <p className="text-xs text-[#6b7280] truncate font-medium">@{user.username || "unset"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.skills?.slice(0, 2).map((skill: string) => (
                            <Badge key={skill} variant="outline" className="bg-white/5 border-white/10 text-[10px] py-0 px-2 h-5 lowercase font-bold">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills?.length > 2 && <span className="text-[10px] text-[#6b7280] font-bold">+{user.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "h-6 px-2 text-[10px] font-black uppercase border-none gap-1",
                            user.plan === "elite" ? "bg-purple-500/10 text-purple-400" : 
                            user.plan === "pro" ? "bg-[#6c47ff]/10 text-[#6c47ff]" : 
                            "bg-white/5 text-[#6b7280]"
                          )}>
                            {getTierIcon(user.plan)}
                            {user.plan || "Free"}
                          </Badge>
                          {user.is_onboarded ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#00d4aa]" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-0.5 min-w-[150px]">
                          <div className="flex items-center gap-1 text-xs font-bold text-[#f0f0ff] truncate">
                            <GraduationCap className="h-3 w-3 text-[#6b7280]" />
                            {user.college || "N/A"}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#6b7280] uppercase tracking-widest">
                            <MapPin className="h-2.5 w-2.5" />
                            {user.city}, {user.state}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-lg">
                              <MoreHorizontal className="h-5 w-5 text-[#6b7280]" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#13131a] border-white/10 text-[#f0f0ff]">
                            <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2">
                              <UserCheck className="mr-2 h-4 w-4 text-[#00d4aa]" /> Verify Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2">
                              <Award className="mr-2 h-4 w-4 text-amber-400" /> Issue Custom Badge
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/5 focus:bg-white/5 cursor-pointer py-2 text-red-400">
                              <Shield className="mr-2 h-4 w-4" /> Suspend Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="p-20 text-center">
                <Users className="h-12 w-12 text-white/5 mx-auto mb-4" />
                <p className="text-[#6b7280] font-bold">No builders found matching your search.</p>
              </div>
            )}
            <div className="p-4 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs font-bold text-[#6b7280] uppercase tracking-widest">Showing {filteredUsers.length} active builders</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 border-white/10 bg-white/5 text-[10px] font-bold uppercase rounded-lg">Prev</Button>
                <Button variant="outline" size="sm" className="h-8 px-3 border-[#6c47ff]/30 bg-[#6c47ff]/10 text-[10px] font-bold text-[#6c47ff] uppercase rounded-lg">Next</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
