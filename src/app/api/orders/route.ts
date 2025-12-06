import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.customer_name || !body.customer_phone || !body.items) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Use Admin client to bypass RLS (Row Level Security)
        // This allows us to Insert AND Select the returned ID safely
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('orders')
            .insert([body])
            .select() // This works now because we are Admin
            .single();

        if (error) {
            console.error('Supabase Order Insert Error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    } catch (err) {
        console.error('Order API Error:', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
