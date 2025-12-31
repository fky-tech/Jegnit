import { getSupabaseAdmin } from '@/utils/supabase-admin';
import DashboardContent from '@/components/admin/DashboardContent';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabaseAdmin = getSupabaseAdmin();
    // Fetch real counts concurrently
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: contactsCount },
        { data: recentOrders },
        { data: ordersData },
        { data: reviewsData }
    ] = await Promise.all([
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('contacts').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
        supabaseAdmin.from('orders').select('total, created_at, status').neq('status', 'cancelled').order('created_at', { ascending: false }),
        supabaseAdmin.from('reviews').select('rating')
    ]);

    // Calculate total revenue and group by date
    const totalRevenue = ordersData?.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) || 0;
    const avgRating = reviewsData?.length
        ? (reviewsData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsData.length).toFixed(1)
        : '0.0';

    // Pass detailed data to a Client Component for interactivity
    const revenueDetails = ordersData || [];
    const reviewsCount = reviewsData?.length || 0;

    return (
        <DashboardContent
            productsCount={productsCount || 0}
            ordersCount={ordersCount || 0}
            contactsCount={contactsCount || 0}
            recentOrders={recentOrders || []}
            totalRevenue={totalRevenue}
            avgRating={avgRating}
            revenueDetails={revenueDetails}
            reviewsCount={reviewsCount}
        />
    );
}
