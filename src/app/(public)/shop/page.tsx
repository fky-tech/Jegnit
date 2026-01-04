'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                console.log("Fetching products in ShopPage...");
                const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

                if (error) {
                    console.error("ShopPage Fetch Error:", error);
                }

                if (data) {
                    setProducts(data);
                    setFilteredProducts(data);
                }
            } catch (error) {
                console.error("ShopPage Unexpected Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    const handleShowLess = () => {
        setVisibleCount(8);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="pt-40 pb-20 min-h-screen bg-gray-50">
            <div className="container">
                <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest text-[#ff6a00]">
                    Our Collections
                </h1>

                {/* Search Bar - Removed sticky */}
                <div className="max-w-md mx-auto mb-12 mt-7">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 bg-white rounded-full shadow-lg border-2 border-transparent focus:border-[#ff6a00] outline-none text-gray-900 font-bold placeholder-gray-400 transition-all group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                        />
                        <div className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6a00]" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No products found matching &quot;{searchTerm}&quot;.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
                            {filteredProducts.slice(0, visibleCount).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {visibleCount < filteredProducts.length ? (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="btn-outline px-8 py-3"
                                >
                                    View More Products
                                </button>
                            </div>
                        ) : visibleCount > 8 && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleShowLess}
                                    className="btn-outline px-8 py-3 border-gray-300 text-gray-500 hover:border-[#ff6a00] hover:text-[#ff6a00]"
                                >
                                    View Less
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
