'use client';
import Link from 'next/link';
import { ChevronLeft, Lock, ShieldCheck, CreditCard, UserCheck, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
    const sections = [
        {
            icon: UserCheck,
            title: "Information We Collect",
            content: "We collect basic information to process your orders efficiently.",
            items: ["Full name & Contact info", "Delivery address", "Order history", "Device preferences"]
        },
        {
            icon: ShieldCheck,
            title: "How We Use Data",
            content: "Your data helps us improve your shopping experience.",
            items: ["Order fulfillment", "Customer support", "Product improvement", "Exclusive updates (optional)"]
        },
        {
            icon: CreditCard,
            title: "Payment Security",
            content: "We never store your full payment card details. All transactions are processed via secure, encrypted third-party providers."
        },
        {
            icon: Eye,
            title: "Data Sharing",
            content: "We respect your privacy and never sell your data. We only share essentials with:",
            items: ["Delivery partners", "Payment processors", "Hosting services"]
        },
        {
            icon: Lock,
            title: "Your Protection",
            content: "We employ industry-standard security measures to keep your personal information safe against unauthorized access."
        }
    ];

    return (
        <div className="pt-40 pb-20 bg-gray-50 min-h-screen text-gray-800 font-sans">
            <div className="container max-w-5xl mx-auto px-6">
                <Link href="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-[#ff6a00] mb-12 transition-colors group tracking-widest uppercase">
                    <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="mb-16 text-center max-w-4xl mx-auto">
                    <span className="text-[#ff6a00] font-black tracking-widest uppercase text-xs mb-3 block">Legals & Trust</span>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Privacy Policy</h1>
                    <p className="text-xl text-gray-500 leading-relaxed mx-auto mt-4">
                        Your trust is our priority. This policy outlines how we protect and manage your personal information with full transparency.
                    </p>
                </div>

                <div className="bg-white p-8 md:p-14 rounded-[2rem] shadow-xl border border-gray-100/80 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Lock className="w-64 h-64 text-[#ff6a00]" />
                    </div>

                    <div className="prose prose-lg prose-gray max-w-none space-y-12 relative z-10">
                        {/* 1. Information We Collect */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">1</span>
                                Information We Collect
                            </h2>
                            <p className="text-gray-600 mb-4">We may collect the following information when you use our website or place an order:</p>
                            <ul className="grid sm:grid-cols-2 gap-2 list-none p-0">
                                {["Full name", "Phone number", "Email address", "Delivery address", "Payment-related information", "Order history and preferences", "Device and browser information"].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg text-sm font-medium text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-[#ff6a00] rounded-full mt-2 flex-shrink-0"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* 2. How We Use Your Information */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">2</span>
                                How We Use Your Information
                            </h2>
                            <p className="text-gray-600 mb-4">Your information is used to:</p>
                            <ul className="space-y-2 list-none p-0 mb-6">
                                {[
                                    "Process and deliver orders",
                                    "Communicate with you about your purchase",
                                    "Provide customer support",
                                    "Improve our products and website",
                                    "Send updates or promotions (only if you choose to receive them)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <p className="text-gray-900 font-bold border-l-4 border-[#ff6a00] pl-4 italic">
                                We do not sell or rent your personal information to third parties.
                            </p>
                        </section>

                        {/* 3. Payments */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">3</span>
                                Payments
                            </h2>
                            <p className="text-gray-600 flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                <CreditCard className="w-6 h-6 text-[#ff6a00] flex-shrink-0 mt-1" />
                                <span>All payments are processed through secure third-party payment providers. Jegnit <span className="font-bold text-gray-900">does not store</span> your full payment card details.</span>
                            </p>
                        </section>

                        {/* 4. Sharing Your Information */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">4</span>
                                Sharing Your Information
                            </h2>
                            <p className="text-gray-600 mb-4">We may share limited information with trusted partners only when necessary, such as:</p>
                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                                {["Delivery and Logistics", "Payment Processors", "Website Hosting"].map((item, i) => (
                                    <div key={i} className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl text-center font-bold text-gray-800 text-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg inline-block">
                                These partners are required to protect your information and use it only for the intended purpose.
                            </p>
                        </section>

                        {/* 5. Data Protection */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">5</span>
                                Data Protection & Security
                            </h2>
                            <p className="text-gray-600 mb-4">
                                We take reasonable technical and organizational measures to protect your personal information against loss, misuse, or unauthorized access.
                            </p>
                            <p className="text-sm text-gray-500 italic">
                                However, no online system is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* 6. Your Rights */}
                        <section>
                            <h2 className="text-2xl font-black text-gray-900 !mb-4 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 text-[#ff6a00] text-sm">6</span>
                                Your Rights
                            </h2>
                            <div className="bg-gray-900 text-white p-6 rounded-2xl">
                                <p className="mb-4 font-bold text-[#ff6a00] uppercase text-xs tracking-widest">As a customer, you have the right to:</p>
                                <ul className="space-y-3">
                                    {[
                                        "Request access to your personal data",
                                        "Request correction of inaccurate information",
                                        "Request deletion of your data (where legally permitted)",
                                        "Opt out of promotional communications at any time"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <UserCheck className="w-4 h-4 text-[#ff6a00]" />
                                            <span className="text-gray-300 font-medium">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* 7. Cookies */}
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-[#ff6a00]">7.</span> Cookies
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Our website may use cookies to improve your browsing experience and analyze site traffic. You can control or disable cookies through your browser settings.
                                </p>
                            </section>

                            {/* 8. Third-Party Links */}
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-[#ff6a00]">8.</span> Third-Party Links
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites.
                                </p>
                            </section>

                            {/* 9. Children’s Privacy */}
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-[#ff6a00]">9.</span> Children’s Privacy
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Jegnit does not knowingly collect personal information from children under the age of 18.
                                </p>
                            </section>

                            {/* 10. Changes to This Policy */}
                            <section>
                                <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-[#ff6a00]">10.</span> Changes to Policy
                                </h2>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>

                <div className="mt-20 relative overflow-hidden rounded-[2rem] shadow-2xl">
                    <div className="relative z-10 p-12 text-center text-white bg-[#ff6a00]">
                        <h3 className="text-3xl font-black mb-4 tracking-tight">Have Questions?</h3>
                        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto font-medium">
                            If you have any concerns about how we handle your data, our Data Protection Officer is available to help you.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:mubagoldlion@gmail.com" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-center shadow-lg">
                                Email Privacy Team
                            </a>
                            <Link href="/contact" className="px-8 py-4 bg-white !text-[#ff6a00] font-bold rounded-xl hover:bg-[#ff8533] hover:!text-white transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-center border border-orange-400/20">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
