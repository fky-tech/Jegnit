'use client';
import Link from 'next/link';
import { ChevronLeft, Ruler, Info, CheckCircle2, HelpCircle } from 'lucide-react';

export default function SizeGuide() {
    return (
        <div className="pt-16 pb-20 bg-white min-h-screen text-gray-800 font-sans">
            {/* Hero Header */}
            <div className="relative bg-black text-white py-20 overflow-hidden mb-16">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-orange-600/30 to-black/90 z-10"></div>
                {/* <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10"></div> */}
                <div className="container max-w-5xl mx-auto px-6 relative z-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-4">
                        Find Your <span>Perfect Fit</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mt-2">
                        Measurement guide to ensure you feel confident and comfortable in your Jegnit shapewear.
                    </p>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-6">
                <Link href="/shop" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#ff6a00] mb-12 transition-colors group tracking-widest uppercase">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Shop
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-50 rounded-xl text-[#ff6a00]">
                                <Ruler className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">How to Measure</h2>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            For the most accurate results, use a soft measuring tape. Measure directly on your skin, keeping the tape snug but not tight.
                        </p>
                        <ul className="space-y-2">
                            {[
                                { title: "Bust", desc: "Measure around the fullest part of your chest." },
                                { title: "Waist", desc: "Measure around the narrowest part of your waist (natural waistline)." },
                                { title: "Hips", desc: "Measure around the fullest part of your hips." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <strong className="block text-gray-900 text-lg">{item.title}</strong>
                                        <span className="text-gray-500">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Visual Placeholder */}
                    <div className="relative h-[500px] bg-gray-100 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-100">
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
                            alt="Measurement visual"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <p className="text-white font-medium text-sm border-l-2 border-[#ff6a00] pl-3">
                                Stand straight and relax while measuring.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Size Chart Section */}
                <section className="mb-20 pt-10">
                    <div className="text-center mb-10">
                        <span className="text-[#ff6a00] font-black tracking-widest uppercase text-xs mb-2 block">Reference Table</span>
                        <h2 className="text-4xl font-bold text-gray-900">Shapewear Size Chart</h2>
                    </div>

                    <div className="overflow-hidden rounded-2xl shadow-xl border border-gray-100 bg-white overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="bg-gray-900 text-white">
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider">Size</th>
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider">Bust (cm)</th>
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider">Waist (cm)</th>
                                    <th className="p-6 text-sm font-bold uppercase tracking-wider">Hips (cm)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { s: 'XS', b: '78-82', w: '58-62', h: '84-88' },
                                    { s: 'S', b: '83-87', w: '63-67', h: '89-93' },
                                    { s: 'M', b: '88-92', w: '68-72', h: '94-98' },
                                    { s: 'L', b: '93-97', w: '73-77', h: '99-103' },
                                    { s: 'XL', b: '98-102', w: '78-82', h: '104-108' },
                                    { s: 'XXL', b: '103-107', w: '83-87', h: '109-113' },
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="p-6 font-black text-gray-900 group-hover:text-[#ff6a00] transition-colors text-lg">{row.s}</td>
                                        <td className="p-6 text-gray-600 font-medium">{row.b}</td>
                                        <td className="p-6 text-gray-600 font-medium">{row.w}</td>
                                        <td className="p-6 text-gray-600 font-medium">{row.h}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Fit Tips */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-[#ff6a00] text-white p-10 rounded-[2rem] shadow-lg shadow-orange-200">
                        <h3 className="text-2xl font-black uppercase mb-6 flex items-center justify-center gap-3">
                            <Info className="w-6 h-6" /> Pro Fit Tips
                        </h3>
                        <ul className="space-y-4 mt-3">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0 text-white/70" />
                                <span className="font-medium text-white/90">If you are in between sizes, primarily use your waist measurement.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0 text-white/70" />
                                <span className="font-medium text-white/90">For a more comfortable fit, size up. For improved sculpting, stick to true size.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0 text-white/70" />
                                <span className="font-medium text-white/90">Shapewear should feel firm but not painful or restrictive to breathing.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-100 p-10 rounded-[2rem] flex flex-col justify-center items-center text-center">
                        <HelpCircle className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Still Unsure?</h3>
                        <p className="text-gray-500 mb-8">Our fit experts are available 24/7 to guide you to the perfect size.</p>
                        <Link href="/contact" className="px-8 py-3 bg-black !text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95">
                            Chat with Expert
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
