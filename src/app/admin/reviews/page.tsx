'use client';
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Calendar, User, ShoppingBag } from 'lucide-react';

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

export default function AdminReviews() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6a00]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                    Customer <span className="text-[#ff6a00]">Reviews</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reviews.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900">No reviews yet</h3>
                        <p className="text-gray-500">Reviews will appear here once customers start rating products.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-4 h-4 ${review.rating >= s ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    <p className="text-gray-700 font-medium leading-relaxed italic">
                                        "{review.comment || 'No comment provided.'}"
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {review.customer_name}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(review.created_at)}
                                        </div>
                                        {review.product_id && (
                                            <div className="flex items-center gap-1.5 text-[#ff6a00]">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                Product ID: {review.product_id}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
