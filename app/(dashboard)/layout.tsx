import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-[#f0f0ff]">
      <Sidebar />
      <div className="flex-1 pl-64">
        {/* We can include a shared Navbar/Header if needed, 
           otherwise individual pages handle their headers */}
        <Navbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
