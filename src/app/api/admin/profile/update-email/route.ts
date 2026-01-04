import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Verify if logged in (check cookie)
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Update the admin user email
        // Note: For simplicity, we update the first active admin.
        const { error } = await supabaseAdmin
            .from('admin_users')
            .update({
                email: email,
                updated_at: new Date().toISOString()
            })
            .eq('is_active', true);

        if (error) {
            console.error('Update email error:', error);
            // Handle unique constraint violation (email already exists)
            if (error.code === '23505') {
                return NextResponse.json({ error: 'This email is already in use' }, { status: 400 });
            }
            return NextResponse.json({ error: 'Failed to update email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Email updated successfully' });
    } catch (error) {
        console.error('Update email error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
