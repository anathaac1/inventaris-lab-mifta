import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredAccounts,
    updateStudentPassword,
    createUserAccount,
    type UserAccount
} from '@/data/auth-store';
import { toast } from 'sonner';
import { AdminPagination } from '@/components/inventory/admin-pagination';
import { SiswaFilterBar, type SiswaFilterValues } from './siswa-filter-bar';
import { SiswaTable } from './siswa-table';
import { SiswaResetPasswordModal } from './siswa-reset-password-modal';
import { SiswaCreateModal, type NewUserFormData } from './siswa-create-modal';

interface AdminSiswaProps {
    initialStudents?: UserAccount[];
}

const DEFAULT_SISWA_FILTERS: SiswaFilterValues = {
    name: '',
    username: '',
    role: 'all',
    studentClass: 'all',
    nisn: ''
};

export default function AdminSiswa({ initialStudents }: AdminSiswaProps) {
    const [accounts, setAccounts] = useState<UserAccount[]>(() => {
        if (initialStudents && initialStudents.length > 0) {
            return initialStudents;
        }
        return getStoredAccounts();
    });

    // Filter Form Values & Applied Filter State
    const [filterForm, setFilterForm] = useState<SiswaFilterValues>(DEFAULT_SISWA_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<SiswaFilterValues>(DEFAULT_SISWA_FILTERS);

    const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Create User Modal State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreatingUser, setIsCreatingUser] = useState(false);

    // Reset Password Modal State
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<UserAccount | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setAccounts(getStoredAccounts());

        const handleAccountsChange = () => setAccounts(getStoredAccounts());
        window.addEventListener('inventory_accounts_changed', handleAccountsChange);

        return () => {
            window.removeEventListener('inventory_accounts_changed', handleAccountsChange);
        };
    }, []);

    // Filter accounts based on appliedFilters
    const filteredAccounts = accounts.filter((acc) => {
        const matchesRole =
            appliedFilters.role === 'all' || acc.role === appliedFilters.role;

        const matchesClass =
            appliedFilters.studentClass === 'all' ||
            acc.class.trim().toLowerCase() === appliedFilters.studentClass.trim().toLowerCase();

        const nameQuery = appliedFilters.name.toLowerCase().trim();
        const matchesName = !nameQuery || acc.name.toLowerCase().includes(nameQuery);

        const usernameQuery = appliedFilters.username.toLowerCase().trim();
        const matchesUsername = !usernameQuery || acc.username.toLowerCase().includes(usernameQuery);

        const nisnQuery = appliedFilters.nisn.toLowerCase().trim();
        const matchesNisn = !nisnQuery || (acc.nisn && acc.nisn.toLowerCase().includes(nisnQuery));

        return matchesRole && matchesClass && matchesName && matchesUsername && matchesNisn;
    });

    const handleApplyFilter = () => {
        setAppliedFilters({ ...filterForm });
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilterForm(DEFAULT_SISWA_FILTERS);
        setAppliedFilters(DEFAULT_SISWA_FILTERS);
        setCurrentPage(1);
    };

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedAccounts = filteredAccounts.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    const togglePasswordReveal = (username: string) => {
        setRevealedPasswords((prev) => ({
            ...prev,
            [username]: !prev[username]
        }));
    };

    const openResetModal = (student: UserAccount) => {
        setSelectedStudent(student);
        setNewPassword('');
        setIsResetModalOpen(true);
    };

    const generateRandomPassword = () => {
        const rand = Math.floor(1000 + Math.random() * 9000);
        setNewPassword(`rpl${rand}!`);
    };

    const handleSaveNewPassword = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;

        if (newPassword.trim().length < 4) {
            toast.error('Password minimal 4 karakter.');
            return;
        }

        setIsSubmitting(true);

        const success = updateStudentPassword(selectedStudent.username, newPassword.trim());

        if (success) {
            setAccounts(getStoredAccounts());
            toast.success(
                `Password baru untuk ${selectedStudent.name} (${selectedStudent.username}) berhasil disimpan: "${newPassword}"`,
                { duration: 6000 }
            );
            setIsResetModalOpen(false);
            setNewPassword('');
        } else {
            toast.error('Gagal memperbarui password.');
        }

        setIsSubmitting(false);
    };

    const handleCreateUser = (formData: NewUserFormData) => {
        setIsCreatingUser(true);
        const result = createUserAccount({
            username: formData.username,
            name: formData.name,
            role: formData.role,
            class: formData.class,
            email: formData.email,
            password: formData.password,
            nisn: formData.nisn,
            phone: formData.phone
        });

        if (result.success) {
            setAccounts(getStoredAccounts());
            toast.success(result.message);
            setIsCreateModalOpen(false);
            setCurrentPage(1);
        } else {
            toast.error(result.message);
        }

        setIsCreatingUser(false);
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.info(`${label} disalin ke clipboard!`);
    };

    return (
        <AdminLayout
            currentTab="siswa"
            title="Akun & Password"
        >
            <Head title="Admin CMS - Manajemen Akun & Password" />

            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <SiswaFilterBar
                        filters={filterForm}
                        onFilterChange={setFilterForm}
                        onApply={handleApplyFilter}
                        onReset={handleResetFilter}
                        totalAccounts={accounts.length}
                        onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    />

                    <SiswaTable
                        students={paginatedAccounts}
                        revealedPasswords={revealedPasswords}
                        onTogglePasswordReveal={togglePasswordReveal}
                        onCopy={copyToClipboard}
                        onOpenResetModal={openResetModal}
                    />

                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredAccounts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPageOptions={[10, 20, 50, 100]}
                        itemLabel="akun pengguna"
                    />
                </div>
            </div>

            <SiswaCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateUser}
                isSubmitting={isCreatingUser}
            />

            <SiswaResetPasswordModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                student={selectedStudent}
                newPassword={newPassword}
                onNewPasswordChange={setNewPassword}
                onGenerateRandom={generateRandomPassword}
                onSubmit={handleSaveNewPassword}
                isSubmitting={isSubmitting}
            />
        </AdminLayout>
    );
}
