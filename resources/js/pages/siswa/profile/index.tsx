import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { MainLayout } from '@/components/inventory/main-layout';
import { USER_PROFILE } from '@/data/inventory-data';
import {
    getActiveSession,
    terminateSession,
    updateStudentPassword,
    type SessionToken
} from '@/data/auth-store';
import { toast } from 'sonner';

import { ProfileHeader } from './profile-header';
import { ProfileStudentCard } from './profile-student-card';
import { ProfileNavLinks } from './profile-nav-links';
import { ProfileSecurityCard } from './profile-security-card';
import { ProfilePasswordModal } from './profile-password-modal';

interface ProfileProps {
    initialUser?: {
        id: string;
        name: string;
        username: string;
        class?: string;
        email?: string;
        nisn?: string;
        phone?: string;
        role?: string;
    } | null;
}

export default function Profile({ initialUser }: ProfileProps) {
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
            toast.error('Kata sandi minimal 4 karakter!');
            return;
        }

        const username = session?.username || initialUser?.username || 'siswa1';
        updateStudentPassword(username, newPassword);

        router.post('/profile/password', {
            old_password: oldPassword,
            new_password: newPassword,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kata sandi berhasil diperbarui!');
                setPasswordModalOpen(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        });
    };

    const handleLogout = () => {
        terminateSession();
        toast.info('Sesi Anda telah berakhir.');
        router.visit('/login');
    };

    const studentName = initialUser?.name || session?.name || USER_PROFILE.name;
    const studentClass = initialUser?.class || session?.class || USER_PROFILE.class;
    const studentUsername = initialUser?.username || session?.username || 'siswa1';
    const avatarInitials = studentName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <MainLayout currentTab="profile">
            <Head title="Profil Siswa - Sistem Inventory Lab RPL" />

            <div className="max-w-xl mx-auto space-y-4">
                {/* Header with Back Arrow */}
                <ProfileHeader />

                {/* Profile Student ID Card */}
                <ProfileStudentCard
                    studentName={studentName}
                    studentClass={studentClass}
                    studentUsername={studentUsername}
                    avatarInitials={avatarInitials}
                />

                {/* Quick Navigation Links */}
                <ProfileNavLinks />

                {/* Security Card (Password & Logout) */}
                <ProfileSecurityCard
                    onOpenPasswordModal={() => setPasswordModalOpen(true)}
                    onLogout={handleLogout}
                />
            </div>

            {/* Change Password Dialog Modal */}
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
        </MainLayout>
    );
}
