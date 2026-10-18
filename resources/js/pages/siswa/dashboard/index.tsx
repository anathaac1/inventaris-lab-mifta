import { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Laptop, Mouse, Wrench, Zap } from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemDetailModal } from '@/components/inventory/item-detail-modal';
import { FilterSheet } from '@/components/inventory/filter-sheet';
import { DashboardBannerCarousel } from '@/components/inventory/dashboard-banner-carousel';
import {
    getStoredItems,
    getStoredLoans,
    saveStoredLoans,
    saveStoredItems,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';
import { getActiveSession, type SessionToken } from '@/data/auth-store';

import { DashboardGreeting } from './dashboard-greeting';
import { DashboardSearchBar } from './dashboard-search-bar';
import { DashboardCategoryGrid, type CategoryOption } from './dashboard-category-grid';
import { DashboardAvailableTools } from './dashboard-available-tools';
import { DashboardActiveLoans } from './dashboard-active-loans';

export default function Dashboard() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [activeLoans, setActiveLoans] = useState<LoanItem[]>([]);
    const [session, setSession] = useState<SessionToken | null>(null);

    useEffect(() => {
        setSession(getActiveSession());
        setItems(getStoredItems());
        const allLoans = getStoredLoans();
        setActiveLoans(allLoans.filter((l) => l.status === 'Sedang Dipinjam'));

        const handleItemsChange = () => setItems(getStoredItems());
        const handleLoansChange = () => {
            const updatedLoans = getStoredLoans();
            setActiveLoans(updatedLoans.filter((l) => l.status === 'Sedang Dipinjam'));
        };

        window.addEventListener('inventory_items_changed', handleItemsChange);
        window.addEventListener('inventory_loans_changed', handleLoansChange);

        return () => {
            window.removeEventListener('inventory_items_changed', handleItemsChange);
            window.removeEventListener('inventory_loans_changed', handleLoansChange);
        };
    }, []);

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
        const newLoan: LoanItem = {
            id: `loan-${Date.now()}`,
            itemId: item.id,
            itemName: item.name,
            code: item.code,
            category: item.category,
            borrowDate,
            returnEstimate,
            status: 'Sedang Dipinjam',
            borrowerName: session?.name || 'Ahmad Rizky Pratama',
            borrowerClass: session?.class || 'XII RPL A',
            notes
        };

        const allLoans = getStoredLoans();
        const updatedLoans = [newLoan, ...allLoans];
        saveStoredLoans(updatedLoans);
        setActiveLoans([newLoan, ...activeLoans]);

        // Decrement stock
        const updatedItems = items.map((i) => {
            if (i.id === item.id) {
                return {
                    ...i,
                    stock: Math.max(0, i.stock - 1),
                    status: i.stock - 1 <= 0 ? ('Dipinjam' as const) : ('Tersedia' as const)
                };
            }
            return i;
        });
        saveStoredItems(updatedItems);
        setItems(updatedItems);
    };

    const studentName = session?.name || 'Kenho Imut';
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
