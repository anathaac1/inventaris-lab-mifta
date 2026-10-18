import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredAccounts,
    updateStudentPassword,
    createUserAccount,
    type UserAccount
} from '@/data/auth-store';
import { toast } from 'sonner';
import { AdminPagination } from '@/components/inventory/admin-pagination';
import { SiswaFilterBar } from './siswa-filter-bar';
import { SiswaTable } from './siswa-table';
import { SiswaResetPasswordModal } from './siswa-reset-password-modal';
import { SiswaCreateModal, type NewUserFormData } from './siswa-create-modal';

interface AdminSiswaProps {
    initialStudents?: UserAccount[];
}

export default function AdminSiswa({ initialStudents }: AdminSiswaProps) {
    const [accounts, setAccounts] = useState<UserAccount[]>(() => {
        if (initialStudents && initialStudents.length > 0) {
            return initialStudents;
        }
        return getStoredAccounts();
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('ALL');
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
        if (initialStudents && initialStudents.length > 0) {
            setAccounts(initialStudents);
        } else {
            setAccounts(getStoredAccounts());
        }

        const handleAccountsChange = () => {
            if (!initialStudents || initialStudents.length === 0) {
                setAccounts(getStoredAccounts());
            }
        };
        window.addEventListener('inventory_accounts_changed', handleAccountsChange);

        return () => {
            window.removeEventListener('inventory_accounts_changed', handleAccountsChange);
        };
    }, [initialStudents]);

    // Filter students only (exclude admin from student table)
    const students = accounts.filter((a) => a.role === 'siswa');

    const filteredStudents = students.filter((s) => {
        const matchesClass =
            selectedClass === 'ALL' ||
            s.class.trim().toLowerCase() === selectedClass.trim().toLowerCase();
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !query ||
            s.name.toLowerCase().includes(query) ||
            s.username.toLowerCase().includes(query) ||
            s.class.toLowerCase().includes(query) ||
            (s.nisn && s.nisn.includes(query));
        return matchesClass && matchesQuery;
    });

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedStudents = filteredStudents.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleClassChange = (cls: string) => {
        setSelectedClass(cls);
        setCurrentPage(1);
    };

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
            updateStudentPassword(selectedStudent.username, newPassword.trim());
        }

        router.post('/admin/siswa/reset-password', {
            username: selectedStudent.username,
            new_password: newPassword.trim(),
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    `Password baru untuk ${selectedStudent.name} (${selectedStudent.username}) berhasil disimpan: "${newPassword}"`,
                    { duration: 6000 }
                );
                setIsResetModalOpen(false);
                setNewPassword('');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleCreateUser = (formData: NewUserFormData) => {
        setIsCreatingUser(true);
        createUserAccount({
            username: formData.username,
            name: formData.name,
            role: formData.role,
            class: formData.class,
            email: formData.email,
            password: formData.password,
            nisn: formData.nisn,
            phone: formData.phone
        });

        router.post('/admin/siswa', {
            username: formData.username,
            name: formData.name,
            role: formData.role,
            class: formData.class,
            email: formData.email,
            password: formData.password,
            nisn: formData.nisn,
            phone: formData.phone
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Akun siswa ${formData.name} berhasil dibuat!`);
                setIsCreateModalOpen(false);
                setCurrentPage(1);
                setIsCreatingUser(false);
            },
            onError: (errors) => {
                const firstErr = Object.values(errors)[0] as string;
                toast.error(firstErr || 'Gagal menambahkan akun siswa.');
                setIsCreatingUser(false);
            }
        });
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
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        selectedClass={selectedClass}
                        onClassChange={handleClassChange}
                        totalStudents={students.length}
                        students={students}
                        onOpenCreateModal={() => setIsCreateModalOpen(true)}
                    />

                    <SiswaTable
                        students={paginatedStudents}
                        revealedPasswords={revealedPasswords}
                        onTogglePasswordReveal={togglePasswordReveal}
                        onCopy={copyToClipboard}
                        onOpenResetModal={openResetModal}
                    />

                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredStudents.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPageOptions={[10, 20, 50, 100]}
                        itemLabel="akun siswa"
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
