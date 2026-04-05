import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#f0f0ff]">Vertex3</span>
          </div>
          <h1 className="text-3xl font-bold text-[#f0f0ff]">Join Vertex3</h1>
          <p className="text-[#6b7280]">India&apos;s builder community awaits</p>
        </div>

        <div className="bg-[#13131a] p-6 rounded-2xl border border-white/10 shadow-xl">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors",
                formButtonPrimary: "bg-[#6c47ff] hover:bg-[#5535ee] text-white font-semibold transition-colors py-2",
                formFieldLabel: "text-[#6b7280]",
                formFieldInput: "bg-white/5 border border-white/10 text-white rounded-lg focus:border-[#6c47ff] focus:ring-1 focus:ring-[#6c47ff]",
                footerActionLink: "text-[#6c47ff] hover:text-[#5535ee]",
                identityPreviewText: "text-[#f0f0ff]",
                identityPreviewEditButtonIcon: "text-[#6c47ff]"
              }
            }}
            routing="hash"
            signInUrl="/login"
          />
        </div>

        <div className="mt-6 text-center text-sm text-[#6b7280]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6c47ff] hover:text-[#5535ee] font-medium transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
