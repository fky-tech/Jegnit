import { getSupabaseAdmin } from '@/utils/supabase-admin';
import ProductList from '@/components/admin/ProductList';

export default async function AdminProducts() {
    // Fetch initial data server-side using Service Role for speed and SEO (if public)
    const supabaseAdmin = getSupabaseAdmin();
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    return <ProductList initialProducts={products || []} />;
}
