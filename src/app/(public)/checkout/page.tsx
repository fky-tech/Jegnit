'use client';
import { useCart } from '@/context/CartContext';
import { calculateDeliveryFee } from '@/utils/delivery';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader, CheckCircle, Star, ShoppingBag, Check, Copy, Upload, X } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import Link from 'next/link';
import dynamic from 'next/dynamic';
const MapSelector = dynamic(() => import('@/components/MapSelector'), { ssr: false });


function ReviewItem({ item, customerName }: { item: any, customerName: string }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewed, setReviewed] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: item.product_id,
                    customer_name: customerName,
                    rating,
                    comment
                })
            });
            if (response.ok) {
                setReviewed(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (reviewed) {
        return (
            <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>Review submitted for {item.name}!</span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{item.size} {item.color ? `• ${item.color}` : ''}</p>

            <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`transition-all hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                    >
                        <Star className={`w-6 h-6 ${rating >= star ? 'fill-current' : 'stroke-2'}`} />
                    </button>
                ))}
            </div>

            <textarea
                placeholder="Write a review..."
                className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-[#ff6a00] outline-none mb-3 bg-gray-50 resize-none h-20"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                disabled={submitting || rating === 0}
                className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all ${rating > 0 && !submitting
                    ? 'bg-black hover:bg-[#ff6a00]'
                    : 'bg-gray-300 cursor-not-allowed'
                    }`}
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
        </div>
    );
}

export default function CheckoutPage() {
    const { addNotification } = useNotification();
    const { items, cartTotal, clearCart } = useCart();
    const [submitting, setSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [bookingId, setBookingId] = useState('');
    const [purchasedItems, setPurchasedItems] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        payment: 'cod',
        latitude: null as number | null,
        longitude: null as number | null,
        screenshot_img: ''
    });

    const [deliveryFee, setDeliveryFee] = useState(0); // Default to 0

    // Recalculate fee when location changes
    const updateDeliveryFee = (lat: number, lng: number) => {
        const result = calculateDeliveryFee(lat, lng);
        console.log(`Distance from Addis: ${result.distanceKm.toFixed(2)} km`);
        setDeliveryFee(result.deliveryFee);
    };

    const [showPaymentInstruction, setShowPaymentInstruction] = useState(false);

    // Scroll to top when order is complete
    useEffect(() => {
        if (orderComplete) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [orderComplete]);

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            address: address
        }));
        updateDeliveryFee(lat, lng);
    };

    const handlePaymentChange = (paymentMethod: string) => {
        setFormData({ ...formData, payment: paymentMethod });
        if (paymentMethod === 'telebirr' || paymentMethod === 'cbe' || paymentMethod === 'abyssinia') {
            setShowPaymentInstruction(true);
        }
    };

    const copyToClipboard = (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        addNotification('Copied to clipboard: ' + text, 'success');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Check items exist
            if (!items || items.length === 0) {
                addNotification("Your cart is empty!", 'error');
                return;
            }

            // Store items for review before clearing
            setPurchasedItems([...items]);

            // Prepare order data
            const orderData = {
                customer_name: formData.name,
                customer_phone: formData.phone,
                customer_address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude,
                payment_method: formData.payment,
                status: 'pending',
                items: items,
                total: cartTotal + deliveryFee,
                fees: { subtotal: cartTotal, shipping: deliveryFee, total: cartTotal + deliveryFee },
                screenshot_img: formData.screenshot_img
            };

            // Use API route to bypass RLS issues securely
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("API Error Response:", data);
                throw new Error(data.error || 'Failed to submit order');
            }

            console.log("Order Successful:", data);

            // Clear cart BEFORE setting completion state to avoid race conditions or UI unmounts
            if (typeof clearCart === 'function') {
                clearCart();
            } else {
                console.error("clearCart is not a function!");
            }

            setBookingId(data.id);

            // Default (COD) - Show Success Message
            setOrderComplete(true);

        } catch (error: any) {
            console.error('Checkout Error:', error);
            addNotification(`Failed to place order: ${error.message || 'Unknown error'}`, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="pt-32 pb-20 flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl max-w-2xl w-full text-center border border-gray-100 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200 animate-bounce">
                        <Check className="w-12 h-12 stroke-[3]" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Order <span className="text-[#ff6a00]">Successful!</span></h1>
                    <p className="text-gray-500 mb-8 font-medium">Thank you, <span className="font-bold text-gray-800">{formData.name}</span>.<br />Your order <span className="text-[#ff6a00] font-black">#{bookingId}</span> has been received.</p>

                    <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mb-8 text-left">
                        <h3 className="text-sm font-black text-[#ff6a00] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Order Info
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                                <span>Total Amount:</span>
                                <span className="text-xl font-black text-[#ff6a00]">ETB {(cartTotal > 0 ? cartTotal + deliveryFee : purchasedItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0) + deliveryFee).toFixed(2)}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 italic">Delivery is being processed to: {formData.address}</p>
                        </div>
                    </div>


                    <div className="flex flex-col gap-3">
                        <Link href="/" className="w-full py-4 bg-[#ff6a00] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#ff8533] transition-all shadow-xl shadow-orange-900/20 active:scale-95 text-center">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20 container text-center flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4 text-gray-400">No Checkouts Pending</h1>
                <p className="text-gray-500 mb-8">Your cart is currently empty.</p>
                <Link href="/shop" className="px-8 py-3 bg-[#ff6a00] !text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                    Go to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-40 pb-20">
            <div className="container">
                <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest text-center">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12">
                    {/* Order Form */}
                    <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">Delivery Location (Select on Map)</label>
                                <MapSelector onLocationSelect={handleLocationSelect} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Address / Landmark</label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Pick on map or type your address here..."
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-1 focus:ring-[#ff6a00] outline-none resize-none transition-all"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                    {formData.latitude && (
                                        <p className="text-[10px] text-green-600 font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
                                            <Check className="w-3 h-3" /> Location Pin Captured
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'cod' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked={formData.payment === 'cod'}
                                            onChange={e => handlePaymentChange(e.target.value)}
                                            className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                        />
                                        <span className="font-bold text-gray-900">Cash on Delivery</span>
                                    </label>

                                    <label className={`flex flex-col gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'telebirr' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="telebirr"
                                                checked={formData.payment === 'telebirr'}
                                                onChange={e => handlePaymentChange(e.target.value)}
                                                className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">Telebirr</span>
                                                <span className="text-xs text-gray-500">Pay via App</span>
                                            </div>
                                        </div>
                                        {formData.payment === 'telebirr' && (
                                            <div className="ml-7 p-3 bg-white border border-orange-100 rounded-lg animate-in zoom-in-95">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-bold text-gray-700">Telebirr Account:</p>
                                                    <button type="button" onClick={() => copyToClipboard('+251911784541')} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors" title="Copy">
                                                        <Copy className="w-3 h-3 text-[#ff6a00]" />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-black text-[#ff6a00]">+251 91 178 4541</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Jegnit Luxury Shapewear</p>
                                            </div>
                                        )}
                                    </label>

                                    <label className={`flex flex-col gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'cbe' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="cbe"
                                                checked={formData.payment === 'cbe'}
                                                onChange={e => handlePaymentChange(e.target.value)}
                                                className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">CBE (Commercial Bank)</span>
                                                <span className="text-xs text-gray-500">Bank Transfer</span>
                                            </div>
                                        </div>
                                        {formData.payment === 'cbe' && (
                                            <div className="ml-7 p-3 bg-white border border-orange-100 rounded-lg animate-in zoom-in-95">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-bold text-gray-700">CBE Account:</p>
                                                    <button type="button" onClick={() => copyToClipboard('1000235004694')} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors" title="Copy">
                                                        <Copy className="w-3 h-3 text-[#ff6a00]" />
                                                    </button>
                                                </div>
                                                <p className="text-lg font-black text-[#ff6a00]">1000235004694</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Jegnit Luxury - CBE Birr</p>
                                            </div>
                                        )}
                                    </label>

                                    <label className={`flex flex-col gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.payment === 'abyssinia' ? 'border-[#ff6a00] bg-[#ff6a00]/5' : 'border-gray-200 hover:border-[#ff6a00]/30'}`}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="abyssinia"
                                                checked={formData.payment === 'abyssinia'}
                                                onChange={e => handlePaymentChange(e.target.value)}
                                                className="text-[#ff6a00] focus:ring-[#ff6a00]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">Abyssinia Bank</span>
                                                <span className="text-xs text-gray-500">Bank Transfer</span>
                                            </div>
                                        </div>
                                        {formData.payment === 'abyssinia' && (
                                            <div className="ml-7 p-3 bg-white border border-orange-100 rounded-lg animate-in zoom-in-95">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="text-sm font-bold text-gray-700">Account Number:</p>
                                                    <button type="button" onClick={() => copyToClipboard('207070629')} className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors" title="Copy">
                                                        <Copy className="w-3 h-3 text-[#ff6a00]" />
                                                    </button>
                                                </div>
                                                <p className="text-sm font-bold text-gray-700">Name: Jegnit Luxury</p>
                                                <p className="text-lg font-black text-[#ff6a00]">207070629</p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Bank of Abyssinia</p>
                                            </div>
                                        )}
                                    </label>

                                    {showPaymentInstruction && (formData.payment === 'telebirr' || formData.payment === 'cbe' || formData.payment === 'abyssinia') && (
                                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                                            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center transform animate-in zoom-in-95 relative">
                                                <button
                                                    onClick={() => setShowPaymentInstruction(false)}
                                                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-gray-500" />
                                                </button>

                                                <div className="w-16 h-16 bg-orange-100 text-[#ff6a00] rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Star className="w-8 h-8 fill-current" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Confirmation</h3>

                                                {/* Account Info Display */}
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">
                                                        {formData.payment === 'telebirr' ? 'Telebirr Account' :
                                                            formData.payment === 'cbe' ? 'CBE Account' : 'Abyssinia Account'}
                                                    </p>
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="text-xl font-black text-[#ff6a00]">
                                                            {formData.payment === 'telebirr' ? '+251 91 178 4541' :
                                                                formData.payment === 'cbe' ? '1000235004694' : '207070629'}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                copyToClipboard(
                                                                    formData.payment === 'telebirr' ? '+251911784541' :
                                                                        formData.payment === 'cbe' ? '1000235004694' : '207070629'
                                                                );
                                                            }}
                                                            className="p-1.5 hover:bg-white rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <Copy className="w-4 h-4 text-gray-400 hover:text-[#ff6a00]" />
                                                        </button>
                                                    </div>
                                                    {formData.payment === 'abyssinia' && <p className="text-xs font-bold text-gray-700 mt-1">Jegnit Luxury</p>}
                                                </div>

                                                <p className="text-gray-600 mb-6 leading-relaxed text-sm">
                                                    We will ship your order as soon as the payment is received.
                                                    <br />
                                                    <span className="text-red-500 font-bold">(Please take a screenshot of your payment for confirmation.)</span>
                                                </p>

                                                <label className="block w-full mb-6 cursor-pointer group">
                                                    <div className={`p-4 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition-colors ${formData.screenshot_img ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-[#ff6a00] hover:bg-orange-50'}`}>
                                                        {formData.screenshot_img ? (
                                                            <>
                                                                <CheckCircle className="w-8 h-8 text-green-500" />
                                                                <span className="text-sm font-bold text-green-700">Screenshot Uploaded!</span>
                                                                <span className="text-xs text-green-600">Click to change</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#ff6a00]" />
                                                                <span className="text-sm font-bold text-gray-600 group-hover:text-[#ff6a00]">Upload Payment Screenshot</span>
                                                                <span className="text-[10px] text-gray-400">Tap to select image</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={async (e) => {
                                                            const file = e.target.files?.[0];
                                                            if (!file) return;

                                                            try {
                                                                setSubmitting(true);
                                                                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                                                                const { data, error } = await supabase.storage
                                                                    .from('order-screenshots')
                                                                    .upload(fileName, file);

                                                                if (error) throw error;

                                                                const publicUrl = `https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/order-screenshots/${fileName}`;
                                                                setFormData(prev => ({ ...prev, screenshot_img: publicUrl }));
                                                                addNotification('Screenshot uploaded successfully', 'success');
                                                            } catch (err: any) {
                                                                console.error(err);
                                                                addNotification('Upload failed: ' + err.message, 'error');
                                                            } finally {
                                                                setSubmitting(false);
                                                            }
                                                        }}
                                                    />
                                                </label>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (!formData.screenshot_img) {
                                                            addNotification('Please upload the payment screenshot first!', 'error');
                                                            return;
                                                        }
                                                        setShowPaymentInstruction(false);
                                                    }}
                                                    className={`w-full py-3 text-white font-bold rounded-xl transition-colors ${formData.screenshot_img ? 'bg-[#ff6a00] hover:bg-[#ff8533]' : 'bg-gray-300 cursor-not-allowed'}`}
                                                >
                                                    Confirm & Continue
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-32">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 mt-5">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <img src={item.img} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold line-clamp-1">{item.name}</p>
                                            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                                                Size: {item.size} {item.color && item.color !== 'Standard' && `| Color: ${item.color}`} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="font-bold">
                                            ETB {(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-gray-100 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-bold">ETB {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery {deliveryFee === 0 && formData.latitude ? '(Addis Ababa)' : ''}</span>
                                    <span className="font-bold">ETB {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span className="text-[#ff6a00]">ETB {(cartTotal + deliveryFee).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={submitting}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader className="w-5 h-5 animate-spin" /> : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
