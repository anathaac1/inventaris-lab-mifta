import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Clock,
    Calendar,
    CheckCircle2,
    ArrowLeft,
    RotateCcw,
    Box
} from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { Button } from '@/components/ui/button';
import {
    getStoredLoans,
    saveStoredLoans,
    getStoredItems,
    saveStoredItems,
    type LoanItem
} from '@/data/inventory-data';
import { toast } from 'sonner';

export default function Peminjaman() {
    const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif');
    const [loans, setLoans] = useState<LoanItem[]>([]);

    useEffect(() => {
        setLoans(getStoredLoans());
        const handleLoansChange = () => setLoans(getStoredLoans());
        window.addEventListener('inventory_loans_changed', handleLoansChange);
        return () => window.removeEventListener('inventory_loans_changed', handleLoansChange);
    }, []);

    const activeLoans = loans.filter((item) => item.status === 'Sedang Dipinjam');
    const loanHistory = loans.filter((item) => item.status === 'Dikembalikan');

    const handleReturnItem = (loan: LoanItem) => {
        const returnDate = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });

        const updatedLoans: LoanItem[] = loans.map((l) =>
            l.id === loan.id
                ? {
                      ...l,
                      status: 'Dikembalikan' as const,
                      returnDate,
                  }
                : l
        );

        saveStoredLoans(updatedLoans);
        setLoans(updatedLoans);

        // Restore item stock
        const currentItems = getStoredItems();
        const updatedItems = currentItems.map((item) => {
            if (item.id === loan.itemId || item.name.toLowerCase() === loan.itemName.toLowerCase()) {
                return {
                    ...item,
                    stock: Math.min(item.total, item.stock + 1)
                };
            }
            return item;
        });
        saveStoredItems(updatedItems);

        toast.success(`Alat ${loan.itemName} (${loan.code}) berhasil dikembalikan!`);
    };

    return (
        <MainLayout currentTab="peminjaman">
            <Head title="Peminjaman Saya - Sistem Inventory Lab RPL" />

            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        Peminjaman Saya
                    </h1>
                </div>

                {/* Tabs Switcher: "Aktif" vs "Riwayat" */}
                <div className="flex border-b border-zinc-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab('aktif')}
                        className={`pb-2.5 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                            activeTab === 'aktif'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <span>Aktif</span>
                        {activeLoans.length > 0 && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 text-[10px]">
                                {activeLoans.length}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('riwayat')}
                        className={`pb-2.5 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
                            activeTab === 'riwayat'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-zinc-500 hover:text-zinc-800'
                        }`}
                    >
                        <span>Riwayat</span>
                        <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 text-[10px]">
                            {loanHistory.length}
                        </span>
                    </button>
                </div>

                {/* Active Loans Tab */}
                {activeTab === 'aktif' && (
                    <div className="space-y-3">
                        {activeLoans.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-lg border border-zinc-200 p-6 space-y-2">
                                <p className="text-xs text-zinc-500">
                                    Tidak ada alat yang sedang dipinjam
                                </p>
                                <Link
                                    href="/alat"
                                    className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
                                >
                                    Pinjam Alat
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {activeLoans.map((loan) => (
                                    <div
                                        key={loan.id}
                                        className="p-3.5 rounded-lg bg-white border border-zinc-200 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded bg-zinc-50 p-1 flex items-center justify-center border border-zinc-100 shrink-0">
                                                <ItemIllustration
                                                    type={loan.itemId.includes('laptop') ? 'laptop' : 'mouse'}
                                                    className="w-9 h-9"
                                                />
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xs font-bold text-zinc-900">
                                                        {loan.itemName}
                                                    </h3>
                                                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                        {loan.status}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-zinc-500 mt-0.5">
                                                    {loan.code} • Dipinjam: {loan.borrowDate}
                                                </p>
                                                {loan.notes && (
                                                    <p className="text-[11px] text-zinc-400 mt-0.5">
                                                        Keperluan: {loan.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleReturnItem(loan)}
                                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0"
                                        >
                                            Kembalikan
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* History Loans Tab */}
                {activeTab === 'riwayat' && (
                    <div className="space-y-2.5">
                        {loanHistory.map((hist) => (
                            <div
                                key={hist.id}
                                className="p-3 rounded-lg bg-white border border-zinc-200 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded bg-zinc-50 border border-zinc-100 p-1 flex items-center justify-center shrink-0">
                                        <ItemIllustration
                                            type={hist.itemId.includes('laptop') ? 'laptop' : 'mouse'}
                                            className="w-7 h-7"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-900">
                                            {hist.itemName}
                                        </h4>
                                        <p className="text-[11px] text-zinc-500">
                                            {hist.code} • Kembali: {hist.returnDate || hist.returnEstimate}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Selesai
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
