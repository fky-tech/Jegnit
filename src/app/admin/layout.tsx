'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut, MessageSquare, Menu, X, Star } from 'lucide-react';
import { useState } from 'react';
import NotificationBell from '@/components/admin/NotificationBell';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile Drawer
    const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Collapse

    const handleLogout = () => {
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: ShoppingBag },
        { name: 'Orders', href: '/admin/orders', icon: Package },
        { name: 'Reviews', href: '/admin/reviews', icon: Star },
        { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
    ];

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-[#f8f9fa] overflow-hidden font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md text-gray-900 z-50 px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <img src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png" alt="Logo" className="h-8 w-auto" />
                    <span className="font-black uppercase tracking-widest text-[#ff6a00]">Jegnit</span>
                </div>
                <div className="flex items-center gap-3">
                    <NotificationBell />
                    <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`
                fixed inset-y-0 left-0 z-[60] bg-black text-white flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl
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

                    {/* Mobile Close Button */}
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none">
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
                <header className="hidden md:flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Hamburger removed from here, now in sidebar */}
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            {navItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <NotificationBell />

                        <div className="flex items-center gap-3 pl-2">
                            {/* <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border border-gray-200 overflow-hidden">
                                <img
                                    src="https://fbgmwoldofhnlfnqfsug.supabase.co/storage/v1/object/public/product-images/logo.png"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div> */}
                            <div className="leading-tight">
                                <p className="text-sm font-bold text-gray-900">Admin</p>
                                <p className="text-[10px] text-[#ff6a00] font-bold uppercase tracking-wider">Super User</p>
                            </div>
                        </div>
                    </div>
                </header>

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
