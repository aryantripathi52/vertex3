"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, Trophy, Award, Users, 
  Settings, LogOut, Loader2, ShieldCheck,
  ChevronRight, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_EMAILS = ["admin@vertex3.in", "founder@vertex3.in"]; // In real app, use a 'role' column

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
        router.push("/dashboard");
        return;
      }
      setLoading(false);
    }
    checkAdmin();
  }, [supabase, router]);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Hackathons", icon: Trophy, href: "/admin/hackathons" },
    { label: "Badges", icon: Award, href: "/admin/badges" },
    { label: "User Management", icon: Users, href: "/admin/users" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#6c47ff]" />
        <p className="text-[#6b7280] font-medium animate-pulse">Verifying administrative access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0ff] flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-[#13131a] border-r border-white/10 transition-transform duration-300 lg:static lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-8 w-8 bg-[#6c47ff] rounded-lg flex items-center justify-center shadow-lg shadow-[#6c47ff]/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">Vertex<span className="text-[#6c47ff]">Admin</span></span>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-[#6c47ff] text-white shadow-lg shadow-[#6c47ff]/20" 
                      : "text-[#6b7280] hover:bg-white/5 hover:text-[#f0f0ff]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/5 space-y-2">
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start text-[#6b7280] hover:text-[#f0f0ff] hover:bg-white/5 rounded-xl px-4">
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Back to Platform
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => supabase.auth.signOut().then(() => router.push("/login"))}
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl px-4"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#13131a]/50 backdrop-blur-md sticky top-0 z-40">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </Button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[#f0f0ff]">Admin Session</p>
              <p className="text-[10px] text-[#6b7280] uppercase tracking-widest">Master Control</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center text-[#6c47ff]">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
