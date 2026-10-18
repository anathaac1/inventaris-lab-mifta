import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Box,
    ClipboardList,
    Users,
    ChevronRight
} from 'lucide-react';
import { getStoredItems, getStoredLoans } from '@/data/inventory-data';
import { getStoredAccounts } from '@/data/auth-store';

interface AdminLayoutProps {
    children: React.ReactNode;
    currentTab?: 'dashboard' | 'alat' | 'peminjaman' | 'siswa' | 'profile';
    title?: string;
}

export function AdminLayout({
    children,
    currentTab = 'dashboard',
    title = 'Admin Panel'
}: AdminLayoutProps) {
    const [counts, setCounts] = useState({
        items: 0,
        activeLoans: 0,
        students: 6
    });

    useEffect(() => {
        const updateCounts = () => {
            const items = getStoredItems();
            const loans = getStoredLoans();
            const accounts = getStoredAccounts();
            setCounts({
                items: items.length,
                activeLoans: loans.filter((l) => l.status === 'Sedang Dipinjam').length,
                students: accounts.filter((a) => a.role === 'siswa').length
            });
        };

        updateCounts();

        window.addEventListener('inventory_items_changed', updateCounts);
        window.addEventListener('inventory_loans_changed', updateCounts);
        window.addEventListener('inventory_accounts_changed', updateCounts);

        return () => {
            window.removeEventListener('inventory_items_changed', updateCounts);
            window.removeEventListener('inventory_loans_changed', updateCounts);
            window.removeEventListener('inventory_accounts_changed', updateCounts);
        };
    }, []);

    const navTabs = [
        {
            id: 'dashboard',
            label: 'Ringkasan & Metrik',
            href: '/admin',
            icon: LayoutDashboard,
            badge: null
        },
        {
            id: 'alat',
            label: 'Data Inventaris & Alat',
            href: '/admin/alat',
            icon: Box,
            badge: counts.items > 0 ? `${counts.items} Alat` : null
        },
        {
            id: 'peminjaman',
            label: 'Log Peminjaman Siswa',
            href: '/admin/peminjaman',
            icon: ClipboardList,
            badge: counts.activeLoans > 0 ? `${counts.activeLoans} Aktif` : null,
            badgeColor: counts.activeLoans > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
        },
        {
            id: 'siswa',
            label: 'Akun & Password',
            href: '/admin/siswa',
            icon: Users,
            badge: counts.students > 0 ? `${counts.students} Akun` : null
        }
    ];

    return (
        <div className="min-h-screen bg-[#F6F8FA] text-slate-800 flex flex-col font-sans antialiased selection:bg-[#0256D0] selection:text-white">
            {/* 1. TOP BRANDED HEADER BAR (Telkomsel inspired: rich themed banner with tech pattern & breadcrumb) */}
            <header className="relative bg-gradient-to-r from-[#0256D0] via-[#0448AB] to-[#0A1C38] text-white shadow-sm z-30 select-none overflow-hidden">
                {/* Tech Hexagonal & Dot Grid Watermark Pattern */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Left: Logo + Institutional Title + Enterprise Breadcrumb */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <Link href="/admin" className="flex items-center gap-3 shrink-0">
                            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center p-1 shadow-xs">
                                <img
                                    src="/images/app-logo.png"
                                    alt="Logo Lab RPL"
                                    className="w-7 h-7 object-contain drop-shadow-xs"
                                />
                            </div>
                            <div className="block leading-tight">
                                <span className="font-black text-sm tracking-wide uppercase text-white flex items-center gap-1.5">
                                    SMKN 1 KOTA BEKASI
                                </span>
                                <span className="block text-[10px] text-blue-200/90 font-medium tracking-wider uppercase">
                                    Rekayasa Perangkat Lunak
                                </span>
                            </div>
                        </Link>

                        {/* Breadcrumb Hierarchy */}
                        <div className="hidden lg:flex items-center gap-2 text-xs pl-4 border-l border-white/20 text-blue-100/90">
                            <span className="font-medium opacity-80">Laboratorium RPL</span>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-300/60" />
                            <span className="font-semibold text-white truncate max-w-xs">{title}</span>
                        </div>
                    </div>

                    {/* Right: Admin Avatar Profile Link Chip */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href="/admin/profile"
                            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all group cursor-pointer ${
                                currentTab === 'profile'
                                    ? 'bg-white/20 ring-1 ring-white/40 shadow-xs'
                                    : 'hover:bg-white/10'
                            }`}
                            title="Buka Profil Administrator Lab"
                        >
                            <div className="w-8 h-8 rounded-full bg-white text-[#0256D0] font-black text-xs flex items-center justify-center shadow-xs border border-white/40 group-hover:scale-105 transition-transform">
                                BH
                            </div>
                            <div className="hidden sm:block text-left leading-tight">
                                <p className="text-xs font-bold text-white leading-none">Bambang H.</p>
                                <p className="text-[10px] text-blue-200 mt-0.5">Kepala Lab</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* 2. TOOLBAR SUBNAV TABS (Horizontal toolbar directly underneath header, matching Telkomsel style) */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200/90 shadow-2xs select-none">
                <div className="px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* Horizontal Tabs with active underline */}
                    <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
                        {navTabs.map((tab) => {
                            const isActive = currentTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    className={`relative flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap rounded-t-md ${
                                        isActive
                                            ? 'text-[#0256D0] font-bold border-b-2 border-[#0256D0] bg-blue-50/40'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent'
                                    }`}
                                >
                                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0256D0]' : 'text-slate-400'}`} />
                                    <span>{tab.label}</span>
                                    {tab.badge && (
                                        <span
                                            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1 ${
                                                tab.badgeColor
                                                    ? tab.badgeColor
                                                    : isActive
                                                    ? 'bg-blue-100 text-[#0256D0]'
                                                    : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {tab.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* 3. MAIN WORKSPACE (Clean Full-Width, no left sidebar) */}
            <div className="flex-1 flex min-w-0">
                <main className="flex-1 min-w-0 px-4 sm:px-6 py-5 sm:py-6 w-full">
                    {children}
                </main>
            </div>

            {/* Footer */}
            <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 select-none">
                Sistem Inventaris Lab Rekayasa Perangkat Lunak • SMKN 1 Kota Bekasi © 2026
            </footer>
        </div>
    );
}
