'use client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Phone as PhoneIcon } from 'lucide-react';
import Link from 'next/link';

export default function FloatingCart() {
    const { toggleDrawer, cartCount } = useCart();

    return (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40 items-end animate-fade-in-up delay-200">
            {/* WhatsApp Button - Phone Icon inside Green Circle */}
            <Link
                href="https://wa.me/251911223344"
                target="_blank"
                className="bg-[#25D366] text-white p-3.5 rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float"
                title="Concierge Chat"
            >
                <PhoneIcon className="w-6 h-6 stroke-[1.5]" />
            </Link>

            {/* Cart Button - Brand Color */}
            <button
                onClick={toggleDrawer}
                className="bg-[#ff6a00] text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-2xl relative group flex items-center justify-center border border-white/20 animate-float delay-100"
            >
                <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-white text-[#ff6a00] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                        {cartCount}
                    </span>
                )}
            </button>
        </div>
    );
}
