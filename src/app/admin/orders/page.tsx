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
        <div className="mt-20 md:mt-5 ml-2">
            <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 pb-7">Orders</h1>
            <OrderTable initialOrders={orders || []} />
        </div>
    );
}
