'use client';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
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
    const { addToCart } = useCart();

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

    const [selectedSize, setSelectedSize] = useState<string>(sizeOptions[0]?.size || '');
    const [currentPrice, setCurrentPrice] = useState<number>(
        sizeOptions[0]?.price ? Number(sizeOptions[0].price) : Number(product.price)
    );

    const handleSizeSelect = (sizeObj: { size: string, price: string }) => {
        setSelectedSize(sizeObj.size);
        setCurrentPrice(Number(sizeObj.price));
    };

    const handleAdd = () => {
        if (!selectedSize && sizeOptions.length > 0) {
            alert('Please select a size');
            return;
        }
        // Use selected price or base price
        addToCart(product, selectedSize, currentPrice);
    };

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in flex flex-col h-full">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                {product.featured && (
                    <span className="absolute top-3 left-3 bg-[#ff6a00] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                        BESTSELLER
                    </span>
                )}
                <Link href={`/shop`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={product.img || '/placeholder.png'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>
                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-[#ff6a00] font-bold text-xl mb-3">ETB {currentPrice.toFixed(2)}</p>

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
    );
}
