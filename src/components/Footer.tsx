import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#111] text-white pt-20 pb-10">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 justify-center md:justify-start">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Logo" className="h-10 w-auto" />
                            <span className="text-3xl font-bold tracking-tighter uppercase">
                                <span className="text-[#ff6a00]">JEG</span>NIT
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Luxury shapewear designed to empower and sculpt. Experience the perfect blend of comfort and elegance.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Home</Link></li>
                            <li><Link href="/shop" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Collection</Link></li>
                            <li><Link href="/checkout" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Checkout</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Customer Care</h3>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Returns & Exchanges</a></li>
                            <li><Link href="/size-guide" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Size Guide</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6">Get in Touch</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 justify-center md:justify-start">
                                <MapPin className="w-5 h-5 text-[#ff6a00] flex-shrink-0 mt-1" />
                                <span className="text-gray-400">Addis Ababa, Ethiopia</span>
                            </li>
                            <li className="flex items-center gap-4 justify-center md:justify-start">
                                <Phone className="w-5 h-5 text-[#ff6a00] flex-shrink-0" />
                                <span className="text-gray-400">+251 900 000 000</span>
                            </li>
                            <li className="flex items-center gap-4 justify-center md:justify-start">
                                <Mail className="w-5 h-5 text-[#ff6a00] flex-shrink-0" />
                                <span className="text-gray-400">info@jegnit.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Jegnit. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
