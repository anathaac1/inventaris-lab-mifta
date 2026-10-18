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
import { PeminjamanFilterBar, type PeminjamanFilterValues } from './peminjaman-filter-bar';
import { PeminjamanTable } from './peminjaman-table';

const DEFAULT_LOAN_FILTERS: PeminjamanFilterValues = {
    borrowerName: '',
    borrowerClass: 'all',
    itemName: '',
    code: '',
    status: 'all'
};

export default function AdminPeminjaman() {
    const [loans, setLoans] = useState<LoanItem[]>([]);
    const [items, setItems] = useState<InventoryItem[]>([]);

    // Filter Form Values & Applied Filter State
    const [filterForm, setFilterForm] = useState<PeminjamanFilterValues>(DEFAULT_LOAN_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<PeminjamanFilterValues>(DEFAULT_LOAN_FILTERS);

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

    // Filter based on appliedFilters
    const filteredLoans = loans.filter((loan) => {
        const borrowerQuery = appliedFilters.borrowerName.toLowerCase().trim();
        const matchesBorrower = !borrowerQuery || loan.borrowerName.toLowerCase().includes(borrowerQuery);

        const matchesClass =
            appliedFilters.borrowerClass === 'all' ||
            loan.borrowerClass.toLowerCase().trim() === appliedFilters.borrowerClass.toLowerCase().trim();

        const itemQuery = appliedFilters.itemName.toLowerCase().trim();
        const matchesItem = !itemQuery || loan.itemName.toLowerCase().includes(itemQuery);

        const codeQuery = appliedFilters.code.toLowerCase().trim();
        const matchesCode = !codeQuery || loan.code.toLowerCase().includes(codeQuery);

        const matchesStatus =
            appliedFilters.status === 'all' ||
            (appliedFilters.status === 'active' && loan.status === 'Sedang Dipinjam') ||
            (appliedFilters.status === 'returned' && loan.status === 'Dikembalikan');

        return matchesBorrower && matchesClass && matchesItem && matchesCode && matchesStatus;
    });

    const handleApplyFilter = () => {
        setAppliedFilters({ ...filterForm });
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilterForm(DEFAULT_LOAN_FILTERS);
        setAppliedFilters(DEFAULT_LOAN_FILTERS);
        setCurrentPage(1);
    };

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
                        filters={filterForm}
                        onFilterChange={setFilterForm}
                        onApply={handleApplyFilter}
                        onReset={handleResetFilter}
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
