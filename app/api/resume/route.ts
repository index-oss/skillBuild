import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    
    // Get profile id first
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ resume: null });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('profile_id', profile.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching resume:', error);
    }

    return NextResponse.json({ resume: resume || null });
  } catch (error) {
    console.error('Resume GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if resume exists
    const { data: existing } = await supabase
      .from('resumes')
      .select('id')
      .eq('profile_id', profile.id)
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('resumes')
        .update({
          title: body.title,
          summary: body.summary,
          skills: body.skills,
          experience: body.experience,
          education: body.education,
          updated_at: new Date().toISOString(),
        })
        .eq('profile_id', profile.id);
    } else {
      result = await supabase
        .from('resumes')
        .insert({
          profile_id: profile.id,
          title: body.title || 'My Resume',
          summary: body.summary || '',
          skills: body.skills || [],
          experience: body.experience || [],
          education: body.education || [],
        });
    }

    if (result.error) {
      console.error('Error saving resume:', result.error);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resume POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}