'use client';
import { useState } from 'react';
import { Loader, Package, Truck, CheckCircle, Clock, ChevronDown } from 'lucide-react';

interface OrderTableProps {
    initialOrders: any[];
}

export default function OrderTable({ initialOrders }: OrderTableProps) {
    const [orders, setOrders] = useState(initialOrders);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

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
                        {(!orders || orders.length === 0) ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-400">No orders found.</td></tr>
                        ) : (
                            orders.map((o: any) => {
                                const { color: statusColor, icon: StatusIcon, label } = getStatusInfo(o.status);
                                return (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors relative">
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
                                        <td className="px-6 py-4 relative">
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
                                                    <div className="fixed sm:absolute top-auto sm:top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                                            ${o.total || o.fees?.total || '0.00'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
