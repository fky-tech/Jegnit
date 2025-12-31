'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, X, Maximize2, Star } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        price: number;
        img: string;
        sizes: any; // Can be string (JSON) or array
        featured?: boolean;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addNotification } = useNotification();
    const { addToCart } = useCart();
    const [showImageModal, setShowImageModal] = useState(false);
    const [rating, setRating] = useState({ averageRating: 0, reviewCount: 0 });

    // Parse sizes safely
    let sizeOptions: { size: string, price: string }[] = [];
    try {
        if (typeof product.sizes === 'string') {
            sizeOptions = JSON.parse(product.sizes);
        } else if (Array.isArray(product.sizes)) {
            sizeOptions = product.sizes;
        }
    } catch {
        sizeOptions = [];
    }

    // Fetch product rating
    useEffect(() => {
        fetch(`/api/products/${product.id}/rating`)
            .then(res => res.json())
            .then(data => setRating(data))
            .catch(err => console.error('Error fetching rating:', err));
    }, [product.id]);

    // Parse colors safely
    let colorOptions: { name: string, img: string }[] = [];
    try {
        if (typeof (product as any).colors === 'string') {
            colorOptions = JSON.parse((product as any).colors);
        } else if (Array.isArray((product as any).colors)) {
            colorOptions = (product as any).colors;
        }
    } catch {
        colorOptions = [];
    }

    const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]?.size || '');
    const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]?.name || '');
    const [currentPrice, setCurrentPrice] = useState<number>(
        sizeOptions[0]?.price ? Number(sizeOptions[0].price) : Number(product.price)
    );
    const [currentImage, setCurrentImage] = useState<string>(
        colorOptions[0]?.img || product.img
    );

    const handleSizeSelect = (sizeObj: { size: string, price: string }) => {
        setSelectedSize(sizeObj.size);
        setCurrentPrice(Number(sizeObj.price));
    };

    const handleColorSelect = (colorObj: { name: string, img: string }) => {
        setSelectedColor(colorObj.name);
        if (colorObj.img) {
            setCurrentImage(colorObj.img);
        }
    };

    const handleAdd = () => {
        if (!selectedSize && sizeOptions.length > 0) {
            addNotification('Please select a size', 'info');
            return;
        }
        addToCart(product, selectedSize, currentPrice, selectedColor, currentImage);
        addNotification(`Added ${product.name} to cart!`, 'success');
    };

    return (
        <>
            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-[#ff6a00] transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm"
                        onClick={() => setShowImageModal(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentImage || '/placeholder.png'}
                        alt={product.name}
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in-up"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in flex flex-col h-full">
                {/* Image Container */}
                <div
                    className="relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-zoom-in"
                    onClick={() => setShowImageModal(true)}
                >
                    {product.featured && (
                        <span className="absolute top-3 left-3 bg-[#ff6a00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                            BESTSELLER
                        </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentImage || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Maximize2 className="text-white w-8 h-8 drop-shadow-lg" />
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-lg mb-1 line-clamp-2 md:line-clamp-none h-14 md:h-auto overflow-hidden leading-tight">{product.name}</h3>

                    {/* Rating Display */}
                    {rating.reviewCount > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-3.5 h-3.5 ${star <= Math.round(rating.averageRating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-600 font-medium">
                                {rating.averageRating.toFixed(1)} ({rating.reviewCount})
                            </span>
                        </div>
                    )}

                    <p className="text-[#ff6a00] font-bold text-xl mb-3">ETB {currentPrice.toFixed(2)}</p>

                    {/* Color Selector */}
                    {colorOptions.length > 0 && (
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <p className="text-xs text-gray-500 font-semibold uppercase">Color</p>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selectedColor}</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {colorOptions.map((opt, idx) => {
                                    const colorMap: Record<string, string> = {
                                        'Black': '#000000',
                                        'Brown': '#63442d',
                                        'Nude': '#e3bc9a',
                                    };
                                    const bgColor = colorMap[opt.name] || '#94a3b8';

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleColorSelect(opt)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${selectedColor === opt.name
                                                ? 'border-[#ff6a00] scale-110 shadow-lg'
                                                : 'border-transparent hover:scale-105'
                                                }`}
                                            title={opt.name}
                                        >
                                            <div
                                                className="w-full h-full rounded-full border border-black/5"
                                                style={{ backgroundColor: bgColor }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Size Selector */}
                    {sizeOptions.length > 0 && (
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Select Size</p>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSizeSelect(opt)}
                                        className={`w-10 h-10 rounded border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === opt.size
                                            ? 'bg-[#ff6a00] text-white border-[#ff6a00]'
                                            : 'bg-white text-gray-800 border-gray-200 hover:border-[#ff6a00]'
                                            }`}
                                    >
                                        {opt.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-auto">
                        <button
                            onClick={handleAdd}
                            className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-[#ff6a00] transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
