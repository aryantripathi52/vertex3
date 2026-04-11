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
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4">
      <ProfileHeader
        profile={profile}
        badges={badges}
        editing={editing}
        form={form}
        setForm={setForm}
        onAvatarUpload={handleAvatarUpload}
      />
    </div>
  );
}