import { Search, X, SlidersHorizontal, Plus } from 'lucide-react';
import { CATEGORIES } from '@/data/inventory-data';

interface AlatFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    visibilityFilter: 'all' | 'visible' | 'hidden';
    onVisibilityFilterChange: (filter: 'all' | 'visible' | 'hidden') => void;
    onOpenAdd: () => void;
}

export function AlatFilterBar({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    visibilityFilter,
    onVisibilityFilterChange,
    onOpenAdd
}: AlatFilterBarProps) {
    return (
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
            {/* Search Field */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Cari nama alat, kode inventaris (EL-001)..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-8 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Filter Segmented Controls & Add Action */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Category Dropdown */}
                <div className="relative">
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 hover:border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-800 cursor-pointer shadow-2xs"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === 'Semua' ? 'Semua Kategori' : cat}
                            </option>
                        ))}
                    </select>
                    <SlidersHorizontal className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Visibility Status Tabs */}
                <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs bg-slate-50/70 p-0.5">
                    <button
                        type="button"
                        onClick={() => onVisibilityFilterChange('all')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                            visibilityFilter === 'all'
                                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Semua
                    </button>
                    <button
                        type="button"
                        onClick={() => onVisibilityFilterChange('visible')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                            visibilityFilter === 'visible'
                                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Aktif
                    </button>
                    <button
                        type="button"
                        onClick={() => onVisibilityFilterChange('hidden')}
                        className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                            visibilityFilter === 'hidden'
                                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        Tidak Aktif
                    </button>
                </div>

                {/* Add New Item Button */}
                <button
                    type="button"
                    onClick={onOpenAdd}
                    className="h-8 px-3.5 rounded-lg bg-[#0256D0] hover:bg-[#0243a4] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer shrink-0 ml-auto sm:ml-0"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alat Baru</span>
                </button>
            </div>
        </div>
    );
}
