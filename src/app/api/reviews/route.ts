import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.product_id || !body.customer_name || !body.rating) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('reviews')
            .insert([{
                product_id: body.product_id,
                customer_name: body.customer_name,
                rating: parseInt(body.rating),
                comment: body.comment || ''
            }])
            .select();

        if (error) {
            console.error('Supabase Review Insert Error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (err) {
        console.error('Review API Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const supabaseAdmin = getSupabaseAdmin();
    let query = supabaseAdmin.from('reviews').select('*').order('created_at', { ascending: false });

    if (productId) {
        query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
