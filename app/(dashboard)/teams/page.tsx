"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Users, Trophy, Loader2, Search, 
  ChevronRight, Lightbulb, Target, X, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import TeamCard from "@/components/cards/TeamCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const SKILLS_OPTIONS = [
  "React", "Python", "ML", "UI/UX", "Blockchain", "Node.js", 
  "Flutter", "Go", "Rust", "DevOps", "Data Science", "Android", "iOS"
];

export default function TeamsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [joinedTeams, setJoinedTeams] = useState<any[]>([]);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    idea: "",
    hackathon_id: "none",
    max_members: 4,
    required_skills: [] as string[],
    is_open: true
  });

  useEffect(() => {
    fetchTeams();
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    const { data } = await supabase
      .from("hackathons")
      .select("id, title")
      .order("title");
    setHackathons(data || []);
  };

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Teams created by me
      const { data: created } = await supabase
        .from("teams")
        .select(`
          *,
          hackathons (title),
          team_members (user_id, status, users (id, avatar_url, full_name))
        `)
        .eq("created_by", user.id);

      // Teams joined by me
      const { data: joined } = await supabase
        .from("team_members")
        .select(`
          team_id,
          teams (
            *,
            hackathons (title),
            team_members (user_id, status, users (id, avatar_url, full_name))
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "accepted")
        .neq("teams.created_by", user.id);

      const transformTeam = (t: any) => ({
        ...t,
        hackathon_title: t.hackathons?.title,
        members: t.team_members?.filter((m: any) => m.status === 'accepted').map((m: any) => m.users) || []
      });

      setMyTeams(created?.map(transformTeam) || []);
      setJoinedTeams(joined?.map((j: any) => transformTeam(j.teams)).filter(Boolean) || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!formData.name || !formData.idea) return;
    
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Insert team
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: formData.name,
          idea: formData.idea,
          hackathon_id: formData.hackathon_id === "none" ? null : formData.hackathon_id,
          max_members: formData.max_members,
          required_skills: formData.required_skills,
          is_open: formData.is_open,
          created_by: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Insert creator as leader
      await supabase
        .from("team_members")
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'leader',
          status: 'accepted'
        });

      setIsCreateModalOpen(false);
      setFormData({
        name: "",
        idea: "",
        hackathon_id: "none",
        max_members: 4,
        required_skills: [],
        is_open: true
      });
      fetchTeams();
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setCreating(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#f0f0ff] mb-2">My Teams</h1>
          <p className="text-[#6b7280]">Manage your squads and pending applications.</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl shadow-lg shadow-[#6c47ff]/20 px-6">
              <Plus className="h-5 w-5 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#13131a] border-white/10 text-[#f0f0ff] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create New Team</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest text-[#6b7280] font-bold">Team Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. The Debuggers" 
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idea" className="text-xs uppercase tracking-widest text-[#6b7280] font-bold">Idea / Project Description</Label>
                <Textarea 
                  id="idea" 
                  value={formData.idea}
                  onChange={e => setFormData({...formData, idea: e.target.value})}
                  placeholder="What are you building? Keep it brief but exciting!" 
                  className="bg-white/5 border-white/10 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-[#6b7280] font-bold">Target Hackathon</Label>
                  <Select 
                    value={formData.hackathon_id} 
                    onValueChange={val => setFormData({...formData, hackathon_id: val})}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10">
                      <SelectValue placeholder="Select Hackathon" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#13131a] border-white/10 text-[#f0f0ff]">
                      <SelectItem value="none">General / No Specific Hackathon</SelectItem>
                      {hackathons.map(h => (
                        <SelectItem key={h.id} value={h.id}>{h.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-[#6b7280] font-bold">Max Members ({formData.max_members})</Label>
                  <Input 
                    type="range" 
                    min="2" 
                    max="10" 
                    value={formData.max_members}
                    onChange={e => setFormData({...formData, max_members: parseInt(e.target.value)})}
                    className="h-2 bg-white/5 accent-[#6c47ff]"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs uppercase tracking-widest text-[#6b7280] font-bold">Required Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map(skill => (
                    <Badge
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl cursor-pointer transition-all border",
                        formData.required_skills.includes(skill)
                          ? "bg-[#6c47ff]/20 text-[#6c47ff] border-[#6c47ff]/40 shadow-[0_0_15px_rgba(108,71,255,0.1)]"
                          : "bg-white/5 text-[#6b7280] border-white/10 hover:border-white/20"
                      )}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Open for Applications</p>
                  <p className="text-xs text-[#6b7280]">Allow other builders to find and apply to your team.</p>
                </div>
                <button 
                  onClick={() => setFormData({...formData, is_open: !formData.is_open})}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    formData.is_open ? "bg-[#6c47ff]" : "bg-white/10"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    formData.is_open ? "left-7" : "left-1"
                  )} />
                </button>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleCreateTeam} 
                disabled={creating || !formData.name || !formData.idea}
                className="w-full bg-[#6c47ff] hover:bg-[#5535ee] text-white py-6 rounded-xl font-bold"
              >
                {creating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
                Create Team Squad
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="created" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl mb-8">
          <TabsTrigger value="created" className="rounded-xl px-8 py-2 data-[state=active]:bg-[#6c47ff] data-[state=active]:text-white">
            Created by Me ({myTeams.length})
          </TabsTrigger>
          <TabsTrigger value="joined" className="rounded-xl px-8 py-2 data-[state=active]:bg-[#6c47ff] data-[state=active]:text-white">
            Joined Teams ({joinedTeams.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="created">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-[#13131a] border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : myTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTeams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#13131a] border border-white/10 rounded-3xl">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Users className="h-10 w-10 text-[#6b7280]" />
              </div>
              <h3 className="text-xl font-bold text-[#f0f0ff]">No teams created yet</h3>
              <p className="text-[#6b7280] max-w-xs mx-auto mb-6">Start a new project and invite builders to join your squad.</p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                variant="ghost" 
                className="text-[#6c47ff] hover:bg-[#6c47ff]/10"
              >
                Create your first team
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="joined">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 bg-[#13131a] border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : joinedTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedTeams.map(team => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#13131a] border border-white/10 rounded-3xl">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Target className="h-10 w-10 text-[#6b7280]" />
              </div>
              <h3 className="text-xl font-bold text-[#f0f0ff]">No joined teams</h3>
              <p className="text-[#6b7280] max-w-xs mx-auto mb-6">You haven't joined any teams yet. Browse hackathons or builders to find a squad.</p>
              <Button 
                onClick={() => router.push("/explore")}
                variant="ghost" 
                className="text-[#6c47ff] hover:bg-[#6c47ff]/10"
              >
                Find builders to team up
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
