import { Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileSecurityCardProps {
    onOpenPasswordModal: () => void;
    onLogout: () => void;
}

export function ProfileSecurityCard({
    onOpenPasswordModal,
    onLogout
}: ProfileSecurityCardProps) {
    return (
        <div className="bg-white rounded-xl border border-zinc-200 p-4 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider text-slate-400">
                Keamanan & Akun
            </h3>

            <div className="space-y-2">
                <Button
                    variant="outline"
                    onClick={onOpenPasswordModal}
                    className="w-full justify-start text-xs h-10 border-zinc-200 text-zinc-700 hover:bg-zinc-50 cursor-pointer"
                >
                    <Lock className="w-4 h-4 mr-2 text-zinc-500" />
                    Ubah Kata Sandi
                </Button>

                <Button
                    variant="outline"
                    onClick={onLogout}
                    className="w-full justify-start text-xs h-10 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                >
                    <LogOut className="w-4 h-4 mr-2 text-red-500" />
                    Keluar dari Aplikasi
                </Button>
            </div>
        </div>
    );
}
