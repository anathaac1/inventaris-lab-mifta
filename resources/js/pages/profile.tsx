import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ClipboardList,
    Home,
    Box,
    ChevronRight,
    Lock,
    LogOut,
    User,
    Shield
} from 'lucide-react';
import { MainLayout } from '@/components/inventory/main-layout';
import { USER_PROFILE } from '@/data/inventory-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Profile() {
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Konfirmasi password tidak cocok!');
            return;
        }

        toast.success('Password berhasil diperbarui!');
        setPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const menuLinks = [
        { title: 'Peminjaman Saya', desc: 'Cek barang aktif dan riwayat', icon: ClipboardList, href: '/peminjaman' },
        { title: 'Home / Beranda', desc: 'Kembali ke katalog utama', icon: Home, href: '/dashboard' },
        { title: 'Semua Alat', desc: 'Daftar inventaris laboratorium', icon: Box, href: '/alat' },
        { title: 'Panel Admin CMS', desc: 'Kelola produk, visibilitas & stok alat', icon: Shield, href: '/admin' },
    ];

    return (
        <MainLayout currentTab="profile">
            <Head title="Profil Siswa - Sistem Inventory Lab RPL" />

            <div className="max-w-xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard"
                        className="w-9 h-9 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                        Profil Siswa
                    </h1>
                </div>

                {/* Profile Header */}
                <div className="rounded-xl bg-[#1E60AA] text-white p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full border border-white/60 bg-white/10 flex items-center justify-center text-white shrink-0">
                        <User className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold">
                            {USER_PROFILE.name}
                        </h2>
                        <p className="text-xs text-blue-100">
                            {USER_PROFILE.class}
                        </p>
                        <p className="text-xs text-blue-200">
                            NISN: {USER_PROFILE.nisn}
                        </p>
                    </div>
                </div>

                {/* Student Info Details */}
                <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100 text-xs">
                    <div className="flex justify-between py-2.5 px-3.5">
                        <span className="text-zinc-500">Sekolah</span>
                        <span className="font-semibold text-zinc-800">{USER_PROFILE.school}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-3.5">
                        <span className="text-zinc-500">Jurusan</span>
                        <span className="font-semibold text-zinc-800">Rekayasa Perangkat Lunak</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-3.5">
                        <span className="text-zinc-500">Email</span>
                        <span className="font-semibold text-zinc-800">{USER_PROFILE.email}</span>
                    </div>
                    <div className="flex justify-between py-2.5 px-3.5">
                        <span className="text-zinc-500">No. Telepon</span>
                        <span className="font-semibold text-zinc-800">{USER_PROFILE.phone}</span>
                    </div>
                </div>

                {/* Navigation Menu List */}
                <div className="bg-white border border-zinc-200 rounded-lg divide-y divide-zinc-100">
                    {menuLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center justify-between p-3 hover:bg-zinc-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-blue-600" />
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-900">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-zinc-400" />
                            </Link>
                        );
                    })}

                    <button
                        type="button"
                        onClick={() => setPasswordModalOpen(true)}
                        className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 transition-colors text-left"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-zinc-600" />
                            <p className="text-xs font-semibold text-zinc-900">
                                Ganti Kata Sandi
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                    </button>

                    <Link
                        href="/login"
                        className="flex items-center justify-between p-3 hover:bg-rose-50 text-rose-600 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="w-4 h-4 text-rose-600" />
                            <p className="text-xs font-semibold text-rose-600">
                                Keluar
                            </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-rose-400" />
                    </Link>
                </div>
            </div>

            {/* Change Password Modal */}
            <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
                <DialogContent className="max-w-sm rounded-lg bg-white p-5 border border-zinc-200">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-zinc-900">
                            Ganti Kata Sandi
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-700">Password Lama</label>
                            <input
                                type="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Masukkan password saat ini"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-700">Password Baru</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Masukkan password baru"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-zinc-700">Konfirmasi Password Baru</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ketik ulang password baru"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setPasswordModalOpen(false)}
                                className="flex-1 rounded-lg text-xs py-2"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2"
                            >
                                Simpan
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </MainLayout>
    );
}
