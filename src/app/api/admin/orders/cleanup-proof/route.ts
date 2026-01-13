import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function POST(request: Request) {
    try {
        const { imagePath } = await request.json();

        if (!imagePath) {
            return NextResponse.json({ error: 'Image path required' }, { status: 400 });
        }

        const fileName = imagePath.split('/').pop();

        if (!fileName) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .storage
            .from('order-screenshots')
            .remove([fileName]);

        if (error) {
            console.error('Storage delete error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
