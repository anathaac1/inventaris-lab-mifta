import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/data/inventory-data';

interface FilterSheetProps {
    open: boolean;
    onClose: () => void;
    selectedCategory: string;
    onSelectCategory: (cat: string) => void;
    selectedStatus: string;
    onSelectStatus: (status: string) => void;
    onApply: () => void;
}

export function FilterSheet({
    open,
    onClose,
    selectedCategory,
    onSelectCategory,
    selectedStatus,
    onSelectStatus,
    onApply,
}: FilterSheetProps) {
    const statuses = ['Semua', 'Tersedia', 'Dipinjam'];

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md w-full p-6 rounded-3xl bg-white border border-zinc-200 shadow-xl">
                <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-100">
                    <DialogTitle className="text-lg font-bold text-zinc-900">
                        Filter
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-3">
                            Kategori
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat) => {
                                const active = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => onSelectCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                            active
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-zinc-800 mb-3">
                            Status
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {statuses.map((st) => {
                                const active = selectedStatus === st;
                                return (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => onSelectStatus(st)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                                            active
                                                ? 'bg-blue-600 text-white shadow-sm'
                                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm"
                    >
                        Terapkan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
