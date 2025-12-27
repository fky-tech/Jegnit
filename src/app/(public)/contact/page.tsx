'use client';
import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<null | 'submitting' | 'success' | 'error'>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                    {/* Info Side */}
                    <div className="bg-[#ff6a00] p-10 text-white md:w-2/5 flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
                            <p className="text-white/90 mb-10 leading-relaxed">
                                Have a question or just want to say hi? We'd love to hear from you.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p className="text-white/80">+251 91 178 4541</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-white/80">mubagoldlion@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 mt-1" />
                                    <div>
                                        <h3 className="font-semibold">Office</h3>
                                        <p className="text-white/80">Behind Bole Medhanialem, Fana Plaza 2nd floor<br />Addis Ababa, Ethiopia</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-white/60 text-sm">
                            <p>@jegnit_official</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="p-10 md:w-3/5">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none transition-all resize-none"
                                    placeholder="Your message..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-[#222] text-white py-4 rounded-lg font-bold hover:bg-[#ff6a00] transition-colors flex items-center justify-center gap-2 "
                            >
                                {status === 'submitting' ? 'Sending...' : (
                                    <>Send Message <Send className="w-4 h-4" /></>
                                )}
                            </button>

                            {status === 'success' && (
                                <div className="p-4 bg-green-50 text-green-600 rounded-lg text-center font-medium">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center font-medium">
                                    Something went wrong. Please try again later.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
