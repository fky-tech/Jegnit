import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="container max-w-4xl">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#ff6a00] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Link>

                <h1 className="text-5xl font-black mb-8 tracking-tight text-gray-900">About Jegnit</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="lead text-xl mb-6 font-medium text-gray-800">
                        Jegnit isn’t just about shapewear. It’s about rewriting the story of confidence.
                    </p>
                    <p className="mb-6">
                        Born from a desire to celebrate the elegance and strength of Ethiopian women, Jegnit was created to provide premium, high-quality shapewear that doesn't just sculpt your body—it empowers your spirit.
                    </p>
                    <p className="mb-6">
                        We believe that every curve tells a story. Our mission is to ensure that story is one of power, comfort, and undeniable beauty. Whether you're dressing for a gala in Addis, a business meeting, or simply elevating your everyday style, Jegnit is designed to be your invisible partner in confidence.
                    </p>
                    <p>
                        From our meticulously selected fabrics to our rigorous testing for durability and comfort, every piece of Jegnit shapewear is a testament to our commitment to quality. Join us in redefining silhouette and self-love.
                    </p>
                </div>

                <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-2xl font-bold mb-4">Our Promise</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#ff6a00] rounded-full"></span>
                            <span>Premium, breathable fabrics designed for all-day wear.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#ff6a00] rounded-full"></span>
                            <span>Inclusive sizing that celebrates every body type.</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-[#ff6a00] rounded-full"></span>
                            <span>Discreet, seamless designs that remain invisible under clothing.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
