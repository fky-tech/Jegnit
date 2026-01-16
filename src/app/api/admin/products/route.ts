import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function GET() {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Admin Create Body:", body);
        const supabaseAdmin = getSupabaseAdmin();

        // Basic validation could go here

        const { data, error } = await supabaseAdmin
            .from('products')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const supabaseAdmin = getSupabaseAdmin();

        const { data, error } = await supabaseAdmin
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    try {
        // First, fetch the product to get all image URLs
        const { data: product, error: fetchError } = await supabaseAdmin
            .from('products')
            .select('img, colors')
            .eq('id', id)
            .single();

        if (fetchError) {
            console.error('Error fetching product:', fetchError);
            return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }

        // Collect all image filenames to delete
        const filesToDelete: string[] = [];

        // Add main image if exists
        if (product.img) {
            const fileName = product.img.split('/').pop();
            if (fileName) filesToDelete.push(fileName);
        }

        // Add all color variant images
        if (product.colors) {
            let colorArray: any[] = [];
            try {
                colorArray = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors;
            } catch (e) {
                console.error('Error parsing colors:', e);
            }

            colorArray.forEach((color: any) => {
                if (color.images && Array.isArray(color.images)) {
                    color.images.forEach((imageUrl: string) => {
                        const fileName = imageUrl.split('/').pop();
                        if (fileName) filesToDelete.push(fileName);
                    });
                }
            });
        }

        // Delete all images from storage if any exist
        if (filesToDelete.length > 0) {
            const { error: storageError } = await supabaseAdmin
                .storage
                .from('product-images')
                .remove(filesToDelete);

            if (storageError) {
                console.error('Error deleting images from storage:', storageError);
                // Continue with product deletion even if storage deletion fails
            }
        }

        // Delete the product record
        const { error: deleteError } = await supabaseAdmin
            .from('products')
            .delete()
            .eq('id', id);

        if (deleteError) {
            console.error('Error deleting product:', deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
    }
}
