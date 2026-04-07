"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Filter, SlidersHorizontal, Trophy, 
  Globe, MapPin, Calendar, Loader2, Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import HackathonCard from "@/components/cards/HackathonCard";

const MODES = ["All", "Online", "Offline", "Hybrid"];
const TAGS = ["AI", "Web3", "Social Impact", "Cloud", "Open Source", "Mobile", "Gaming"];
const PRIZE_RANGES = [
  { label: "Any", min: 0 },
  { label: "₹10k+", min: 10000 },
  { label: "₹50k+", min: 50000 },
  { label: "₹1L+", min: 100000 },
];
const STATUSES = ["Upcoming", "Open", "Closed"];

export default function HackathonsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrize, setSelectedPrize] = useState(PRIZE_RANGES[0]);
  const [selectedStatus, setSelectedStatus] = useState("Open");

  useEffect(() => {
    fetchHackathons(true);
    fetchSavedIds();
  }, [selectedMode, selectedTags, selectedPrize, selectedStatus]);

  const fetchSavedIds = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("hackathon_saves")
      .select("hackathon_id")
      .eq("user_id", user.id);
    
    setSavedIds(data?.map(s => s.hackathon_id) || []);
  };

  const fetchHackathons = async (reset = false) => {
    setLoading(true);
    const from = reset ? 0 : (page + 1) * 12;
    const to = from + 11;

    let query = supabase
      .from("hackathons")
      .select("*")
      .range(from, to)
      .order("is_featured", { ascending: false })
      .order("start_date", { ascending: true });

    if (search) query = query.ilike("title", `%${search}%`);
    if (selectedMode !== "All") query = query.eq("mode", selectedMode);
    if (selectedTags.length > 0) query = query.overlaps("tags", selectedTags);
    if (selectedPrize.min > 0) query = query.gte("prize_pool", selectedPrize.min);
    
    // Status filter logic
    const now = new Date().toISOString();
    if (selectedStatus === "Open") {
      query = query.lte("reg_deadline", now).gte("end_date", now);
    } else if (selectedStatus === "Upcoming") {
      query = query.gt("reg_deadline", now);
    } else if (selectedStatus === "Closed") {
      query = query.lt("end_date", now);
    }

    const { data, error } = await query;

    if (data) {
      if (reset) {
        setHackathons(data);
        setPage(0);
      } else {
        setHackathons(prev => [...prev, ...data]);
        setPage(page + 1);
      }
      setHasMore(data.length === 12);
    }
    setLoading(false);
  };

  const handleSave = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (savedIds.includes(id)) {
      await supabase
        .from("hackathon_saves")
        .delete()
        .eq("user_id", user.id)
        .eq("hackathon_id", id);
      setSavedIds(prev => prev.filter(sid => sid !== id));
    } else {
      await supabase
        .from("hackathon_saves")
        .insert({ user_id: user.id, hackathon_id: id });
      setSavedIds(prev => [...prev, id]);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#f0f0ff] mb-2">Explore Hackathons</h1>
          <p className="text-[#6b7280]">Find your next challenge and build something amazing.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6b7280]" />
          <Input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchHackathons(true)}
            placeholder="Search by title or organizer..."
            className="pl-10 bg-[#13131a] border-white/10 text-[#f0f0ff] h-11 rounded-xl focus:ring-[#6c47ff]"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="bg-[#13131a] border-white/10 p-4 rounded-2xl">
        <div className="flex flex-col gap-6">
          {/* Mode & Status */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2">
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Mode</p>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {MODES.map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedMode(mode)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedMode === mode ? "bg-[#6c47ff] text-white shadow-lg" : "text-[#6b7280] hover:text-[#f0f0ff]"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Status</p>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {STATUSES.map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedStatus === status ? "bg-[#6c47ff] text-white shadow-lg" : "text-[#6b7280] hover:text-[#f0f0ff]"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Prize Pool</p>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {PRIZE_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPrize(range)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                      selectedPrize.label === range.label ? "bg-[#6c47ff] text-white shadow-lg" : "text-[#6b7280] hover:text-[#f0f0ff]"
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <p className="text-[10px] text-[#6b7280] uppercase tracking-widest font-bold">Filter by Topics</p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <Badge
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl cursor-pointer transition-all border",
                    selectedTags.includes(tag) 
                      ? "bg-[#6c47ff]/20 text-[#6c47ff] border-[#6c47ff]/40 shadow-[0_0_15px_rgba(108,71,255,0.1)]" 
                      : "bg-white/5 text-[#6b7280] border-white/10 hover:border-white/20"
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid */}
      {loading && hackathons.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-[#13131a] border border-white/10 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : hackathons.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((h) => (
              <HackathonCard 
                key={h.id} 
                hackathon={h} 
                isSaved={savedIds.includes(h.id)}
                onSave={handleSave}
              />
            ))}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button 
                onClick={() => fetchHackathons()} 
                disabled={loading}
                variant="ghost"
                className="bg-white/5 border border-white/10 text-[#f0f0ff] hover:bg-white/10 px-8 py-6 rounded-2xl"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Load More Hackathons"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 space-y-4">
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <Trophy className="h-10 w-10 text-[#6b7280]" />
          </div>
          <h3 className="text-xl font-bold text-[#f0f0ff]">No hackathons found</h3>
          <p className="text-[#6b7280] max-w-xs mx-auto">Try adjusting your filters or search terms to find more results.</p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setSearch("");
              setSelectedMode("All");
              setSelectedTags([]);
              setSelectedPrize(PRIZE_RANGES[0]);
              setSelectedStatus("Open");
            }}
            className="text-[#6c47ff] hover:bg-[#6c47ff]/10"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
