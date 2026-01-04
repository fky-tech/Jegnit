'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { toggleDrawer, cartCount } = useCart();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Shop', href: '/shop' },
        { name: 'About', href: '/about' },
        { name: 'Checkout', href: '/checkout' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#ff6a00]/95 backdrop-blur-md shadow-md py-4' : 'bg-gradient-to-r from-[#ff6a00] to-[#ff914d] py-3'}`}>
            <div className="container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Jegnit Logo" className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-black tracking-[0.2em] text-white group-hover:opacity-90 transition-opacity">JEGNIT</span>
                        <span className="text-[10px] font-bold tracking-[0.3em] text-white/90 uppercase ml-0.5 mt-0.5">Shapewear</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 font-medium text-white">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`transition-all duration-300 relative py-1 hover:text-white/80 ${pathname === link.href ? 'text-white' : 'text-white/70'}`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white animate-in slide-in-from-left duration-500"></span>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4 text-white">
                    {/* Cart Button - Hidden on Mobile */}
                    <button onClick={toggleDrawer} className="relative hover:text-white/80 transition-colors hidden md:block">
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
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col items-center gap-4 text-gray-800 text-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-lg font-medium w-full py-2 ${pathname === link.href ? 'text-[#ff6a00] bg-orange-50 rounded-lg' : 'text-gray-800'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
