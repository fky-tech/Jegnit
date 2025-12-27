import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <div className="relative h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-orange-600/30 to-black/90 z-10" />
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596486489709-77137e3164d9?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />

                <div className="relative z-20 text-center text-white px-4">
                    <span className="block text-white font-bold tracking-[0.3em] uppercase mb-4 text-sm animate-fade-in-up">The Jegnit Story</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
                        Sculpting Confidence.
                    </h1>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-6 py-24">
                <Link href="/" className="mt-7 inline-flex items-center text-gray-400 hover:text-[#ff6a00] mb-12 transition-colors -ml-1 text-sm font-medium tracking-wide">
                    <ArrowLeft className="w-4 h-4 mr-2" /> RETURN HOME
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Born in Ethiopia,<br />Designed for <span className="text-[#ff6a00]">Queens</span>.</h2>
                            <div className="w-20 h-1 bg-[#ff6a00]"></div>
                        </div>

                        <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                            <p className="text-xl font-medium text-gray-900">
                                Jegnit isn't just shapewear. It’s an invisible crown you wear every day.
                            </p>
                            <p>
                                We noticed a gap in the market: shapewear that felt restrictive, looked clinical, and didn't celebrate the natural curves of Ethiopian women. We set out to change that.
                            </p>
                            <p>
                                Our mission is simple: to create premium, breathable, and luxurious shapewear that enhances your natural silhouette without compromising on comfort. Whether you're commanding a boardroom or dancing at a wedding, Jegnit moves with you.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6a00] mb-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-900">Breathable Fabric</h4>
                                <p className="text-sm text-gray-500">All-day comfort in any climate.</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-[#ff6a00] mb-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-gray-900">Seamless Fit</h4>
                                <p className="text-sm text-gray-500">Invisible under any outfit.</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/hero.jpg"
                                alt="Jegnit Model"
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Decorative floating card */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden md:block">
                            <p className="text-gray-900 font-serif italic text-lg mb-2">"True beauty is comfortable in its own skin. Jegnit makes that comfort effortless."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-900 uppercase">Jegnit Team</p>
                                    <p className="text-[10px] text-gray-500">Addis Ababa, Ethiopia</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mt-40 mb-20 text-center">
                    <h3 className="text-2xl font-bold mb-16 text-gray-900">Why Choose Jegnit?</h3>
                    <div className="pt-9 grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                            <h4 className="text-xl font-bold mb-4 group-hover:text-[#ff6a00] transition-colors">Premium Materials</h4>
                            <p className="text-gray-600">Sourced from the finest suppliers to ensure durability and a soft touch against your skin.</p>
                        </div>
                        <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                            <h4 className="text-xl font-bold mb-4 group-hover:text-[#ff6a00] transition-colors">Inclusive Sizing</h4>
                            <p className="text-gray-600">We celebrate every body type with a wide range of sizes designed to fit real women.</p>
                        </div>
                        <div className="p-8 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                            <h4 className="text-xl font-bold mb-4 group-hover:text-[#ff6a00] transition-colors">Local Heart</h4>
                            <p className="text-gray-600">Proudly Ethiopian, we understand the local style, climate, and culture better than anyone.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
