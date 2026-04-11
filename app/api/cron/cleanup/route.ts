import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Cron function to delete messages exceeding their retention limit
// Free tier: 24h
// Pro/Elite tier: 1 year (365 days)

export async function GET(req: Request) {
  // Verify using some authorization header if needed, but for Vercel Cron it's usually authenticated by CRON_SECRET
  const authHeader = req.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // We will do a manual process of fetching free users and pro users, though it's slow it works for basic implementations.
    // Optimal would be a Supabase RPC function. Here we orchestrate via API.
    
    // Date limits
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch free users
    const { data: freeUsers } = await supabase
      .from('users')
      .select('id')
      .in('subscription_tier', ['free', null])

    if (freeUsers && freeUsers.length > 0) {
      const freeUserIds = freeUsers.map((u: any) => u.id);
      
      // Delete their old messages > 24 hr
      // supabase .in doesnt support more than array limits, assuming small users for now.
      // Chunking strategy if needed.
      const batchSize = 100;
      for (let i = 0; i < freeUserIds.length; i += batchSize) {
         const batch = freeUserIds.slice(i, i + batchSize);
         await supabase
           .from('messages')
           .delete()
           .in('sender_id', batch)
           .lt('created_at', oneDayAgo);
      }
    }

    // Pro/Elite retention is 1 year. We just delete any message older than 1 year unconditionally 
    // to keep database clean.
    await supabase
      .from('messages')
      .delete()
      .lt('created_at', oneYearAgo);

    return NextResponse.json({ success: true, message: 'Message cleanup completed' });
  } catch (error) {
    console.error('Error cleaning up messages:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
