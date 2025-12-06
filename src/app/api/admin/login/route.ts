import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // Verify using Service Role (Bypasses RLS)
        const supabaseAdmin = getSupabaseAdmin();
        const { data: user, error } = await supabaseAdmin
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .eq('password_hash', password) // Still using plain text as requested
            .maybeSingle();

        if (error) {
            console.error('Database query error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return success (Client will set cookie)
        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
