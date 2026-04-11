"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  Users,
  ChevronDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import BuilderCard from "@/components/cards/BuilderCard";
import { BadgeType } from "@/components/badges/BadgeIcon";

// ─── Constants ────────────────────────────────────────────────────────────────

const SKILLS = [
  "React", "Next.js", "Vue", "Python", "Django", "FastAPI",
  "Node.js", "ML/AI", "UI/UX", "Figma", "Flutter", "Android",
  "iOS", "Web3", "Solidity", "DevOps", "Docker", "AWS",
  "Blockchain", "Data Science", "TypeScript", "Go", "Rust",
];

const ROLES = [
  "Frontend Dev", "Backend Dev", "Full Stack", "ML Engineer",
  "UI/UX Designer", "Mobile Dev", "DevOps", "Data Scientist",
  "Blockchain Dev", "Product Manager",
];

const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi",
];

const BADGE_TYPES: { value: BadgeType; label: string; color: string }[] = [
  { value: "verified", label: "Verified", color: "text-[#00d4aa]" },
  { value: "influencer", label: "Influencer", color: "text-amber-500" },
  { value: "spotlight", label: "Spotlight", color: "text-slate-300" },
  { value: "elite", label: "Elite", color: "text-purple-400" },
];

const TIERS = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite" },
];

const PAGE_SIZE = 12;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Builder {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  college: string;
  city: string;
  state?: string;
  skills: string[];
  roles?: string[];
  subscription_tier?: string;
  badge_type?: BadgeType;
}

interface Filters {
  search: string;
  skills: string[];
  roles: string[];
  college: string;
  state: string;
  badges: BadgeType[];
  tiers: string[];
}

const defaultFilters: Filters = {
  search: "",
  skills: [],
  roles: [],
  college: "",
  state: "All States",
  badges: [],
  tiers: [],
};

// ─── Chip Toggle Component ────────────────────────────────────────────────────

