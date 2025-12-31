'use client';
import { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Calendar, User, ShoppingBag } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    }).format(new Date(dateString));
};

export default function AdminReviews() {
    const { addNotification } = useNotification();
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
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                addNotification('Review deleted successfully!');
            } else {
                addNotification('Failed to delete review', 'error');
            }
        } catch (error) {
            console.error('Failed to delete review:', error);
            addNotification('Error deleting review', 'error');
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
        <div className="mt-20 md:mt-5 ml-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Customer <span className="text-[#ff6a00]">Reviews</span>
                    </h1>
                    <p className="text-gray-500 font-medium mt-1">What your customers differ saying</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {reviews.length === 0 ? (
                    <div className="bg-white p-16 rounded-[2rem] border border-gray-100 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                        <p className="text-gray-500">Reviews will appear here once customers start rating products.</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:border-[#ff6a00]/20 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-4 h-4 ${review.rating >= s ? 'text-[#ff6a00] fill-current' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">
                                            {review.rating}.0 / 5.0
                                        </span>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute left-0 top-0 text-4xl text-gray-200 font-serif leading-none">"</div>
                                        <p className="text-gray-800 font-medium text-lg leading-relaxed italic">
                                            {review.comment || 'No comment provided.'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center text-white font-bold text-xs">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">{review.customer_name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(review.created_at)}</span>
                                            </div>
                                        </div>

                                        {review.product_id && (
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-[#ff6a00] rounded-xl text-xs font-bold uppercase tracking-wide">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                {review.products?.name || `Product #${review.product_id}`}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start pl-4 border-l border-gray-100 md:border-l-0 md:pl-0">
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="p-3 text-gray-400 hover:text-white hover:bg-red-500 rounded-xl transition-all shadow-sm hover:shadow-red-200"
                                        title="Delete Review"
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
