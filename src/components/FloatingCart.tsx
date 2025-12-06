'use client';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function FloatingCart() {
    const { toggleDrawer, cartCount } = useCart();

    return (
        <button
            onClick={toggleDrawer}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 group animate-fade-in"
        >
            <ShoppingBag className="w-6 h-6 text-white" />
            <span className="absolute top-0 right-0 bg-white text-[#ff6a00] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>
        </button>
    );
}
