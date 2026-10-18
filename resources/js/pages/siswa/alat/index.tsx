import { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemDetailModal } from '@/components/inventory/item-detail-modal';
import { FilterSheet } from '@/components/inventory/filter-sheet';
import {
    getStoredItems,
    saveStoredItems,
    getStoredLoans,
    saveStoredLoans,
    CATEGORIES,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';
import { getActiveSession } from '@/data/auth-store';

import { AlatHeader } from './alat-header';
import { AlatSearchBar } from './alat-search-bar';
import { AlatCategoryChips } from './alat-category-chips';
import { AlatGrid } from './alat-grid';

export default function Alat() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        setItems(getStoredItems());
        const handleItemsChange = () => setItems(getStoredItems());
        window.addEventListener('inventory_items_changed', handleItemsChange);
        return () => window.removeEventListener('inventory_items_changed', handleItemsChange);
    }, []);

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
        const session = getActiveSession();
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
        saveStoredLoans([newLoan, ...allLoans]);

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

    return (
        <MainLayout currentTab="alat">
            <Head title="Semua Alat - Sistem Inventory Lab RPL" />

            <div className="space-y-4">
                {/* Header with Back Arrow & Item Count */}
                <AlatHeader totalItems={filteredItems.length} />

                {/* Search Bar + Filter Button */}
                <AlatSearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    isFiltered={selectedCategory !== 'Semua' || selectedStatus !== 'Semua'}
                    onOpenFilter={() => setFilterSheetOpen(true)}
                />

                {/* Horizontal Category Chips */}
                <AlatCategoryChips
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {/* Grid of Tools */}
                <AlatGrid
                    items={filteredItems}
                    onOpenDetail={handleOpenDetail}
                />
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

            {/* Item Detail Modal for Pinjam */}
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
