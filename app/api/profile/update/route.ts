import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      clerk_id, full_name, username, bio, college, city, state, github_url, 
      skills, roles, leetcode_username, codeforces_username, linkedin_url, 
      twitter_url, portfolio_url 
    } = body;

    if (!clerk_id) {
      return NextResponse.json({ error: 'Missing clerk_id' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get user id from clerk_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_id', clerk_id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    const userId = userData.id;

    // Update users table with optional fields using null coalescing
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        full_name: full_name ?? null,
        username: username ?? null,
        bio: bio ?? null,
        college: college ?? null,
        city: city ?? null,
        state: state ?? null,
        github_url: github_url ?? null,
        skills: skills ?? null,
        roles: roles ?? null,
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Upsert into profiles_extended table
    const { error: extendedError } = await supabaseAdmin
      .from('profiles_extended')
      .upsert({
        user_id: userId,
        leetcode_username: leetcode_username ?? null,
        codeforces_username: codeforces_username ?? null,
        linkedin_url: linkedin_url ?? null,
        twitter_url: twitter_url ?? null,
        portfolio_url: portfolio_url ?? null,
      });

    if (extendedError) {
      throw extendedError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}
