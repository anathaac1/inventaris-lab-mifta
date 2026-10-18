import React from 'react';
import { Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ProfilePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    oldPassword: string;
    onOldPasswordChange: (val: string) => void;
    newPassword: string;
    onNewPasswordChange: (val: string) => void;
    confirmPassword: string;
    onConfirmPasswordChange: (val: string) => void;
    onSubmit: (e: React.SyntheticEvent) => void;
}

export function ProfilePasswordModal({
    isOpen,
    onClose,
    oldPassword,
    onOldPasswordChange,
    newPassword,
    onNewPasswordChange,
    confirmPassword,
    onConfirmPasswordChange,
    onSubmit
}: ProfilePasswordModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-sm rounded-2xl bg-white p-5 border border-slate-200 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#0256D0]" />
                        <span>Ganti Kata Sandi Admin</span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-3 pt-2 text-xs">
                    <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Kata Sandi Saat Ini</label>
                        <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => onOldPasswordChange(e.target.value)}
                            placeholder="Masukkan password lama"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Kata Sandi Baru</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => onNewPasswordChange(e.target.value)}
                            placeholder="Masukkan password baru (min 4 karakter)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Konfirmasi Kata Sandi Baru</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                            placeholder="Ketik ulang password baru"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                        />
                    </div>

                    <div className="pt-2 flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-lg text-xs py-2 border-slate-200 font-semibold"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-lg bg-[#0256D0] hover:bg-[#0243a4] text-white text-xs font-bold py-2 shadow-xs cursor-pointer"
                        >
                            Simpan Sandi
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
