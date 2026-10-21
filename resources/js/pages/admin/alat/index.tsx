import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredItems,
    type InventoryItem
} from '@/data/inventory-data';
import { toast } from 'sonner';
import { AdminPagination } from '@/components/inventory/admin-pagination';
import { AlatFilterBar, type AlatFilterValues } from './alat-filter-bar';
import { AlatTable } from './alat-table';
import { AlatDetailModal } from './alat-detail-modal';
import { AlatFormModal, type AlatFormData, type SpecRow } from './alat-form-modal';
import { AlatDeleteModal } from './alat-delete-modal';

const DEFAULT_ALAT_FILTERS: AlatFilterValues = {
    name: '',
    code: '',
    category: 'Semua',
    stockStatus: 'all',
    visibility: 'all'
};

interface AdminAlatProps {
    initialItems?: InventoryItem[];
}

export default function AdminAlat({ initialItems }: AdminAlatProps) {
    const [items, setItems] = useState<InventoryItem[]>(() => {
        if (initialItems && initialItems.length > 0) return initialItems;
        return getStoredItems();
    });

    // Filter Form Values & Applied Filter State
    const [filterForm, setFilterForm] = useState<AlatFilterValues>(DEFAULT_ALAT_FILTERS);
    const [appliedFilters, setAppliedFilters] = useState<AlatFilterValues>(DEFAULT_ALAT_FILTERS);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [selectedDetailItem, setSelectedDetailItem] = useState<InventoryItem | null>(null);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);

    // Form fields
    const [formData, setFormData] = useState<AlatFormData>({
        name: '',
        code: '',
        category: 'Laptop',
        stock: 10,
        total: 10,
        description: '',
        iconType: 'laptop',
        isVisibleToStudents: true,
        specs: [{ key: 'Tipe', value: '' }]
    });

    useEffect(() => {
        if (initialItems) setItems(initialItems);
    }, [initialItems]);

    useEffect(() => {
        const handleItemsChange = () => {
            if (!initialItems || initialItems.length === 0) {
                setItems(getStoredItems());
            }
        };
        window.addEventListener('inventory_items_changed', handleItemsChange);
        return () => window.removeEventListener('inventory_items_changed', handleItemsChange);
    }, [initialItems]);

    // Filter items based on appliedFilters
    const filteredItems = items.filter((item) => {
        const nameQuery = appliedFilters.name.toLowerCase().trim();
        const matchesName = !nameQuery || item.name.toLowerCase().includes(nameQuery);

        const codeQuery = appliedFilters.code.toLowerCase().trim();
        const matchesCode = !codeQuery || item.code.toLowerCase().includes(codeQuery);

        const matchesCategory =
            appliedFilters.category === 'Semua' || item.category === appliedFilters.category;

        // Stock status logic
        let matchesStock = true;
        if (appliedFilters.stockStatus === 'in_stock') {
            matchesStock = item.stock > 2;
        } else if (appliedFilters.stockStatus === 'low_stock') {
            matchesStock = item.stock > 0 && item.stock <= 2;
        } else if (appliedFilters.stockStatus === 'out_of_stock') {
            matchesStock = item.stock === 0;
        }

        const isVisible = item.isVisibleToStudents !== false;
        const matchesVisibility =
            appliedFilters.visibility === 'all' ||
            (appliedFilters.visibility === 'visible' && isVisible) ||
            (appliedFilters.visibility === 'hidden' && !isVisible);

        return matchesName && matchesCode && matchesCategory && matchesStock && matchesVisibility;
    });

    const handleApplyFilter = () => {
        setAppliedFilters({ ...filterForm });
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilterForm(DEFAULT_ALAT_FILTERS);
        setAppliedFilters(DEFAULT_ALAT_FILTERS);
        setCurrentPage(1);
    };

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedItems = filteredItems.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    // Toggle single item visibility to students
    const handleToggleVisibility = (itemId: string) => {
        const item = items.find((i) => i.id === itemId);
        if (!item) return;

        router.patch(`/admin/alat/${itemId}/visibility`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                const newVis = item.isVisibleToStudents === false ? true : false;
                toast.success(
                    newVis
                        ? `"${item.name}" diatur ke status AKTIF.`
                        : `"${item.name}" diatur ke status TIDAK AKTIF.`
                );
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Gagal mengubah status visibilitas.');
            }
        });
    };

    // Open add modal (Create)
    const handleOpenAdd = () => {
        setEditingItem(null);
        setFormData({
            name: '',
            code: `EL-${String(items.length + 1).padStart(3, '0')}`,
            category: 'Laptop',
            stock: 10,
            total: 10,
            description: '',
            iconType: 'laptop',
            isVisibleToStudents: true,
            specs: [
                { key: 'Tipe', value: 'Standar Lab RPL' },
                { key: 'Kondisi', value: 'Prima / Siap Pakai' }
            ]
        });
        setIsFormModalOpen(true);
    };

    // Open edit modal (Update)
    const handleOpenEdit = (item: InventoryItem) => {
        setEditingItem(item);

        const specsList: SpecRow[] = Object.entries(item.specs || {}).map(([key, value]) => ({
            key,
            value: String(value)
        }));

        setFormData({
            name: item.name,
            code: item.code,
            category: item.category,
            stock: Number(item.stock),
            total: Number(item.total),
            description: item.description || '',
            iconType: item.iconType || 'laptop',
            isVisibleToStudents: item.isVisibleToStudents !== false,
            specs: specsList.length > 0 ? specsList : [{ key: 'Tipe', value: '' }]
        });

        setSelectedDetailItem(null);
        setIsFormModalOpen(true);
    };

    // Save add/edit
    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();

        const compiledSpecs: Record<string, string> = {};
        formData.specs.forEach((s) => {
            if (s.key.trim()) {
                compiledSpecs[s.key.trim()] = s.value.trim() || '-';
            }
        });

        const payload = {
            name: formData.name.trim(),
            code: formData.code.trim(),
            category: formData.category,
            stock: Number(formData.stock),
            total: Number(formData.total),
            description: formData.description.trim(),
            icon_type: formData.iconType,
            is_visible_to_students: formData.isVisibleToStudents,
            specs: compiledSpecs,
        };

        if (editingItem) {
            router.put(`/admin/alat/${editingItem.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Data alat "${formData.name}" berhasil diperbarui!`);
                    setIsFormModalOpen(false);
                },
                onError: (errors) => {
                    toast.error(Object.values(errors)[0] as string || 'Gagal memperbarui alat.');
                }
            });
        } else {
            router.post('/admin/alat', payload, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Alat baru "${formData.name}" berhasil ditambahkan ke inventaris!`);
                    setIsFormModalOpen(false);
                },
                onError: (errors) => {
                    toast.error(Object.values(errors)[0] as string || 'Gagal menambahkan alat.');
                }
            });
        }
    };

    // DELETE
    const handleConfirmDelete = () => {
        if (!deleteConfirmItem) return;

        router.delete(`/admin/alat/${deleteConfirmItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Alat "${deleteConfirmItem.name}" berhasil dihapus.`);
                setDeleteConfirmItem(null);
                setSelectedDetailItem(null);
            },
            onError: (errors) => {
                toast.error(Object.values(errors)[0] as string || 'Gagal menghapus alat.');
            }
        });
    };

    return (
        <AdminLayout
            currentTab="alat"
            title="Data Inventaris & Alat"
        >
            <Head title="Admin CMS - Kelola Alat & Inventaris" />

            <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                    <AlatFilterBar
                        filters={filterForm}
                        onFilterChange={setFilterForm}
                        onApply={handleApplyFilter}
                        onReset={handleResetFilter}
                        onOpenAdd={handleOpenAdd}
                    />

                    <AlatTable
                        items={paginatedItems}
                        onViewDetail={setSelectedDetailItem}
                        onEdit={handleOpenEdit}
                        onDelete={setDeleteConfirmItem}
                        onToggleVisibility={handleToggleVisibility}
                    />

                    <AdminPagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={filteredItems.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                        itemsPerPageOptions={[10, 20, 50, 100]}
                        itemLabel="perangkat"
                    />
                </div>
            </div>

            {/* Read / Detail Modal */}
            <AlatDetailModal
                item={selectedDetailItem}
                onClose={() => setSelectedDetailItem(null)}
                onEdit={handleOpenEdit}
            />

            {/* Create / Edit Form Modal */}
            <AlatFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSaveForm}
            />

            {/* Delete Confirmation Modal */}
            <AlatDeleteModal
                item={deleteConfirmItem}
                onClose={() => setDeleteConfirmItem(null)}
                onConfirm={handleConfirmDelete}
            />
        </AdminLayout>
    );
}
