import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { User, Lock, LogOut, ChevronRight, School, BookOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfileStudentCard } from './profile-student-card';
import { ProfilePasswordModal } from './profile-password-modal';
import { updateStudentPassword, type SessionToken } from '@/data/auth-store';
import { USER_PROFILE } from '@/data/inventory-data';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: SessionToken | null;
    user?: any;
    onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, session, user, onLogout }: ProfileModalProps) {
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

        const username = user?.username || session?.username || 'siswa1';
        updateStudentPassword(username, newPassword);

        router.post('/profile/password', {
            old_password: oldPassword,
            new_password: newPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kata sandi siswa berhasil diperbarui!');
                setPasswordModalOpen(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Gagal memperbarui kata sandi.');
            }
        });
    };

    const studentName = user?.name || session?.name || USER_PROFILE.name;
    const studentClass = user?.class || session?.class || USER_PROFILE.class;
    const studentUsername = user?.username || session?.username || (user?.email ? user.email.split('@')[0] : 'siswa1');
    const avatarInitials = studentName
        .split(' ')
        .map((n: string) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="max-w-lg w-full rounded-2xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="pb-3 border-b border-slate-100">
                            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span>Profil Siswa</span>
                            </DialogTitle>
                        </DialogHeader>

                    <div className="space-y-4 pt-3">
                        <ProfileStudentCard
                            studentName={studentName}
                            studentClass={studentClass}
                            studentUsername={studentUsername}
                            avatarInitials={avatarInitials}
                        />

                        {/* Detail Info Card */}
                        <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Informasi Akademik & Akun
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <School className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-medium">Sekolah</p>
                                        <p className="font-semibold text-slate-800">SMKN 1 Kota Bekasi</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-600">
                                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-medium">Program Keahlian</p>
                                        <p className="font-semibold text-slate-800">Rekayasa Perangkat Lunak</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white border border-slate-200/90 rounded-xl divide-y divide-slate-100 shadow-2xs overflow-hidden">
                            {/* Ubah Kata Sandi */}
                            {/* <button
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
                                            Ubah Kata Sandi
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Perbarui kata sandi akun siswa Anda
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            </button> */}

                            {/* Keluar dari Aplikasi */}
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
                                            Keluar dari Aplikasi
                                        </p> 
                                        <p className="text-[11px] text-rose-400">
                                            Akhiri sesi login siswa dan kembali ke halaman masuk
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
                onSubmit={handleChangePassword}
                oldPassword={oldPassword}
                onOldPasswordChange={setOldPassword}
                newPassword={newPassword}
                onNewPasswordChange={setNewPassword}
                confirmPassword={confirmPassword}
                onConfirmPasswordChange={setConfirmPassword}
            />
        </>
    );
}
