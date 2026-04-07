"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Loader2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import HackathonCard from "@/components/cards/HackathonCard";
import Link from "next/link";

export default function SavedHackathonsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchSavedHackathons();
  }, []);

  const fetchSavedHackathons = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedData, error: savedError } = await supabase
        .from("hackathon_saves")
        .select(`
          hackathon_id,
          hackathons (*)
        `)
        .eq("user_id", user.id);

      if (savedData) {
        const hList = savedData.map((s: any) => s.hackathons).filter(Boolean);
        setHackathons(hList);
        setSavedIds(hList.map((h: any) => h.id));
      }
    } catch (error) {
      console.error("Error fetching saved hackathons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // In saved page, clicking save usually means unsaving
    await supabase
      .from("hackathon_saves")
      .delete()
      .eq("user_id", user.id)
      .eq("hackathon_id", id);
    
    setHackathons(prev => prev.filter(h => h.id !== id));
    setSavedIds(prev => prev.filter(sid => sid !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#f0f0ff] mb-2 flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-yellow-500 fill-current" />
          Saved Hackathons
        </h1>
        <p className="text-[#6b7280]">Your personalized list of hackathons you're interested in.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-[#13131a] border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((h) => (
            <HackathonCard 
              key={h.id} 
              hackathon={h} 
              isSaved={true}
              onSave={handleSave}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-[#13131a] border border-white/10 rounded-3xl">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Bookmark className="h-10 w-10 text-[#6b7280]" />
          </div>
          <h3 className="text-xl font-bold text-[#f0f0ff]">No saved hackathons</h3>
          <p className="text-[#6b7280] max-w-xs mx-auto">You haven't saved any hackathons yet. Explore the directory and bookmark the ones you like!</p>
          <Link href="/hackathons">
            <Button className="mt-4 bg-[#6c47ff] hover:bg-[#5535ee]">
              Explore Hackathons
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
