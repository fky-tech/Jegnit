import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/utils/supabase-admin';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const supabase = getSupabaseAdmin();
        // Get recent orders (last 24 hours) as notifications
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

        const { data: recentOrders, error: ordersError } = await supabase
            .from('orders')
            .select('id, customer_name, fees, created_at, status')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false })
            .limit(10);

        if (ordersError) throw ordersError;

        // Get recent reviews (last 24 hours)
        const { data: recentReviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('id, customer_name, rating, created_at')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false })
            .limit(10);

        if (reviewsError) throw reviewsError;

        // Get recent contact messages (last 24 hours)
        const { data: recentContacts, error: contactsError } = await supabase
            .from('contacts')
            .select('id, name, subject, created_at')
            .gte('created_at', oneDayAgo)
            .order('created_at', { ascending: false })
            .limit(10);

        if (contactsError) throw contactsError;

        const orderNotifications = (recentOrders || []).map(order => {
            const fees = typeof order.fees === 'string' ? JSON.parse(order.fees) : order.fees;
            const total = fees?.total || 0;

            return {
                id: `order-${order.id}`,
                title: `New Order #${order.id}`,
                message: `${order.customer_name} - ETB ${total}`,
                time: new Date(order.created_at).toLocaleString(),
                unread: order.status === 'pending',
                type: 'order'
            };
        });

        const reviewNotifications = (recentReviews || []).map(review => ({
            id: `review-${review.id}`,
            title: `New Review`,
            message: `${review.customer_name}: ${review.rating} Stars`,
            time: new Date(review.created_at).toLocaleString(),
            unread: true,
            type: 'review'
        }));

        const contactNotifications = (recentContacts || []).map(contact => ({
            id: `contact-${contact.id}`,
            title: `New Message`,
            message: `${contact.name}: ${contact.subject || 'No Subject'}`,
            time: new Date(contact.created_at).toLocaleString(),
            unread: true,
            type: 'contact'
        }));

        // Merge and sort
        const notifications = [...orderNotifications, ...reviewNotifications, ...contactNotifications].sort((a, b) =>
            new Date(b.time).getTime() - new Date(a.time).getTime()
        );

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
