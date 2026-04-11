"use client";

import React from "react";
import { Camera, Github, GraduationCap, MapPin, ExternalLink, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BadgeIcon, { BadgeType } from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: any;
  badges: any[];
  editing: boolean;
  form: any;
  setForm: (form: any) => void;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isOwnProfile?: boolean;
}

export default function ProfileHeader({
  profile,
  badges,
  editing,
  form,
  setForm,
  onAvatarUpload,
  isOwnProfile = true
}: ProfileHeaderProps) {
  return (
    <div className="bg-[#13131a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Cover Banner */}
      <div className="h-32 sm:h-40 bg-gradient-to-r from-[#6c47ff]/40 via-[#13131a] to-[#a855f7]/30 relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#6c47ff 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
      </div>

      <div className="px-6 pb-6 -mt-12 sm:-mt-16 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-[#13131a] ring-2 ring-white/10 shadow-xl">
                <AvatarImage src={editing ? form.avatar_url : profile.avatar_url} />
                <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] text-3xl font-bold">
                  {profile.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              {editing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={onAvatarUpload} />
                </label>
              )}

              {/* Badges Overlay */}
              <div className="absolute -bottom-1 -right-1 flex -space-x-2">
                {(badges || []).slice(0, 3).map((badge, idx) => (
                  <div key={idx} className="bg-[#13131a] rounded-full p-0.5">
                    {badge?.badge_type && (
                      <BadgeIcon type={badge.badge_type as BadgeType} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Name & Username */}
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2">
                {editing ? (
                  <Input
                    value={form.full_name || ""}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    className="h-9 text-xl font-bold bg-white/5 border-white/10 text-[#f0f0ff] w-48 sm:w-64"
                    placeholder="Full Name"
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#f0f0ff] tracking-tight">
                    {profile.full_name}
                  </h1>
                )}
                
                {profile.subscription_tier && profile.subscription_tier !== 'free' && (
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    profile.subscription_tier === 'elite' ? "bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/30" : "bg-[#6c47ff]/20 text-[#6c47ff] border border-[#6c47ff]/30"
                  )}>
                    {profile.subscription_tier}
                  </span>
                )}
              </div>
              <p className="text-[#6b7280] font-medium">@{profile.username}</p>
            </div>
          </div>

          {/* Socials / Action Buttons handled by parent */}
        </div>

        {/* Info Row */}
        <div className="mt-6 flex flex-wrap gap-y-3 gap-x-6">
          <div className="flex items-center gap-2 text-[#6b7280]">
            <GraduationCap className="h-4 w-4" />
            {editing ? (
              <Input
                value={form.college || ""}
                onChange={(e) => setForm({ ...form, college: e.target.value })}
                className="h-7 text-xs bg-white/5 border-white/10 text-[#f0f0ff] w-40"
                placeholder="College"
              />
            ) : (
              <span className="text-sm">{profile.college || "No college set"}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[#6b7280]">
            <MapPin className="h-4 w-4" />
            {editing ? (
              <div className="flex gap-2">
                <Input
                  value={form.city || ""}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-7 text-xs bg-white/5 border-white/10 text-[#f0f0ff] w-24"
                  placeholder="City"
                />
                <Input
                  value={form.state || ""}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="h-7 text-xs bg-white/5 border-white/10 text-[#f0f0ff] w-24"
                  placeholder="State"
                />
              </div>
            ) : (
              <span className="text-sm">{profile.city}{profile.state ? `, ${profile.state}` : ""}</span>
            )}
          </div>

          {!editing && profile.github_url && (
            <a 
              href={profile.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#6c47ff] hover:text-[#5535ee] transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm font-medium">GitHub</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {/* Bio */}
        <div className="mt-4 max-w-2xl">
          {editing ? (
            <textarea
              value={form.bio || ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-[#f0f0ff] focus:ring-2 focus:ring-[#6c47ff] outline-none min-h-[80px] resize-none"
              placeholder="Tell us about yourself, your goals, and what you're looking for in a teammate..."
            />
          ) : (
            <p className="text-[#6b7280] text-sm leading-relaxed italic">
              {profile.bio || "No bio added yet."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
