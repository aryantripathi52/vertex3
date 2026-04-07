"use client";

import React, { useState, useEffect } from "react";
import { 
  Zap, Crown, CheckCircle2, X, Loader2, Star, 
  BadgeCheck, ToggleLeft, ToggleRight, ArrowRight,
  ShieldCheck, ZapOff, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const FEATURES = [
  { label: "Direct Messaging", free: true, pro: true, elite: true },
  { label: "Read Receipts", free: false, pro: true, elite: true },
  { label: "Image Attachments", free: false, pro: true, elite: true },
  { label: "Voice Notes", free: false, pro: false, elite: true },
  { label: "Message Search", free: false, pro: true, elite: true },
  { label: "Spotlight Badge", free: false, pro: true, elite: false },
  { label: "Elite Badge", free: false, pro: false, elite: true },
  { label: "Profile Boost", free: false, pro: true, elite: true },
  { label: "Priority in Explore", free: false, pro: true, elite: true },
  { label: "Unlimited Teams", free: false, pro: true, elite: true },
];

export default function UpgradePage() {
  const supabase = createClient();
  const [isYearly, setIsYearly] = useState(false);
  const [currentTier, setCurrentTier] = useState("free");
  const [loading, setLoading] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    async function loadUserSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();
        if (data?.subscription_tier) setCurrentTier(data.subscription_tier);
      }
    }
    loadUserSubscription();

    return () => {
      document.body.removeChild(script);
    };
  }, [supabase]);

  const handlePayment = async (plan: any) => {
    if (!scriptLoaded) return;
    setLoading(plan.id);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to upgrade.");
        return;
      }

      const amount = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: amount * 100, // In paise
        currency: "INR",
        name: "Vertex3",
        description: `${plan.name} Subscription - ${isYearly ? 'Yearly' : 'Monthly'}`,
        image: "https://vertex3.in/logo.png",
        handler: async function (response: any) {
          // Success handler
          try {
            const { error: subError } = await supabase
              .from("subscriptions")
              .upsert({
                user_id: user.id,
                plan: plan.id,
                status: "active",
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + (isYearly ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
                payment_id: response.razorpay_payment_id
              });

            if (subError) throw subError;

            // Update user tier
            await supabase
              .from("users")
              .update({ subscription_tier: plan.id })
              .eq("id", user.id);

            // Award badge
            const badgeType = plan.id === "pro" ? "spotlight" : "elite";
            await supabase
              .from("badges")
              .insert({
                user_id: user.id,
                badge_type: badgeType,
                earned_at: new Date().toISOString()
              });

            setCurrentTier(plan.id);
            alert(`Successfully upgraded to ${plan.name}!`);
          } catch (err) {
            console.error("Error updating subscription:", err);
            alert("Payment successful but failed to update subscription. Please contact support.");
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: "#6c47ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Essential for starters",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: <ZapOff className="h-6 w-6 text-[#6b7280]" />,
      color: "border-white/10",
      features: ["Unlimited DMs", "Standard Profile", "Community Support"],
      cta: "Current Plan",
    },
    {
      id: "pro",
      name: "Pro",
      description: "Most popular for builders",
      monthlyPrice: 99,
      yearlyPrice: 799,
      icon: <Zap className="h-6 w-6 text-[#6c47ff]" />,
      color: "border-[#6c47ff]/50",
      glow: "shadow-[0_0_50px_-10px_rgba(108,71,255,0.3)]",
      badge: "Most Popular",
      features: ["Read Receipts", "Image Attachments", "Spotlight Badge", "Profile Boost"],
      cta: "Upgrade to Pro",
    },
    {
      id: "elite",
      name: "Elite",
      description: "Ultimate networking power",
      monthlyPrice: 199,
      yearlyPrice: 1799,
      icon: <Crown className="h-6 w-6 text-amber-400" />,
      color: "border-amber-400/30",
      glow: "shadow-[0_0_50px_-10px_rgba(251,191,36,0.2)]",
      features: ["Voice Notes", "Elite Badge", "Priority Support", "Global Visibility"],
      cta: "Go Elite",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#f0f0ff] tracking-tight">
          Supercharge Your <span className="text-[#6c47ff]">Building Journey</span>
        </h1>
        <p className="text-[#6b7280] max-w-2xl mx-auto text-lg">
          Join thousands of elite builders and unlock powerful networking tools to find your perfect hackathon team.
        </p>

        <div className="flex items-center justify-center gap-4 pt-6">
          <span className={cn("text-sm font-medium", !isYearly ? "text-[#f0f0ff]" : "text-[#6b7280]")}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 rounded-full bg-white/10 border border-white/10 p-1 relative transition-colors hover:border-[#6c47ff]/50"
          >
            <div className={cn(
              "w-5 h-5 rounded-full bg-[#6c47ff] transition-all duration-300",
              isYearly ? "translate-x-7" : "translate-x-0"
            )} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-medium", isYearly ? "text-[#f0f0ff]" : "text-[#6b7280]")}>Yearly</span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              SAVE 30%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={cn(
              "bg-[#13131a] border-2 relative overflow-hidden transition-all duration-500 hover:-translate-y-2",
              plan.color,
              plan.glow,
              currentTier === plan.id && "ring-2 ring-offset-4 ring-offset-[#0a0a0f] ring-[#6c47ff]"
            )}
          >
            {plan.badge && (
              <div className="absolute top-4 right-[-35px] rotate-45 bg-[#6c47ff] text-white text-[10px] font-bold py-1 w-32 text-center shadow-lg">
                {plan.badge}
              </div>
            )}
            
            <CardHeader className="p-8 pb-4">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                {plan.icon}
              </div>
              <CardTitle className="text-2xl font-bold text-[#f0f0ff]">{plan.name}</CardTitle>
              <CardDescription className="text-[#6b7280]">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#f0f0ff]">
                  ₹{isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#6b7280] text-sm">/{isYearly ? 'yr' : 'mo'}</span>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#f0f0ff]/80">
                    <CheckCircle2 className="h-4 w-4 text-[#00d4aa] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              <Button 
                onClick={() => plan.id !== 'free' && handlePayment(plan)}
                disabled={currentTier === plan.id || plan.id === 'free' || loading === plan.id}
                className={cn(
                  "w-full h-12 rounded-xl font-bold transition-all shadow-lg",
                  currentTier === plan.id 
                    ? "bg-white/5 text-[#6b7280] border border-white/10 cursor-default" 
                    : "bg-[#6c47ff] hover:bg-[#5535ee] text-white shadow-[#6c47ff]/20"
                )}
              >
                {loading === plan.id ? <Loader2 className="h-5 w-5 animate-spin" /> : 
                 currentTier === plan.id ? "Your Active Plan" : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="pt-12 space-y-8">
        <h2 className="text-2xl font-bold text-center text-[#f0f0ff]">Compare Features</h2>
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#13131a]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-6 text-left text-xs uppercase tracking-widest text-[#6b7280] font-bold">Feature</th>
                <th className="p-6 text-center text-xs uppercase tracking-widest text-[#6b7280] font-bold">Free</th>
                <th className="p-6 text-center text-xs uppercase tracking-widest text-[#6c47ff] font-bold">Pro</th>
                <th className="p-6 text-center text-xs uppercase tracking-widest text-amber-400 font-bold">Elite</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {FEATURES.map((f, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 text-sm text-[#f0f0ff]/80 font-medium">{f.label}</td>
                  <td className="p-6 text-center">
                    {f.free ? <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-white/10 mx-auto" />}
                  </td>
                  <td className="p-6 text-center">
                    {f.pro ? <CheckCircle2 className="h-4 w-4 text-[#6c47ff] mx-auto shadow-[0_0_10px_#6c47ff40]" /> : <X className="h-4 w-4 text-white/10 mx-auto" />}
                  </td>
                  <td className="p-6 text-center">
                    {f.elite ? <CheckCircle2 className="h-4 w-4 text-amber-400 mx-auto shadow-[0_0_10px_#fbbf2440]" /> : <X className="h-4 w-4 text-white/10 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2 text-sm font-bold text-[#f0f0ff]">
          <ShieldCheck className="h-5 w-5" />
          SECURE PAYMENTS
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#f0f0ff]">
          <BadgeCheck className="h-5 w-5" />
          RAZORPAY VERIFIED
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#f0f0ff]">
          <Sparkles className="h-5 w-5" />
          100% BUILDER SATISFACTION
        </div>
      </div>
    </div>
  );
}
