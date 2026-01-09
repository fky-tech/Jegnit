'use client';
import { useState, useEffect } from 'react';
import { ShoppingBag, X, Maximize2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
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
        bestseller?: boolean;
        discount?: number;
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
    let colorOptions: { name: string, images: string[] }[] = [];
    try {
        let parsed: any[] = [];
        if (typeof (product as any).colors === 'string') {
            parsed = JSON.parse((product as any).colors);
        } else if (Array.isArray((product as any).colors)) {
            parsed = (product as any).colors;
        }

        colorOptions = parsed.map(c => ({
            name: c.name || 'Black',
            images: c.images || (c.img ? [c.img] : [])
        }));
    } catch {
        colorOptions = [];
    }

    const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]?.size || '');
    const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0]?.name || '');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Calculate initial price based on size or base price
    const basePrice = sizeOptions[0]?.price ? Number(sizeOptions[0].price) : Number(product.price);
    const discount = product.discount || 0;

    const [currentPrice, setCurrentPrice] = useState<number>(basePrice);

    // Calculate discounted price
    const discountedPrice = discount > 0 ? currentPrice * (1 - discount / 100) : currentPrice;

    const [currentImage, setCurrentImage] = useState<string>(
        colorOptions[0]?.images?.[0] || product.img
    );

    // Sync image when color or index changes
    useEffect(() => {
        const color = colorOptions.find(c => c.name === selectedColor);
        if (color && color.images.length > 0) {
            setCurrentImage(color.images[currentImageIndex % color.images.length]);
        } else {
            setCurrentImage(product.img);
        }
    }, [selectedColor, currentImageIndex, colorOptions, product.img]);

    const handleSizeSelect = (sizeObj: { size: string, price: string }) => {
        setSelectedSize(sizeObj.size);
        setCurrentPrice(Number(sizeObj.price));
    };

    const handleColorSelect = (colorObj: { name: string, images: string[] }) => {
        setSelectedColor(colorObj.name);
        setCurrentImageIndex(0);
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const color = colorOptions.find(c => c.name === selectedColor);
        const imagesCount = color?.images.length || 1;
        setCurrentImageIndex(prev => (prev + 1) % imagesCount);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        const color = colorOptions.find(c => c.name === selectedColor);
        const imagesCount = color?.images.length || 1;
        setCurrentImageIndex(prev => (prev - 1 + imagesCount) % imagesCount);
    };

    const handleAdd = () => {
        if (!selectedSize && sizeOptions.length > 0) {
            addNotification('Please select a size', 'info');
            return;
        }
        addToCart(product, selectedSize, discountedPrice, selectedColor, currentImage);
        addNotification(`Added ${product.name} to cart!`, 'success');
    };

    return (
        <>
            {/* Image Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowImageModal(false)}
                >
                    <button
                        className="absolute top-8 right-8 md:top-10 md:right-10 text-white hover:text-[#ff6a00] transition-colors bg-white/20 hover:bg-white/30 p-3 rounded-full backdrop-blur-md shadow-2xl z-[2001]"
                        onClick={() => setShowImageModal(false)}
                        title="Close"
                    >
                        <X className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
                        {colorOptions.find(c => c.name === selectedColor)?.images.length! > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[2002]"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all z-[2002]"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                        <img
                            src={currentImage || '/placeholder.png'}
                            alt={product.name}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-fade-in-up"
                        />
                        {colorOptions.find(c => c.name === selectedColor)?.images.length! > 1 && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
                                {colorOptions.find(c => c.name === selectedColor)?.images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-[#ff6a00] w-6' : 'bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in flex flex-col h-full">
                {/* Image Container */}
                <div
                    className="relative aspect-[4/5] overflow-hidden bg-gray-100 cursor-zoom-in"
                    onClick={() => setShowImageModal(true)}
                >
                    {product.bestseller && (
                        <span className="absolute top-3 left-3 bg-[#ff6a00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                            BESTSELLER
                        </span>
                    )}
                    {(product.discount || 0) > 0 && (
                        <span className={`absolute top-3 ${product.bestseller ? 'left-24' : 'left-3'} bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10 animate-pulse`}>
                            {product.discount}% OFF
                        </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={currentImage || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Slideshow Controls (Visible if > 1) */}
                    {colorOptions.find(c => c.name === selectedColor)?.images.length! > 1 && (
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 z-10">
                            <button
                                onClick={prevImage}
                                className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg backdrop-blur-md transition-all active:scale-90"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Image Counter Indicator */}
                    {colorOptions.find(c => c.name === selectedColor)?.images.length! > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {colorOptions.find(c => c.name === selectedColor)?.images.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-[#ff6a00] w-3' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Hover Overlay Hint */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
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

                    <div className="flex items-center gap-2 mb-3">
                        <p className="text-[#ff6a00] font-bold text-xl">ETB {discountedPrice.toFixed(2)}</p>
                        {discount > 0 && (
                            <p className="text-gray-400 text-sm font-bold line-through">ETB {currentPrice.toFixed(2)}</p>
                        )}
                    </div>

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
