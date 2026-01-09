'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState(8);
    const [loading, setLoading] = useState(true);

    const [categories, setCategories] = useState<{ name: string, count: number }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    // Auto-scroll ref
    const productsGridRef = useRef<HTMLDivElement>(null);

    const handleCategorySelect = (categoryName: string) => {
        setSelectedCategory(categoryName);

        // Auto-scroll to products grid with offset for header
        if (productsGridRef.current) {
            const yOffset = -120; // Adjust for sticky header + spacing
            const y = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Fetching products and categories in ShopPage...");

                // Fetch Products
                const { data: productData, error: productError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                // Fetch Categories
                const { data: categoryData, error: categoryError } = await supabase
                    .from('categories')
                    .select('name')
                    .order('name');

                if (productError) console.error("Product Fetch Error:", productError);
                if (categoryError) console.error("Category Fetch Error:", categoryError);

                if (productData) {
                    setProducts(productData);

                    // Calculate counts based on fetched products
                    if (categoryData) {
                        const counts = categoryData.map(c => ({
                            name: c.name,
                            count: productData.filter(p => p.category === c.name).length
                        }));
                        setCategories(counts);
                    }
                }
            } catch (error) {
                console.error("ShopPage Unexpected Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        let filtered = products;

        // Filter by Category
        if (selectedCategory) {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by Search
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
        setVisibleCount(8); // Reset pagination on filter change
    }, [searchTerm, products, selectedCategory]);

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
                {/* Unified Search & Filter Toolbar */}
                <div className="max-w-4xl mx-auto mb-12 mt-7">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Input */}
                        <div className="relative group w-full md:flex-1">
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

                        {/* Category Dropdown */}
                        <div className="w-full md:w-72 flex-shrink-0">
                            <div className="relative group">
                                <select
                                    className="w-full px-6 py-4 bg-white rounded-full shadow-lg border-2 border-transparent focus:border-[#ff6a00] outline-none text-gray-900 font-bold appearance-none cursor-pointer transition-all group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] pr-12"
                                    value={selectedCategory}
                                    onChange={(e) => handleCategorySelect(e.target.value)}
                                >
                                    <option value="">All Categories ({products.length})</option>
                                    {categories.map(cat => (
                                        <option key={cat.name} value={cat.name}>{cat.name} ({cat.count})</option>
                                    ))}
                                </select>
                                <div className="absolute top-1/2 right-6 -translate-y-1/2 text-gray-400 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-8 h-8 animate-spin text-[#ff6a00]" />
                    </div>
                ) : (
                    <div>
                        {/* Product Grid */}
                        <div className="w-full" ref={productsGridRef}>
                            {/* Active Category Title (Mobile/Desktop) */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">
                                    {selectedCategory || 'All Products'} <span className="text-gray-400 ml-2 text-sm">({filteredProducts.length})</span>
                                </h2>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No products found for this category</p>
                                    <button
                                        onClick={() => setSelectedCategory('')} // Optional: Clear filter
                                        className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#ff6a00] hover:underline"
                                    >
                                        View All Products
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
                )}
            </div>
        </div>
    );
}
