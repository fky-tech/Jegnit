import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotificationBell({ mode = 'light' }: { mode?: 'light' | 'dark' }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            const data = await res.json();

            // Get dismissed notification IDs from localStorage
            const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');

            // Filter out dismissed notifications
            const activeNotifications = (data.notifications || []).filter(
                (notif: any) => !dismissed.includes(notif.id)
            );

            setNotifications(activeNotifications);
            setUnreadCount(activeNotifications.filter((n: any) => n.unread).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const dismissNotification = (notifId: string) => {
        // Add to dismissed list in localStorage
        const dismissed = JSON.parse(localStorage.getItem('dismissedNotifications') || '[]');
        if (!dismissed.includes(notifId)) {
            dismissed.push(notifId);
            localStorage.setItem('dismissedNotifications', JSON.stringify(dismissed));
        }

        // Remove from current notifications
        setNotifications(prev => prev.filter(n => n.id !== notifId));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative p-2 rounded-lg transition-colors ${mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
                <Bell className={`w-5 h-5 ${mode === 'dark' ? 'text-white' : 'text-gray-600'}`} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#ff6a00] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                        </div>
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            setShowDropdown(false);
                                            window.location.href = '/admin/orders';
                                        }}
                                        className="p-4 hover:bg-gray-50 transition-colors group relative cursor-pointer"
                                    >
                                        <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                                        <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dismissNotification(notif.id);
                                            }}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all text-xs font-medium"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
