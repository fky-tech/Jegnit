import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        // Verify if logged in (check cookie)
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the admin user
        // Note: For simplicity, we update the first active admin. 
        // In a multi-admin system, we'd use the ID from the session token.
        const { error } = await supabaseAdmin
            .from('admin_users')
            .update({
                password_hash: hashedPassword,
                updated_at: new Date().toISOString()
            })
            .eq('is_active', true);

        if (error) {
            console.error('Update password error:', error);
            return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
