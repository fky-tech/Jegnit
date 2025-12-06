'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleDrawer, cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#ff6a00]/95 backdrop-blur-md shadow-md py-4' : 'bg-gradient-to-r from-[#ff6a00] to-[#ff914d] py-5'}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Jegnit Logo" className="h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium text-white">
                    <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
                    <Link href="/shop" className="hover:text-white/80 transition-colors">Shop</Link>
                    <Link href="/checkout" className="hover:text-white/80 transition-colors">Checkout</Link>
                    <Link href="/contact" className="hover:text-white/80 transition-colors">Contact</Link>
                </div>

                <div className="flex items-center gap-4 text-white">
                    {/* Admin Link for convenience */}
                    <Link href="/admin/login" className="hidden md:block hover:text-white/80">
                        <User className="w-5 h-5" />
                    </Link>
                    <button onClick={toggleDrawer} className="relative hover:text-white/80 transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="absolute -top-2 -right-2 bg-white text-[#ff6a00] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartCount}</span>
                    </button>

                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col gap-4 text-gray-800">
                    <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    <Link href="/shop" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                    <Link href="/checkout" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Checkout</Link>
                    <Link href="/contact" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                    <Link href="/admin/login" className="text-lg font-medium text-gray-500" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                </div>
            )}
        </nav>
    );
}
