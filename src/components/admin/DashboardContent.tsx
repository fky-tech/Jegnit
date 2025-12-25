'use client';
import { useState } from 'react';
import { ShoppingBag, Users, DollarSign, Package, Star, ArrowRight, TrendingUp, Calendar, X } from 'lucide-react';
import Link from 'next/link';
import OrderDetailsModal from './OrderDetailsModal';

interface DashboardContentProps {
    productsCount: number;
    ordersCount: number;
    contactsCount: number;
    recentOrders: any[];
    totalRevenue: number;
    avgRating: string;
    revenueDetails: any[];
    reviewsCount: number;
}

export default function DashboardContent({
    productsCount,
    ordersCount,
    contactsCount,
    recentOrders,
    totalRevenue,
    avgRating,
    revenueDetails,
    reviewsCount
}: DashboardContentProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [showRevenueModal, setShowRevenueModal] = useState(false);

    // Group revenue by date
    const revenueByDate = revenueDetails.reduce((acc: any, curr: any) => {
        const date = new Date(curr.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (Number(curr.total) || 0);
        return acc;
    }, {});

    const sortedDates = Object.entries(revenueByDate).sort((a, b) =>
        new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
            case 'processed': return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
            case 'shipped': return { color: 'bg-blue-100 text-blue-800 border-blue-200' };
            case 'completed': return { color: 'bg-green-100 text-green-800 border-green-200' };
            case 'cancelled': return { color: 'bg-red-100 text-red-800 border-red-200' };
            default: return { color: 'bg-gray-100 text-gray-800 border-gray-200' };
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Revenue Card - Click for Popup */}
                <div
                    onClick={() => setShowRevenueModal(true)}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp className="w-16 h-16 text-[#ff6a00]" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-orange-100 rounded-2xl text-[#ff6a00]">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">ETB {totalRevenue.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Revenue</div>
                    <div className="mt-4 flex items-center text-[10px] font-bold text-[#ff6a00] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                </div>

                {/* Orders Card */}
                <Link href="/admin/orders" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{ordersCount || 0}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Orders</div>
                </Link>

                {/* Products Card */}
                <Link href="/admin/products" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{productsCount || 0}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Products</div>
                </Link>

                {/* Messages Card */}
                <Link href="/admin/contacts" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{contactsCount || 0}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Messages</div>
                </Link>

                {/* Overall Rating Card - NEW */}
                <Link href="/admin/reviews" className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group border-b-4 border-b-yellow-400">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-yellow-100 rounded-2xl text-yellow-600">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                    </div>
                    <div className="text-2xl font-black text-gray-900">{avgRating} / 5</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Overall Rating ({reviewsCount} reviews)</div>
                </Link>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-xs font-black text-[#ff6a00] uppercase tracking-widest hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {(!recentOrders || recentOrders.length === 0) ? (
                        <div className="bg-gray-50 p-8 rounded-2xl text-center">
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No recent orders found.</p>
                        </div>
                    ) : (
                        recentOrders.map((o: any) => (
                            <div
                                key={o.id}
                                onClick={() => setSelectedOrder(o)}
                                className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-mono text-xs font-bold text-[#ff6a00] border border-gray-100">
                                        #{o.id}
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900 uppercase tracking-tight">{o.customer_name}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(o.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div>
                                        <div className="font-black text-gray-900">ETB {o.fees?.total || o.total || '0.00'}</div>
                                        <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block border ${getStatusInfo(o.status).color}`}>
                                            {o.status}
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-[#ff6a00] transition-colors" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Revenue Details Modal */}
            {showRevenueModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRevenueModal(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-black text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold uppercase italic tracking-tighter">Revenue Analysis</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Date-wise Breakdown</p>
                            </div>
                            <button onClick={() => setShowRevenueModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-4">
                                {sortedDates.map(([date, amount]: [string, any]) => (
                                    <div key={date} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="font-bold text-gray-700">{date}</span>
                                        </div>
                                        <span className="font-black text-[#ff6a00]">ETB {amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-lg font-black text-gray-900 border-b border-gray-200 pb-4 mb-4">
                                <span className="uppercase tracking-widest">Total Calculated</span>
                                <span className="text-[#ff6a00]">ETB {totalRevenue.toLocaleString()}</span>
                            </div>
                            <button onClick={() => setShowRevenueModal(false)} className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg">
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Details Modal (Shared) */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    getStatusInfo={getStatusInfo}
                />
            )}
        </div>
    );
}
