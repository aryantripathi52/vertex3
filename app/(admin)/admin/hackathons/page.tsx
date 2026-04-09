"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, Search, Trophy, Calendar, 
  MapPin, Tag, MoreVertical, Edit2, 
  Trash2, ExternalLink, Filter, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminHackathons() {
  const supabase = createClient();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    organizer: "",
    description: "",
    prize_pool: "",
    deadline: "",
    tags: "",
    image_url: "",
    registration_url: "",
    mode: "Online"
  });

  useEffect(() => {
    fetchHackathons();
  }, []);

  async function fetchHackathons() {
    setLoading(true);
    const { data } = await supabase
      .from("hackathons")
      .select("*")
      .order("created_at", { ascending: false });
    
    setHackathons(data || []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("hackathons").insert([{
      ...formData,
      prize_pool: parseInt(formData.prize_pool || "0"),
      tags: formData.tags.split(",").map(t => t.trim()),
      is_featured: false
    }]);

    if (!error) {
      setIsCreateModalOpen(false);
      fetchHackathons();
      setFormData({ title: "", organizer: "", description: "", prize_pool: "", deadline: "", tags: "", image_url: "", registration_url: "", mode: "Online" });
    }
  }

  const filteredHackathons = hackathons.filter(h => 
    h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.organizer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f0f0ff] tracking-tight">Hackathons Directory</h1>
          <p className="text-[#6b7280] font-medium">Create, manage, and feature Pan-India hackathons.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6c47ff] hover:bg-[#5535ee] text-white shadow-lg shadow-[#6c47ff]/20 h-11 px-6 font-bold rounded-xl border-none">
              <Plus className="mr-2 h-5 w-5" /> New Hackathon
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#13131a] border-white/10 text-[#f0f0ff] max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Register New Hackathon</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hackathon Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Meta-Build 24" 
                    className="bg-white/5 border-white/10" required 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organizer Name</Label>
                  <Input 
                    value={formData.organizer} 
                    onChange={e => setFormData({...formData, organizer: e.target.value})}
                    placeholder="e.g. Vertex3 Labs" 
                    className="bg-white/5 border-white/10" required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border-white/10 min-h-[100px]" required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prize Pool (₹)</Label>
                  <Input 
                    type="number" 
                    value={formData.prize_pool} 
                    onChange={e => setFormData({...formData, prize_pool: e.target.value})}
                    placeholder="500000" 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deadline Date</Label>
                  <Input 
                    type="date" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                    className="bg-white/5 border-white/10" required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tags (Comma separated)</Label>
                <Input 
                  value={formData.tags} 
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                  placeholder="AI, Web3, FinTech" 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <div className="space-y-2">
                <Label>Registration URL</Label>
                <Input 
                  value={formData.registration_url} 
                  onChange={e => setFormData({...formData, registration_url: e.target.value})}
                  placeholder="https://devpost.com/..." 
                  className="bg-white/5 border-white/10" 
                />
              </div>
              <Button type="submit" className="w-full bg-[#6c47ff] hover:bg-[#5535ee] font-bold h-12 rounded-xl mt-4">
                List Hackathon
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6b7280]" />
        <Input 
          placeholder="Search by title, organizer, or tech stack..." 
          className="pl-12 h-14 bg-[#13131a] border-white/10 rounded-2xl text-lg focus:ring-2 focus:ring-[#6c47ff]/20 transition-all font-medium"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHackathons.map((hackathon) => (
            <Card key={hackathon.id} className="bg-[#13131a] border-white/10 hover:border-white/20 transition-all group overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-6">
                  <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-[#6c47ff] group-hover:bg-[#6c47ff]/10 transition-colors shrink-0">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-[#f0f0ff] truncate">{hackathon.title}</h3>
                      {hackathon.is_featured && (
                        <Badge className="bg-[#6c47ff] text-[10px] h-5 px-1.5 uppercase font-black border-none">Featured</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#6b7280] font-medium">
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5" />
                        <span>{hackathon.organizer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(hackathon.deadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#00d4aa]">
                        <Tag className="h-3.5 w-3.5" />
                        <span>₹{(hackathon.prize_pool / 100000).toFixed(1)}L Pool</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:border-l border-white/5 sm:pl-6">
                    <Button variant="ghost" size="icon" className="text-[#6b7280] hover:text-[#f0f0ff] hover:bg-white/5 rounded-xl">
                      <Edit2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl">
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[#6c47ff] hover:text-[#f0f0ff] hover:bg-[#6c47ff]/10 rounded-xl" asChild>
                      <a href={hackathon.registration_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
