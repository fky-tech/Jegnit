import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { FaTiktok, FaTelegramPlane } from 'react-icons/fa';

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
                                <span>JEG</span>NIT
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Luxury shapewear designed to empower and sculpt. Experience the perfect blend of comfort and elegance.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <a href="https://www.instagram.com/jegnit_shapewear?igsh=Y2RhZnRpNGZwdXcz&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/share/1G5MSvr6zA/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.tiktok.com/@jegnitshapewear?_r=1&_t=ZM-92ZhHHd2Yto" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors" title="TikTok">
                                <FaTiktok className="w-5 h-5" />
                            </a>
                            <a href="https://t.me/jegenit1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#ff6a00] transition-colors" title="Telegram">
                                <FaTelegramPlane className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className='ml-0 lg:ml-12'>
                        <h3 className="text-lg font-bold mb-6 pb-3">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Home</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-[#ff6a00] transition-colors">About</Link></li>
                            <li><Link href="/shop" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Collection</Link></li>
                            <li><Link href="/checkout" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Checkout</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 pb-3">Customer Care</h3>
                        <ul className="space-y-4">
                            <li><Link href="/write-review" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Write a Review</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Contact Us</Link></li>
                            <li><Link href="/size-guide" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Size Guide</Link></li>
                            <li><Link href="/privacy-policy" className="text-gray-400 hover:text-[#ff6a00] transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 pb-3">Get in Touch</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 justify-center md:justify-start">
                                <MapPin className="w-5 h-5 text-[#ff6a00] flex-shrink-0 mt-1" />
                                <span className="text-gray-400">Behind Bole Medhanialem, Fana Plaza 2nd floor, Addis Ababa</span>
                            </li>
                            <li className="flex items-center gap-4 justify-center md:justify-start">
                                <Phone className="w-5 h-5 text-[#ff6a00] flex-shrink-0" />
                                <span className="text-gray-400">0911784541 / 0946414928</span>
                            </li>
                            <li className="flex items-center gap-4 justify-center md:justify-start">
                                <Mail className="w-5 h-5 text-[#ff6a00] flex-shrink-0" />
                                <span className="text-gray-400">mubagoldlion@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Jegnit. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
