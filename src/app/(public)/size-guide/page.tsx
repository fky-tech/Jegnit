'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ruler, Search, ChevronRight, HelpCircle, X, ArrowRight, Sparkles, MoveRight } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface SizeGuide {
    id: string;
    product_id: number;
    content: string[][];
}

interface Product {
    id: number;
    name: string;
    img: string;
}

interface SizeGuideWithProduct extends SizeGuide {
    products: {
        name: string;
        img: string;
    } | null;
}

export default function SizeGuidePage() {
    const [guides, setGuides] = useState<SizeGuideWithProduct[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedGuide, setSelectedGuide] = useState<SizeGuideWithProduct | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const fetchGuides = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('product_size_guides')
                    .select('*, products(name, img)');

                if (error) throw error;
                setGuides(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);

    const filteredGuides = guides.filter(g =>
        g.products?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productsToShow = filteredGuides.slice(0, visibleCount);

    const openModal = (guide: SizeGuideWithProduct) => {
        setSelectedGuide(guide);
        setModalOpen(true);
    };

    return (
        <div className="pt-16 pb-20 bg-white min-h-screen text-gray-900 font-sans selection:bg-orange-100 selection:text-[#ff6a00]">
            {/* --- HERO SECTION --- */}
            <section className="relative h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/50 via-orange-600/30 to-black/90 z-10" />
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596486489709-77137e3164d9?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />

                <div className="container max-w-5xl mx-auto px-6 relative z-20 text-center text-white">
                    {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-orange-400 text-[9px] font-black uppercase tracking-[0.3em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Sparkles className="w-3 h-3" /> Professional Fitting
                    </div> */}
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight italic">
                        Find Your Perfect Fit
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto font-medium leading-relaxed opacity-80">
                        Our measurement guides ensure you feel confident, comfortable, and perfectly sculpted in every Jegnit silhouette.
                    </p>
                </div>
            </section>

            {/* --- SEARCH & PRODUCTS SECTION --- */}
            <section className="container max-w-6xl mx-auto px-6 !mt-12 relative z-30">
                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-20">
                    <div className="bg-white p-1.5 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 flex items-center group focus-within:ring-4 focus-within:ring-orange-500/5 transition-all">
                        <div className="pl-5 text-gray-500 group-focus-within:text-[#ff6a00] transition-colors">
                            <Search className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            className="flex-1 px-4 py-3 bg-transparent outline-none font-bold text-sm text-gray-500 placeholder:text-gray-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24">
                        <div className="w-8 h-8 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin shadow-sm"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Title for the listing */}
                        <div className="text-center mb-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Collection Charts</h2>
                            <div className="w-8 h-1 bg-[#ff6a00] mx-auto opacity-50" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {productsToShow.map(guide => (
                                <button
                                    key={guide.id}
                                    onClick={() => openModal(guide)}
                                    className="group bg-white rounded-3xl border border-gray-100 p-4 hover:border-orange-500/20 hover:shadow-[0_24px_48px_-12px_rgba(255,106,0,0.08)] transition-all duration-500 text-left relative"
                                >
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 mb-5 relative">
                                        <img
                                            src={guide.products?.img || ''}
                                            alt={guide.products?.name || ''}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
                                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm text-[#ff6a00]">
                                            <Ruler className="w-3.5 h-3.5" />
                                        </div>
                                    </div>

                                    <div className="px-1">
                                        <h3 className="font-black text-gray-900 uppercase italic tracking-tight text-sm line-clamp-1 mb-3 group-hover:text-[#ff6a00] transition-colors">{guide.products?.name}</h3>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Sizing Chart</span>
                                            <MoveRight className="w-4 h-4 text-gray-200 group-hover:text-[#ff6a00] group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                            {filteredGuides.length > visibleCount && (
                                <button
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="px-12 py-5 bg-white border border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-black hover:text-white hover:border-black transition-all shadow-sm active:scale-95"
                                >
                                    View More Products
                                </button>
                            )}
                            {visibleCount > 4 && searchTerm === '' && (
                                <button
                                    onClick={() => setVisibleCount(4)}
                                    className="px-12 py-5 bg-white border border-gray-100 text-orange-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-orange-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                >
                                    View Less
                                </button>
                            )}
                        </div>

                        {filteredGuides.length === 0 && (
                            <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-100">
                                <Search className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic">No sizing data found for "{searchTerm}"</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* --- NEED ADVICE SECTION --- */}
            <section className="container max-w-4xl mx-auto px-6 !mt-16 mb-32">
                <div className="bg-gray-50/50 p-10 md:p-16 rounded-[3rem] border border-gray-100 flex flex-col md:flex-row items-center gap-10 group hover:bg-white transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-[#ff6a00] flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 group-hover:rotate-6 transition-transform">
                        <HelpCircle className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tight mb-2">Need Expert Advice?</h2>
                        <p className="text-xs md:text-sm font-bold text-gray-400 mb-8 max-w-sm opacity-80">
                            Our fitting experts are available to help you find the exact proportions for your unique body shape.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 bg-black !text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ff6a00] hover:shadow-xl hover:shadow-orange-500/10 transition-all"
                        >
                            Speak with a Specialist <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? 'bg-[#ff6a00]' : 'bg-gray-200'}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- POPUP MODAL (TABLE) --- */}
            {modalOpen && selectedGuide && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-8 overflow-y-auto pt-24 animate-in fade-in duration-300">
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setModalOpen(false)}
                    />

                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-2xl min-h-[80vh] md:min-h-0 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 mb-20">
                        {/* Modal Header */}
                        <div className="relative h-44 md:h-48 bg-gray-950 overflow-hidden flex items-end">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent z-10" />
                            <img src={selectedGuide.products?.img || ''} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5]" />

                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-all z-20 backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="relative z-20 p-8 md:p-10 w-full">
                                <span className="text-orange-400 text-[9px] font-black uppercase tracking-[0.3em] mb-2 block">Jegnit Shapewear</span>
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedGuide.products?.name}</h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 md:p-10">
                            <div className="mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 flex items-center gap-2">
                                    <Ruler className="w-3.5 h-3.5 text-[#ff6a00]" /> Body Measurement Guide
                                </h3>

                                <div className="rounded-[1.5rem] border border-gray-100 overflow-hidden bg-gray-50/50">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse min-w-[500px]">
                                            <thead>
                                                <tr className="bg-gray-900">
                                                    {(selectedGuide.content[0] as string[]).map((cell: string, idx: number) => (
                                                        <th key={idx} className="p-5 text-[9px] font-black text-white hover:text-orange-400 transition-colors uppercase tracking-[0.2em]">{cell}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(selectedGuide.content.slice(1) as string[][]).map((row: string[], rIdx: number) => (
                                                    <tr key={rIdx} className="hover:bg-white transition-colors duration-200 group">
                                                        {row.map((cell: string, cIdx: number) => (
                                                            <td key={cIdx} className={`p-5 text-xs font-bold text-gray-500 ${cIdx === 0 ? 'text-gray-900 font-black italic text-base' : ''}`}>
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-[#ff6a00] flex items-center justify-center text-white shrink-0 mt-0.5">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <p className="text-[10px] md:text-xs text-orange-950/70 font-bold leading-relaxed">
                                    All values are in <span className="text-[#ff6a00]">centimeters (cm)</span>.
                                    If you find yourself between two sizes, we recommend selecting based on your waist measurement for the ultimate sculpt.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
