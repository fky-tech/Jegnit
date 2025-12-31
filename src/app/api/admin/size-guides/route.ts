import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('product_id');
        const supabaseAdmin = getSupabaseAdmin();

        let query = supabaseAdmin.from('product_size_guides').select('*, products(name)');

        if (productId) {
            query = query.eq('product_id', productId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { product_id, content } = body;

        if (!product_id || !content) {
            return NextResponse.json({ error: 'Missing product_id or content' }, { status: 400 });
        }

        const supabaseAdmin = getSupabaseAdmin();

        // Check for existing guide
        const { data: existing } = await supabaseAdmin
            .from('product_size_guides')
            .select('id')
            .eq('product_id', product_id)
            .maybeSingle();

        let result;
        if (existing) {
            // Update existing
            result = await supabaseAdmin
                .from('product_size_guides')
                .update({ content })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Insert new
            result = await supabaseAdmin
                .from('product_size_guides')
                .insert([{ product_id, content }])
                .select()
                .single();
        }

        if (result.error) {
            console.error('Database Error:', result.error);
            throw result.error;
        }

        return NextResponse.json(result.data);
    } catch (error: any) {
        console.error('Size Guide POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const supabaseAdmin = getSupabaseAdmin();

        const { error } = await supabaseAdmin
            .from('product_size_guides')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
