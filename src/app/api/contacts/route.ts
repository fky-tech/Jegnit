import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data: messages, error } = await supabaseAdmin
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(messages);
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
