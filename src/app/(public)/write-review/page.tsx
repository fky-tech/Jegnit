'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Search, Star, MessageSquare, Send, X, Loader } from 'lucide-react';

export default function WriteReviewPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    // Review Form State
    const [rating, setRating] = useState(0);
    const [customerName, setCustomerName] = useState('');
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct || rating === 0 || !customerName) return;

        setSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: selectedProduct.id,
                    customer_name: customerName,
                    rating,
                    comment
                }),
            });

            if (response.ok) {
                setSuccessMessage('Thank you for your review!');
                setTimeout(() => {
                    setSuccessMessage('');
                    setSelectedProduct(null);
                    setRating(0);
                    setCustomerName('');
                    setComment('');
                }, 2000);
            } else {
                alert('Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-40 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                        Share Your <span>Experience</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-3">
                        Your feedback helps us create better products. Select a product below to write a review.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md mx-auto mb-12">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search for a product..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all shadow-lg shadow-gray-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader className="w-10 h-10 text-[#ff6a00] animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-[#ff6a00]/20"
                                onClick={() => setSelectedProduct(product)}
                            >
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.img || product.images?.[0] || 'https://via.placeholder.com/400'}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="bg-white text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            Write Review
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
                                    <p className="text-[#ff6a00] font-black">{product.price} ETB</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="bg-gradient-to-br from-[#ff6a00] to-[#ff914d] p-8 text-white text-center">
                            <h2 className="text-2xl font-bold mb-2">Write a Review</h2>
                            <p className="text-white/90 font-medium">{selectedProduct.name}</p>
                        </div>

                        <div className="p-8">
                            {successMessage ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Review Submitted!</h3>
                                    <p className="text-gray-500">{successMessage}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="space-y-6">
                                    {/* Rating */}
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Rate this product</label>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 ${rating >= star ? 'fill-[#ff6a00] text-[#ff6a00]' : 'text-gray-300'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all"
                                            placeholder="Eg. Abebe Bikila"
                                        />
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-2 focus:ring-[#ff6a00]/20 outline-none transition-all resize-none"
                                            placeholder="Tell us what you think..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting || rating === 0 || !customerName}
                                        className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <Loader className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <MessageSquare className="w-5 h-5" />
                                                Submit Review
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
