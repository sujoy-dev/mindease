import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getJournalEntries, getAIResponses } from '@/services/supabase';
import { analyzePatterns } from '@/utils/patternAnalyzer';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 7;

    const [entriesResponse, responsesResponse] = await Promise.all([
      supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit),
      supabase
        .from('ai_responses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
    ]);

    const entries = entriesResponse.data || [];
    const responses = responsesResponse.data || [];

    const patternData = analyzePatterns(entries, responses);

    return NextResponse.json(patternData);
  } catch (error: any) {
    console.error('Patterns API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
