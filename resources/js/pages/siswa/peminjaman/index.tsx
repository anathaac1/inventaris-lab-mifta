import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { MainLayout } from '@/components/inventory/main-layout';
import {
    getStoredLoans,
    type LoanItem
} from '@/data/inventory-data';
import { toast } from 'sonner';

import { PeminjamanHeader } from './peminjaman-header';
import { PeminjamanTabs } from './peminjaman-tabs';
import { PeminjamanActiveList } from './peminjaman-active-list';
import { PeminjamanHistoryList } from './peminjaman-history-list';

interface PeminjamanProps {
    initialActiveLoans?: LoanItem[];
    initialLoanHistory?: LoanItem[];
}

export default function Peminjaman({ initialActiveLoans, initialLoanHistory }: PeminjamanProps) {
    const [activeTab, setActiveTab] = useState<'aktif' | 'riwayat'>('aktif');
    const [activeLoans, setActiveLoans] = useState<LoanItem[]>(() => {
        if (initialActiveLoans) return initialActiveLoans;
        return getStoredLoans().filter((item) => item.status === 'Sedang Dipinjam');
    });
    const [loanHistory, setLoanHistory] = useState<LoanItem[]>(() => {
        if (initialLoanHistory) return initialLoanHistory;
        return getStoredLoans().filter((item) => item.status === 'Dikembalikan');
    });

    useEffect(() => {
        if (initialActiveLoans) setActiveLoans(initialActiveLoans);
    }, [initialActiveLoans]);

    useEffect(() => {
        if (initialLoanHistory) setLoanHistory(initialLoanHistory);
    }, [initialLoanHistory]);

    useEffect(() => {
        const handleLoansChange = () => {
            if (!initialActiveLoans && !initialLoanHistory) {
                const stored = getStoredLoans();
                setActiveLoans(stored.filter((item) => item.status === 'Sedang Dipinjam'));
                setLoanHistory(stored.filter((item) => item.status === 'Dikembalikan'));
            }
        };
        window.addEventListener('inventory_loans_changed', handleLoansChange);
        return () => window.removeEventListener('inventory_loans_changed', handleLoansChange);
    }, [initialActiveLoans, initialLoanHistory]);

    const handleReturnItem = (loan: LoanItem) => {
        router.post(`/peminjaman/${loan.id}/kembalikan`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Alat ${loan.itemName} (${loan.code}) berhasil dikembalikan!`);
            },
            onError: (errors) => {
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Gagal memproses pengembalian alat.');
            }
        });
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
