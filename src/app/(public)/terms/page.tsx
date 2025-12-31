'use client';
import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ShieldCheck, FileText, Scale, ShoppingBag, Truck, Mail, Sparkles, AlertCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="pt-40 pb-20 bg-gray-50 min-h-screen text-gray-800 font-sans selection:bg-orange-100 selection:text-[#ff6a00]">
            <div className="container max-w-5xl mx-auto px-6">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#ff6a00] mb-12 transition-colors group tracking-widest uppercase">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Page Title Section (Matching Privacy Policy) */}
                <div className="mb-16 text-center max-w-4xl mx-auto">
                    <span className="text-[#ff6a00] font-black tracking-widest uppercase text-xs mb-3 block">Legal Framework</span>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Terms & Conditions</h1>
                    <p className="text-xl text-gray-500 leading-relaxed mx-auto mt-4">
                        Our commitment to transparency, quality, and your luxury experience. Please read these terms carefully.
                    </p>
                </div>

                {/* Content Card (Matching Privacy Policy) */}
                <div className="bg-white p-8 md:p-14 rounded-[2.5rem] shadow-xl border border-gray-100/80 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <FileText className="w-64 h-64 text-[#ff6a00]" />
                    </div>

                    <div className="prose prose-lg prose-gray max-w-none space-y-12 relative z-10">

                        {/* 1. Acceptance of Terms */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-7 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm font-black">1</span>
                                Acceptance of Terms
                            </h2>
                            <div className="space-y-4 text-gray-600 font-medium">
                                <p>
                                    By accessing and using Jegnit Luxury Shapewear's (Jegnit) website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                                </p>
                                <p>
                                    These terms constitute a legally binding agreement. if you do not agree with any part of these terms, please refrain from using our platform.
                                </p>
                            </div>
                        </section>

                        {/* 2. Product Information */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm font-black">2</span>
                                Product Integrity & Sizing
                            </h2>
                            <div className="space-y-4 text-gray-600 font-medium">
                                <p>
                                    We strive for absolute accuracy in our product descriptions and imagery. However, due to screen variations and the artisan nature of textiles, actual colors and fits may vary slightly.
                                </p>
                                <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 flex items-start gap-4">
                                    <Sparkles className="w-5 h-5 text-[#ff6a00] flex-shrink-0 mt-1" />
                                    <p className="text-sm italic text-orange-950/80">
                                        "Since shapewear is designed for a precision fit, we highly recommend consulting our <Link href="/size-guide" className="text-[#ff6a00] font-black underline underline-offset-4">Size Guide</Link> before purchase."
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Ordering & Payments */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm font-black">3</span>
                                Ordering & Financial Transactions
                            </h2>
                            <div className="space-y-6">
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    Orders are processed upon verification of payment. We currently integrate with local and international payment gateways including:
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {["Secure Mobile Wallets (Telebirr)", "Direct Bank Transfers (CBE, Abyssinia)", "Cash on Delivery"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl text-sm font-black text-gray-700 uppercase tracking-tighter">
                                            <Scale className="w-4 h-4 text-[#ff6a00]" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* 4. Returns & Hygiene Policy */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm font-black">4</span>
                                Hygiene & Return Standards
                            </h2>
                            <div className="space-y-4">
                                <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                                    <p className="text-sm text-red-900 font-bold leading-relaxed">
                                        Due to the intimate nature of shapewear and strict health regulations, we maintain a limited return policy. Exchanges are only permitted for manufacturing defects reported within 48 hours.
                                    </p>
                                </div>
                                <p className="text-gray-600 font-medium px-4 border-l-4 border-gray-100 italic">
                                    We do not accept returns for items that have been worn, washed, or had tags removed.
                                </p>
                            </div>
                        </section>

                        {/* 5. Delivery Logistics */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm font-black">5</span>
                                Logistics & Delivery
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-[#ff6a00]" /> Standard Delivery
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-bold">
                                        24-48 hours within Addis Ababa. We utilize trusted white-glove couriers to ensure your luxury items arrive in perfect condition.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-400" /> Regional Shipping
                                    </h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-bold">
                                        Shipments outside the capital are managed via air or road logistics. Timelines vary by location.
                                    </p>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Bottom Contact CTA (Matching Privacy Policy style) */}
                <div className="mt-20 relative overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <div className="relative z-10 p-12 text-center text-white bg-gray-950">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a00]/30 to-transparent opacity-50" />
                        <div className="relative z-20">
                            <h3 className="text-3xl font-black mb-4 tracking-tight uppercase italic">Still Have Questions?</h3>
                            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto font-medium">
                                If you need clarification on any of our policies, our legal support team is ready to assist you.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="mailto:mubagoldlion@gmail.com" className="px-10 py-5 bg-[#ff6a00] text-white font-black rounded-2xl hover:bg-orange-600 transition-all text-center shadow-lg uppercase tracking-widest text-xs">
                                    Email Support Team
                                </a>
                                <Link href="/contact" className="px-10 py-5 bg-white !text-black font-black rounded-2xl hover:bg-gray-100 transition-all shadow-xl text-center uppercase tracking-widest text-xs">
                                    Chat with an Expert
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
