'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Call server API to verify credentials (prevents RLS issues)
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Set cookie for simple auth middleware
                document.cookie = `admin_token=true; path=/; max-age=86400;`; // 1 day
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold uppercase tracking-widest text-[#ff6a00] mb-2">Jegnit Admin</h1>
                    <p className="text-gray-500">Secure Access Portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                placeholder="admin@jegnit.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#ff6a00] focus:ring-1 focus:ring-[#ff6a00] outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#222] text-white py-3 rounded-lg font-bold hover:bg-[#ff6a00] transition-colors"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}
