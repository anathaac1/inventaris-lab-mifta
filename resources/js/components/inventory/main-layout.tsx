import React from 'react';
import { Link } from '@inertiajs/react';
import {
    Home,
    Box,
    ClipboardList,
    User
} from 'lucide-react';

interface MainLayoutProps {
    children: React.ReactNode;
    currentTab?: 'home' | 'alat' | 'peminjaman' | 'profile';
    title?: string;
}

export function MainLayout({ children, currentTab = 'home' }: MainLayoutProps) {
    const navItems = [
        { id: 'home', label: 'Home', href: '/dashboard', icon: Home },
        { id: 'alat', label: 'Alat', href: '/alat', icon: Box },
        { id: 'peminjaman', label: 'Peminjaman', href: '/peminjaman', icon: ClipboardList },
        { id: 'profile', label: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex flex-col font-sans">
            {/* Desktop Top Navbar */}
            <header className="sticky top-0 z-30 bg-white border-b border-zinc-200">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
                            <Box className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-base font-bold text-blue-600">
                                Pinjam<span className="text-zinc-900">Yuk!</span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const active = currentTab === item.id;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                                        active
                                            ? 'bg-blue-600 text-white'
                                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right User Link & Admin Switch */}
                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/admin"
                            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors border border-zinc-200"
                            title="Buka CMS Admin"
                        >
                            <span>Admin CMS</span>
                        </Link>

                        <Link
                            href="/profile"
                            className="flex items-center gap-2 p-1 rounded hover:bg-zinc-100 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs border border-zinc-200">
                                <span className="text-[10px]">KI</span>
                            </div>
                            <span className="text-xs font-medium text-zinc-700 hidden sm:inline">
                                Kenho Imut
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-5 pb-20 md:pb-8">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 px-4 py-1.5 flex items-center justify-around">
                {navItems.map((item) => {
                    const active = currentTab === item.id;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded transition-colors ${
                                active
                                    ? 'text-blue-600 font-bold'
                                    : 'text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : ''}`} />
                            <span className="text-[10px] mt-0.5">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
