'use client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Phone as PhoneIcon } from 'lucide-react';
import Link from 'next/link';

export default function FloatingCart() {
    const { toggleDrawer, cartCount } = useCart();

    return (
        <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-40 items-end animate-fade-in-up delay-200">
            {/* Telegram Button - MessageCircle Icon inside Blue Circle */}
            <Link
                href="https://t.me/jegnit"
                target="_blank"
                className="bg-[#0088cc] text-white p-3.5 rounded-full shadow-xl hover:scale-110 transition-transform hover:shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 animate-float"
                title="Telegram Support"
            >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.24.37-.49 1.02-.73 4-1.74 6.67-2.88 8.01-3.43 3.81-1.56 4.6-.1.84 4.54-1.8z" />
                </svg>
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
