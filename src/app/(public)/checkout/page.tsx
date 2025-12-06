'use client';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [bookingId, setBookingId] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        payment: 'cod'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Prepare order data
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                payment_method: formData.payment,
                status: 'pending',
                items: items,
                total: cartTotal + 5,
                fees: { subtotal: cartTotal, shipping: 5, total: cartTotal + 5 }
            };

            // Use API route to bypass RLS issues securely
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error Response:", data);
                throw new Error(data.error || 'Failed to submit order');
            }

            console.log("Order Successful:", data);

            // Clear cart BEFORE setting completion state to avoid race conditions or UI unmounts
            if (typeof clearCart === 'function') {
                clearCart();
            } else {
                console.error("clearCart is not a function!");
            }

            setBookingId(data.id);
            setOrderComplete(true);

        } catch (error: any) {
            console.error('Checkout Error:', error);
            alert(`Failed to place order: ${error.message || 'Unknown error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="min-h-screen pb-20 container text-center max-w-lg mx-auto" style={{ paddingTop: '200px' }}>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-green-100">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-gray-900">Order Placed!</h1>
                    <p className="text-gray-600 mb-8">
                        Thank you for your purchase, {formData.name}.<br />
                        Your Order ID is <span className="font-mono font-bold text-black">#{bookingId}</span>.
                    </p>
                    <Link href="/shop" className="block w-full py-4 bg-[#ff6a00] text-white font-bold rounded-xl hover:bg-[#ff8533] transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 container text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-400">No Checkouts Pending</h1>
                <p className="text-gray-500 mb-8">Your cart is currently empty.</p>
                <Link href="/shop" className="px-8 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest text-center">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Order Form */}
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none resize-none"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'cod' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={formData.payment === 'cod'}
                                            onChange={e => setFormData({ ...formData, payment: e.target.value })}
                                            className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                        />
                                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'telebirr' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="telebirr"
                                            checked={formData.payment === 'telebirr'}
                                            onChange={e => setFormData({ ...formData, payment: e.target.value })}
                                            className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">Telebirr</span>
                                            <span className="text-xs text-gray-500">Pay via App</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'cbe' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cbe"
                                            checked={formData.payment === 'cbe'}
                                            onChange={e => setFormData({ ...formData, payment: e.target.value })}
                                            className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">CBE (Commercial Bank)</span>
                                            <span className="text-xs text-gray-500">Bank Transfer</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img src={item.img} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold line-clamp-1">{item.name}</p>
                                            <p className="text-gray-500">{item.size} x {item.quantity}</p>
                                        </div>
                                        <div className="font-bold">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-bold">$5.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span className="text-[#ff6a00]">${(cartTotal + 5).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
