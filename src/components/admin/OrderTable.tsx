'use client';
import { useState } from 'react';
import { Loader, Package, Truck, CheckCircle, Clock, ChevronDown, X, User, Phone, MapPin, CreditCard, DollarSign } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderTableProps {
    initialOrders: any[];
}

export default function OrderTable({ initialOrders }: OrderTableProps) {
    const { addNotification } = useNotification();
    const [orders, setOrders] = useState(initialOrders);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const filteredOrders = orders.filter(o => {
        if (!startDate && !endDate) return true;
        const orderDate = new Date(o.created_at).getTime();
        const start = startDate ? new Date(startDate).getTime() : 0;
        const end = endDate ? new Date(endDate).getTime() : Infinity;
        return orderDate >= start && orderDate <= end;
    });

    const exportToCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Address', 'Item Name', 'Size', 'Color', 'Qty', 'Item Price', 'Payment Method', 'Status', 'Order Total'];
        const rows: any[] = [];

        filteredOrders.forEach(o => {
            if (o.items && o.items.length > 0) {
                o.items.forEach((item: any) => {
                    rows.push([
                        o.id,
                        new Date(o.created_at).toLocaleDateString(),
                        `"${o.customer_name.replace(/"/g, '""')}"`,
                        o.customer_phone,
                        `"${o.customer_address.replace(/"/g, '""')}"`,
                        `"${item.name.replace(/"/g, '""')}"`,
                        item.size,
                        item.color || 'Standard',
                        item.quantity,
                        item.price,
                        o.payment_method,
                        o.status,
                        o.total || o.fees?.total || 0
                    ]);
                });
            } else {
                rows.push([
                    o.id,
                    new Date(o.created_at).toLocaleDateString(),
                    `"${o.customer_name.replace(/"/g, '""')}"`,
                    o.customer_phone,
                    `"${o.customer_address.replace(/"/g, '""')}"`,
                    'N/A', 'N/A', 'N/A', 0, 0,
                    o.payment_method,
                    o.status,
                    o.total || o.fees?.total || 0
                ]);
            }
        });

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `detailed_orders_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        setUpdatingId(id);
        setActiveDropdown(null); // Close dropdown
        try {
            const res = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });
            const updatedOrder = await res.json();

            if (updatedOrder.error) throw new Error(updatedOrder.error);

            setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
            addNotification(`Order status updated to ${newStatus}`);
        } catch (error) {
            console.error(error);
            addNotification("Failed to update status", 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'bg-yellow-50 text-yellow-700 border-yellow-200 ring-yellow-500/20', icon: Clock, label: 'Pending' };
            case 'processed': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20', icon: Package, label: 'Processed' };
            case 'shipped': return { color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20', icon: Truck, label: 'Shipped' };
            case 'completed': return { color: 'bg-green-50 text-green-700 border-green-200 ring-green-500/20', icon: CheckCircle, label: 'Completed' };
            case 'cancelled': return { color: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20', icon: CheckCircle, label: 'Cancelled' };
            default: return { color: 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-500/20', icon: Clock, label: status };
        }
    };

    const statusOptions = ['pending', 'processed', 'shipped', 'completed', 'cancelled'];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-end gap-4 bg-white p-5 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex-1">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Filter Orders</h3>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">From Date</label>
                            <input
                                type="date"
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent transition-all"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">To Date</label>
                            <input
                                type="date"
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ff6a00] focus:border-transparent transition-all"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={exportToCSV}
                        className="px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-lg transition-all duration-300 active:scale-95"
                    >
                        Export CSV
                    </button>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => { setStartDate(''); setEndDate(''); }}
                            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-visible text-black min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto min-w-[900px]">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Items</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {(!filteredOrders || filteredOrders.length === 0) ? (
                                <tr><td colSpan={5} className="p-16 text-center text-gray-400 font-medium">No orders found matching your criteria.</td></tr>
                            ) : (
                                filteredOrders.map((o: any) => {
                                    const { color: statusColor, icon: StatusIcon, label } = getStatusInfo(o.status);
                                    return (
                                        <tr
                                            key={o.id}
                                            className="hover:bg-gray-50 transition-colors relative cursor-pointer group"
                                            onClick={() => setSelectedOrder(o)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-mono text-[10px] font-bold text-[#ff6a00] bg-orange-50 px-2 py-1 rounded-md inline-block border border-orange-100">
                                                    #{o.id}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 text-sm">{o.customer_name}</div>
                                                <div className="text-[10px] text-gray-400 font-medium mt-0.5">{o.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                    {o.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                                                {/* Status Dropdown Trigger */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveDropdown(activeDropdown === o.id ? null : o.id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:brightness-95 hover:shadow-md ${statusColor} w-36 justify-between group ring-1 ring-inset`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {updatingId === o.id ? <Loader className="w-3 h-3 animate-spin" /> : <StatusIcon className="w-3 h-3" />}
                                                            <span className="uppercase tracking-wider">{label}</span>
                                                        </div>
                                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === o.id ? 'rotate-180' : ''} opacity-50`} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeDropdown === o.id && (
                                                        <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                            {statusOptions.map((opt) => (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => handleStatusChange(o.id, opt)}
                                                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center gap-2 transition-colors ${o.status === opt ? 'text-[#ff6a00] bg-orange-50' : 'text-gray-500'}`}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusInfo(opt).color.split(' ')[0]}`}></span>
                                                                    {opt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Overlay to close dropdown when clicking outside */}
                                                {activeDropdown === o.id && (
                                                    <div
                                                        className="fixed inset-0 z-50 bg-transparent"
                                                        onClick={() => setActiveDropdown(null)}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-black text-gray-900 text-sm">
                                                ETB {(o.total || o.fees?.total || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
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
