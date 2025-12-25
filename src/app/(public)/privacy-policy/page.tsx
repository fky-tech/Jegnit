'use client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="pt-32 pb-20 bg-white min-h-screen">
            <div className="container max-w-4xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-[#ff6a00] mb-8 transition-colors group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-black mb-2 tracking-tighter uppercase italic">
                    Privacy <span className="text-[#ff6a00]">Policy</span>
                </h1>
                <p className="text-gray-400 mb-12 font-medium">Effective Date: {new Date().toLocaleDateString()}</p>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-12">
                    <section>
                        <p className="leading-relaxed">
                            Jegnit (“we”, “our”, “us”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect your data when you visit or make a purchase from our website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-black">1</span>
                            Information We Collect
                        </h2>
                        <p>We may collect the following information when you use our website or place an order:</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none pl-0">
                            {[
                                "Full name", "Phone number", "Email address", "Delivery address",
                                "Payment-related information", "Order history and preferences",
                                "Device and browser information"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#ff6a00] rounded-full"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-black">2</span>
                            How We Use Your Information
                        </h2>
                        <p>Your information is used to:</p>
                        <ul className="space-y-2 list-none pl-0">
                            {[
                                "Process and deliver orders",
                                "Communicate with you about your purchase",
                                "Provide customer support",
                                "Improve our products and website",
                                "Send updates or promotions (only if you choose to receive them)"
                            ].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#ff6a00] rounded-full"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="p-4 bg-orange-50 border-l-4 border-[#ff6a00] italic font-medium">
                            We do not sell or rent your personal information to third parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-black">3</span>
                            Payments
                        </h2>
                        <p>All payments are processed through secure third-party payment providers. Jegnit does not store your full payment card details.</p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-black">4</span>
                            Sharing Your Information
                        </h2>
                        <p>We may share limited information with trusted partners only when necessary, such as:</p>
                        <ul className="space-y-2 list-none pl-0">
                            {["Delivery and logistics providers", "Payment processors", "Website hosting and analytics services"].map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#ff6a00] rounded-full"></div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-black">5</span>
                            Data Protection & Security
                        </h2>
                        <p>We take reasonable technical and organizational measures to protect your personal information against loss, misuse, or unauthorized access.</p>
                        <p className="text-sm text-gray-400">However, no online system is 100% secure, and we cannot guarantee absolute security.</p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-y border-gray-100 italic">
                        <section className="space-y-2">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">6. Your Rights</h3>
                            <p className="text-sm">You have the right to access, correct, or delete your data. Contact us to exercise these rights.</p>
                        </section>
                        <section className="space-y-2">
                            <h3 className="font-bold text-gray-900 uppercase tracking-widest text-sm">7. Cookies</h3>
                            <p className="text-sm">We use cookies to improve your experience. You can disable them in your browser settings.</p>
                        </section>
                    </div>

                    <div className="flex flex-col items-center text-center pt-20">
                        <h2 className="text-3xl font-black mb-8 uppercase italic">Contact <span className="text-[#ff6a00]">Us</span></h2>
                        <div className="space-y-2 text-gray-600">
                            <p className="font-bold text-gray-900 text-xl">Jegnit</p>
                            <p>Addis Ababa, Ethiopia</p>
                            <p>Email: <a href="mailto:info@jegnit.com" className="text-[#ff6a00] hover:underline">info@jegnit.com</a></p>
                            <p>Phone: +251 911 22 33 44</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
