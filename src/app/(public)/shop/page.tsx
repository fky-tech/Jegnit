'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
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
                    console.log("ShopPage Data Received:", data);
                    console.log("Count:", data.length);
                    setProducts(data);
                } else {
                    console.warn("ShopPage: No data received even if no error");
                }
            } catch (error) {
                console.error("ShopPage Unexpected Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="container">
                <h1 className="text-4xl font-bold mb-8 text-center uppercase tracking-widest text-[#ff6a00]">
                    The Collection
                </h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6a00]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">No products found.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.slice(0, visibleCount).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {visibleCount < products.length && (
                            <div className="text-center mt-12">
                                <button
                                    onClick={handleLoadMore}
                                    className="btn-outline px-8 py-3"
                                >
                                    View More Products
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
