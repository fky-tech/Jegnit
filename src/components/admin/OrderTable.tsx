'use client';
import { useState } from 'react';
import { Loader, Package, Truck, CheckCircle, Clock, ChevronDown, X, User, Phone, MapPin, CreditCard, DollarSign } from 'lucide-react';
import OrderDetailsModal from './OrderDetailsModal';

interface OrderTableProps {
    initialOrders: any[];
}

export default function OrderTable({ initialOrders }: OrderTableProps) {
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
        } catch (error) {
            console.error(error);
            alert("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' };
            case 'processed': return { color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Package, label: 'Processed' };
            case 'shipped': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Truck, label: 'Shipped' };
            case 'completed': return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Completed' };
            case 'cancelled': return { color: 'bg-red-100 text-red-800 border-red-200', icon: CheckCircle, label: 'Cancelled' };
            default: return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock, label: status };
        }
    };

    const statusOptions = ['pending', 'processed', 'shipped', 'completed', 'cancelled'];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">From Date</label>
                    <input
                        type="date"
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#ff6a00]"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">To Date</label>
                    <input
                        type="date"
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#ff6a00]"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <button
                    onClick={exportToCSV}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10"
                >
                    Download List
                </button>
                {(startDate || endDate) && (
                    <button
                        onClick={() => { setStartDate(''); setEndDate(''); }}
                        className="px-4 py-2 text-gray-500 text-sm hover:underline"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible text-black min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-black">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Order ID</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Customer</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Items</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(!filteredOrders || filteredOrders.length === 0) ? (
                                <tr><td colSpan={5} className="p-10 text-center text-gray-400">No orders found.</td></tr>
                            ) : (
                                filteredOrders.map((o: any) => {
                                    const { color: statusColor, icon: StatusIcon, label } = getStatusInfo(o.status);
                                    return (
                                        <tr
                                            key={o.id}
                                            className="hover:bg-gray-50 transition-colors relative cursor-pointer"
                                            onClick={() => setSelectedOrder(o)}
                                        >
                                            <td className="px-6 py-4 font-mono text-sm text-gray-600">#{o.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{o.customer_name}</div>
                                                <div className="text-xs text-gray-500">{o.customer_phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600">
                                                    {o.items?.length || 0} items
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 relative" onClick={(e) => e.stopPropagation()}>
                                                {/* Status Dropdown Trigger */}
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setActiveDropdown(activeDropdown === o.id ? null : o.id)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:brightness-95 ${statusColor} w-32 justify-between group`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {updatingId === o.id ? <Loader className="w-3 h-3 animate-spin" /> : <StatusIcon className="w-3 h-3" />}
                                                            <span>{label}</span>
                                                        </div>
                                                        <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === o.id ? 'rotate-180' : ''}`} />
                                                    </button>

                                                    {/* Dropdown Menu */}
                                                    {activeDropdown === o.id && (
                                                        <div className="fixed sm:absolute top-auto sm:top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                            {statusOptions.map((opt) => (
                                                                <button
                                                                    key={opt}
                                                                    onClick={() => handleStatusChange(o.id, opt)}
                                                                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 ${o.status === opt ? 'font-bold text-[#ff6a00] bg-orange-50' : 'text-gray-600'}`}
                                                                >
                                                                    <span className={`w-2 h-2 rounded-full ${getStatusInfo(opt).color.split(' ')[0]}`}></span>
                                                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Overlay to close dropdown when clicking outside */}
                                                {activeDropdown === o.id && (
                                                    <div
                                                        className="fixed inset-0 z-50 bg-black/10"
                                                        onClick={() => setActiveDropdown(null)}
                                                    />
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                ETB {o.total || o.fees?.total || '0.00'}
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
