"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", " हिमाचल प्रदेश (Himachal Pradesh)", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

const SKILLS_OPTIONS = [
  "React", "Next.js", "Vue", "Python", "Django", "FastAPI", 
  "Node.js", "ML/AI", "UI/UX", "Figma", "Flutter", "Android",
  "iOS", "Web3", "Solidity", "DevOps", "Docker", "AWS", 
  "Blockchain", "Data Science"
];

const ROLES_OPTIONS = [
  "Frontend Dev", "Backend Dev", "Full Stack", "ML Engineer",
  "UI/UX Designer", "Mobile Dev", "DevOps", "Data Scientist",
  "Blockchain Dev", "Product Manager"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [college, setCollege] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username,
          college,
          city,
          state,
          bio,
          skills: selectedSkills,
          roles: selectedRoles, // Added this field in case we want to store it
          github_url: githubUrl,
          referred_by: referralCode, // Using referred_by instead of referralCode to mark who referred them
          is_onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("clerk_id", user.id);

      if (error) throw error;

      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving onboarding details:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl bg-[#13131a] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#f0f0ff] mb-2">Complete Your Profile</h1>
          <p className="text-[#6b7280]">Tell us about yourself so builders can find you</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#f0f0ff]">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">@</span>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="pl-8 bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college" className="text-[#f0f0ff]">College</Label>
              <Input
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="Indian Institute of Technology..."
                className="bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-[#f0f0ff]">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Bangalore"
                className="bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#f0f0ff]">State</Label>
              <Select onValueChange={setState} required>
                <SelectTrigger className="bg-white/5 border-white/10 text-[#f0f0ff] focus:ring-[#6c47ff]">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-[#13131a] border-white/10 text-[#f0f0ff]">
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s} className="hover:bg-white/5 focus:bg-white/5">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="bio" className="text-[#f0f0ff]">Bio</Label>
              <span className={`text-xs ${bio.length > 160 ? "text-red-500" : "text-[#6b7280]"}`}>
                {bio.length}/160
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 160))}
              placeholder="I build high-performance web apps..."
              className="bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] min-h-[100px] transition-colors"
              required
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[#f0f0ff]">Skills</Label>
            <div className="flex flex-wrap gap-2">
              {SKILLS_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    selectedSkills.includes(skill)
                      ? "bg-[#6c47ff] border-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/20"
                      : "bg-white/5 border-white/10 text-[#6b7280] hover:border-[#6c47ff]/50 hover:text-[#f0f0ff]"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[#f0f0ff]">Roles</Label>
            <div className="flex flex-wrap gap-2">
              {ROLES_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    selectedRoles.includes(role)
                      ? "bg-[#6c47ff] border-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/20"
                      : "bg-white/5 border-white/10 text-[#6b7280] hover:border-[#6c47ff]/50 hover:text-[#f0f0ff]"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="github" className="text-[#f0f0ff]">GitHub URL (Optional)</Label>
              <Input
                id="github"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral" className="text-[#f0f0ff]">Referral Code (Optional)</Label>
              <Input
                id="referral"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="V3-XXXXXX"
                className="bg-white/5 border-white/10 text-[#f0f0ff] focus:border-[#6c47ff] transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6c47ff] hover:bg-[#5535ee] text-white h-12 text-lg font-semibold rounded-xl transition-all duration-300"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <>Complete Setup <ArrowRight className="ml-2 h-5 w-5" /></>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
