import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function PeminjamanHeader() {
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/dashboard"
                className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors"
                title="Kembali ke Beranda"
            >
                <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                Peminjaman Saya
            </h1>
        </div>
    );
}
