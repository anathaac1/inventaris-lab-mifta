import { Search, UserCheck, UserPlus } from 'lucide-react';
import { RPL_CLASSES, type UserAccount } from '@/data/auth-store';

interface SiswaFilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedClass: string;
    onClassChange: (cls: string) => void;
    totalStudents: number;
    students: UserAccount[];
    onOpenCreateModal: () => void;
}

export function SiswaFilterBar({
    searchQuery,
    onSearchChange,
    selectedClass,
    onClassChange,
    totalStudents,
    students,
    onOpenCreateModal
}: SiswaFilterBarProps) {
    return (
        <div className="p-3.5 sm:p-4 border-b border-slate-100 space-y-3 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama siswa, username, atau kelas..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-[#0256D0]" />
                        <span>Total: <strong>{totalStudents} Akun</strong></span>
                    </div>

                    <button
                        type="button"
                        onClick={onOpenCreateModal}
                        className="h-9 px-3.5 rounded-lg bg-[#0256D0] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Tambah User Baru</span>
                    </button>
                </div>
            </div>

            {/* 6 Classes Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-1 text-xs scrollbar-none">
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1 shrink-0">
                    Filter Kelas:
                </span>
                <button
                    type="button"
                    onClick={() => onClassChange('ALL')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                        selectedClass === 'ALL'
                            ? 'bg-[#0256D0] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    Semua Kelas ({totalStudents})
                </button>
                {RPL_CLASSES.map((cls) => {
                    const count = students.filter(
                        (s) => s.class.trim().toLowerCase() === cls.trim().toLowerCase()
                    ).length;
                    const isActive = selectedClass.trim().toLowerCase() === cls.trim().toLowerCase();
                    return (
                        <button
                            key={cls}
                            type="button"
                            onClick={() => onClassChange(cls)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                                isActive
                                    ? 'bg-[#0256D0] text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {cls} ({count})
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
