import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Box,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    ShieldCheck,
    Clock,
    Layers,
    Users,
    School,
    LogIn
} from 'lucide-react';
import { ItemIllustration } from '@/components/inventory/item-illustration';

export default function Welcome() {
    return (
        <>
            <Head title="Pinjam Yuk! - Sistem Inventory Lab RPL SMKN 1 Kota Bekasi" />

            <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F8FAFC] to-white dark:from-[#0B132B] dark:via-[#090D16] dark:to-[#040810] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
                {/* Navbar */}
                <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                            <Box className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tight text-blue-600 dark:text-blue-400">
                                Pinjam<span className="text-zinc-900 dark:text-white">Yuk!</span>
                            </span>
                            <span className="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                Lab RPL
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-all shadow-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Masuk</span>
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                        >
                            <span>Buka Aplikasi</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* Hero Section (Matching Figma Screen 1: Splash / Onboarding) */}
                <main className="max-w-6xl w-full mx-auto px-6 py-8 sm:py-12 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Column: Typography & Badges */}
                    <div className="max-w-xl space-y-6 text-center lg:text-left">
                        {/* School / Lab Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200/80 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
                            <School className="w-4 h-4" />
                            <span>SMKN 1 Kota Bekasi • Rekayasa Perangkat Lunak</span>
                        </div>

                        {/* Main Title */}
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.15]">
                                <span className="text-blue-600 dark:text-blue-400">Pinjam Yuk!</span> <br />
                                Solusi Peminjaman Alat Lab Praktikum
                            </h1>
                            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-blue-600/90 dark:text-blue-400">
                                SOLUSI PEMINJAMAN ALAT LAB YANG LEBIH MUDAH DAN TERORGANISIR
                            </p>
                            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 max-w-lg leading-relaxed">
                                Sistem manajemen inventaris dan peminjaman perangkat laboratorium RPL. Pantau ketersediaan laptop, peripheral, tools, dan kabel secara real-time.
                            </p>
                        </div>

                        {/* 3 Pills from Figma design */}
                        <div className="flex flex-wrap gap-2.5 justify-center lg:justify-start">
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>Peminjaman Mudah Cepat</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>Monitoring Status Realtime</span>
                            </div>
                            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Keamanan Alat Terjamin</span>
                            </div>
                        </div>

                        {/* CTA Buttons & Subtext */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 group transition-all"
                            >
                                <span>Mulai Pinjam Sekarang</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                            </Link>

                            <Link
                                href="/alat"
                                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-sm shadow-sm transition-all text-center"
                            >
                                Lihat Katalog Alat
                            </Link>
                        </div>

                        {/* Slogan pill from Figma: "Pinjam Pakai Kembalikan Jaga Bersama!" */}
                        <div className="inline-block p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900 text-blue-900 dark:text-blue-300 text-xs font-bold tracking-tight">
                            ✨ Pinjam • Pakai • Kembalikan • Jaga Bersama!
                        </div>
                    </div>

                    {/* Right Column: Visual Graphic Showcase */}
                    <div className="relative w-full max-w-md lg:max-w-lg flex items-center justify-center">
                        {/* Decorative background glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-sky-300/30 dark:from-blue-600/10 dark:to-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative w-full rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl space-y-6">
                            {/* Device & Character Composition Graphic */}
                            <div className="rounded-2xl bg-gradient-to-b from-sky-50 via-blue-50 to-indigo-50/40 dark:from-zinc-800 dark:to-zinc-800/40 p-6 flex flex-col items-center justify-center border border-sky-100 dark:border-zinc-700">
                                <div className="flex items-center gap-4">
                                    <ItemIllustration type="laptop" className="w-32 h-24 drop-shadow-md" />
                                    <ItemIllustration type="mouse" className="w-16 h-16 drop-shadow-sm" />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    <span>36+ Unit Alat Lab Siap Dipakai</span>
                                </div>
                            </div>

                            {/* Quick Inventory Highlights preview */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                    <span>Katalog Terpopuler</span>
                                    <Link href="/alat" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        Semua (15)
                                    </Link>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                        <p className="font-bold text-zinc-800 dark:text-zinc-200">Laptop</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">36 Tersedia</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                        <p className="font-bold text-zinc-800 dark:text-zinc-200">Peripheral</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">36 Tersedia</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                        <p className="font-bold text-zinc-800 dark:text-zinc-200">Tools</p>
                                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">36 Tersedia</p>
                                    </div>
                                </div>
                            </div>

                            {/* Active Loan Mock Notification */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-300">
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Peminjaman terintegrasi: Konfirmasi instan tanpa formulir kertas.</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur py-6">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <p>© 2024 SMKN 1 Kota Bekasi - Laboratory Inventory System</p>
                        <div className="flex items-center gap-4">
                            <span>Rekayasa Perangkat Lunak</span>
                            <span>•</span>
                            <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Akses Aplikasi
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
