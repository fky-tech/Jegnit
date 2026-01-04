import { Bell, X, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function NotificationBell({ mode = 'light' }: { mode?: 'light' | 'dark' }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadOrders, setUnreadOrders] = useState(0);
    const [unreadReviews, setUnreadReviews] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);
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
            const unread = activeNotifications.filter((n: any) => n.unread);
            setUnreadCount(unread.length);

            // Categorize unread
            const orders = unread.filter((n: any) => n.type === 'order').length;
            const blueBadgeNotifs = unread.filter((n: any) => n.type === 'review' || n.type === 'contact').length;

            setUnreadOrders(orders);
            setUnreadReviews(blueBadgeNotifs);
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

        // Update counts optimistically
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Re-calculate types locally would be complex without full object, 
        // but the poll will correct it shortly. 
        // For distinct visual accuracy immediately, we can decrement based on assumptions or just wait for poll.
        // Let's just wait for next poll to update specific color counts to avoid drift.
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`relative p-2 rounded-lg transition-all duration-200 ${mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} ${showDropdown ? 'bg-gray-100' : ''}`}
            >
                <Bell className={`w-5 h-5 ${mode === 'dark' ? 'text-white' : (showDropdown ? 'text-[#ff6a00]' : 'text-gray-600')}`} />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-2 flex gap-0.5">
                        {unreadOrders > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-sm ring-1 ring-white" title="New Orders">
                                {unreadOrders > 9 ? '9+' : unreadOrders}
                            </span>
                        )}
                        {unreadReviews > 0 && (
                            <span className="bg-blue-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse shadow-sm ring-1 ring-white" title="New Reviews/Messages">
                                {unreadReviews > 9 ? '9+' : unreadReviews}
                            </span>
                        )}
                    </div>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="fixed md:absolute inset-x-4 md:inset-auto md:right-0 top-16 md:top-full mt-2 w-auto md:w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-20 overflow-hidden flex flex-col animate-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-[#ff6a00]" />
                                Notifications
                            </h3>
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto scrollbar-thin">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400">
                                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.slice(0, 4).map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                window.location.href = notif.type === 'order' ? '/admin/orders' : notif.type === 'contact' ? '/admin/contacts' : '/admin/reviews';
                                            }}
                                            className="p-4 hover:bg-gray-50 transition-colors group relative cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? (notif.type === 'order' ? 'bg-red-500' : 'bg-blue-500') : 'bg-transparent'}`} />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 leading-tight">{notif.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{notif.time}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    dismissNotification(notif.id);
                                                }}
                                                className="absolute top-4 right-4 p-1 hover:bg-red-50 text-red-600 rounded transition-all"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {notifications.length > 4 && (
                            <button
                                onClick={() => {
                                    setShowDropdown(false);
                                    setShowAllModal(true);
                                }}
                                className="w-full p-3 text-xs font-bold text-[#ff6a00] uppercase tracking-widest hover:bg-orange-50 transition-colors border-t border-gray-100 flex items-center justify-center gap-2"
                            >
                                View All Notifications <ArrowRight className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </>
            )}

            {/* View All Modal */}
            {showAllModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto scrollbar-none">
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAllModal(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 flex flex-col max-h-[85vh] my-auto">
                        <div className="p-6 bg-black text-white flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#ff6a00]">All Notifications</h3>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">Activity Log</p>
                            </div>
                            <button onClick={() => setShowAllModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => {
                                            setShowAllModal(false);
                                            window.location.href = notif.type === 'order' ? '/admin/orders' : notif.type === 'contact' ? '/admin/contacts' : '/admin/reviews';
                                        }}
                                        className="p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#ff6a00]/30 transition-all group relative cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${notif.unread ? (notif.type === 'order' ? 'bg-red-500' : 'bg-blue-500') : 'bg-transparent'}`} />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="font-black text-gray-900 uppercase tracking-tight text-base group-hover:text-[#ff6a00] transition-colors">{notif.title}</p>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{notif.time}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1.5 font-medium">{notif.message}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dismissNotification(notif.id);
                                            }}
                                            className="absolute top-4 right-4 p-2 bg-white hover:bg-red-50 text-red-600 rounded-xl shadow-sm border border-gray-100 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
                            <button onClick={() => setShowAllModal(false)} className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest hover:bg-[#ff6a00] transition-all shadow-lg text-xs">
                                Close Notifications
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
