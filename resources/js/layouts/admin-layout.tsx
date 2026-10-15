import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Box,
    ClipboardList,
    ExternalLink,
    Menu,
    X,
    ShieldCheck,
    Layers
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentTab?: 'dashboard' | 'alat' | 'peminjaman';
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export function AdminLayout({
    children,
    currentTab = 'dashboard',
    title,
    subtitle,
    actions
}: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
        { id: 'alat', label: 'Kelola Alat & Produk', href: '/admin/alat', icon: Box },
        { id: 'peminjaman', label: 'Peminjaman Siswa', href: '/admin/peminjaman', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-zinc-900 flex font-sans">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-200 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {/* Brand */}
                <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-200">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                            <Layers className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-sm font-bold text-zinc-900">
                                Admin<span className="text-blue-600">Lab</span>
                            </span>
                            <span className="block text-[10px] text-zinc-400 font-medium">
                                Sistem CMS Inventaris
                            </span>
                        </div>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-600 rounded-md"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 px-3 py-4 space-y-1">
                    <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Menu Utama
                    </p>
                    {navItems.map((item) => {
                        const active = currentTab === item.id;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                                    active
                                        ? 'bg-blue-600 text-white'
                                        : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-zinc-100">
                        <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Pratinjau
                        </p>
                        <Link
                            href="/dashboard"
                            target="_blank"
                            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        >
                            <span className="flex items-center gap-2.5">
                                <ExternalLink className="w-4 h-4 text-zinc-400" />
                                <span>Halaman Siswa</span>
                            </span>
                            <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                                Live
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Admin User Footer */}
                <div className="p-3 border-t border-zinc-200">
                    <div className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-50 border border-zinc-200">
                        <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-zinc-800 truncate">
                                Admin Laboratorium
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">
                                RPL SMKN 1 Kota Bekasi
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Navbar */}
                <header className="sticky top-0 z-30 h-14 bg-white border-b border-zinc-200 px-4 sm:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg border border-zinc-200"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        <div>
                            {title && (
                                <h1 className="text-sm sm:text-base font-bold text-zinc-900">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-[11px] text-zinc-500 hidden sm:block">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                </header>

                {/* Page Content Body */}
                <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
