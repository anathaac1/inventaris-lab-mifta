import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    Search,
    SlidersHorizontal,
    ArrowLeft
} from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemIllustration } from '@/components/inventory/item-illustration';
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
            const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                item.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
            const matchStatus = selectedStatus === 'Semua' || item.status === selectedStatus;
            return matchSearch && matchCategory && matchStatus;
        });
    }, [items, searchQuery, selectedCategory, selectedStatus]);

    const handleOpenDetail = (item: InventoryItem) => {
        setSelectedItem(item);
        setDetailModalOpen(true);
    };

    const handleLoanSuccess = (item: InventoryItem, borrowDate: string, returnEstimate: string, notes: string) => {
        const newLoan: LoanItem = {
            id: `loan-${Date.now()}`,
            itemId: item.id,
            itemName: item.name,
            code: item.code,
            category: item.category,
            borrowDate,
            returnEstimate,
            status: 'Sedang Dipinjam',
            borrowerName: 'Kenho Imut',
            borrowerClass: 'XII RPL 2',
            notes,
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
                {/* Header with Back Arrow */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        Semua Alat
                    </h1>
                </div>

                {/* Search Bar + Filter Button */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setFilterSheetOpen(true)}
                        className={`px-3 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                            selectedCategory !== 'Semua' || selectedStatus !== 'Semua'
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                        }`}
                        title="Filter"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                                    active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {/* Items Grid */}
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-zinc-200 p-6">
                        <p className="text-xs text-zinc-500">
                            Tidak ditemukan alat yang cocok.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                        {filteredItems.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleOpenDetail(item)}
                                className="flex flex-col items-center justify-between p-3 rounded-lg bg-white border border-zinc-200 hover:border-blue-500 transition-colors text-center"
                            >
                                <div className="w-full aspect-[4/3] rounded bg-zinc-50 flex items-center justify-center mb-2">
                                    <ItemIllustration type={item.iconType} className="w-16 h-12" />
                                </div>

                                <div className="w-full">
                                    <h4 className="text-xs font-semibold text-zinc-900 truncate">
                                        {item.name}
                                    </h4>
                                    <p className="text-[11px] text-emerald-600 mt-0.5">
                                        {item.stock} Tersedia
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Item Detail Modal */}
            <ItemDetailModal
                item={selectedItem}
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                onLoanSuccess={handleLoanSuccess}
            />

            {/* Filter Sheet Modal */}
            <FilterSheet
                open={filterSheetOpen}
                onClose={() => setFilterSheetOpen(false)}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                onSelectStatus={setSelectedStatus}
                onApply={() => {}}
            />
        </MainLayout>
    );
}
