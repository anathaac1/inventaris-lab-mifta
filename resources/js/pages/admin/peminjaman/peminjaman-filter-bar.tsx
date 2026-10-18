import React from 'react';
import { X, ChevronDown } from 'lucide-react';

export interface PeminjamanFilterValues {
    borrowerName: string;
    borrowerClass: string;
    itemName: string;
    code: string;
    status: 'all' | 'active' | 'returned';
}

interface PeminjamanFilterBarProps {
    filters: PeminjamanFilterValues;
    onFilterChange: (filters: PeminjamanFilterValues) => void;
    onReset: () => void;
    onApply: () => void;
    totalCount: number;
    activeCount: number;
    returnedCount: number;
}

export const RPL_CLASSES_FILTER = [
    'Semua Kelas',
    'X RPL A',
    'X RPL B',
    'XI RPL A',
    'XI RPL B',
    'XII RPL A',
    'XII RPL B'
];

export function PeminjamanFilterBar({
    filters,
    onFilterChange,
    onReset,
    onApply,
    totalCount,
    activeCount,
    returnedCount
}: PeminjamanFilterBarProps) {
    const handleFieldChange = (field: keyof PeminjamanFilterValues, value: string) => {
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
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Total: <strong>{totalCount}</strong></span>
                    <span>•</span>
                    <span className="text-amber-700 font-semibold">{activeCount} Sedang Dipinjam</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{returnedCount} Selesai</span>
                </div>
            </div>

            {/* 3-Column Grid Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3.5 text-xs">
                {/* Row 1 - Col 1: Nama Peminjam (Input biasa) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Nama Siswa
                    </label>
                    <input
                        type="text"
                        placeholder="Input Nama Siswa"
                        value={filters.borrowerName}
                        onChange={(e) => handleFieldChange('borrowerName', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-9 px-3 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0]"
                    />
                </div>

                {/* Row 1 - Col 2: Kelas (Select) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Kelas
                    </label>
                    <div className="relative flex-1">
                        <select
                            value={filters.borrowerClass}
                            onChange={(e) => handleFieldChange('borrowerClass', e.target.value)}
                            className={`w-full h-9 pl-3 pr-14 rounded border border-slate-300 bg-white text-xs appearance-none focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0] cursor-pointer ${
                                filters.borrowerClass === 'all' ? 'text-transparent' : 'text-slate-900 font-medium'
                            }`}
                        >
                            <option value="all" className="hidden" disabled>Pilih Kelas</option>
                            {RPL_CLASSES_FILTER.filter((cls) => cls !== 'Semua Kelas').map((cls) => (
                                <option key={cls} value={cls} className="text-slate-900 font-normal">
                                    {cls}
                                </option>
                            ))}
                        </select>
                        {filters.borrowerClass === 'all' && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                Pilih Kelas
                            </span>
                        )}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            {filters.borrowerClass !== 'all' && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange('borrowerClass', 'all');
                                    }}
                                    title="Hapus pilihan kelas"
                                    className="pointer-events-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 1 - Col 3: Status Log (Select) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Status Pinjam
                    </label>
                    <div className="relative flex-1">
                        <select
                            value={filters.status}
                            onChange={(e) => handleFieldChange('status', e.target.value)}
                            className={`w-full h-9 pl-3 pr-14 rounded border border-slate-300 bg-white text-xs appearance-none focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0] cursor-pointer ${
                                filters.status === 'all' ? 'text-transparent' : 'text-slate-900 font-medium'
                            }`}
                        >
                            <option value="all" className="hidden" disabled>Pilih Status</option>
                            <option value="active" className="text-slate-900 font-normal">Sedang Dipinjam</option>
                            <option value="returned" className="text-slate-900 font-normal">Selesai Dikembalikan</option>
                        </select>
                        {filters.status === 'all' && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                                Pilih Status
                            </span>
                        )}
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            {filters.status !== 'all' && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFieldChange('status', 'all');
                                    }}
                                    title="Hapus pilihan status"
                                    className="pointer-events-auto p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2 - Col 1: Nama Perangkat Lab (Input biasa) */}
                <div className="flex items-center gap-3">
                    <label className="w-32 shrink-0 font-medium text-slate-600 text-[11px] sm:text-xs">
                        Perangkat Lab
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan Perangkat Lab"
                        value={filters.itemName}
                        onChange={(e) => handleFieldChange('itemName', e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-9 px-3 rounded border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0256D0] focus:ring-1 focus:ring-[#0256D0]"
                    />
                </div>

                {/* Row 2 - Col 2: Kode Perangkat (Input biasa) */}
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

                {/* Row 2 - Col 3: Empty spacer for symmetry */}
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
