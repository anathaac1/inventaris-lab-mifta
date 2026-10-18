import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    SlidersHorizontal,
    Laptop,
    Mouse,
    Wrench,
    Zap,
    ChevronRight,
    Clock
} from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { ItemDetailModal } from '@/components/inventory/item-detail-modal';
import { FilterSheet } from '@/components/inventory/filter-sheet';
import {
    getStoredItems,
    getStoredLoans,
    saveStoredLoans,
    saveStoredItems,
    type InventoryItem,
    type LoanItem
} from '@/data/inventory-data';

interface DashboardProps {
    initialItems?: InventoryItem[];
    initialActiveLoans?: LoanItem[];
}

export default function Dashboard({ initialItems, initialActiveLoans }: DashboardProps) {
    const [items, setItems] = useState<InventoryItem[]>(() =>
        initialItems && initialItems.length > 0 ? initialItems : getStoredItems()
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedStatus, setSelectedStatus] = useState('Semua');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [activeLoans, setActiveLoans] = useState<LoanItem[]>(() =>
        initialActiveLoans && initialActiveLoans.length > 0
            ? initialActiveLoans
            : getStoredLoans().filter((l) => l.status === 'Sedang Dipinjam')
    );

    useEffect(() => {
        if (initialItems && initialItems.length > 0) {
            setItems(initialItems);
        } else {
            setItems(getStoredItems());
        }

        if (initialActiveLoans && initialActiveLoans.length > 0) {
            setActiveLoans(initialActiveLoans);
        } else {
            const allLoans = getStoredLoans();
            setActiveLoans(allLoans.filter((l) => l.status === 'Sedang Dipinjam'));
        }

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

    const categories = [
        { name: 'Laptop', icon: Laptop },
        { name: 'Peripheral', icon: Mouse },
        { name: 'Tools', icon: Wrench },
        { name: 'Elektrikal', icon: Zap },
    ];

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

        // Submit to Laravel backend
        if (typeof item.id === 'number' || (initialItems && initialItems.length > 0)) {
            router.post('/peminjaman', {
                alat_id: item.id,
                borrower_name: 'Kenho Imut',
                borrower_class: 'XII RPL 2',
                borrow_date: borrowDate,
                return_estimate: returnEstimate,
                notes,
            }, {
                preserveScroll: true,
            });
        }
    };

    return (
        <MainLayout currentTab="home">
            <Head title="Beranda - Sistem Inventory Lab RPL" />

            <div className="space-y-5">
                {/* Greeting Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                            Hi, Kenho Imut!
                        </h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Hari ini kamu mau pinjam apa?
                        </p>
                    </div>

                    <Link href="/profile">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-zinc-200">
                            <span className="font-bold text-xs text-blue-600">KI</span>
                        </div>
                    </Link>
                </div>

                {/* Search Bar + Filter Button */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-zinc-200 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-blue-500"
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

                {/* Banner */}
                <div className="relative overflow-hidden rounded-xl bg-[#1E60AA] text-white p-5">
                    <div className="relative z-10 max-w-xs">
                        <h2 className="text-lg sm:text-xl font-bold leading-snug">
                            Apapun yang kamu pinjam, <br />
                            Tolong pakai dengan, <span className="text-[#FFDE59]">Bijak!</span>
                        </h2>
                    </div>

                    <div className="absolute right-2 -bottom-1 sm:right-4 sm:bottom-0 pointer-events-none">
                        <ItemIllustration type="laptop" className="w-28 h-24 sm:w-36 sm:h-28" />
                    </div>
                </div>

                {/* Category Quick Filter Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory === cat.name;
                        const Icon = cat.icon;
                        return (
                            <button
                                key={cat.name}
                                type="button"
                                onClick={() => setSelectedCategory(isSelected ? 'Semua' : cat.name)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-colors text-left ${
                                    isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-semibold">
                                    {cat.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Section: "Alat Tersedia" */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-zinc-900">
                            Alat Tersedia
                        </h3>
                        <Link
                            href="/alat"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                        >
                            <span>Lihat Semua</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {filteredItems.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-lg border border-zinc-200 p-6">
                            <p className="text-xs text-zinc-500">
                                Tidak ada alat yang sesuai.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                            {filteredItems.slice(0, 10).map((item) => (
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

                {/* Section: "Terakhir Dipinjam" */}
                {activeLoans.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2.5">
                            <h3 className="text-sm font-bold text-zinc-900">
                                Terakhir Dipinjam
                            </h3>
                            <Link
                                href="/peminjaman"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            >
                                <span>Lihat Semua</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <div className="space-y-2">
                            {activeLoans.slice(0, 2).map((loan) => (
                                <Link
                                    key={loan.id}
                                    href="/peminjaman"
                                    className="flex items-center justify-between p-3 rounded-lg bg-white border border-zinc-200 hover:border-blue-400 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded bg-zinc-50 flex items-center justify-center border border-zinc-100 shrink-0">
                                            <ItemIllustration
                                                type={loan.itemId.includes('laptop') ? 'laptop' : 'mouse'}
                                                className="w-7 h-7"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-zinc-900">
                                                {loan.itemName}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                                                    {loan.status}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {loan.borrowDate}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-zinc-400" />
                                </Link>
                            ))}
                        </div>
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
