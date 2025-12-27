import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabaseAdmin = getSupabaseAdmin();

        const { error } = await supabaseAdmin
            .from('contacts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase Contact Delete Error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error('Contact Delete API Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
