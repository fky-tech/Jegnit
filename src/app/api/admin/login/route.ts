import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

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
            .maybeSingle();

        if (error) {
            console.error('Database query error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify Hashed Password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Set secure session cookie (httponly prevents XSS)
        const cookieStore = await cookies();
        cookieStore.set('admin_token', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 86400 // 1 day
        });

        // Return success
        return NextResponse.json({ success: true, user: { email: user.email, full_name: user.full_name } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
