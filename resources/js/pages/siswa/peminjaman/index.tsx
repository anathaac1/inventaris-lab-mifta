import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { MainLayout } from '@/components/inventory/main-layout';
import {
    getStoredLoans,
    saveStoredLoans,
    getStoredItems,
    saveStoredItems,
    type LoanItem
} from '@/data/inventory-data';
import { toast } from 'sonner';

import { PeminjamanHeader } from './peminjaman-header';
import { PeminjamanTabs } from './peminjaman-tabs';
import { PeminjamanActiveList } from './peminjaman-active-list';
import { PeminjamanHistoryList } from './peminjaman-history-list';

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
            year: 'numeric'
        });

        const updatedLoans: LoanItem[] = loans.map((l) =>
            l.id === loan.id
                ? {
                      ...l,
                      status: 'Dikembalikan' as const,
                      returnDate
                  }
                : l
        );

        saveStoredLoans(updatedLoans);
        setLoans(updatedLoans);

        // Restore item stock
        const currentItems = getStoredItems();
        const updatedItems = currentItems.map((item) => {
            if (
                item.id === loan.itemId ||
                item.name.toLowerCase() === loan.itemName.toLowerCase()
            ) {
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
                <PeminjamanHeader />

                {/* Tabs Switcher: "Aktif" vs "Riwayat" */}
                <PeminjamanTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    activeCount={activeLoans.length}
                    historyCount={loanHistory.length}
                />

                {/* Tab Content */}
                {activeTab === 'aktif' ? (
                    <PeminjamanActiveList
                        loans={activeLoans}
                        onReturnItem={handleReturnItem}
                    />
                ) : (
                    <PeminjamanHistoryList loans={loanHistory} />
                )}
            </div>
        </MainLayout>
    );
}
