'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function SizeGuide() {
    return (
        <div className="pt-32 pb-20 bg-white">
            <div className="container max-w-4xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#ff6a00] mb-8 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase italic">
                    Jegnit <span className="text-[#ff6a00]">Size Guide</span>
                </h1>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    <section>
                        <p className="leading-relaxed">
                            To ensure the best fit, measure your body using a soft measuring tape. Measurements should be taken directly on the body, not over clothing.
                        </p>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-[#ff6a00] pl-4">How to Measure</h2>
                        <ul className="space-y-3 list-none pl-0">
                            <li className="flex gap-2">
                                <span className="font-bold text-[#ff6a00]">•</span>
                                <div><strong>Bust:</strong> Measure around the fullest part of your chest.</div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-[#ff6a00]">•</span>
                                <div><strong>Waist:</strong> Measure around the narrowest part of your waist.</div>
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold text-[#ff6a00]">•</span>
                                <div><strong>Hips:</strong> Measure around the fullest part of your hips.</div>
                            </li>
                        </ul>
                    </section>

                    <div className="my-12 relative h-[400px] w-full bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-gray-100">
                        {/* Placeholder for size chart image per user request */}
                        <div className="text-center p-12">
                            <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=1000" alt="Size Chart Reference" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                            <div className="relative z-10">
                                <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Size Chart Reference Image</p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Woman’s Shapewear Size Chart</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse border border-gray-200 rounded-xl overflow-hidden">
                                <thead className="bg-[#ff6a00] text-white">
                                    <tr>
                                        <th className="p-4 border border-white/20">Size</th>
                                        <th className="p-4 border border-white/20">Bust (in)</th>
                                        <th className="p-4 border border-white/20">Waist (in)</th>
                                        <th className="p-4 border border-white/20">Hips (in)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { s: 'S', b: '32-34', w: '24-26', h: '34-36' },
                                        { s: 'M', b: '34-36', w: '26-28', h: '36-38' },
                                        { s: 'L', b: '36-38', w: '28-30', h: '38-40' },
                                        { s: 'XL', b: '38-40', w: '30-32', h: '40-42' },
                                        { s: 'XXL', b: '40-42', w: '32-34', h: '42-44' },
                                    ].map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="p-4 border border-gray-200 font-bold">{row.s}</td>
                                            <td className="p-4 border border-gray-200">{row.b}</td>
                                            <td className="p-4 border border-gray-200">{row.w}</td>
                                            <td className="p-4 border border-gray-200">{row.h}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-[#ff6a00] pl-4 italic uppercase">Fit Tips (Important)</h2>
                        <ul className="space-y-3 list-none pl-0">
                            {[
                                "If you’re between sizes, choose the larger size for comfort.",
                                "Jegnit shapewear is designed to shape, not restrict.",
                                "Do not size down for extra compression — it may reduce comfort and durability."
                            ].map((tip, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="font-bold text-[#ff6a00]">•</span>
                                    <span>{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900">Product-Specific Fit Notes</h2>
                        <p>Some styles may fit differently depending on design and compression level. Always check the product description for specific fit details.</p>
                    </section>

                    <section className="space-y-4 border-t pt-8 border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 italic uppercase">Care & Comfort Note</h2>
                        <p>Our fabrics are stretchable and breathable, allowing flexibility while maintaining support throughout the day.</p>
                    </section>
                </div>

                <div className="mt-16 bg-black text-white p-12 rounded-3xl text-center">
                    <h2 className="text-3xl font-black mb-4 uppercase">Need Help Choosing a Size?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        If you’re unsure, contact our support team and we’ll help you find your perfect fit.
                    </p>
                    <Link href="/contact" className="inline-block px-10 py-4 bg-[#ff6a00] text-white font-bold rounded-xl hover:bg-[#ff8533] transition-all transform hover:scale-105 shadow-xl shadow-orange-900/20">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
