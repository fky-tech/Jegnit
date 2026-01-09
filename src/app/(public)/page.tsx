'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader, ShieldCheck, Truck, Headphones } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import ProductCard from '@/components/ProductCard';
import FAQ from '@/components/FAQ';
import HeroSlideshow from '@/components/HeroSlideshow';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        // Fetch products marked as featured
        let { data, error } = await supabase.from('products').select('*').eq('featured', true).limit(20);

        // Fallback if none featured
        if (!data || data.length === 0) {
          const { data: allData } = await supabase.from('products').select('*').limit(8);
          data = allData;
        }

        if (data) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Error fetching featured products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div className="pt-36 md:pt-8 overflow-hidden bg-white text-gray-900">
      {/* Hero Section - Refined for professional/balanced look */}
      <section className="relative min-h-[85vh] flex items-center bg-white">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-20">
          {/* Hero Text */}
          <div className="order-1 lg:order-1 space-y-3 animate-fade-in-up text-center lg:text-left">
            <span className="inline-block px-3 py-1 bg-gray-100 text-[#ff6a00] text-xs font-bold tracking-widest uppercase rounded-sm">
              JEGNIT SHAPEWEAR
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900">
              Strength in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff6a00] to-[#ff914d]">Womanhood</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Designed for the elegance and strength of Ethiopian women.
              Experience the perfect blend of comfort, support, and confidence.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#ff6a00] text-white font-bold text-base tracking-wide rounded-lg hover:bg-[#ff8533] transition-all shadow-lg shadow-orange-100">
                Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-900 border border-gray-200 font-bold text-base tracking-wide rounded-lg hover:bg-gray-50 transition-all">
                Learn More
              </Link>
            </div>
          </div>

          {/* Hero Image / Slideshow */}
          <div className="lg:py-32 pt-10 order-2 lg:order-2 relative h-[400px] lg:h-[700px] w-full flex items-center justify-center">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
              <HeroSlideshow />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Strip */}
      <section className="py-10 border-y border-gray-100 bg-gray-900 mt-14 lg:mt-0">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-800">
          <div className="flex items-center justify-center md:justify-start gap-4 pb-4 md:pb-0 md:pr-8">
            <div className="p-3 bg-white/10 rounded-full text-[#ff6a00]"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide text-white">Premium Quality</h3>
              <p className="text-xs text-gray-400">Guaranteed durability</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-center gap-4 py-4 md:py-0 md:px-8">
            <div className="p-3 bg-white/10 rounded-full text-[#ff6a00]"><Truck className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide text-white">Reliable Delivery</h3>
              <p className="text-xs text-gray-400">Fast & secure shipping</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-end gap-4 pt-4 md:pt-0 md:pl-8">
            <div className="p-3 bg-white/10 rounded-full text-[#ff6a00]"><Headphones className="w-6 h-6" /></div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wide text-white">24/7 Support</h3>
              <p className="text-xs text-gray-400">Here for you always</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <span className="text-[#ff6a00] font-bold tracking-widest uppercase text-xs mb-2 block">Curated For You</span>
            <h2 className="text-4xl font-bold text-gray-900">Featured Collection</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader className="w-8 h-8 animate-spin text-[#ff6a00]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, showAllFeatured ? featuredProducts.length : 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {featuredProducts.length > 4 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllFeatured(!showAllFeatured)}
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-black text-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-300 rounded-lg"
              >
                {showAllFeatured ? 'Show Less' : 'View More Products'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Need Help Section - Gradient Background */}
      <section className="py-24 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6a00] to-[#ff914d] z-0"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10 mix-blend-overlay"></div>

        <div className="container relative z-20 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Need Help Finding Your Fit?</h2>
          <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg font-medium">
            Every body is unique. Our shapewear experts are here to guide you to the perfect size and style for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact" className="px-8 py-3 bg-white !text-gray-900 font-bold rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
              Contact Support
            </Link>
            <Link href="#faq" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
              Browse FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>
    </div>
  );
}