function ChipToggle({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
        selected
          ? "bg-[#6c47ff] border-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/20"
          : "bg-white/5 border-white/10 text-[#6b7280] hover:border-[#6c47ff]/50 hover:text-[#f0f0ff]"
      )}
    >
      {label}
    </button>
  );
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onChange,
  onApply,
  onClear,
}: {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const toggleArr = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <aside className="w-72 shrink-0 sticky top-24 self-start space-y-6">
      <div className="bg-[#13131a] border border-white/10 rounded-2xl p-5 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#6c47ff]" />
            <h2 className="text-sm font-bold text-[#f0f0ff] uppercase tracking-widest">
              Filters
            </h2>
          </div>
          <button
            onClick={onClear}
            className="text-xs text-[#6b7280] hover:text-[#f0f0ff] transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7280]" />
            <Input
              placeholder="Name or username..."
              value={filters.search}
              onChange={(e) => onChange({ search: e.target.value })}
              className="pl-9 h-9 bg-white/5 border-white/10 text-[#f0f0ff] text-sm placeholder:text-[#4b5563] focus-visible:ring-[#6c47ff] rounded-xl"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Skills
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SKILLS.map((s) => (
              <ChipToggle
                key={s}
                label={s}
                selected={filters.skills.includes(s)}
                onToggle={() => onChange({ skills: toggleArr(filters.skills, s) })}
              />
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Role
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <ChipToggle
                key={r}
                label={r}
                selected={filters.roles.includes(r)}
                onToggle={() => onChange({ roles: toggleArr(filters.roles, r) })}
              />
            ))}
          </div>
        </div>

        {/* College */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            College
          </label>
          <Input
            placeholder="e.g. IIT Bombay..."
            value={filters.college}
            onChange={(e) => onChange({ college: e.target.value })}
            className="h-9 bg-white/5 border-white/10 text-[#f0f0ff] text-sm placeholder:text-[#4b5563] focus-visible:ring-[#6c47ff] rounded-xl"
          />
        </div>

        {/* State */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            State
          </label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full h-9 appearance-none bg-white/5 border border-white/10 text-[#f0f0ff] text-sm rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-[#6c47ff] pr-8"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s} className="bg-[#13131a]">
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6b7280] pointer-events-none" />
          </div>
        </div>

        {/* Badge Type */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Badge
          </label>
          <div className="space-y-2">
            {BADGE_TYPES.map(({ value, label, color }) => (
              <label
                key={value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.badges.includes(value)}
                  onChange={() =>
                    onChange({ badges: toggleArr(filters.badges, value) })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#6c47ff]"
                />
                <span
                  className={cn(
                    "text-sm font-medium group-hover:opacity-100 transition-opacity",
                    color,
                    !filters.badges.includes(value) && "opacity-60"
                  )}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Subscription Tier */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
            Plan
          </label>
          <div className="space-y-2">
            {TIERS.map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.tiers.includes(value)}
                  onChange={() =>
                    onChange({ tiers: toggleArr(filters.tiers, value) })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[#6c47ff]"
                />
                <span className="text-sm font-medium text-[#6b7280] group-hover:text-[#f0f0ff] transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply */}
        <Button
          onClick={onApply}
          className="w-full bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl font-semibold transition-all"
        >
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Users className="h-8 w-8 text-[#6b7280]" />
      </div>
      <h3 className="text-xl font-bold text-[#f0f0ff] mb-2">No builders found</h3>
      <p className="text-[#6b7280] text-sm max-w-xs mb-6">
        Try adjusting your filters to discover more builders on the network.
      </p>
      <Button
        variant="ghost"
        onClick={onClear}
        className="border border-white/20 hover:border-white/40 text-[#f0f0ff] rounded-xl"
      >
        Clear Filters
      </Button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const supabase = createClient();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(defaultFilters);
  const [builders, setBuilders] = useState<Builder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const fetchBuilders = useCallback(
    async (f: Filters, pageIndex: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      try {
        let query = supabase
          .from("users")
          .select(
            `id, username, full_name, avatar_url, college, city, state,
             skills, roles, subscription_tier,
             badges!left(badge_type)`,
            { count: "exact" }
          )
          .range(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE - 1);

        // Search
        if (f.search.trim()) {
          query = query.or(
            `full_name.ilike.%${f.search}%,username.ilike.%${f.search}%`
          );
        }

        // College
        if (f.college.trim()) {
          query = query.ilike("college", `%${f.college}%`);
        }

        // State
        if (f.state && f.state !== "All States") {
          query = query.eq("state", f.state);
        }

        // Skills (overlap – uses contains for array)
        if (f.skills.length > 0) {
          query = query.overlaps("skills", f.skills);
        }

        // Roles
        if (f.roles.length > 0) {
          query = query.overlaps("roles", f.roles);
        }

        // Subscription tier
        if (f.tiers.length > 0) {
          query = query.in("subscription_tier", f.tiers);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        // Map badge from joined table
        const mapped: Builder[] = (data ?? []).map((row: any) => ({
          id: row.id,
          username: row.username || "unknown",
          full_name: row.full_name || "Builder",
          avatar_url: row.avatar_url,
          college: row.college || "–",
          city: row.city || "–",
          state: row.state,
          skills: row.skills ?? [],
          roles: row.roles ?? [],
          subscription_tier: row.subscription_tier,
          badge_type: row.badges?.[0]?.badge_type ?? undefined,
        }));

        // Client-side badge filter (since it's a join)
        const filtered =
          f.badges.length > 0
            ? mapped.filter(
                (b) => b.badge_type && f.badges.includes(b.badge_type)
              )
            : mapped;

        setBuilders((prev) => (append ? [...prev, ...filtered] : filtered));
        setTotal(count ?? 0);
        setHasMore((data?.length ?? 0) === PAGE_SIZE);
      } catch (err) {
        console.error("Error fetching builders:", err);
        // Fallback removed
        setBuilders((prev) => (append ? [...prev] : []));
        setTotal(0);
        setHasMore(false);
      } finally {
        if (append) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [supabase]
  );

  useEffect(() => {
    setPage(0);
    fetchBuilders(appliedFilters, 0);
  }, [appliedFilters, fetchBuilders]);

  const handleApply = () => {
    setAppliedFilters(filters);
    setShowMobileFilter(false);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setShowMobileFilter(false);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchBuilders(appliedFilters, next, true);
  };

  const activeFilterCount =
    appliedFilters.skills.length +
    appliedFilters.roles.length +
    appliedFilters.badges.length +
    appliedFilters.tiers.length +
    (appliedFilters.search ? 1 : 0) +
    (appliedFilters.college ? 1 : 0) +
    (appliedFilters.state !== "All States" ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#f0f0ff]">Explore Builders</h1>
            <p className="text-[#6b7280] mt-1 text-sm">
              {loading ? "Loading..." : `${total.toLocaleString()} builders on the network`}
            </p>
          </div>
          {/* Mobile filter toggle */}
          <Button
            variant="ghost"
            className="md:hidden border border-white/20 hover:border-white/40 text-[#f0f0ff] rounded-xl relative"
            onClick={() => setShowMobileFilter((v) => !v)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#6c47ff] rounded-full text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {appliedFilters.search && (
              <ActiveChip label={`"${appliedFilters.search}"`} onRemove={() => { const f = { ...filters, search: "" }; setFilters(f); setAppliedFilters(f); }} />
            )}
            {appliedFilters.skills.map((s) => (
              <ActiveChip key={s} label={s} onRemove={() => { const f = { ...filters, skills: filters.skills.filter((x) => x !== s) }; setFilters(f); setAppliedFilters(f); }} />
            ))}
            {appliedFilters.badges.map((b) => (
              <ActiveChip key={b} label={b} onRemove={() => { const f = { ...filters, badges: filters.badges.filter((x) => x !== b) }; setFilters(f); setAppliedFilters(f); }} />
            ))}
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar
            filters={filters}
            onChange={(p) => setFilters((prev) => ({ ...prev, ...p }))}
            onApply={handleApply}
            onClear={handleClear}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilter(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 overflow-y-auto bg-[#0a0a0f] p-4">
              <div className="flex justify-end mb-4">
                <button onClick={() => setShowMobileFilter(false)}>
                  <X className="h-5 w-5 text-[#6b7280]" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(p) => setFilters((prev) => ({ ...prev, ...p }))}
                onApply={handleApply}
                onClear={handleClear}
              />
            </div>
          </div>
        )}

        {/* Builder Grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : builders.length === 0 ? (
            <EmptyState onClear={handleClear} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {builders.map((builder) => (
                  <BuilderCard key={builder.id} user={builder} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="ghost"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="border border-white/20 hover:border-[#6c47ff]/50 text-[#f0f0ff] rounded-xl px-8 h-11 transition-all"
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/20 border-t-[#6c47ff] rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      `Load More (${total - builders.length} remaining)`
                    )}
                  </Button>
                </div>
              )}

              <p className="text-center text-xs text-[#6b7280] mt-4">
                Showing {builders.length} of {total} builders
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Active Filter Chip ───────────────────────────────────────────────────────

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6c47ff]/10 border border-[#6c47ff]/30 text-[#6c47ff] text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#13131a] border border-white/10 rounded-xl p-5 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-14 w-14 rounded-full bg-white/5" />
        <div className="h-5 w-5 rounded-full bg-white/5" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-32 bg-white/5 rounded" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-2/3 bg-white/5 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-white/5 rounded-full" />
        <div className="h-6 w-16 bg-white/5 rounded-full" />
        <div className="h-6 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-9 bg-white/5 rounded-xl" />
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}
