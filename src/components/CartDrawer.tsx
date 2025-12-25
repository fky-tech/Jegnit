'use client';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDrawer() {
    const { items, isDrawerOpen, toggleDrawer, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <>
            {/* Backdrop */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={toggleDrawer}
                />
            )}

            {/* Drawer */}
            <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] text-white">
                        <h2 className="text-xl font-bold">Your Cart</h2>
                        <button onClick={toggleDrawer} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                                <p className="text-lg">Your cart is empty</p>
                                <button onClick={toggleDrawer} className="text-[#ff6a00] font-bold hover:underline">
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-black uppercase text-gray-500 bg-gray-200 px-2 py-0.5 rounded tracking-widest">{item.size}</span>
                                            {item.color && item.color !== 'Standard' && (
                                                <span className="text-[10px] font-black uppercase text-white bg-[#ff6a00] px-2 py-0.5 rounded tracking-widest">{item.color}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#ff6a00] font-black">ETB {item.price.toFixed(2)}</span>
                                            <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-2 py-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-[#ff6a00]">
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-[#ff6a00]">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t border-gray-100 bg-white">
                            <div className="flex justify-between items-center mb-4 text-lg font-bold">
                                <span>Subtotal</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-center text-gray-400 mb-4">Shipping calculated at checkout</p>
                            <Link
                                href="/checkout"
                                onClick={toggleDrawer}
                                className="block w-full py-4 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] text-white text-center font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Checkout Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
