import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import { getActiveSession, terminateSession, updateStudentPassword, type SessionToken } from '@/data/auth-store';
import { toast } from 'sonner';
import { ProfileHeader } from './profile-header';
import { ProfileBanner } from './profile-banner';
import { ProfileInfoCard } from './profile-info-card';
import { ProfileActionCard } from './profile-action-card';
import { ProfilePasswordModal } from './profile-password-modal';

export default function AdminProfile() {
    const [session, setSession] = useState<SessionToken | null>(null);
    const [passwordModalOpen, setPasswordModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        setSession(getActiveSession());
    }, []);

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

    const handleLogout = () => {
        terminateSession();
        toast.info('Sesi administrator telah berakhir.');
        router.visit('/login');
    };

    const adminName = session?.name || 'Bambang Haryanto, S.Kom';
    const adminUsername = session?.username || 'admin';
    const adminInitials = adminName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <AdminLayout
            currentTab="profile"
            title="Profil Administrator"
        >
            <Head title="Profil Administrator - Sistem Inventory Lab RPL" />

            <div className="max-w-4xl mx-auto space-y-4 pt-1 pb-8">
                <ProfileHeader />

                <ProfileBanner
                    adminName={adminName}
                    adminUsername={adminUsername}
                    adminInitials={adminInitials}
                />

                <ProfileInfoCard adminUsername={adminUsername} />

                <ProfileActionCard
                    onOpenPasswordModal={() => setPasswordModalOpen(true)}
                    onLogout={handleLogout}
                />
            </div>

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
        </AdminLayout>
    );
}
