'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What are your shipping options?",
        answer: "We offer standard delivery within Addis Ababa (1-3 business days) and nationwide shipping (3-7 business days). Delivery fees vary by location."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery for unworn items with original tags. Please contact us to initiate a return."
    },
    {
        question: "How do I track my order?",
        answer: "After your order is confirmed, you'll receive updates via phone. You can also contact us anytime for order status."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept cash on delivery, bank transfer, and mobile payment (Telebirr, CBE Birr). Payment details are provided during checkout."
    },
    {
        question: "How do I know my size?",
        answer: "Check our Size Guide page for detailed measurements. If you're between sizes, we recommend sizing up for a comfortable fit."
    },
    {
        question: "Can I change or cancel my order?",
        answer: "Yes! Contact us immediately via Telegram if you need to make changes. Once shipped, changes may not be possible."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600">
                        Everything you need to know about ordering and delivery
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all hover:border-[#ff6a00]/30 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-gray-50"
                            >
                                <span className="font-bold text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#ff6a00] flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-5 text-gray-600 animate-in slide-in-from-top-2 fade-in">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* <div className="mt-12 text-center">
                    <p className="text-gray-600 mb-4">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-block px-8 py-3 bg-[#ff6a00] text-white font-bold rounded-xl hover:bg-[#ff8533] transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        Contact Us
                    </a>
                </div> */}
            </div>
        </section>
    );
}
