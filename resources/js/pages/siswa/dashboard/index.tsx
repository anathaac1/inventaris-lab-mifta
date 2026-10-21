import { useState, useMemo, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Laptop, Mouse, Wrench, Zap } from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemDetailModal } from '@/components/inventory/item-detail-modal';
import { FilterSheet } from '@/components/inventory/filter-sheet';
import { DashboardBannerCarousel } from '@/components/inventory/dashboard-banner-carousel';
import {
    getStoredItems,
    getStoredLoans,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';
import { getActiveSession, type SessionToken } from '@/data/auth-store';
import { toast } from 'sonner';

import { DashboardGreeting } from './dashboard-greeting';
import { DashboardSearchBar } from './dashboard-search-bar';
import { DashboardCategoryGrid, type CategoryOption } from './dashboard-category-grid';
import { DashboardAvailableTools } from './dashboard-available-tools';
import { DashboardActiveLoans } from './dashboard-active-loans';

interface DashboardProps {
    initialItems?: InventoryItem[];
    initialActiveLoans?: LoanItem[];
}

export default function Dashboard({ initialItems, initialActiveLoans }: DashboardProps) {
    const { auth } = usePage().props as any;
    const [items, setItems] = useState<InventoryItem[]>(() => {
        if (initialItems && initialItems.length > 0) return initialItems;
        return getStoredItems();
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [activeLoans, setActiveLoans] = useState<LoanItem[]>(() => {
        if (initialActiveLoans && initialActiveLoans.length > 0) return initialActiveLoans;
        return getStoredLoans().filter((l) => l.status === 'Sedang Dipinjam');
    });
    const [session, setSession] = useState<SessionToken | null>(null);

    useEffect(() => {
        if (initialItems) setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        if (initialActiveLoans) setActiveLoans(initialActiveLoans);
    }, [initialActiveLoans]);

    useEffect(() => {
        setSession(getActiveSession());

        const handleItemsChange = () => {
            if (!initialItems || initialItems.length === 0) {
                setItems(getStoredItems());
            }
        };
        const handleLoansChange = () => {
            if (!initialActiveLoans || initialActiveLoans.length === 0) {
                const updatedLoans = getStoredLoans();
                setActiveLoans(updatedLoans.filter((l) => l.status === 'Sedang Dipinjam'));
            }
        };

        window.addEventListener('inventory_items_changed', handleItemsChange);
        window.addEventListener('inventory_loans_changed', handleLoansChange);

        return () => {
            window.removeEventListener('inventory_items_changed', handleItemsChange);
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
        };
    }, [initialItems, initialActiveLoans]);

    const categories: CategoryOption[] = [
        { name: 'Laptop', icon: Laptop },
        { name: 'Peripheral', icon: Mouse },
        { name: 'Tools', icon: Wrench },
        { name: 'Elektrikal', icon: Zap }
    ];

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            if (item.isVisibleToStudents === false) return false;
            const matchSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory =
                selectedCategory === 'Semua' || item.category === selectedCategory;
            const matchStatus =
                selectedStatus === 'Semua' || item.status === selectedStatus;
            return matchSearch && matchCategory && matchStatus;
        });
    }, [items, searchQuery, selectedCategory, selectedStatus]);

    const handleOpenDetail = (item: InventoryItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    const handleLoanSuccess = (
        item: InventoryItem,
        borrowDate: string,
        returnEstimate: string,
        notes: string
    ) => {
        const borrowerName = auth?.user?.name || session?.name || 'Ahmad Rizky Pratama';
        const borrowerClass = auth?.user?.class || session?.class || 'XII RPL A';

        router.post('/peminjaman', {
            alat_id: item.id,
            borrower_name: borrowerName,
            borrower_class: borrowerClass,
            borrow_date: borrowDate,
            return_estimate: returnEstimate,
            notes: notes || null
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Berhasil mengajukan peminjaman ${item.name}!`);
            },
            onError: (errors) => {
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Gagal mengajukan peminjaman.');
            }
        });
    };

    const studentName = auth?.user?.name || session?.name || 'Ahmad Rizky Pratama';
    const loginTimestamp = session?.createdAt || Date.now();
    const loginDate = new Date(loginTimestamp);

    const loginDateStr = loginDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const loginTimeStr =
        loginDate.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }) + ' WIB';

    return (
        <MainLayout currentTab="home">
            <Head title="Beranda - Sistem Inventory Lab RPL" />

            <div className="space-y-5">
                {/* Greeting Header & Last Login Badge */}
                <DashboardGreeting
                    studentName={studentName}
                    loginDateStr={loginDateStr}
                    loginTimeStr={loginTimeStr}
                />

                {/* Search Bar + Filter Button */}
                <DashboardSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isFiltered={selectedCategory !== 'Semua' || selectedStatus !== 'Semua'}
                    onOpenFilter={() => setFilterSheetOpen(true)}
                />

                {/* Banner Carousel */}
                <DashboardBannerCarousel />

                {/* Category Quick Filter Row */}
                <DashboardCategoryGrid
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {/* Section: "Alat Tersedia" */}
                <DashboardAvailableTools
                    items={filteredItems}
                    onOpenDetail={handleOpenDetail}
                />

                {/* Section: "Terakhir Dipinjam" */}
                <DashboardActiveLoans loans={activeLoans} />
            </div>

            {/* Filter Bottom Sheet */}
            <FilterSheet
                isOpen={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
                onReset={() => {
                    setSelectedCategory('Semua');
                    setSelectedStatus('Semua');
                    setFilterSheetOpen(false);
                }}
            />

            {/* Item Detail Modal for Borrowing */}
            {selectedItem && (
                <ItemDetailModal
                    item={selectedItem}
                    isOpen={detailModalOpen}
                    onClose={() => setDetailModalOpen(false)}
                    onLoanSuccess={handleLoanSuccess}
                />
            )}
        </MainLayout>
    );
}
