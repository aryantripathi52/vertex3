"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const SKILLS_OPTIONS = [
  "React", "Python", "ML", "UI/UX", "Blockchain", "Node.js", 
  "Flutter", "Go", "Rust", "DevOps", "Data Science", "Android", "iOS"
];

const ROLES_OPTIONS = [
  "Frontend Dev", "Backend Dev", "ML Engineer", "Designer", 
  "Full Stack", "DevOps Engineer", "Data Scientist", "Android Dev", 
  "iOS Dev", "Product Manager"
];

interface SkillsSectionProps {
  skills: string[];
  roles: string[];
  editing: boolean;
  onToggleSkill: (skill: string) => void;
  onToggleRole: (role: string) => void;
}

export default function SkillsSection({
  skills = [],
  roles = [],
  editing,
  onToggleSkill,
  onToggleRole
}: SkillsSectionProps) {
  return (
    <div className="space-y-8">
      {/* Roles Section */}
      <div className="space-y-4">
        <h3 className="text-[#f0f0ff] font-semibold flex items-center gap-2">
          Roles
          <span className="text-[10px] text-[#6b7280] font-normal uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
            Specialization
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {(editing ? ROLES_OPTIONS : roles).map((role) => {
            const isSelected = roles.includes(role);
            if (!editing && !isSelected) return null;

            return (
              <Badge
                key={role}
                onClick={() => editing && onToggleRole(role)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all cursor-default border",
                  isSelected 
                    ? "bg-[#6c47ff]/20 text-[#6c47ff] border-[#6c47ff]/40 shadow-[0_0_10px_rgba(108,71,255,0.15)]" 
                    : "bg-white/5 text-[#6b7280] border-white/10 hover:border-white/20",
                  editing && "cursor-pointer"
                )}
              >
                {role}
                {editing && (
                  isSelected ? (
                    <X className="ml-1.5 h-3 w-3" />
                  ) : (
                    <Plus className="ml-1.5 h-3 w-3" />
                  )
                )}
              </Badge>
            );
          })}
          {!editing && roles.length === 0 && (
            <p className="text-sm text-[#6b7280]">No roles specified</p>
          )}
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        <h3 className="text-[#f0f0ff] font-semibold flex items-center gap-2">
          Tech Stack
          <span className="text-[10px] text-[#6b7280] font-normal uppercase tracking-widest border border-white/10 px-1.5 py-0.5 rounded">
            Skills
          </span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {(editing ? SKILLS_OPTIONS : skills).map((skill) => {
            const isSelected = skills.includes(skill);
            if (!editing && !isSelected) return null;

            return (
              <Badge
                key={skill}
                onClick={() => editing && onToggleSkill(skill)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium transition-all cursor-default border",
                  isSelected 
                    ? "bg-white/10 text-[#f0f0ff] border-white/20" 
                    : "bg-white/5 text-[#6b7280] border-white/10 hover:border-white/20",
                  editing && "cursor-pointer"
                )}
              >
                {skill}
                {editing && (
                  isSelected ? (
                    <X className="ml-1.5 h-3 w-3" />
                  ) : (
                    <Plus className="ml-1.5 h-3 w-3" />
                  )
                )}
              </Badge>
            );
          })}
          {!editing && skills.length === 0 && (
            <p className="text-sm text-[#6b7280]">No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
