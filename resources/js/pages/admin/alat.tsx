import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Check,
    AlertCircle
} from 'lucide-react';
import { AdminLayout } from '@/layouts/admin-layout';
import {
    getStoredItems,
    saveStoredItems,
    CATEGORIES,
    type InventoryItem
} from '@/data/inventory-data';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

type IconType = InventoryItem['iconType'];
const ICON_OPTIONS: IconType[] = [
    'laptop',
    'charger',
    'mouse',
    'lan',
    'headset',
    'power',
    'screwdriver',
    'speaker',
    'keyboard',
    'scissors',
    'flashdisk'
];

interface AdminAlatProps {
    initialItems?: InventoryItem[];
}

export default function AdminAlat({ initialItems }: AdminAlatProps) {
    const [items, setItems] = useState<InventoryItem[]>(() =>
        initialItems && initialItems.length > 0 ? initialItems : getStoredItems()
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

    // Modal state
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [deleteConfirmItem, setDeleteConfirmItem] = useState<InventoryItem | null>(null);

    // Form fields
    const [formData, setFormData] = useState<{
        name: string;
        code: string;
        category: 'Laptop' | 'Peripheral' | 'Tools' | 'Elektrikal';
        stock: number;
        total: number;
        description: string;
        iconType: IconType;
        isVisibleToStudents: boolean;
        specType: string;
        specDetail: string;
    }>({
        name: '',
        code: '',
        category: 'Laptop',
        stock: 10,
        total: 10,
        description: '',
        iconType: 'laptop',
        isVisibleToStudents: true,
        specType: '',
        specDetail: ''
    });

    useEffect(() => {
        if (initialItems && initialItems.length > 0) {
            setItems(initialItems);
        } else {
            setItems(getStoredItems());
        }

        const handleItemsChange = () => {
            if (!initialItems || initialItems.length === 0) setItems(getStoredItems());
        };
        window.addEventListener('inventory_items_changed', handleItemsChange);
        return () => window.removeEventListener('inventory_items_changed', handleItemsChange);
    }, [initialItems]);

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

    // Toggle single item visibility to students
    const handleToggleVisibility = (itemId: string | number) => {
        const target = items.find((i) => i.id === itemId);
        const updated = items.map((item) => {
            if (item.id === itemId) {
                const newVis = item.isVisibleToStudents === false ? true : false;
                return { ...item, isVisibleToStudents: newVis };
            }
            return item;
        });

        saveStoredItems(updated);
        setItems(updated);

        if (typeof itemId === 'number' || (initialItems && initialItems.length > 0)) {
            router.patch(`/admin/alat/${itemId}/visibility`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    const newVis = target?.isVisibleToStudents === false;
                    toast.success(
                        newVis
                            ? `"${target?.name}" sekarang TAMPIL di halaman siswa.`
                            : `"${target?.name}" sekarang DISEMBUNYIKAN dari siswa.`
                    );
                },
            });
        } else {
            const newVis = target?.isVisibleToStudents === false;
            toast.success(
                newVis
                    ? `"${target?.name}" sekarang TAMPIL di halaman siswa.`
                    : `"${target?.name}" sekarang DISEMBUNYIKAN dari siswa.`
            );
        }
    };

    // Open add modal
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
            specType: 'Standar Lab RPL',
            specDetail: 'Kondisi Prima'
        });
        setIsFormModalOpen(true);
    };

    // Open edit modal
    const handleOpenEdit = (item: InventoryItem) => {
        setEditingItem(item);
        const specEntries = Object.entries(item.specs || {});
        setFormData({
            name: item.name,
            code: item.code,
            category: item.category,
            stock: item.stock,
            total: item.total,
            description: item.description,
            iconType: item.iconType,
            isVisibleToStudents: item.isVisibleToStudents !== false,
            specType: specEntries[0] ? specEntries[0][0] : 'Tipe',
            specDetail: specEntries[0] ? specEntries[0][1] : ''
        });
        setIsFormModalOpen(true);
    };

    // Save add/edit
    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            // Update
            const updated = items.map((item) => {
                if (item.id === editingItem.id) {
                    return {
                        ...item,
                        name: formData.name,
                        code: formData.code,
                        category: formData.category,
                        stock: Number(formData.stock),
                        total: Number(formData.total),
                        description: formData.description,
                        iconType: formData.iconType,
                        isVisibleToStudents: formData.isVisibleToStudents,
                        specs: {
                            ...item.specs,
                            [formData.specType || 'Keterangan']: formData.specDetail || 'Tersedia'
                        }
                    };
                }
                return item;
            });
            saveStoredItems(updated);
            setItems(updated);

            if (typeof editingItem.id === 'number' || (initialItems && initialItems.length > 0)) {
                router.put(`/admin/alat/${editingItem.id}`, {
                    name: formData.name,
                    code: formData.code,
                    category: formData.category,
                    stock: Number(formData.stock),
                    total: Number(formData.total),
                    description: formData.description,
                    icon_type: formData.iconType,
                    is_visible_to_students: formData.isVisibleToStudents,
                    specs: {
                        ...(editingItem.specs || {}),
                        [formData.specType || 'Keterangan']: formData.specDetail || 'Tersedia'
                    }
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(`Alat "${formData.name}" berhasil diperbarui!`);
                    }
                });
            } else {
                toast.success(`Alat "${formData.name}" berhasil diperbarui!`);
            }
        } else {
            // Create
            const newItem: InventoryItem = {
                id: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
                name: formData.name,
                code: formData.code,
                category: formData.category,
                stock: Number(formData.stock),
                total: Number(formData.total),
                description: formData.description,
                iconType: formData.iconType,
                status: 'Tersedia',
                isVisibleToStudents: formData.isVisibleToStudents,
                specs: {
                    [formData.specType || 'Tipe']: formData.specDetail || 'Standar Lab'
                }
            };
            const updated = [newItem, ...items];
            saveStoredItems(updated);
            setItems(updated);

            if (initialItems && initialItems.length > 0) {
                router.post('/admin/alat', {
                    name: formData.name,
                    code: formData.code,
                    category: formData.category,
                    stock: Number(formData.stock),
                    total: Number(formData.total),
                    description: formData.description,
                    icon_type: formData.iconType,
                    is_visible_to_students: formData.isVisibleToStudents,
                    specs: {
                        [formData.specType || 'Tipe']: formData.specDetail || 'Standar Lab'
                    }
                }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(`Alat baru "${formData.name}" berhasil ditambahkan!`);
                    }
                });
            } else {
                toast.success(`Alat baru "${formData.name}" berhasil ditambahkan!`);
            }
        }

        setIsFormModalOpen(false);
    };

    // Delete item
    const handleConfirmDelete = () => {
        if (!deleteConfirmItem) return;
        const target = deleteConfirmItem;
        const updated = items.filter((item) => item.id !== target.id);
        saveStoredItems(updated);
        setItems(updated);

        if (typeof target.id === 'number' || (initialItems && initialItems.length > 0)) {
            router.delete(`/admin/alat/${target.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`Alat "${target.name}" berhasil dihapus dari inventaris.`);
                }
            });
        } else {
            toast.success(`Alat "${target.name}" berhasil dihapus dari inventaris.`);
        }
        setDeleteConfirmItem(null);
    };

    return (
        <AdminLayout
            currentTab="alat"
            title="Kelola Alat & Produk Lab"
            subtitle="Atur ketersediaan dan visibilitas alat yang tampil di portal siswa"
            actions={
                <Button
                    onClick={handleOpenAdd}
                    className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 py-1.5 px-3"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Alat Baru</span>
                </Button>
            }
        >
            <Head title="Admin CMS - Kelola Alat & Produk" />

            <div className="space-y-4">
                {/* Search & Filter Toolbar */}
                <div className="bg-white p-3.5 rounded-lg border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari nama alat, kode barang..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Filter Category & Visibility */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category Dropdown */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-blue-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    Kategori: {cat}
                                </option>
                            ))}
                        </select>

                        {/* Visibility Filter */}
                        <div className="flex border border-zinc-200 rounded-lg overflow-hidden text-xs">
                            <button
                                type="button"
                                onClick={() => setVisibilityFilter('all')}
                                className={`px-2.5 py-1.5 font-medium transition-colors ${
                                    visibilityFilter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibilityFilter('visible')}
                                className={`px-2.5 py-1.5 font-medium transition-colors border-l border-zinc-200 ${
                                    visibilityFilter === 'visible'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                Tampil
                            </button>
                            <button
                                type="button"
                                onClick={() => setVisibilityFilter('hidden')}
                                className={`px-2.5 py-1.5 font-medium transition-colors border-l border-zinc-200 ${
                                    visibilityFilter === 'hidden'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-zinc-600 hover:bg-zinc-50'
                                }`}
                            >
                                Tersembunyi
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table View */}
                <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-semibold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4">Alat & Kode</th>
                                    <th className="py-3 px-4">Kategori</th>
                                    <th className="py-3 px-4">Stok / Total</th>
                                    <th className="py-3 px-4 text-center">Tampil di Siswa</th>
                                    <th className="py-3 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 text-zinc-800">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-zinc-500">
                                            Tidak ada alat yang cocok dengan pencarian atau filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => {
                                        const isVisible = item.isVisibleToStudents !== false;
                                        return (
                                            <tr key={item.id} className="hover:bg-zinc-50/70 transition-colors">
                                                {/* Item & Code */}
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                                                            <ItemIllustration type={item.iconType} className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-zinc-900 block">
                                                                {item.name}
                                                            </span>
                                                            <span className="text-[10px] text-zinc-400 font-mono">
                                                                {item.code}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="py-3 px-4">
                                                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[11px] font-medium">
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* Stock */}
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <span className="font-bold text-zinc-900">
                                                            {item.stock} Unit
                                                        </span>
                                                        <span className="text-zinc-400 text-[11px]">
                                                            {' '}/ {item.total} Total
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Student Visibility Toggle */}
                                                <td className="py-3 px-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleVisibility(item.id)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors border ${
                                                            isVisible
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200'
                                                        }`}
                                                        title="Klik untuk ubah visibilitas di portal siswa"
                                                    >
                                                        {isVisible ? (
                                                            <>
                                                                <Eye className="w-3.5 h-3.5" />
                                                                <span>Tampil</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-3.5 h-3.5" />
                                                                <span>Sembunyi</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="w-7 h-7 rounded text-zinc-600 hover:text-blue-600 hover:border-blue-300"
                                                            title="Edit Detail"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => setDeleteConfirmItem(item)}
                                                            className="w-7 h-7 rounded text-zinc-600 hover:text-rose-600 hover:border-rose-300"
                                                            title="Hapus Alat"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500 flex items-center justify-between">
                        <span>Menampilkan {filteredItems.length} dari {items.length} total alat</span>
                        <span>Klik tombol pada kolom "Tampil di Siswa" untuk langsung mengubah visibilitas katalog</span>
                    </div>
                </div>
            </div>

            {/* Add / Edit Modal */}
            <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-5 rounded-lg border border-zinc-200 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-base font-bold text-zinc-900">
                            {editingItem ? 'Edit Alat Inventaris' : 'Tambah Alat Baru'}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveForm} className="space-y-3.5 text-xs pt-2">
                        {/* Nama & Kode */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2 space-y-1">
                                <label className="font-semibold text-zinc-700">Nama Alat</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Laptop Asus ROG"
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-semibold text-zinc-700">Kode Barang</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="EL-006"
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        {/* Kategori & Ikon */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-semibold text-zinc-700">Kategori</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            category: e.target.value as InventoryItem['category']
                                        })
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Laptop">Laptop</option>
                                    <option value="Peripheral">Peripheral</option>
                                    <option value="Tools">Tools</option>
                                    <option value="Elektrikal">Elektrikal</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold text-zinc-700">Tipe Ikon</label>
                                <select
                                    value={formData.iconType}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            iconType: e.target.value as IconType
                                        })
                                    }
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs bg-white focus:outline-none focus:border-blue-500 capitalize"
                                >
                                    {ICON_OPTIONS.map((ico) => (
                                        <option key={ico} value={ico}>
                                            {ico}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Stok & Total */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-semibold text-zinc-700">Stok Tersedia</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-semibold text-zinc-700">Total Unit Lab</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={formData.total}
                                    onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <div className="space-y-1">
                            <label className="font-semibold text-zinc-700">Deskripsi Singkat</label>
                            <textarea
                                rows={2}
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Jelaskan kegunaan alat ini untuk praktikum..."
                                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Spesifikasi Ringkas */}
                        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                            <div className="space-y-1">
                                <label className="font-medium text-zinc-600">Label Spesifikasi</label>
                                <input
                                    type="text"
                                    value={formData.specType}
                                    onChange={(e) => setFormData({ ...formData, specType: e.target.value })}
                                    placeholder="Contoh: RAM / Material"
                                    className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-zinc-600">Nilai / Detail</label>
                                <input
                                    type="text"
                                    value={formData.specDetail}
                                    onChange={(e) => setFormData({ ...formData, specDetail: e.target.value })}
                                    placeholder="Contoh: 16 GB DDR4"
                                    className="w-full px-2.5 py-1.5 rounded border border-zinc-200 bg-white text-xs"
                                />
                            </div>
                        </div>

                        {/* Visibility to Student Toggle */}
                        <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-zinc-800">Tampilkan ke Portal Siswa</p>
                                <p className="text-[11px] text-zinc-500">
                                    Jika dinonaktifkan, alat tidak akan muncul di katalog siswa
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isVisibleToStudents}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            isVisibleToStudents: e.target.checked
                                        })
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Modal Action Buttons */}
                        <DialogFooter className="pt-2 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormModalOpen(false)}
                                className="flex-1 rounded-lg text-xs py-2"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2"
                            >
                                {editingItem ? 'Simpan Perubahan' : 'Tambah ke Katalog'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deleteConfirmItem} onOpenChange={(open) => !open && setDeleteConfirmItem(null)}>
                <DialogContent className="max-w-sm rounded-lg border border-zinc-200 bg-white p-5">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2 text-rose-600">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>Hapus Alat dari Sistem</span>
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-xs text-zinc-600 pt-2 leading-relaxed">
                        Apakah Anda yakin ingin menghapus{' '}
                        <strong className="text-zinc-900">{deleteConfirmItem?.name}</strong> ({deleteConfirmItem?.code})?
                        Tindakan ini tidak dapat dibatalkan.
                    </p>

                    <DialogFooter className="pt-4 flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleteConfirmItem(null)}
                            className="flex-1 rounded-lg text-xs py-2"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDelete}
                            className="flex-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2"
                        >
                            Hapus Sekarang
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
