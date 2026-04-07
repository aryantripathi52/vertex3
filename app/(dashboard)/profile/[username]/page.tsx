"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, Share2, MessageSquare, UserPlus, 
  Check, Globe, Trophy, ExternalLink, Mail, 
  Linkedin, Github, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SkillsSection from "@/components/profile/SkillsSection";
import StatsRow from "@/components/profile/StatsRow";
import BadgeIcon from "@/components/badges/BadgeIcon";
import { cn } from "@/lib/utils";

export default function PublicProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [extended, setExtended] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none');
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user: currUser } } = await supabase.auth.getUser();
        setCurrentUser(currUser);

        // Fetch target user by username
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .single();

        if (userError || !userData) {
          setLoading(false);
          return;
        }

        // If viewing own profile, redirect
        if (currUser && userData.id === currUser.id) {
          router.push("/profile");
          return;
        }

        setProfile(userData);

        // Fetch Badges
        const { data: badgesData } = await supabase
          .from("badges")
          .select("*")
          .eq("user_id", userData.id);
        setBadges(badgesData || []);

        // Fetch Extended Profile
        const { data: extendedData } = await supabase
          .from("profiles_extended")
          .select("*")
          .eq("user_id", userData.id)
          .single();
        setExtended(extendedData || {});

        // Fetch Connections Count
        const { count: connCount } = await supabase
          .from("connections")
          .select("*", { count: 'exact', head: true })
          .or(`requester_id.eq.${userData.id},receiver_id.eq.${userData.id}`)
          .eq("status", "accepted");
        setConnectionsCount(connCount || 0);

        // Check connection status with current user
        if (currUser) {
          const { data: connData } = await supabase
            .from("connections")
            .select("status, requester_id")
            .or(`and(requester_id.eq.${currUser.id},receiver_id.eq.${userData.id}),and(requester_id.eq.${userData.id},receiver_id.eq.${currUser.id})`)
            .single();

          if (connData) {
            setConnectionStatus(connData.status as any);
          }
        }
      } catch (error) {
        console.error("Error loading public profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username, supabase, router]);

  const handleConnect = async () => {
    if (!currentUser || !profile || connectionStatus !== 'none') return;
    
    setIsConnecting(true);
    try {
      const { error } = await supabase
        .from("connections")
        .insert({
          requester_id: currentUser.id,
          receiver_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;
      setConnectionStatus('pending');
    } catch (error) {
      console.error("Error connecting:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280] animate-pulse">Loading builder profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <X className="h-10 w-10 text-[#6b7280]" />
        </div>
        <h2 className="text-2xl font-bold text-[#f0f0ff]">Builder Not Found</h2>
        <p className="text-[#6b7280] max-w-md">The builder you're looking for doesn't exist or has moved their profile.</p>
        <Button onClick={() => router.push("/explore")} className="bg-[#6c47ff] hover:bg-[#5535ee]">
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 sm:px-0">
      {/* Profile Header */}
      <div className="relative">
        <ProfileHeader 
          profile={profile}
          badges={badges}
          editing={false}
          form={{}}
          setForm={() => {}}
          onAvatarUpload={() => {}}
          isOwnProfile={false}
        />
        
        {/* Header Actions */}
        <div className="absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6 flex gap-3">
          <Button 
            onClick={handleConnect}
            disabled={connectionStatus !== 'none' || isConnecting}
            className={cn(
              "rounded-xl shadow-lg transition-all",
              connectionStatus === 'accepted' ? "bg-green-500/10 border border-green-500/20 text-green-400 cursor-default" :
              connectionStatus === 'pending' ? "bg-white/5 border border-white/10 text-[#6b7280] cursor-default" :
              "bg-[#6c47ff] hover:bg-[#5535ee] text-white shadow-[#6c47ff]/20"
            )}
          >
            {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 
             connectionStatus === 'accepted' ? <Check className="h-4 w-4 mr-2" /> :
             connectionStatus === 'pending' ? null : <UserPlus className="h-4 w-4 mr-2" />}
            {connectionStatus === 'accepted' ? "Connected" : 
             connectionStatus === 'pending' ? "Pending..." : "Connect"}
          </Button>

          <Button 
            variant="ghost"
            onClick={() => router.push(`/messages?u=${profile.id}`)}
            className="bg-white/5 border border-white/10 text-[#f0f0ff] hover:bg-white/10 rounded-xl"
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Message
          </Button>

          <Button 
            variant="ghost"
            onClick={copyProfileLink}
            className="bg-white/5 border border-white/10 text-[#f0f0ff] hover:bg-white/10 rounded-xl hidden sm:flex"
          >
            <Share2 className="h-4 w-4 mr-2" /> {copied ? "Copied!" : "Share"}
          </Button>
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
              skills={profile.skills}
              roles={profile.roles}
              editing={false}
              onToggleSkill={() => {}}
              onToggleRole={() => {}}
            />
          </Card>

          {/* Past Hackathons & Wins */}
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
        </div>

        {/* Right Column: Links & Badges */}
        <div className="space-y-8">
          <Card className="bg-[#13131a] border-white/10 rounded-2xl p-6">
            <h3 className="text-[#f0f0ff] font-semibold mb-6 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#6c47ff]" />
              Social Links
            </h3>
            
            <div className="space-y-3">
              {extended.linkedin_url && (
                <a href={extended.linkedin_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Linkedin className="h-4 w-4 text-[#0077b5]" />
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
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-white" />
                    <span className="text-sm text-[#f0f0ff]">GitHub</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#6b7280] opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {(!extended.linkedin_url && !extended.portfolio_url && !profile.github_url) && (
                <p className="text-sm text-[#6b7280] text-center py-4">No social links added yet.</p>
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
                    <BadgeIcon type={badge.badge_type} size="md" />
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
                  <p className="text-sm text-[#6b7280]">This builder hasn't earned any badges yet.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Rocket(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.71-2.5.71-2.5s-1.79 0-2.5-.71Z" />
      <path d="M12 10 9 13" />
      <path d="M7 15 4 18" />
      <path d="M13 13.5c2 1 3.5 3.5 3.5 3.5s-2.5 1.5-3.5 3.5c-1 2-1.5 4.5-1.5 4.5s-1.5-2.5-3.5-3.5c-2-1-4.5-1.5-4.5-1.5s2.5-1.5 3.5-3.5c1-2 1.5-4.5 1.5-4.5s1.5 2.5 3.5 3.5Z" />
      <path d="m11.5 7.5 3-3" />
      <path d="m14 10 3-3" />
      <path d="M2 21s.5-3 2-4.5L16.5 4a1 1 0 0 1 1.4 0l2.1 2.1a1 1 0 0 1 0 1.4L7.5 20C6 21.5 3 22 3 22Z" />
    </svg>
  );
}
