import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Password required' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // 1. Verify Password against any admin user
        // We check if any admin has a password that matches the provided one
        const { data: admins, error: dbError } = await supabaseAdmin
            .from('admin_users')
            .select('password_hash')
            .eq('is_active', true);

        if (dbError || !admins) {
            return NextResponse.json({ error: 'Database check failed' }, { status: 500 });
        }

        // Check if any admin password matches
        let isValid = false;
        for (const admin of admins) {
            if (await bcrypt.compare(password, admin.password_hash)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            return NextResponse.json({ error: 'Incorrect Admin Password' }, { status: 401 });
        }

        // 2. Perform the Clear Action (Truncate/Delete Orders)
        // 2. Perform Logical Reset (Non-Destructive)
        // Set revenue_reset_at to NOW() for all active admins
        const { error: updateError } = await supabaseAdmin
            .from('admin_users')
            .update({ revenue_reset_at: new Date().toISOString() })
            .eq('is_active', true);

        if (updateError) {
            console.error('Reset error:', updateError);
            return NextResponse.json({ error: 'Failed to reset revenue metrics' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Revenue history reset visually' });

    } catch (error) {
        console.error('Clear revenue error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
