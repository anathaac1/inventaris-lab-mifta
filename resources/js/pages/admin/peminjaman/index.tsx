import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredLoans,
    saveStoredLoans,
    getStoredItems,
    saveStoredItems,
    type LoanItem,
    type InventoryItem
} from '@/data/inventory-data';
import { toast } from 'sonner';
import { AdminPagination } from '@/components/inventory/admin-pagination';
import { PeminjamanFilterBar } from './peminjaman-filter-bar';
import { PeminjamanTable } from './peminjaman-table';

export default function AdminPeminjaman() {
    const [loans, setLoans] = useState<LoanItem[]>([]);
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusTab, setStatusTab] = useState<'all' | 'active' | 'returned'>('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        setLoans(getStoredLoans());
        setItems(getStoredItems());

        const handleLoansChange = () => setLoans(getStoredLoans());
        const handleItemsChange = () => setItems(getStoredItems());

        window.addEventListener('inventory_loans_changed', handleLoansChange);
        window.addEventListener('inventory_items_changed', handleItemsChange);

        return () => {
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
            window.removeEventListener('inventory_items_changed', handleItemsChange);
        };
    }, []);

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

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(filteredLoans.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedLoans = filteredLoans.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

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

        toast.success(`Alat "${targetLoan.itemName}" telah dikonfirmasi kembali.`);
    };

    return (
        <AdminLayout
            currentTab="peminjaman"
            title="Log Peminjaman Siswa"
        >
            <Head title="Admin CMS - Log Peminjaman Siswa" />

            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <PeminjamanFilterBar
                        searchQuery={searchQuery}
                        onSearchChange={(q) => {
                            setSearchQuery(q);
                            setCurrentPage(1);
                        }}
                        statusTab={statusTab}
                        onStatusTabChange={(tab) => {
                            setStatusTab(tab);
                            setCurrentPage(1);
                        }}
                        totalCount={loans.length}
                        activeCount={activeCount}
                        returnedCount={returnedCount}
                    />

                    <PeminjamanTable
                        loans={paginatedLoans}
                        onReturnItem={handleReturnItem}
                    />

                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredLoans.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPageOptions={[10, 20, 50, 100]}
                        itemLabel="riwayat"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
