import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json(
                { error: 'Invalid product ID' },
                { status: 400 }
            );
        }

        const supabase = getSupabaseAdmin();

        // Get average rating and count from reviews table
        const { data, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('product_id', productId);

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json({
                averageRating: 0,
                reviewCount: 0
            });
        }

        const total = data.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = total / data.length;

        return NextResponse.json({
            averageRating: Number(averageRating.toFixed(1)),
            reviewCount: data.length
        });
    } catch (error: any) {
        console.error('Error fetching product rating:', error);
        return NextResponse.json(
            { error: 'Failed to fetch rating' },
            { status: 500 }
        );
    }
}
