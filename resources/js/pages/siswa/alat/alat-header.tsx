import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';

interface AlatHeaderProps {
    totalItems: number;
}

export function AlatHeader({ totalItems }: AlatHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            {/* <Link
                href="/dashboard"
                className="w-9 h-9 rounded flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors"
                title="Kembali ke Beranda"
            >
                <ChevronLeft className="w-4 h-4" />
            </Link> */}
            <div>
                {/* <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                    Semua Alat
                </h1> */}
                {/* <p className="text-xs text-zinc-500">
                    {totalItems} Perangkat laboratorium tersedia
                </p> */}
            </div>
        </div>
    );
}
