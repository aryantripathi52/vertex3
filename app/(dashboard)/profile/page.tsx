"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2, Save, X, Edit3,
  Globe, Trophy, ExternalLink, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SkillsSection from "@/components/profile/SkillsSection";
import StatsRow from "@/components/profile/StatsRow";
import BadgeIcon from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";

export default function MyProfilePage() {
  const supabase = createClient();
  const { user: clerkUser, isLoaded } = useUser();

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
    if (!isLoaded || !clerkUser) return;

    async function loadProfile() {
      try {
        // Fetch user from Supabase using Clerk ID
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("clerk_id", clerkUser.id)
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
          .select("*", { count: "exact", head: true })
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
  }, [isLoaded, clerkUser, supabase]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clerk_id: clerkUser.id, ...form })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      setProfile({ ...profile, ...form });
      setExtended({ ...extended, ...form });
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('clerk_id', clerkUser.id);
      formData.append('file', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload avatar');
      }

      const { publicUrl } = await response.json();

      setForm({ ...form, avatar_url: publicUrl });
      if (!editing) {
        setProfile({ ...profile, avatar_url: publicUrl });
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: "error", text: "Avatar upload failed" });
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

  // Loading state - Clerk not ready yet
  if (!isLoaded || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280] animate-pulse">Loading your builder profile...</p>
      </div>
    );
  }

  // User not logged in
  if (!clerkUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-[#6b7280]">Please log in to view your profile.</p>
      </div>
    );
  }

  // User logged in but not found in Supabase yet
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280] animate-pulse">Setting up your profile...</p>
        <p className="text-xs text-[#6b7280]">This may take a moment on first login.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-0">
      {/* Toast Message */}
      {message && (
        <div className={cn(
          "fixed top-24 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl border flex items-center gap-3 animate-in slide-in-from-right",
          message.type === "success"
            ? "bg-green-500/10 border-green-500/20 text-green-400"
            : "bg-red-500/10 border-red-500/20 text-red-400"
        )}>
          {message.type === "success" ? <Save className="h-5 w-5" /> : <X className="h-5 w-5" />}
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
        {/* Left Column */}
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

        {/* Right Column */}
        <div className="space-y-8">
          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <h3 className="text-[#f0f0ff] font-semibold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6c47ff]" />
              Social Links
            </h3>
            <div className="space-y-4">
              {editing ? (
                <>
                  {[
                    { label: "LeetCode Username", key: "leetcode_username", placeholder: "username" },
                    { label: "Codeforces Username", key: "codeforces_username", placeholder: "username" },
                    { label: "LinkedIn URL", key: "linkedin_url", placeholder: "linkedin.com/in/..." },
                    { label: "Portfolio URL", key: "portfolio_url", placeholder: "https://..." },
                    { label: "Twitter URL", key: "twitter_url", placeholder: "twitter.com/..." },
                    { label: "GitHub URL", key: "github_url", placeholder: "github.com/..." },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs text-[#6b7280] uppercase tracking-wider">{label}</label>
                      <Input
                        value={form[key] || ""}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="bg-white/5 border-white/10 text-sm h-10"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <div className="space-y-3">
                  {[
                    { url: extended.linkedin_url, label: "LinkedIn", color: "text-[#0077b5]" },
                    { url: extended.portfolio_url, label: "Portfolio", color: "text-emerald-400" },
                    { url: extended.twitter_url, label: "Twitter", color: "text-sky-400" },
                    { url: profile.github_url, label: "GitHub", color: "text-white" },
                  ].filter(l => l.url).map(({ url, label, color }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Globe className={`h-4 w-4 ${color}`} />
                        <span className="text-sm text-[#f0f0ff]">{label}</span>
                      </div>
                      <ExternalLink className="h-4 w-4 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                  {!extended.linkedin_url && !extended.portfolio_url && !extended.twitter_url && !profile.github_url && (
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