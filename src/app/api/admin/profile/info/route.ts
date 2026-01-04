import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        // Verify if logged in (check cookie)
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Fetch the active admin info
        const { data: admin, error } = await supabaseAdmin
            .from('admin_users')
            .select('email, full_name')
            .eq('is_active', true)
            .maybeSingle();

        if (error || !admin) {
            return NextResponse.json({ error: 'Failed to fetch admin info' }, { status: 500 });
        }

        return NextResponse.json({ email: admin.email, full_name: admin.full_name });
    } catch (error) {
        console.error('Fetch admin info error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
