import React from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '@/data/inventory-data';

export interface AlatFilterValues {
    name: string;
    code: string;
    category: string;
    stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
    visibility: 'all' | 'visible' | 'hidden';
}

interface AlatFilterBarProps {
    filters: AlatFilterValues;
    onFilterChange: (filters: AlatFilterValues) => void;
    onReset: () => void;
    onApply: () => void;
    onOpenAdd: () => void;
}

export function AlatFilterBar({
    filters,
    onFilterChange,
    onReset,
    onApply,
    onOpenAdd
}: AlatFilterBarProps) {
    const handleFieldChange = (field: keyof AlatFilterValues, value: string) => {
        onFilterChange({
            ...filters,
            [field]: value
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onApply();
        }
    };

    return (
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">

                </span>
                <button
                    type="button"
                    onClick={onOpenAdd}
                    className="h-8 px-3.5 rounded bg-[#0256D0] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alat Baru</span>
                </button>
            </div>

            {/* 3-Column Grid Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3.5 text-xs">
                {/* Row 1 - Col 1: Nama Perangkat (Input biasa tanpa tombol X) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Nama Alat
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan Nama Alat"
                        value={filters.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-9 px-3 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0]"
                    />
                </div>

                {/* Row 1 - Col 2: Kategori (Select dengan chevron digeser ke kiri dan tombol X di kanan) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Kategori
                    </label>
                    <div className="relative flex-1">
                        <select
                            value={filters.category}
                            onChange={(e) => handleFieldChange('category', e.target.value)}
                            className={`w-full h-9 pl-3 pr-14 rounded border border-slate-300 bg-white text-xs appearance-none focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0] cursor-pointer ${
                                filters.category === 'Semua' ? 'text-transparent' : 'text-slate-900 font-medium'
                            }`}
                        >
                            <option value="Semua" className="hidden" disabled>Pilih Kategori</option>
                            {CATEGORIES.filter((cat) => cat !== 'Semua').map((cat) => (
                                <option key={cat} value={cat} className="text-slate-900 font-normal">
                                    {cat}
                                </option>
                            ))}
                        </select>
                        {filters.category === 'Semua' && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                Pilih Kategori
                            </span>
                        )}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            {filters.category !== 'Semua' && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange('category', 'Semua');
                                    }}
                                    title="Hapus pilihan kategori"
                                    className="pointer-events-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 1 - Col 3: Ketersediaan Stok (Select) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Status Stok
                    </label>
                    <div className="relative flex-1">
                        <select
                            value={filters.stockStatus}
                            onChange={(e) => handleFieldChange('stockStatus', e.target.value)}
                            className={`w-full h-9 pl-3 pr-14 rounded border border-slate-300 bg-white text-xs appearance-none focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0] cursor-pointer ${
                                filters.stockStatus === 'all' ? 'text-transparent' : 'text-slate-900 font-medium'
                            }`}
                        >
                            <option value="all" className="hidden" disabled>Pilih Stok</option>
                            <option value="in_stock" className="text-slate-900 font-normal">Tersedia</option>
                            <option value="low_stock" className="text-slate-900 font-normal">Stok Menipis</option>
                            <option value="out_of_stock" className="text-slate-900 font-normal">Habis</option>
                        </select>
                        {filters.stockStatus === 'all' && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                Pilih Stok
                            </span>
                        )}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            {filters.stockStatus !== 'all' && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange('stockStatus', 'all');
                                    }}
                                    title="Hapus pilihan status stok"
                                    className="pointer-events-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2 - Col 1: Kode Alat (Input biasa tanpa tombol X) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Kode Alat
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan Kode Alat"
                        value={filters.code}
                        onChange={(e) => handleFieldChange('code', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-9 px-3 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0]"
                    />
                </div>

                {/* Row 2 - Col 2: Status Visibilitas (Select) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Status Alat
                    </label>
                    <div className="relative flex-1">
                        <select
                            value={filters.visibility}
                            onChange={(e) => handleFieldChange('visibility', e.target.value)}
                            className={`w-full h-9 pl-3 pr-14 rounded border border-slate-300 bg-white text-xs appearance-none focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0] cursor-pointer ${
                                filters.visibility === 'all' ? 'text-transparent' : 'text-slate-900 font-medium'
                            }`}
                        >
                            <option value="all" className="hidden" disabled>Pilih Status</option>
                            <option value="visible" className="text-slate-900 font-normal">Aktif</option>
                            <option value="hidden" className="text-slate-900 font-normal">Tidak Aktif</option>
                        </select>
                        {filters.visibility === 'all' && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                Pilih Status
                            </span>
                        )}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            {filters.visibility !== 'all' && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange('visibility', 'all');
                                    }}
                                    title="Hapus pilihan status visibilitas"
                                    className="pointer-events-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2 - Col 3: Empty spacer for alignment */}
                <div className="hidden md:block"></div>
            </div>

            {/* Filter Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 mt-4 pt-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onApply}
                    className="h-8 px-6 rounded bg-[#0256D0] hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                >
                    Filter
                </button>
                <button
                    type="button"
                    onClick={onReset}
                    className="h-8 px-5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
