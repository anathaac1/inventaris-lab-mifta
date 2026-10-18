import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Box,
    Layers,
    Eye,
    ClipboardList,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    Plus
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredItems,
    getStoredLoans,
    saveStoredLoans,
    saveStoredItems,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminDashboardProps {
    initialItems?: InventoryItem[];
    initialLoans?: LoanItem[];
}

export default function AdminDashboard({ initialItems, initialLoans }: AdminDashboardProps) {
    const [items, setItems] = useState<InventoryItem[]>(() =>
        initialItems && initialItems.length > 0 ? initialItems : getStoredItems()
    );
    const [loans, setLoans] = useState<LoanItem[]>(() =>
        initialLoans && initialLoans.length > 0 ? initialLoans : getStoredLoans()
    );

    useEffect(() => {
        if (initialItems && initialItems.length > 0) {
            setItems(initialItems);
        } else {
            setItems(getStoredItems());
        }

        if (initialLoans && initialLoans.length > 0) {
            setLoans(initialLoans);
        } else {
            setLoans(getStoredLoans());
        }

        const handleItemsChange = () => {
            if (!initialItems || initialItems.length === 0) setItems(getStoredItems());
        };
        const handleLoansChange = () => {
            if (!initialLoans || initialLoans.length === 0) setLoans(getStoredLoans());
        };

        window.addEventListener('inventory_items_changed', handleItemsChange);
        window.addEventListener('inventory_loans_changed', handleLoansChange);

        return () => {
            window.removeEventListener('inventory_items_changed', handleItemsChange);
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
        };
    }, [initialItems, initialLoans]);

    // Summary calculations
    const totalItems = items.length;
    const totalPhysicalUnits = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const visibleToStudentsCount = items.filter((item) => item.isVisibleToStudents !== false).length;
    const activeLoans = loans.filter((loan) => loan.status === 'Sedang Dipinjam');

    // Quick Return action
    const handleQuickReturn = (loanId: string) => {
        const targetLoan = loans.find((l) => l.id === loanId);
        if (!targetLoan) return;

        const updatedLoans: LoanItem[] = loans.map((l) =>
            l.id === loanId
                ? {
                      ...l,
                      status: 'Dikembalikan' as const,
                      returnDate: new Date().toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                      })
                  }
                : l
        );

        // Return stock
        const updatedItems = items.map((item) => {
            if (item.id === targetLoan.itemId || item.name.toLowerCase() === targetLoan.itemName.toLowerCase()) {
                return {
                    ...item,
                    stock: Math.min(item.total, item.stock + 1)
                };
            }
            return item;
        });

        saveStoredLoans(updatedLoans);
        saveStoredItems(updatedItems);
        setLoans(updatedLoans);
        setItems(updatedItems);

        // Submit to Laravel backend
        if (typeof targetLoan.id === 'number' || (initialLoans && initialLoans.length > 0)) {
            router.post(`/admin/peminjaman/${targetLoan.id}/kembalikan`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Barang ${targetLoan.itemName} telah ditandai dikembalikan!`);
                },
            });
        } else {
            toast.success(`Barang ${targetLoan.itemName} telah ditandai dikembalikan!`);
        }
    };

    return (
        <AdminLayout
            currentTab="dashboard"
            title="Ringkasan Lab"
            subtitle="Pusat kontrol inventaris dan pemantauan barang lab RPL"
            actions={
                <Link href="/admin/alat">
                    <Button className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Kelola Alat</span>
                    </Button>
                </Link>
            }
        >
            <Head title="Admin CMS - Ringkasan Lab" />

            <div className="space-y-5">
                {/* 4 Metric Strips */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-lg border border-zinc-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500">Total Macam Alat</span>
                            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Box className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-2">{totalItems}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Jenis alat terdaftar</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-zinc-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500">Total Unit Fisik</span>
                            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Layers className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-2">{totalPhysicalUnits}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Unit peralatan lab</p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-zinc-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500">Tampil di Siswa</span>
                            <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                <Eye className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-2">{visibleToStudentsCount}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                            Dari {totalItems} alat ({totalItems - visibleToStudentsCount} disembunyikan)
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-zinc-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500">Dipinjam Siswa</span>
                            <div className="w-8 h-8 rounded bg-amber-50 text-amber-600 flex items-center justify-center">
                                <ClipboardList className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 mt-2">{activeLoans.length}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Sedang dalam penggunaan</p>
                    </div>
                </div>

                {/* Main Content Grid: Active Loans & Quick Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Active Loans Table (2 cols) */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-zinc-200">
                        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-zinc-900">
                                    Peminjaman Aktif Oleh Siswa
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    Daftar peminjaman yang belum dikembalikan
                                </p>
                            </div>
                            <Link
                                href="/admin/peminjaman"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <span>Lihat Semua</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {activeLoans.length === 0 ? (
                            <div className="p-8 text-center text-xs text-zinc-500">
                                Tidak ada peminjaman aktif saat ini. Semua alat telah dikembalikan.
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-100 overflow-x-auto">
                                {activeLoans.slice(0, 5).map((loan) => (
                                    <div key={loan.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-zinc-900">
                                                    {loan.borrowerName}
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium">
                                                    {loan.borrowerClass}
                                                </span>
                                            </div>
                                            <p className="text-zinc-600 text-[11px] mt-0.5">
                                                Meminjam: <span className="font-semibold text-zinc-800">{loan.itemName}</span> ({loan.code})
                                            </p>
                                            <p className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>Estimasi kembali: {loan.returnEstimate}</span>
                                                {loan.notes && <span>• {loan.notes}</span>}
                                            </p>
                                        </div>

                                        <div className="shrink-0">
                                            <Button
                                                onClick={() => handleQuickReturn(loan.id)}
                                                variant="outline"
                                                className="h-8 rounded-lg text-[11px] font-semibold text-emerald-600 border-emerald-200 hover:bg-emerald-50 flex items-center gap-1.5 px-2.5"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Selesai</span>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Stock Alert / Quick Overview (1 col) */}
                    <div className="bg-white rounded-lg border border-zinc-200 flex flex-col">
                        <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-bold text-zinc-900">
                                    Status Katalog
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    Alat yang aktif & tersembunyi
                                </p>
                            </div>
                            <Link
                                href="/admin/alat"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Kelola
                            </Link>
                        </div>

                        <div className="p-4 flex-1 space-y-3">
                            <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Status Visibilitas:</span>
                                    <span className="font-bold text-zinc-800">
                                        {visibleToStudentsCount} Aktif / {totalItems - visibleToStudentsCount} Tersembunyi
                                    </span>
                                </div>
                                <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full"
                                        style={{
                                            width: `${totalItems > 0 ? (visibleToStudentsCount / totalItems) * 100 : 0}%`
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-500">
                                    Siswa hanya dapat melihat dan mengajukan pinjam untuk produk dengan status aktif.
                                </p>
                            </div>

                            <h3 className="text-xs font-bold text-zinc-800 pt-1">
                                Contoh Alat Teratas:
                            </h3>
                            <div className="space-y-2">
                                {items.slice(0, 4).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-2 rounded border border-zinc-100 bg-white text-xs"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-8 h-8 rounded bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100">
                                                <ItemIllustration type={item.iconType} className="w-5 h-5" />
                                            </div>
                                            <div className="truncate">
                                                <p className="font-semibold text-zinc-800 truncate">{item.name}</p>
                                                <p className="text-[10px] text-zinc-400">Stok: {item.stock}/{item.total}</p>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                                item.isVisibleToStudents !== false
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                                            }`}
                                        >
                                            {item.isVisibleToStudents !== false ? 'Tampil' : 'Sembunyi'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
