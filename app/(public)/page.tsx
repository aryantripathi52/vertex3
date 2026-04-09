import React from 'react';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Trophy, 
  CheckCircle2, 
  Flame, 
  Star, 
  Crown,
  ArrowRight,
  Zap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0ff] selection:bg-[#6c47ff]/30">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-transparent">
              <Image src="/logo.png" alt="Vertex3" width={24} height={24} className="object-contain filter invert opacity-90" />
            </div>
            <span className="text-xl font-bold tracking-tight">Vertex3</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6b7280]">
            <a href="#features" className="hover:text-[#f0f0ff] transition-colors">Features</a>
            <a href="#hackathons" className="hover:text-[#f0f0ff] transition-colors">Hackathons</a>
            <a href="#pricing" className="hover:text-[#f0f0ff] transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-[#f0f0ff] hover:bg-white/5">Log In</Button>
            <Button className="bg-[#6c47ff] hover:bg-[#6c47ff]/90 text-white border-none">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO */}
      <header className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(#6c47ff 0.5px, transparent 0.5px), radial-gradient(#6c47ff 0.5px, #0a0a0f 0.5px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-4 border-[#6c47ff]/30 bg-[#6c47ff]/10 text-[#6c47ff] hover:bg-[#6c47ff]/20">
            Now live across 500+ colleges
          </Badge>
          <h1 className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight text-[#f0f0ff]">
            Find Your Team.<br />
            <span className="text-[#6c47ff]">Win Hackathons.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-[#6b7280]">
            India&apos;s largest builder network — connect with developers, designers, and innovators across 500+ colleges.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 bg-[#6c47ff] hover:bg-[#6c47ff]/90 text-white font-semibold">
              Find Teammates <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-white/10 bg-transparent text-[#f0f0ff] hover:bg-white/5">
              Browse Hackathons
            </Button>
          </div>
        </div>
      </header>

      {/* 3. STATS BAR */}
      <section className="container mx-auto px-4 mb-24">
        <div className="rounded-2xl border border-white/10 bg-[#13131a] p-8 md:p-12 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#f0f0ff]">2,400+</p>
              <p className="text-sm text-[#6b7280] uppercase tracking-wider mt-1">Builders</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#f0f0ff]">18</p>
              <p className="text-sm text-[#6b7280] uppercase tracking-wider mt-1">States</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#f0f0ff]">130+</p>
              <p className="text-sm text-[#6b7280] uppercase tracking-wider mt-1">Hackathons</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#f0f0ff]">₹50L+</p>
              <p className="text-sm text-[#6b7280] uppercase tracking-wider mt-1">Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURES */}
      <section id="features" className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supercharge Your Build</h2>
          <p className="text-[#6b7280] max-w-xl mx-auto">Everything you need to find the perfect team and ship faster.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-[#13131a] border-white/10 group hover:border-[#6c47ff]/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-[#6c47ff]/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-[#6c47ff]" />
              </div>
              <CardTitle className="text-[#f0f0ff]">Smart Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6b7280]">Advanced filters to find builders by specific skills, college departments, or your immediate city.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#13131a] border-white/10 group hover:border-[#6c47ff]/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-[#00d4aa]/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-[#00d4aa]" />
              </div>
              <CardTitle className="text-[#f0f0ff]">Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6b7280]">Direct messaging built for collaboration. Share ideas and coordinate projects instantly within the platform.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#13131a] border-white/10 group hover:border-[#6c47ff]/50 transition-all duration-300">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-[#6c47ff]/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-[#6c47ff]" />
              </div>
              <CardTitle className="text-[#f0f0ff]">Hackathon Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#6b7280]">A curated list of every major hackathon across India. One dashboard to track deadlines and registrations.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. BADGES SHOWCASE */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn Badges. Build Reputation.</h2>
          <p className="text-[#6b7280]">Level up your profile as you contribute to the community.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: CheckCircle2, title: "Verified", desc: "Connect GitHub", color: "text-[#00d4aa]", glow: "shadow-[0_0_20px_-5px_#00d4aa]" },
            { icon: Flame, title: "Influencer", desc: "Refer 10 builders", color: "text-amber-500", glow: "shadow-[0_0_20px_-5px_#f59e0b]" },
            { icon: Star, title: "Spotlight", desc: "Pro subscribers", color: "text-slate-400", glow: "shadow-[0_0_20px_-5px_#94a3b8]" },
            { icon: Crown, title: "Elite", desc: "Elite subscribers", color: "text-purple-500", glow: "shadow-[0_0_20px_-5px_#a855f7]" },
          ].map((badge, i) => (
            <div key={i} className={`flex flex-col items-center p-8 rounded-2xl bg-[#13131a] border border-white/10 ${badge.glow} transition-transform hover:scale-105`}>
              <badge.icon className={`h-12 w-12 ${badge.color} mb-4`} />
              <h3 className="font-bold text-[#f0f0ff] mb-1">{badge.title}</h3>
              <p className="text-xs text-[#6b7280]">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="container mx-auto px-4 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-[#6b7280]">Scale your building potential.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free */}
          <Card className="bg-[#13131a] border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#f0f0ff]">Free</CardTitle>
              <CardDescription className="text-[#6b7280]">Basic experience</CardDescription>
              <div className="mt-4 text-3xl font-bold text-[#f0f0ff]">₹0</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm text-[#6b7280]">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00d4aa]" /> Basic profile</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00d4aa]" /> Unlimited DMs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#00d4aa]" /> Explore network</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full variant-outline border-white/10 bg-white/5 text-[#f0f0ff] hover:bg-white/10">Current Plan</Button>
            </CardFooter>
          </Card>

          {/* Pro */}
          <Card className="bg-[#13131a] border-[#6c47ff] shadow-[0_0_30px_-10px_#6c47ff] relative flex flex-col scale-105 z-10">
            <div className="absolute top-0 right-0 transform translate-y-[-50%] px-3 py-1 bg-[#6c47ff] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mr-6">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-[#f0f0ff]">Pro</CardTitle>
              <CardDescription className="text-[#6b7280]">Power user tools</CardDescription>
              <div className="mt-4 text-3xl font-bold text-[#f0f0ff]">₹99<span className="text-sm font-normal text-[#6b7280]">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm text-[#f0f0ff]">
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#6c47ff]" /> Read receipts</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#6c47ff]" /> Image DMs</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#6c47ff]" /> Spotlight badge</li>
                <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-[#6c47ff]" /> Profile boost</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#6c47ff] hover:bg-[#6c47ff]/90 text-white">Upgrade to Pro</Button>
            </CardFooter>
          </Card>

          {/* Elite */}
          <Card className="bg-[#13131a] border-white/10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-[#f0f0ff]">Elite</CardTitle>
              <CardDescription className="text-[#6b7280]">Maximum visibility</CardDescription>
              <div className="mt-4 text-3xl font-bold text-[#f0f0ff]">₹199<span className="text-sm font-normal text-[#6b7280]">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3 text-sm text-[#6b7280]">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Voice notes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Elite badge</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> Priority listing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-purple-500" /> All Pro features</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full variant-outline border-white/10 bg-white/5 text-[#f0f0ff] hover:bg-white/10">Go Elite</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-[#0a0a0f] border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center bg-transparent">
                  <Image src="/logo.png" alt="Vertex3" width={24} height={24} className="object-contain filter invert opacity-90" />
                </div>
                <span className="text-xl font-bold tracking-tight">Vertex3</span>
              </div>
              <p className="text-sm text-[#6b7280]">Build better, together.</p>
            </div>
            <div className="flex gap-8 text-sm text-[#6b7280]">
              <a href="#" className="hover:text-[#f0f0ff] transition-colors">Features</a>
              <a href="#" className="hover:text-[#f0f0ff] transition-colors">Hackathons</a>
              <a href="#" className="hover:text-[#f0f0ff] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#f0f0ff] transition-colors">Terms</a>
            </div>
          </div>
          <div className="text-center text-xs text-[#6b7280]">
            © {new Date().getFullYear()} Vertex3. Built with ❤️ for the Indian builder community.
          </div>
        </div>
      </footer>
    </div>
  );
}
