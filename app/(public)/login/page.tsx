import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center justify-center bg-transparent">
              <Image src="/logo.png" alt="Vertex3" width={32} height={32} className="object-contain filter invert opacity-90" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#f0f0ff]">Vertex3</span>
          </div>
          <h1 className="text-3xl font-bold text-[#f0f0ff]">Welcome back</h1>
          <p className="text-[#6b7280]">Sign in to find your team</p>
        </div>

        <div className="bg-[#13131a] p-6 rounded-2xl border border-white/10 shadow-xl">
          <SignIn 
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
            signUpUrl="/signup"
          />
        </div>

        <div className="mt-6 text-center text-sm text-[#6b7280]">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#6c47ff] hover:text-[#5535ee] font-medium transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
