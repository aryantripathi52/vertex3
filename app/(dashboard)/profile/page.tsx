"use client";

import React, { useState, useEffect } from "react";
import { 
  Loader2, Save, X, Edit3, Share2, Code, Rocket,
  Globe, Trophy, ExternalLink, Mail, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SkillsSection from "@/components/profile/SkillsSection";
import StatsRow from "@/components/profile/StatsRow";
import BadgeIcon from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";

export default function MyProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [extended, setExtended] = useState<any>({});
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [form, setForm] = useState<any>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch User Data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", user.id)
          .single();

        if (!userData) {
          console.error("User not found in Supabase:", userError);
          setLoading(false);
          return;
        }

        const supabaseUserId = userData.id;

        // Fetch Badges
        const { data: badgesData } = await supabase
          .from("badges")
          .select("*")
          .eq("user_id", supabaseUserId);

        // Fetch Extended Profile
        const { data: extendedData } = await supabase
          .from("profiles_extended")
          .select("*")
          .eq("user_id", supabaseUserId)
          .single();

        // Fetch Connections Count
        const { count: connCount } = await supabase
          .from("connections")
          .select("*", { count: 'exact', head: true })
          .or(`requester_id.eq.${supabaseUserId},receiver_id.eq.${supabaseUserId}`)
          .eq("status", "accepted");

        setProfile(userData);
        setBadges(badgesData || []);
        setExtended(extendedData || {});
        setConnectionsCount(connCount || 0);
        setForm({
          ...userData,
          leetcode_username: extendedData?.leetcode_username || "",
          codeforces_username: extendedData?.codeforces_username || "",
          linkedin_url: extendedData?.linkedin_url || "",
          twitter_url: extendedData?.twitter_url || "",
          portfolio_url: extendedData?.portfolio_url || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    try {
      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: form.full_name,
          username: form.username,
          bio: form.bio,
          college: form.college,
          city: form.city,
          state: form.state,
          github_url: form.github_url,
          skills: form.skills,
          roles: form.roles,
        })
        .eq("id", profile.id);

      if (userError) throw userError;

      // Update profiles_extended table
      const { error: extendedError } = await supabase
        .from("profiles_extended")
        .upsert({
          user_id: profile.id,
          leetcode_username: form.leetcode_username,
          codeforces_username: form.codeforces_username,
          linkedin_url: form.linkedin_url,
          twitter_url: form.twitter_url,
          portfolio_url: form.portfolio_url,
        });

      if (extendedError) throw extendedError;

      setProfile({ ...profile, ...form });
      setExtended({ ...extended, ...form });
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setForm({ ...form, avatar_url: publicUrl });
      // Update immediately if not in full edit mode, or just wait for save
      if (!editing) {
        await supabase.from("users").update({ avatar_url: publicUrl }).eq("id", profile.id);
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: 'error', text: 'Avatar upload failed' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = form.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s: string) => s !== skill)
      : [...currentSkills, skill];
    setForm({ ...form, skills: newSkills });
  };

  const toggleRole = (role: string) => {
    const currentRoles = form.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r: string) => r !== role)
      : [...currentRoles, role];
    setForm({ ...form, roles: newRoles });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280] animate-pulse">Loading your builder profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-0">
      {/* Toast Message */}
      {message && (
        <div className={cn(
          "fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right",
          message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {message.type === 'success' ? <Save className="h-5 w-5" /> : <X className="h-5 w-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Profile Header */}
      <div className="relative">
        <ProfileHeader 
          profile={profile}
          badges={badges}
          editing={editing}
          form={form}
          setForm={setForm}
          onAvatarUpload={handleAvatarUpload}
        />
        
        {/* Header Actions */}
        <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6 flex gap-3">
          {editing ? (
            <>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl shadow-lg shadow-[#6c47ff]/20"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { setEditing(false); setForm({ ...profile, ...extended }); }}
                className="bg-white/5 border border-white/10 text-[#f0f0ff] hover:bg-white/10 rounded-xl"
              >
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setEditing(true)}
              className="bg-white/5 border border-white/10 text-[#f0f0ff] hover:bg-white/10 rounded-xl"
            >
              <Edit3 className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Skills */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <StatsRow 
              connectionsCount={connectionsCount}
              hackathonsCount={extended.past_hackathons?.length || 0}
              winsCount={extended.past_wins?.length || 0}
              referralCount={extended.referral_count || 0}
              githubScore={extended.github_score}
              leetcodeRating={extended.leetcode_rating}
              codeforcesRating={extended.codeforces_rating}
            />
          </Card>

          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <SkillsSection 
              skills={form.skills}
              roles={form.roles}
              editing={editing}
              onToggleSkill={toggleSkill}
              onToggleRole={toggleRole}
            />
          </Card>

          {/* Past Hackathons & Wins */}
          {!editing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
                <h3 className="text-[#f0f0ff] font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-400" />
                  Past Hackathons
                </h3>
                <div className="space-y-3">
                  {extended.past_hackathons?.length > 0 ? (
                    extended.past_hackathons.map((h: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        <span className="text-sm text-[#f0f0ff]">{h}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6b7280]">No hackathons listed yet.</p>
                  )}
                </div>
              </Card>

              <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
                <h3 className="text-[#f0f0ff] font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Past Wins
                </h3>
                <div className="space-y-3">
                  {extended.past_wins?.length > 0 ? (
                    extended.past_wins.map((w: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Trophy className="h-3 w-3 text-yellow-400" />
                        <span className="text-sm text-[#f0f0ff]">{w}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-[#6b7280]">No wins listed yet.</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Links & Badges */}
        <div className="space-y-8">
          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <h3 className="text-[#f0f0ff] font-semibold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6c47ff]" />
              Social Links
            </h3>
            
            <div className="space-y-4">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs text-[#6b7280] uppercase tracking-wider">LeetCode Username</label>
                    <Input 
                      value={form.leetcode_username} 
                      onChange={(e) => setForm({...form, leetcode_username: e.target.value})}
                      className="bg-white/5 border-white/10 text-sm h-10"
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#6b7280] uppercase tracking-wider">Codeforces Username</label>
                    <Input 
                      value={form.codeforces_username} 
                      onChange={(e) => setForm({...form, codeforces_username: e.target.value})}
                      className="bg-white/5 border-white/10 text-sm h-10"
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#6b7280] uppercase tracking-wider">LinkedIn URL</label>
                    <Input 
                      value={form.linkedin_url} 
                      onChange={(e) => setForm({...form, linkedin_url: e.target.value})}
                      className="bg-white/5 border-white/10 text-sm h-10"
                      placeholder="linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-[#6b7280] uppercase tracking-wider">Portfolio URL</label>
                    <Input 
                      value={form.portfolio_url} 
                      onChange={(e) => setForm({...form, portfolio_url: e.target.value})}
                      className="bg-white/5 border-white/10 text-sm h-10"
                      placeholder="https://..."
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {extended.linkedin_url && (
                    <a href={extended.linkedin_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-[#0077b5]" />
                        <span className="text-sm text-[#f0f0ff]">LinkedIn</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {extended.portfolio_url && (
                    <a href={extended.portfolio_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm text-[#f0f0ff]">Portfolio</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  )}
                  {(!extended.linkedin_url && !extended.portfolio_url) && (
                    <p className="text-sm text-[#6b7280] text-center py-4">No social links added yet.</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <h3 className="text-[#f0f0ff] font-semibold mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Achievements
            </h3>
            
            <div className="space-y-4">
              {badges.length > 0 ? (
                badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                    <BadgeIcon type={badge.badge_type} className="p-2" />
                    <div>
                      <p className="text-sm font-semibold text-[#f0f0ff] capitalize">{badge.badge_type}</p>
                      <p className="text-[10px] text-[#6b7280] uppercase tracking-wider">
                        Earned {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/5 text-[#6b7280]">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-[#6b7280]">Keep building to earn badges!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
