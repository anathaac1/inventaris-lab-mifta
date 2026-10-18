import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Search,
    CheckCircle2,
    Clock,
    User,
    Calendar,
    ArrowUpDown
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredLoans,
    saveStoredLoans,
    getStoredItems,
    saveStoredItems,
    type LoanItem,
    type InventoryItem
} from '@/data/inventory-data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminPeminjamanProps {
    initialLoans?: LoanItem[];
    initialItems?: InventoryItem[];
}

export default function AdminPeminjaman({ initialLoans, initialItems }: AdminPeminjamanProps) {
    const [loans, setLoans] = useState<LoanItem[]>(() =>
        initialLoans && initialLoans.length > 0 ? initialLoans : getStoredLoans()
    );
    const [items, setItems] = useState<InventoryItem[]>(() =>
        initialItems && initialItems.length > 0 ? initialItems : getStoredItems()
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTab, setStatusTab] = useState<'all' | 'active' | 'returned'>('all');

    useEffect(() => {
        if (initialLoans && initialLoans.length > 0) {
            setLoans(initialLoans);
        } else {
            setLoans(getStoredLoans());
        }

        if (initialItems && initialItems.length > 0) {
            setItems(initialItems);
        } else {
            setItems(getStoredItems());
        }

        const handleLoansChange = () => {
            if (!initialLoans || initialLoans.length === 0) setLoans(getStoredLoans());
        };
        const handleItemsChange = () => {
            if (!initialItems || initialItems.length === 0) setItems(getStoredItems());
        };

        window.addEventListener('inventory_loans_changed', handleLoansChange);
        window.addEventListener('inventory_items_changed', handleItemsChange);

        return () => {
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
            window.removeEventListener('inventory_items_changed', handleItemsChange);
        };
    }, [initialLoans, initialItems]);

    // Filter
    const filteredLoans = loans.filter((loan) => {
        const matchesSearch =
            loan.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.borrowerClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.code.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusTab === 'all' ||
            (statusTab === 'active' && loan.status === 'Sedang Dipinjam') ||
            (statusTab === 'returned' && loan.status === 'Dikembalikan');

        return matchesSearch && matchesStatus;
    });

    const activeCount = loans.filter((l) => l.status === 'Sedang Dipinjam').length;
    const returnedCount = loans.filter((l) => l.status === 'Dikembalikan').length;

    // Process Return
    const handleReturnItem = (loanId: string) => {
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

        // Increment stock
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

        if (typeof targetLoan.id === 'number' || (initialLoans && initialLoans.length > 0)) {
            router.post(`/admin/peminjaman/${targetLoan.id}/kembalikan`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Barang ${targetLoan.itemName} telah berhasil dikembalikan ke inventaris!`);
                }
            });
        } else {
            toast.success(`Barang ${targetLoan.itemName} telah berhasil dikembalikan ke inventaris!`);
        }
    };

    return (
        <AdminLayout
            currentTab="peminjaman"
            title="Kelola Peminjaman Siswa"
            subtitle="Pantau dan konfirmasi pengembalian alat praktikum siswa"
        >
            <Head title="Admin CMS - Peminjaman Siswa" />

            <div className="space-y-4">
                {/* Filter and Search Bar */}
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari nama siswa, kelas, nama alat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex border border-zinc-200 rounded-lg overflow-hidden text-xs">
                        <button
                            type="button"
                            onClick={() => setStatusTab('all')}
                            className={`px-3 py-1.5 font-medium transition-colors ${
                                statusTab === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            Semua ({loans.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusTab('active')}
                            className={`px-3 py-1.5 font-medium transition-colors border-l border-zinc-200 flex items-center gap-1.5 ${
                                statusTab === 'active'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            <span>Sedang Dipinjam</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                statusTab === 'active' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                                {activeCount}
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setStatusTab('returned')}
                            className={`px-3 py-1.5 font-medium transition-colors border-l border-zinc-200 ${
                                statusTab === 'returned'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                            }`}
                        >
                            Selesai ({returnedCount})
                        </button>
                    </div>
                </div>

                {/* Table of Loans */}
                <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4">Siswa & Kelas</th>
                                    <th className="py-3 px-4">Alat Dipinjam</th>
                                    <th className="py-3 px-4">Periode Pinjam</th>
                                    <th className="py-3 px-4">Keperluan / Catatan</th>
                                    <th className="py-3 px-4 text-center">Status</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-zinc-800">
                                {filteredLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-zinc-500">
                                            Tidak ada data peminjaman yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLoans.map((loan) => {
                                        const isActive = loan.status === 'Sedang Dipinjam';
                                        return (
                                            <tr key={loan.id} className="hover:bg-zinc-50/70 transition-colors">
                                                {/* Siswa */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                            <User className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-zinc-900 block">
                                                                {loan.borrowerName}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-500">
                                                                {loan.borrowerClass}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Alat */}
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <span className="font-semibold text-zinc-900 block">
                                                            {loan.itemName}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-400 font-mono">
                                                            {loan.code} • {loan.category}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Tanggal */}
                                                <td className="py-3 px-4">
                                                    <div className="space-y-0.5 text-[11px]">
                                                        <p className="text-zinc-700 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3 text-zinc-400" />
                                                            <span>Pinjam: {loan.borrowDate}</span>
                                                        </p>
                                                        {isActive ? (
                                                            <p className="text-amber-700 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>Tenggat: {loan.returnEstimate}</span>
                                                            </p>
                                                        ) : (
                                                            <p className="text-emerald-700 flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                <span>Kembali: {loan.returnDate || loan.returnEstimate}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Catatan */}
                                                <td className="py-3 px-4 max-w-[200px]">
                                                    <p className="text-[11px] text-zinc-600 truncate">
                                                        {loan.notes || '-'}
                                                    </p>
                                                </td>

                                                {/* Status */}
                                                <td className="py-3 px-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                                                            isActive
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                        }`}
                                                    >
                                                        {isActive ? (
                                                            <>
                                                                <Clock className="w-3 h-3" />
                                                                <span>Sedang Dipinjam</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-3 h-3" />
                                                                <span>Dikembalikan</span>
                                                            </>
                                                        )}
                                                    </span>
                                                </td>

                                                {/* Aksi */}
                                                <td className="py-3 px-4 text-right">
                                                    {isActive ? (
                                                        <Button
                                                            onClick={() => handleReturnItem(loan.id)}
                                                            className="h-7 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 px-2.5"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span>Konfirmasi Kembali</span>
                                                        </Button>
                                                    ) : (
                                                        <span className="text-[11px] text-zinc-400 italic">
                                                            Selesai
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500 flex items-center justify-between">
                        <span>Total {filteredLoans.length} catatan peminjaman ditampilkan</span>
                        <span>Konfirmasi pengembalian otomatis mengembalikan unit ke stok inventaris</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
