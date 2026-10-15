import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Info } from 'lucide-react';
import { ItemIllustration } from './item-illustration';
import type { InventoryItem } from '@/data/inventory-data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ItemDetailModalProps {
    item: InventoryItem | null;
    open: boolean;
    onClose: () => void;
    onLoanSuccess?: (item: InventoryItem, borrowDate: string, returnEstimate: string, notes: string) => void;
}

export function ItemDetailModal({ item, open, onClose, onLoanSuccess }: ItemDetailModalProps) {
    const [isBorrowing, setIsBorrowing] = useState(false);
    const [borrowDate, setBorrowDate] = useState('2024-08-03');
    const [returnEstimate, setReturnEstimate] = useState('2024-08-05');
    const [notes, setNotes] = useState('Praktikum Pemrograman Web & Aplikasi');
    const [loading, setLoading] = useState(false);

    if (!item) return null;

    const handleConfirmBorrow = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setIsBorrowing(false);
            onClose();

            if (onLoanSuccess) {
                onLoanSuccess(item, borrowDate, returnEstimate, notes);
            }
            toast.success(`Berhasil mengajukan peminjaman ${item.name}!`);
        }, 500);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-xl border border-zinc-200 bg-white">
                <DialogHeader className="p-4 border-b border-zinc-100 flex flex-row items-center justify-between sticky top-0 bg-white z-20">
                    <DialogTitle className="text-sm font-bold text-zinc-900">
                        {isBorrowing ? 'Formulir Peminjaman' : 'Detail Alat'}
                    </DialogTitle>
                </DialogHeader>

                {!isBorrowing ? (
                    <div className="p-5 space-y-4">
                        {/* Image */}
                        <div className="rounded-lg bg-zinc-50 p-4 flex flex-col items-center justify-center border border-zinc-100">
                            <ItemIllustration type={item.iconType} className="w-32 h-24" />
                        </div>

                        {/* Title & Status */}
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <span className="text-[11px] font-semibold text-blue-600 uppercase">
                                    {item.category}
                                </span>
                                <h2 className="text-base font-bold text-zinc-900">
                                    {item.name}
                                </h2>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                {item.status}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100">
                                <span className="text-zinc-500">Jumlah Tersedia</span>
                                <p className="font-bold text-blue-600 mt-0.5">
                                    {item.stock} Unit ({item.total} Total)
                                </p>
                            </div>
                            <div className="p-2.5 rounded bg-zinc-50 border border-zinc-100">
                                <span className="text-zinc-500">Kode Barang</span>
                                <p className="font-bold text-zinc-800 mt-0.5">
                                    {item.code}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-800 mb-1">
                                Deskripsi
                            </h3>
                            <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-100">
                                {item.description}
                            </p>
                        </div>

                        {/* Specifications */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-800 mb-1">
                                Spesifikasi
                            </h3>
                            <div className="rounded-lg bg-[#1E60AA] text-white p-3.5 space-y-1.5 text-xs">
                                {Object.entries(item.specs).map(([key, val]) => (
                                    <div key={key} className="flex justify-between items-center border-b border-blue-400/20 pb-1 last:border-none last:pb-0">
                                        <span className="text-blue-100">{key}</span>
                                        <span className="font-semibold text-white">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="pt-1">
                            <Button
                                onClick={() => setIsBorrowing(true)}
                                className="w-full py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                            >
                                <span>Pinjam Sekarang</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* Loan Submission Form */
                    <form onSubmit={handleConfirmBorrow} className="p-5 space-y-3 text-xs">
                        <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded border border-blue-100 text-blue-800">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>Silakan lengkapi formulir peminjaman alat lab.</span>
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-zinc-700">Nama Alat</label>
                            <input
                                type="text"
                                readOnly
                                value={`${item.name} (${item.code})`}
                                className="w-full px-3 py-2 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="font-medium text-zinc-700">Tanggal Pinjam</label>
                                <input
                                    type="date"
                                    required
                                    value={borrowDate}
                                    onChange={(e) => setBorrowDate(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-zinc-200 text-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="font-medium text-zinc-700">Estimasi Pengembalian</label>
                                <input
                                    type="date"
                                    required
                                    value={returnEstimate}
                                    onChange={(e) => setReturnEstimate(e.target.value)}
                                    className="w-full px-3 py-2 rounded border border-zinc-200 text-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="font-medium text-zinc-700">Keperluan</label>
                            <textarea
                                required
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Praktikum Web"
                                className="w-full px-3 py-2 rounded border border-zinc-200 text-zinc-800 text-xs focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsBorrowing(false)}
                                className="flex-1 rounded-lg text-xs py-2"
                            >
                                Kembali
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2"
                            >
                                {loading ? 'Memproses...' : 'Konfirmasi Pinjam'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
