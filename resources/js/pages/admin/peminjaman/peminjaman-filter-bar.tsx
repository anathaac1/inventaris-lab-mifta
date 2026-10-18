import { Search, X } from 'lucide-react';
import type { LoanItem } from '@/data/inventory-data';

interface PeminjamanFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusTab: 'all' | 'active' | 'returned';
    onStatusTabChange: (status: 'all' | 'active' | 'returned') => void;
    totalCount: number;
    activeCount: number;
    returnedCount: number;
}

export function PeminjamanFilterBar({
    searchQuery,
    onSearchChange,
    statusTab,
    onStatusTabChange,
    totalCount,
    activeCount,
    returnedCount
}: PeminjamanFilterBarProps) {
    return (
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari nama siswa, kelas (XII RPL A), nama alat..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Status Tabs Segmented Control */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs bg-slate-50/70 p-0.5">
                <button
                    type="button"
                    onClick={() => onStatusTabChange('all')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                        statusTab === 'all'
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    Semua ({totalCount})
                </button>
                <button
                    type="button"
                    onClick={() => onStatusTabChange('active')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                        statusTab === 'active'
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>Sedang Dipinjam</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800">
                        {activeCount}
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => onStatusTabChange('returned')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                        statusTab === 'returned'
                            ? 'bg-white text-slate-900 shadow-xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" />
                    <span>Selesai Dikembalikan</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 text-slate-700">
                        {returnedCount}
                    </span>
                </button>
            </div>
        </div>
    );
}
