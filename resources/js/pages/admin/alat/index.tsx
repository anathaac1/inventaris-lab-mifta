import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredItems,
    saveStoredItems,
    type InventoryItem
} from '@/data/inventory-data';
import { toast } from 'sonner';
import { AdminPagination } from '@/components/inventory/admin-pagination';
import { AlatFilterBar } from './alat-filter-bar';
import { AlatTable } from './alat-table';
import { AlatDetailModal } from './alat-detail-modal';
import { AlatFormModal, type AlatFormData, type SpecRow } from './alat-form-modal';
import { AlatDeleteModal } from './alat-delete-modal';

export default function AdminAlat() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

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
        setItems(getStoredItems());
        const handleItemsChange = () => setItems(getStoredItems());
        window.addEventListener('inventory_items_changed', handleItemsChange);
        return () => window.removeEventListener('inventory_items_changed', handleItemsChange);
    }, []);

    // Filter items
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'Semua' || item.category === selectedCategory;

        const isVisible = item.isVisibleToStudents !== false;
        const matchesVisibility =
            visibilityFilter === 'all' ||
            (visibilityFilter === 'visible' && isVisible) ||
            (visibilityFilter === 'hidden' && !isVisible);

        return matchesSearch && matchesCategory && matchesVisibility;
    });

    // Pagination Calculations
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedItems = filteredItems.slice(
        (safeCurrentPage - 1) * itemsPerPage,
        safeCurrentPage * itemsPerPage
    );

    // Toggle single item visibility to students
    const handleToggleVisibility = (itemId: string) => {
        const updated = items.map((item) => {
            if (item.id === itemId) {
                const newVis = item.isVisibleToStudents === false ? true : false;
                toast.success(
                    newVis
                        ? `"${item.name}" diatur ke status AKTIF.`
                        : `"${item.name}" diatur ke status TIDAK AKTIF.`
                );
                return { ...item, isVisibleToStudents: newVis };
            }
            return item;
        });

        saveStoredItems(updated);
        setItems(updated);
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

        if (editingItem) {
            // UPDATE
            const updated = items.map((item) => {
                if (item.id === editingItem.id) {
                    return {
                        ...item,
                        name: formData.name.trim(),
                        code: formData.code.trim(),
                        category: formData.category,
                        stock: Math.min(Number(formData.total), Math.max(0, Number(formData.stock))),
                        total: Number(formData.total),
                        description: formData.description.trim(),
                        iconType: formData.iconType,
                        isVisibleToStudents: formData.isVisibleToStudents,
                        specs: Object.keys(compiledSpecs).length > 0 ? compiledSpecs : item.specs
                    };
                }
                return item;
            });
            saveStoredItems(updated);
            setItems(updated);
            toast.success(`Data alat "${formData.name}" berhasil diperbarui!`);
        } else {
            // CREATE
            const newItem: InventoryItem = {
                id: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                name: formData.name.trim(),
                code: formData.code.trim(),
                category: formData.category,
                stock: Math.min(Number(formData.total), Math.max(0, Number(formData.stock))),
                total: Number(formData.total),
                description: formData.description.trim(),
                iconType: formData.iconType,
                status: 'Tersedia',
                isVisibleToStudents: formData.isVisibleToStudents,
                specs: Object.keys(compiledSpecs).length > 0 ? compiledSpecs : { 'Kondisi': 'Siap Pakai' }
            };
            const updated = [newItem, ...items];
            saveStoredItems(updated);
            setItems(updated);
            toast.success(`Alat baru "${formData.name}" berhasil ditambahkan ke inventaris!`);
        }

        setIsFormModalOpen(false);
    };

    // DELETE
    const handleConfirmDelete = () => {
        if (!deleteConfirmItem) return;
        const updated = items.filter((item) => item.id !== deleteConfirmItem.id);
        saveStoredItems(updated);
        setItems(updated);
        toast.success(`Alat "${deleteConfirmItem.name}" berhasil dihapus.`);
        setDeleteConfirmItem(null);
        setSelectedDetailItem(null);
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
                        searchQuery={searchQuery}
                        onSearchChange={(q) => {
                            setSearchQuery(q);
                            setCurrentPage(1);
                        }}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(c) => {
                            setSelectedCategory(c);
                            setCurrentPage(1);
                        }}
                        visibilityFilter={visibilityFilter}
                        onVisibilityFilterChange={(v) => {
                            setVisibilityFilter(v);
                            setCurrentPage(1);
                        }}
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
