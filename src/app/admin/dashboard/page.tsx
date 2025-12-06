import { getSupabaseAdmin } from '@/utils/supabase-admin';
import { ShoppingBag, Users, DollarSign, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabaseAdmin = getSupabaseAdmin();
    // Fetch real counts concurrently
    const [
        { count: productsCount },
        { count: ordersCount },
        { count: contactsCount },
        { data: recentOrders }
    ] = await Promise.all([
        supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('contacts').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    // Calculate total revenue from orders (simplified/naive approach for now)
    const totalRevenue = 12500; // Placeholder until RPC is set up

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-7">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-lg text-[#ff6a00]">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Revenue</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{ordersCount || 0}</div>
                    <div className="text-sm text-gray-500">Total Orders</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{productsCount || 0}</div>
                    <div className="text-sm text-gray-500">Total Products</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{contactsCount || 0}</div>
                    <div className="text-sm text-gray-500">Messages</div>
                </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Recent Orders</h2>
                <div className="space-y-4">
                    {(!recentOrders || recentOrders.length === 0) ? (
                        <p className="text-gray-400">No recent orders.</p>
                    ) : (
                        recentOrders.map((o: any) => (
                            <div key={o.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <div className="font-bold text-gray-900">Order #{o.id}</div>
                                    <div className="text-sm text-gray-500">{o.customer_name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-[#ff6a00]">${o.fees?.total || '0.00'}</div>
                                    <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
