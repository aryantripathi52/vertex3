import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-[#6c47ff] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-[#f0f0ff] mb-6">Page Not Found</h2>
      <p className="text-[#6b7280] max-w-md mb-10">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-[#6c47ff] hover:bg-[#5535ee] text-white rounded-xl">
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
