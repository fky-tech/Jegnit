'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, MessageSquare, Menu, X, Star, Image as ImageIcon, Ruler, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from '@/components/admin/NotificationBell';
import { NotificationProvider, useNotification } from '@/context/NotificationContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotificationProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </NotificationProvider>
    );
}

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { addNotification } = useNotification();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Drawer
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapse
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [updating, setUpdating] = useState<'email' | 'password' | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch current admin info
    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await fetch('/api/admin/profile/info');
                if (res.ok) {
                    const data = await res.json();
                    setEmail(data.email || '');
                }
            } catch (err) {
                console.error('Failed to fetch admin info');
            }
        };
        fetchAdmin();
    }, []);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating('email');
        try {
            const res = await fetch('/api/admin/profile/update-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            if (res.ok) {
                addNotification('Email updated successfully. Please login again.', 'success');
                handleLogout();
            } else {
                const data = await res.json();
                addNotification(data.error || 'Failed to update email', 'error');
            }
        } catch (err) {
            addNotification('Error updating email', 'error');
        } finally {
            setUpdating(null);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            addNotification("Passwords don't match", 'error');
            return;
        }
        setUpdating('password');
        try {
            const res = await fetch('/api/admin/profile/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            });
            if (res.ok) {
                addNotification('Password updated successfully. Please login again.', 'success');
                handleLogout();
            } else {
                const data = await res.json();
                addNotification(data.error || 'Failed to update password', 'error');
            }
        } catch (err) {
            addNotification('Error updating password', 'error');
        } finally {
            setUpdating(null);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/admin/login');
        } catch (error) {
            console.error('Logout failed', error);
            router.push('/admin/login'); // Fallback
        }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', href: '/admin/orders', icon: Package },
        { name: 'Hero Images', href: '/admin/hero', icon: ImageIcon },
        { name: 'Size Guides', href: '/admin/size-guide', icon: Ruler },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    ];

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full text-gray-900 z-[500] px-4 py-3 flex items-center justify-between">
                <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm -z-10" />
                <div className="flex items-center gap-2">
                    <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="font-black uppercase tracking-widest text-[#ff6a00]">Jegnit</span>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <button
                        onClick={() => setShowProfileModal(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center text-gray-600"
                        title="Settings"
                    >
                        <Users className="w-5 h-5" />
                    </button>
                    <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[990] md:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-[999] bg-black text-white flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
                ${isCollapsed ? 'md:w-24' : 'md:w-72'}
            `}>
                {/* Sidebar Header */}
                <div className={`p-6 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} gap-3 transition-all duration-300 h-24`}>
                    <div className={`flex items-center gap-3 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'flex'}`}>
                        <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Logo" className="h-10 w-auto" />
                        {!isCollapsed && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#ff6a00]">Jegnit</h2>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Admin Console</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Collapse Toggle (In Sidebar) */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`hidden md:flex text-gray-400 hover:text-white transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Mobile Close Button */}
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-hidden scrollbar-none">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    group flex items-center relative rounded-xl transition-all duration-300 ease-out
                                    ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-4'}
                                    ${isActive
                                        ? 'bg-gradient-to-r from-[#ff6a00] to-[#ff4d00] text-white shadow-lg shadow-orange-900/40 translate-x-1'
                                        : 'text-gray-400 hover:bg-white/10 hover:text-white hover:translate-x-1'
                                    }
                                `}
                                title={isCollapsed ? item.name : ''}
                            >
                                <Icon className={`transition-all duration-300 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                {!isCollapsed && (
                                    <span className="font-bold text-sm tracking-wide animate-in fade-in slide-in-from-left-2">{item.name}</span>
                                )}

                                {/* Active Indicator Dot */}
                                {isActive && !isCollapsed && (
                                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Logout Section */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-lg">
                    <button
                        onClick={handleLogout}
                        className={`
                            group flex items-center rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 w-full
                            ${isCollapsed ? 'justify-center p-4' : 'px-5 py-4 gap-3'}
                        `}
                        title="Logout"
                    >
                        <LogOut className={`transition-all ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 group-hover:-translate-x-1'}`} />
                        {!isCollapsed && (
                            <span className="font-bold text-sm tracking-wide">Logout Account</span>
                        )}
                    </button>
                    {/* Version text removed as per request */}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Desktop Top Bar */}
                <header className="hidden md:flex items-center justify-between px-8 py-5 sticky top-0 z-[500] group/header">
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm -z-10" />
                    <div className="flex items-center gap-4">
                        {/* Hamburger removed from here, now in sidebar */}
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <NotificationBell />

                        <div
                            className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-gray-50 p-1 rounded-xl transition-colors group"
                            onClick={() => setShowProfileModal(true)}
                        >
                            <div className="leading-tight text-right">
                                <p className="text-sm font-bold text-gray-900 group-hover:text-[#ff6a00] transition-colors">Admin</p>
                                <p className="text-[10px] text-[#ff6a00] font-bold uppercase tracking-wider">Settings</p>
                            </div>
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#ff6a00] group-hover:text-white transition-all">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Change Password Modal */}
                {showProfileModal && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden p-8 space-y-6">
                            <div className="text-center">
                                <h3 className="text-xl font-black uppercase tracking-widest text-[#ff6a00]">Account Settings</h3>
                                <p className="text-xs text-gray-400 font-medium mt-1">Update Admin Credentials</p>
                            </div>

                            <div className="space-y-6">
                                {/* Email Section */}
                                <form onSubmit={handleUpdateEmail} className="space-y-3 pb-6 border-b border-gray-100">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Admin Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all"
                                            placeholder="admin@jegnit.com"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updating !== null}
                                        className="w-full py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#ff6a00] transition-all disabled:opacity-50"
                                    >
                                        {updating === 'email' ? 'Updating...' : 'Save New Email'}
                                    </button>
                                </form>

                                {/* Password Section */}
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                required
                                                value={newPassword}
                                                onChange={e => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all pr-12"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-[#ff6a00] transition-colors p-1"
                                                title={showNewPassword ? "Hide password" : "Show password"}
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={e => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl font-bold outline-none focus:ring-2 focus:ring-[#ff6a00]/20 focus:border-[#ff6a00] transition-all pr-12"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-gray-400 hover:text-[#ff6a00] transition-colors p-1"
                                                title={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updating !== null}
                                        className="w-full py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#ff6a00] transition-all disabled:opacity-50"
                                    >
                                        {updating === 'password' ? 'Updating...' : 'Save New Password'}
                                    </button>
                                </form>

                                <button
                                    type="button"
                                    onClick={() => setShowProfileModal(false)}
                                    className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors"
                                >
                                    Close Settings
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-[#f8f9fa] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                    <main className="p-4 md:p-8 pb-20 md:max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
