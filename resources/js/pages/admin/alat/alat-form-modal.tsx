import React from 'react';
import { X, Plus } from 'lucide-react';
import type { InventoryItem } from '@/data/inventory-data';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

export interface SpecRow {
    key: string;
    value: string;
}

export interface AlatFormData {
    name: string;
    code: string;
    category: 'Laptop' | 'Peripheral' | 'Tools' | 'Elektrikal';
    stock: number;
    total: number;
    description: string;
    iconType: IconType;
    isVisibleToStudents: boolean;
    specs: SpecRow[];
}

interface AlatFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingItem: InventoryItem | null;
    formData: AlatFormData;
    setFormData: React.Dispatch<React.SetStateAction<AlatFormData>>;
    onSubmit: (e: React.FormEvent) => void;
}

export function AlatFormModal({
    isOpen,
    onClose,
    editingItem,
    formData,
    setFormData,
    onSubmit
}: AlatFormModalProps) {
    const handleAddSpecRow = () => {
        setFormData({
            ...formData,
            specs: [...formData.specs, { key: '', value: '' }]
        });
    };

    const handleUpdateSpecRow = (index: number, field: 'key' | 'value', val: string) => {
        const updated = [...formData.specs];
        updated[index][field] = val;
        setFormData({ ...formData, specs: updated });
    };

    const handleRemoveSpecRow = (index: number) => {
        const updated = formData.specs.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            specs: updated.length > 0 ? updated : [{ key: '', value: '' }]
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg p-5 rounded-2xl border border-slate-200 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-slate-900">
                        {editingItem ? 'Perbarui Data Perangkat' : 'Tambah Perangkat Inventaris Baru'}
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        {editingItem
                            ? `Memuat data saat ini untuk "${editingItem.name}" (${editingItem.code}). Sesuaikan kolom yang ingin diubah.`
                            : 'Masukkan rincian spesifikasi perangkat laboratorium baru.'}
                    </p>
                </DialogHeader>

                {/* Current Item Overview Banner when Editing */}
                {editingItem && (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center shrink-0">
                            <ItemIllustration type={formData.iconType} className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#0256D0] uppercase tracking-wider block">
                                Sedang Mengedit Data Terkini
                            </span>
                            <p className="font-bold text-xs text-slate-900 truncate">
                                {formData.name} <span className="text-slate-500 font-mono">({formData.code})</span>
                            </p>
                            <span className="text-[11px] text-slate-600">
                                Stok: <strong>{formData.stock}</strong> dari <strong>{formData.total}</strong> unit
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4 text-xs pt-2">
                    {/* Nama & Kode */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                            <label className="font-semibold text-slate-700">Nama Perangkat</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Contoh: Laptop Lenovo"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Kode Inventaris</label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="EL-001"
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-800 font-mono"
                            />
                        </div>
                    </div>

                    {/* Kategori & Ikon */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value as InventoryItem['category']
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-800 cursor-pointer"
                            >
                                <option value="Laptop">Laptop</option>
                                <option value="Peripheral">Peripheral</option>
                                <option value="Tools">Tools</option>
                                <option value="Elektrikal">Elektrikal</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Ikon Ilustrasi</label>
                            <select
                                value={formData.iconType}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        iconType: e.target.value as IconType
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-slate-800 capitalize cursor-pointer"
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
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Stok Siap Pakai</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="font-semibold text-slate-700">Total Unit Fisik Lab</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.total}
                                onChange={(e) => setFormData({ ...formData, total: Number(e.target.value) })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                            />
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="space-y-1">
                        <label className="font-semibold text-slate-700">Deskripsi Alat</label>
                        <textarea
                            rows={2}
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Tuliskan spesifikasi umum atau panduan praktikum..."
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-slate-800"
                        />
                    </div>

                    {/* Spesifikasi Teknis Dinamis */}
                    <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between">
                            <label className="font-semibold text-slate-800 block">
                                Spesifikasi Lengkap (CRUD Teknis)
                            </label>
                            <button
                                type="button"
                                onClick={handleAddSpecRow}
                                className="text-[11px] font-bold text-[#0256D0] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="w-3 h-3" />
                                <span>Tambah Baris</span>
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.specs.map((spec, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={spec.key}
                                        onChange={(e) => handleUpdateSpecRow(idx, 'key', e.target.value)}
                                        placeholder="Label (Processor/RAM/Port)"
                                        className="w-2/5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                                    />
                                    <input
                                        type="text"
                                        value={spec.value}
                                        onChange={(e) => handleUpdateSpecRow(idx, 'value', e.target.value)}
                                        placeholder="Nilai (Intel i5/8 GB/USB-C)"
                                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                                    />
                                    {formData.specs.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpecRow(idx)}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                                            title="Hapus baris spesifikasi"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visibility to Student Toggle */}
                    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-900">Status Alat (Aktif)</p>
                            <p className="text-[11px] text-slate-500">
                                Alat berstatus aktif dapat dicari dan diajukan pinjam oleh siswa di katalog
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
                            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0256D0]"></div>
                        </label>
                    </div>

                    <DialogFooter className="pt-2 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="h-9 rounded-lg text-xs font-semibold border-slate-200"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="h-9 rounded-lg bg-[#0256D0] hover:bg-[#0243a4] text-white text-xs font-semibold px-4 cursor-pointer shadow-xs"
                        >
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
