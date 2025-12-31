'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroImage {
    id: string;
    image_url: string;
}

export default function HeroSlideshow() {
    const [images, setImages] = useState<HeroImage[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const fallbackImage = 'https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/hero.jpg';

    useEffect(() => {
        async function fetchHeroImages() {
            try {
                const { data, error } = await supabase
                    .from('hero_images')
                    .select('id, image_url')
                    .eq('is_active', true)
                    .order('order', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    setImages(data);
                } else {
                    setImages([{ id: 'fallback', image_url: fallbackImage }]);
                }
            } catch (err) {
                console.error("Error fetching hero images", err);
                setImages([{ id: 'fallback', image_url: fallbackImage }]);
            } finally {
                setLoading(false);
            }
        }
        fetchHeroImages();
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [images]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (loading) {
        return (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#ff6a00] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full group">
            {images.map((img, idx) => (
                <div
                    key={img.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <img
                        src={img.image_url}
                        alt={`Hero Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1596486489709-77137e3164d9?auto=format&fit=crop&q=80&w=1000';
                        }}
                    />
                </div>
            ))}

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
