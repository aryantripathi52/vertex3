"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Users, Trophy, Loader2, ArrowLeft, 
  MessageSquare, UserPlus, Check, X, 
  Settings, LogOut, ExternalLink, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TeamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const fetchTeamData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      const { data: teamData, error } = await supabase
        .from("teams")
        .select(`
          *,
          hackathons (*)
        `)
        .eq("id", id)
        .single();

      if (error || !teamData) {
        setLoading(false);
        return;
      }

      setTeam(teamData);
      setIsCreator(user?.id === teamData.created_by);

      const { data: membersData } = await supabase
        .from("team_members")
        .select(`
          *,
          users (*)
        `)
        .eq("team_id", id);

      if (membersData) {
        const accepted = membersData.filter(m => m.status === 'accepted');
        const pending = membersData.filter(m => m.status === 'pending');
        setMembers(accepted);
        setPendingMembers(pending);
        
        setIsMember(accepted.some(m => m.user_id === user?.id));
        setIsPending(pending.some(m => m.user_id === user?.id));
      }
    } catch (error) {
      console.error("Error fetching team details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!currentUser || isMember || isPending) return;
    setActionLoading(true);
    try {
      await supabase.from("team_members").insert({
        team_id: id,
        user_id: currentUser.id,
        status: 'pending'
      });
      setIsPending(true);
    } catch (error) {
      console.error("Error applying:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!currentUser || isCreator || !isMember) return;
    setActionLoading(true);
    try {
      await supabase
        .from("team_members")
        .delete()
        .eq("team_id", id)
        .eq("user_id", currentUser.id);
      setIsMember(false);
      fetchTeamData();
    } catch (error) {
      console.error("Error leaving team:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMemberAction = async (userId: string, status: 'accepted' | 'rejected') => {
    if (!isCreator) return;
    setActionLoading(true);
    try {
      if (status === 'accepted') {
        await supabase
          .from("team_members")
          .update({ status: 'accepted' })
          .eq("team_id", id)
          .eq("user_id", userId);
      } else {
        await supabase
          .from("team_members")
          .delete()
          .eq("team_id", id)
          .eq("user_id", userId);
      }
      fetchTeamData();
    } catch (error) {
      console.error("Error updating member status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280]">Loading team details...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold text-[#f0f0ff]">Team not found</h2>
        <Button onClick={() => router.push("/teams")}>Back to Teams</Button>
      </div>
    );
  }

  const openSlots = team.max_members - members.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-0">
      {/* Header Section */}
      <div className="space-y-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6b7280] hover:text-[#f0f0ff] transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-[#f0f0ff]">{team.name}</h1>
              <Badge className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                team.is_open ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
              )}>
                {team.is_open ? "Open for Applications" : "Closed"}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-[#6b7280]">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">{members.length} / {team.max_members} Members</span>
              </div>
              {team.hackathons && (
                <Link 
                  href={`/hackathons`} 
                  className="flex items-center gap-2 text-[#6c47ff] hover:underline"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">{team.hackathons.title}</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isCreator ? (
              <>
                <Button variant="ghost" className="bg-white/5 border border-white/10 text-[#f0f0ff] rounded-xl px-6 h-11">
                  <Settings className="h-4 w-4 mr-2" /> Team Settings
                </Button>
              </>
            ) : isMember ? (
              <Button 
                variant="ghost" 
                onClick={handleLeave}
                disabled={actionLoading}
                className="bg-red-500/5 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl px-6 h-11"
              >
                <LogOut className="h-4 w-4 mr-2" /> Leave Team
              </Button>
            ) : (
              <Button 
                onClick={handleApply}
                disabled={!team.is_open || isPending || actionLoading}
                className={cn(
                  "rounded-xl px-8 h-11 shadow-lg shadow-[#6c47ff]/20",
                  isPending ? "bg-white/5 text-[#6b7280]" : "bg-[#6c47ff] hover:bg-[#5535ee] text-white"
                )}
              >
                {isPending ? "Application Pending" : "Apply to Join Squad"}
                {!isPending && <UserPlus className="h-4 w-4 ml-2" />}
              </Button>
            )}
            
            {!isCreator && isMember && (
              <Button className="bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl px-6 h-11">
                <MessageSquare className="h-4 w-4 mr-2" /> Group Chat
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <Card className="bg-[#13131a] border-white/10 p-8 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-[#f0f0ff]">The Vision</h3>
            <p className="text-[#6b7280] leading-relaxed whitespace-pre-wrap">{team.idea}</p>
          </Card>

          {/* Members List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#f0f0ff] px-1 flex items-center justify-between">
              Squad Members
              <span className="text-xs font-medium text-[#6b7280] uppercase tracking-widest">{members.length} Active</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((m) => (
                <Card key={m.id} className="bg-[#13131a] border-white/10 p-4 rounded-2xl flex items-center justify-between group hover:border-[#6c47ff]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-white/10">
                      <AvatarImage src={m.users.avatar_url} />
                      <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] font-bold">
                        {m.users.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-bold text-[#f0f0ff] flex items-center gap-2">
                        {m.users.full_name}
                        {m.role === 'leader' && <Shield className="h-3 w-3 text-yellow-500" />}
                      </p>
                      <p className="text-xs text-[#6b7280]">@{m.users.username}</p>
                    </div>
                  </div>
                  <Link href={`/profile/${m.users.username}`}>
                    <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#6c47ff]">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              ))}
              
              {[...Array(openSlots)].map((_, i) => (
                <div key={i} className="border border-dashed border-white/10 rounded-2xl p-4 flex items-center justify-center bg-white/[0.02]">
                  <p className="text-xs text-[#6b7280] font-medium uppercase tracking-widest">Open Slot</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications (Admin only) */}
          {isCreator && pendingMembers.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-lg font-bold text-[#f0f0ff] px-1 flex items-center justify-between">
                Pending Applications
                <span className="text-xs font-medium text-yellow-500 uppercase tracking-widest">{pendingMembers.length} Requesting</span>
              </h3>
              <div className="space-y-3">
                {pendingMembers.map((m) => (
                  <Card key={m.id} className="bg-[#13131a] border-yellow-500/20 p-4 rounded-2xl flex items-center justify-between animate-pulse-slow">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarImage src={m.users.avatar_url} />
                        <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] font-bold">
                          {m.users.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-[#f0f0ff]">{m.users.full_name}</p>
                        <p className="text-xs text-[#6b7280]">@{m.users.username} wants to join</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleMemberAction(m.user_id, 'accepted')}
                        disabled={actionLoading}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-9 px-4"
                      >
                        <Check className="h-4 w-4 mr-2" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleMemberAction(m.user_id, 'rejected')}
                        disabled={actionLoading}
                        className="text-red-400 hover:bg-red-500/10 rounded-xl h-9 px-4"
                      >
                        <X className="h-4 w-4 mr-2" /> Reject
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="bg-[#13131a] border-white/10 p-6 rounded-3xl">
            <h3 className="text-sm font-bold text-[#f0f0ff] uppercase tracking-widest mb-6 border-b border-white/5 pb-3">Requirements</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Skills Needed</p>
                <div className="flex flex-wrap gap-2">
                  {team.required_skills?.map((skill: string) => (
                    <Badge key={skill} className="bg-white/5 border-white/10 text-[#f0f0ff] px-3 py-1.5 rounded-xl text-xs font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Team Composition</p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6b7280]">Capacity</span>
                    <span className="text-[#f0f0ff] font-bold">{members.length} / {team.max_members}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#6c47ff] transition-all" 
                      style={{ width: `${(members.length / team.max_members) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {team.hackathons && (
            <Card className="bg-[#13131a] border-white/10 p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-bold text-[#f0f0ff] uppercase tracking-widest border-b border-white/5 pb-3">Target Hackathon</h3>
              <div className="space-y-2">
                <p className="text-lg font-bold text-[#f0f0ff]">{team.hackathons.title}</p>
                <p className="text-sm text-[#6b7280]">by {team.hackathons.organizer}</p>
              </div>
              <Link href={`/hackathons`}>
                <Button variant="ghost" className="w-full justify-between text-[#6c47ff] hover:bg-[#6c47ff]/10 rounded-xl px-4 mt-2">
                  View Event Details
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
