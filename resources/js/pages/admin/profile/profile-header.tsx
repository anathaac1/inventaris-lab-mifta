import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function ProfileHeader() {
    return (
        <div className="flex items-center gap-3">
            <Link
                href="/admin"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                title="Kembali ke Dashboard Admin"
            >
                <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                    Profil Administrator
                </h1>
                <p className="text-xs text-slate-500">
                    Informasi akun penanggung jawab dan pengelolaan akses laboratorium
                </p>
            </div>
        </div>
    );
}
