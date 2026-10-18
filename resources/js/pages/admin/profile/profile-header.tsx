import { ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function ProfileHeader() {
    return (
        <div className="flex items-center gap-2.5">
            <Link
                href="/admin"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Kembali ke Dashboard Admin"
            >
                <ArrowLeft className="w-5 h-5" />
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
