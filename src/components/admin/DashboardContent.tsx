'use client';
import { useState } from 'react';
import { ShoppingBag, Users, DollarSign, Package, Star, ArrowRight, TrendingUp, Calendar, X, Download } from 'lucide-react';
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

    // Group revenue by date, excluding cancelled orders
    const revenueByDate = revenueDetails.reduce((acc: any, curr: any) => {
        if (curr.status === 'cancelled') return acc;
        const date = new Date(curr.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + (Number(curr.total) || 0);
        return acc;
    }, {});

    const sortedDates = Object.entries(revenueByDate).sort((a, b) =>
        new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/20' };
            case 'processed': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20' };
            case 'shipped': return { color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20' };
            case 'completed': return { color: 'bg-green-50 text-green-700 border-green-200 ring-green-500/20' };
            case 'cancelled': return { color: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20' };
            default: return { color: 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/20' };
        }
    };

    const downloadRevenueReport = () => {
        // Headers
        const headers = ['Date', 'Revenue (ETB)'];
        const csvContent = [
            headers.join(','),
            ...sortedDates.map(([date, amount]: [string, any]) => `${date},${amount}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `revenue_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 mt-20 md:mt-5 ml-2">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back to your command center.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Revenue Card - Click for Popup */}
                <div
                    onClick={() => setShowRevenueModal(true)}
                    className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(255,106,0,0.1)] border border-gray-100 hover:border-[#ff6a00]/20 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                        <TrendingUp className="w-20 h-20 text-[#ff6a00]" />
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-orange-50 rounded-2xl text-[#ff6a00] group-hover:bg-[#ff6a00] group-hover:text-white transition-colors duration-300">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-1 relative z-10">
                        <div className="text-2xl font-black text-gray-900 tracking-tight">ETB {totalRevenue.toLocaleString()}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Revenue</div>
                    </div>
                    <div className="mt-4 flex items-center text-[10px] font-bold text-[#ff6a00] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                        View Details <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                </div>

                {/* Orders Card */}
                <Link href="/admin/orders" className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(59,130,246,0.1)] border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{ordersCount || 0}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</div>
                    </div>
                </Link>

                {/* Products Card */}
                <Link href="/admin/products" className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(168,85,247,0.1)] border border-gray-100 hover:border-purple-200 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-purple-50 rounded-2xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                            <Package className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{productsCount || 0}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Products</div>
                    </div>
                </Link>

                {/* Messages Card */}
                <Link href="/admin/contacts" className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(34,197,94,0.1)] border border-gray-100 hover:border-green-200 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{contactsCount || 0}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Messages</div>
                    </div>
                </Link>

                {/* Overall Rating Card */}
                <Link href="/admin/reviews" className="bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(234,179,8,0.1)] border border-gray-100 hover:border-yellow-200 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2.5 bg-yellow-50 rounded-2xl text-yellow-600 group-hover:bg-yellow-400 group-hover:text-white transition-colors duration-300">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black text-gray-900 tracking-tight">{avgRating} <span className="text-base text-gray-400 font-bold">/ 5</span></div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall Rating ({reviewsCount})</div>
                    </div>
                </Link>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Recent Activities</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Latest Orders</p>
                    </div>
                    <Link href="/admin/orders" className="px-5 py-2.5 bg-black !text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
                        View All Orders <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {(!recentOrders || recentOrders.length === 0) ? (
                        <div className="bg-gray-50 py-12 rounded-[1.5rem] text-center border-2 border-dashed border-gray-200">
                            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No recent orders found.</p>
                        </div>
                    ) : (
                        recentOrders.map((o: any) => (
                            <div
                                key={o.id}
                                onClick={() => setSelectedOrder(o)}
                                className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#ff6a00]/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-mono text-xs font-bold text-[#ff6a00] border border-gray-100 group-hover:bg-[#ff6a00] group-hover:text-white transition-colors duration-300 shadow-inner">
                                        #{o.id}
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900 text-base uppercase tracking-tight group-hover:text-[#ff6a00] transition-colors">{o.customer_name}</div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(o.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 md:mt-0 flex items-center gap-6 justify-between md:justify-end w-full md:w-auto">
                                    <div className="text-right">
                                        <div className="font-black text-gray-900 text-base">ETB {(o.fees?.total || o.total || 0).toLocaleString()}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Total Amount</div>
                                    </div>

                                    <div className={`
                                        px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ring-1 ring-inset
                                        ${getStatusInfo(o.status).color}
                                    `}>
                                        {o.status}
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Revenue Details Modal */}
            {showRevenueModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setShowRevenueModal(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100">
                        <div className="p-8 bg-black text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <DollarSign className="w-32 h-32 text-white transform rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#ff6a00]">Revenue</h3>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 font-bold">Financial Breakdown</p>
                            </div>
                            <div className="flex items-center gap-3 relative z-10">
                                <button
                                    onClick={downloadRevenueReport}
                                    className="p-3 bg-white/10 hover:bg-[#ff6a00] rounded-xl transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white ring-1 ring-white/20"
                                    title="Download CSV"
                                >
                                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
                                </button>
                                <button onClick={() => setShowRevenueModal(false)} className="p-3 bg-white/10 hover:bg-red-500 rounded-xl transition-colors ring-1 ring-white/20">
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="p-8 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                            <div className="space-y-3">
                                {sortedDates.map(([date, amount]: [string, any]) => (
                                    <div key={date} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#ff6a00]/30 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:text-[#ff6a00] transition-colors">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-gray-700">{date}</span>
                                        </div>
                                        <span className="font-black text-xl text-gray-900 group-hover:text-[#ff6a00] transition-colors">ETB {amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center text-xl font-black text-gray-900 border-b border-gray-200 pb-6 mb-6">
                                <span className="uppercase tracking-widest">Total Revenue</span>
                                <span className="text-[#ff6a00]">ETB {totalRevenue.toLocaleString()}</span>
                            </div>
                            <button onClick={() => setShowRevenueModal(false)} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-orange-500/20 hover:shadow-xl transition-all shadow-lg active:scale-95">
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
