import React, { useState } from 'react';
import { User, Lock, LogOut, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileBanner } from './profile-banner';
import { ProfileInfoCard } from './profile-info-card';
import { ProfilePasswordModal } from './profile-password-modal';
import { updateStudentPassword, type SessionToken } from '@/data/auth-store';
import { toast } from 'sonner';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: SessionToken | null;
    onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, session, onLogout }: ProfileModalProps) {
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Konfirmasi kata sandi baru tidak cocok!');
            return;
        }

        if (newPassword.length < 4) {
            toast.error('Kata sandi minimal harus 4 karakter!');
            return;
        }

        const username = session?.username || 'admin';
        updateStudentPassword(username, newPassword);

        toast.success('Kata sandi administrator berhasil diperbarui!');
        setPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const adminName = session?.name || 'Agus Wibowo';
    const adminUsername = session?.username || 'admin';
    const adminInitials = adminName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-lg w-full rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-[#0256D0]" />
                                <span>Profil Administrator</span>
                            </DialogTitle>
                            {/* <p className="text-xs text-slate-500 mt-0.5">
                                Informasi akun penanggung jawab dan pengelolaan akses laboratorium
                            </p> */}
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 pt-3">
                        <ProfileBanner
                            adminName={adminName}
                            adminUsername={adminUsername}
                            adminInitials={adminInitials}
                        />

                        <ProfileInfoCard adminUsername={adminUsername} />

                        {/* Action buttons */}
                        <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
                            {/* Ganti Kata Sandi */}
                            <button
                                type="button"
                                onClick={() => setPasswordModalOpen(true)}
                                className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0256D0] flex items-center justify-center shrink-0 group-hover:bg-[#0256D0] group-hover:text-white transition-colors">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-900 group-hover:text-[#0256D0] transition-colors">
                                            Ganti Kata Sandi Admin
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Perbarui kata sandi akun kepala laboratorium
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            </button>

                            {/* Keluar (Logout) */}
                            {/* <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onLogout();
                                }}
                                className="w-full flex items-center justify-between p-3.5 hover:bg-rose-50 text-rose-600 transition-colors text-left group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                                        <LogOut className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-rose-600">
                                            Keluar
                                        </p>
                                        <p className="text-[11px] text-rose-400">
                                            Akhiri sesi administrator dan kembali ke login
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                            </button> */}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <ProfilePasswordModal
                isOpen={passwordModalOpen}
                onClose={() => setPasswordModalOpen(false)}
                oldPassword={oldPassword}
                onOldPasswordChange={setOldPassword}
                newPassword={newPassword}
                onNewPasswordChange={setNewPassword}
                confirmPassword={confirmPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSubmit={handleChangePassword}
            />
        </>
    );
}
