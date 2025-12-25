import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        // Get recent orders (last 24 hours) as notifications
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: recentOrders, error } = await supabase
            .from('orders')
            .select('id, customer_name, fees, created_at, status')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        const notifications = (recentOrders || []).map(order => {
            const fees = typeof order.fees === 'string' ? JSON.parse(order.fees) : order.fees;
            const total = fees?.total || 0;

            return {
                id: `order-${order.id}`, // Unique ID for tracking dismissal
                title: `New Order #${order.id}`,
                message: `${order.customer_name} - ETB ${total}`,
                time: new Date(order.created_at).toLocaleString(),
                unread: order.status === 'pending'
            };
        });

        const unreadCount = notifications.filter(n => n.unread).length;

        return NextResponse.json({
            notifications,
            unreadCount
        });
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
