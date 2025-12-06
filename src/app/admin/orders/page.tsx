import { getSupabaseAdmin } from '@/utils/supabase-admin';
import OrderTable from '@/components/admin/OrderTable';

export const dynamic = 'force-dynamic';

export default async function AdminOrders() {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800 pb-7">Orders</h1>
            <OrderTable initialOrders={orders || []} />
        </div>
    );
}
