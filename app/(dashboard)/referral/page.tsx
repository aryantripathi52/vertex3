"use client";

import React, { useState, useEffect } from "react";
import { 
  Share2, Copy, CheckCheck, Users, Gift, Twitter, 
  Linkedin, MessageCircle, Loader2, ArrowRight, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TARGET = 10;

export default function ReferralPage() {
  const supabase = createClient();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<any[]>([]);
  const [count, setCount] = useState(0);
  const [hasBadge, setHasBadge] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch user's referral code
        const { data: userData } = await supabase
          .from("users")
          .select("referral_code")
          .eq("id", user.id)
          .single();
        
        if (userData?.referral_code) {
          setReferralCode(userData.referral_code);

          // Fetch users who signed up using this code
          const { data: referredUsers } = await supabase
            .from("users")
            .select("id, full_name, username, avatar_url, created_at")
            .eq("referred_by", userData.referral_code)
            .order("created_at", { ascending: false });
          
          setReferrals(referredUsers || []);
          setCount(referredUsers?.length || 0);

          // Check if user already has Influencer badge
          const { data: badgeData } = await supabase
            .from("badges")
            .select("id")
            .eq("user_id", user.id)
            .eq("badge_type", "influencer")
            .single();
          
          setHasBadge(!!badgeData);
        }
      } catch (error) {
        console.error("Error loading referral data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [supabase]);

  const referralLink = `https://vertex3.in/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimBadge = async () => {
    if (count < TARGET || hasBadge || claiming) return;
    
    setClaiming(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("badges")
        .insert({
          user_id: user.id,
          badge_type: "influencer",
          earned_at: new Date().toISOString()
        });

      if (error) throw error;
      setHasBadge(true);
    } catch (error) {
      console.error("Error claiming badge:", error);
    } finally {
      setClaiming(false);
    }
  };

  const shareText = encodeURIComponent(`Join me on Vertex3 — India's largest hackathon builder network! Use my referral link to sign up: ${referralLink}`);

  const progress = Math.min((count / TARGET) * 100, 100);
  const remaining = Math.max(TARGET - count, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280]">Loading referral status...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#f0f0ff] flex items-center gap-3">
          <Gift className="h-8 w-8 text-[#6c47ff]" />
          Referral Program
        </h1>
        <p className="text-[#6b7280]">Help us grow the community and earn exclusive badges.</p>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-br from-[#6c47ff]/10 via-[#13131a] to-[#a855f7]/5 border-white/10 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 right-0 h-40 w-40 bg-[#6c47ff]/5 rounded-full -translate-y-20 translate-x-20 blur-3xl" />
        <CardContent className="p-8 relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Your Progress</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-[#f0f0ff]">{count}</span>
                <span className="text-xl text-[#6b7280]">/ {TARGET} Referrals</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className={cn(
                "h-14 w-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-500",
                count >= TARGET ? "bg-amber-400/20 text-amber-400 shadow-amber-400/20" : "bg-white/5 text-[#6b7280] grayscale"
              )}>
                🔥
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#f0f0ff]">Influencer Badge</p>
                {hasBadge ? (
                  <p className="text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCheck className="h-3 w-3" /> Already Claimed
                  </p>
                ) : count >= TARGET ? (
                  <Button 
                    size="sm" 
                    onClick={handleClaimBadge}
                    disabled={claiming}
                    className="h-7 bg-amber-400 hover:bg-amber-500 text-black text-[10px] font-bold px-3 rounded-lg"
                  >
                    {claiming ? <Loader2 className="h-3 w-3 animate-spin" /> : "CLAIM BADGE"}
                  </Button>
                ) : (
                  <p className="text-xs text-[#6b7280]">{remaining} more builders needed</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-[#6c47ff] to-[#a855f7] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-[#6b7280] font-medium italic">
              "Invite builders you've worked with to help them find great teammates!"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sharing Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-[#13131a] border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-[#f0f0ff] uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-[#6c47ff]" />
            Your Referral Link
          </h3>
          <div className="space-y-4">
            <div className="relative group">
              <Input 
                value={referralLink}
                readOnly
                className="bg-white/5 border-white/10 text-xs h-12 pr-12 focus:ring-[#6c47ff] cursor-default"
              />
              <Button 
                onClick={copyToClipboard}
                size="icon"
                variant="ghost"
                className="absolute right-1.5 top-1.5 h-9 w-9 text-[#6b7280] hover:text-[#f0f0ff] hover:bg-white/5 rounded-xl"
              >
                {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={`https://wa.me/?text=${shareText}`} 
                target="_blank"
                className="flex-1 h-12 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center hover:bg-[#25D366]/20 transition-all group"
              >
                <MessageCircle className="h-5 w-5 text-[#25D366] group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                target="_blank"
                className="flex-1 h-12 rounded-xl bg-[#0077b5]/10 border border-[#0077b5]/20 flex items-center justify-center hover:bg-[#0077b5]/20 transition-all group"
              >
                <Linkedin className="h-5 w-5 text-[#0077b5] group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}`}
                target="_blank"
                className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
              >
                <Twitter className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </Card>

        <Card className="bg-[#13131a] border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-[#f0f0ff] uppercase tracking-widest border-b border-white/5 pb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#6c47ff]" />
            Recent Referrals
          </h3>
          <div className="space-y-3 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
            {referrals.length > 0 ? (
              referrals.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-white/10">
                      <AvatarImage src={r.avatar_url} />
                      <AvatarFallback className="bg-[#6c47ff]/20 text-[#6c47ff] text-[10px] font-bold">
                        {r.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-[#f0f0ff]">{r.full_name}</p>
                      <p className="text-[10px] text-[#6b7280]">Joined {format(new Date(r.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <Star className="h-3 w-3 text-amber-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-[#6b7280]">No referrals yet. Start sharing!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
