import { getSupabaseAdmin } from '@/utils/supabase-admin';
import DashboardContent from '@/components/admin/DashboardContent';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
    const supabaseAdmin = getSupabaseAdmin();

    // 1. Fetch products, orders, contacts, and reviews counts
    // 2. Fetch the reset timestamp
    const [
        productsRes,
        ordersRes,
        contactsRes,
        reviewsRes,
        adminRes
    ] = await Promise.all([
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('contacts').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('reviews').select('rating'),
        supabaseAdmin.from('admin_users').select('revenue_reset_at').eq('is_active', true).limit(1).maybeSingle()
    ]);

    const productsCount = productsRes.count || 0;
    const ordersCount = ordersRes.count || 0;
    const contactsCount = contactsRes.count || 0;
    const adminData = adminRes.data;
    const resetDateStr = adminData?.revenue_reset_at || new Date(0).toISOString();

    // 3. Fetch reset-aware data (Recent Orders & Revenue Details)
    const [
        recentOrdersRes,
        revenueDataRes
    ] = await Promise.all([
        supabaseAdmin.from('orders')
            .select('*')
            .gte('created_at', resetDateStr)
            .order('created_at', { ascending: false })
            .limit(5),
        supabaseAdmin.from('orders')
            .select('total, created_at, status')
            .neq('status', 'cancelled')
            .gte('created_at', resetDateStr)
            .order('created_at', { ascending: false })
    ]);

    const recentOrders = recentOrdersRes.data || [];
    const revenueDetails = revenueDataRes.data || [];

    // Calculate total revenue from filtered data
    const totalRevenue = revenueDetails.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);

    const reviewsData = reviewsRes.data || [];
    const avgRating = reviewsData.length
        ? (reviewsData.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviewsData.length).toFixed(1)
        : '0.0';

    return (
        <DashboardContent
            productsCount={productsCount}
            ordersCount={ordersCount}
            contactsCount={contactsCount}
            recentOrders={recentOrders}
            totalRevenue={totalRevenue}
            avgRating={avgRating}
            revenueDetails={revenueDetails}
            reviewsCount={reviewsData.length}
        />
    );
}
