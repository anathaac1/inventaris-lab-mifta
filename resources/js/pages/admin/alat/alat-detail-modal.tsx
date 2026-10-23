import { Info } from 'lucide-react';
import type { InventoryItem } from '@/data/inventory-data';
import { ItemIllustration } from '@/components/inventory/item-illustration';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AlatDetailModalProps {
    item: InventoryItem | null;
    onClose: () => void;
    onEdit: (item: InventoryItem) => void;
}

export function AlatDetailModal({ item, onClose, onEdit }: AlatDetailModalProps) {
    return (
        <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                {item && (
                    <div>
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-[#0256D0] to-[#0A1C38] text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0">
                                    <ItemIllustration type={item.iconType} className="w-7 h-7" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-white/15 px-2 py-0.5 rounded inline-block mb-1">
                                        {item.category}
                                    </span>
                                    <h3 className="text-base font-bold text-white">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-blue-100 font-mono mt-0.5">
                                        Kode: {item.code}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                            >
                                {/* <X className="w-4 h-4" /> */}
                            </button>
                        </div>

                        {/* Body Details */}
                        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                            {/* Stock & Visibility Status Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-500 block mb-1">Ketersediaan Unit Lab</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-lg font-black text-slate-900">
                                            {item.stock}
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">
                                            / {item.total} unit
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1.5">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{
                                                width: `${item.total > 0 ? (item.stock / item.total) * 100 : 0}%`
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="p-3 rounded bg-slate-50 border border-slate-200">
                                    <span className="text-[11px] text-slate-500 block mb-1">Status</span>
                                    {item.isVisibleToStudents !== false ? (
                                        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs mt-1">
                                            {/* <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> */}
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium text-xs mt-1">
                                            {/* <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> */}
                                            Tidak Aktif
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-1">
                                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <Info className="w-3.5 h-3.5 text-[#0256D0]" />
                                    <span>Deskripsi Perangkat</span>
                                </span>
                                <p className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-xs">
                                    {item.description || 'Tidak ada catatan deskripsi tambahan untuk perangkat ini.'}
                                </p>
                            </div>

                            {/* Full Specifications Table */}
                            <div className="space-y-2">
                                <span className="font-bold text-slate-900 block">
                                    Spesifikasi Teknis & Rincian Lab
                                </span>
                                <div className="border border-slate-200 rounded overflow-hidden divide-y divide-slate-100">
                                    {item.specs && Object.keys(item.specs).length > 0 ? (
                                        Object.entries(item.specs).map(([specKey, specVal]) => (
                                            <div key={specKey} className="flex justify-between py-2 px-3 text-xs hover:bg-slate-50/60">
                                                <span className="font-medium text-slate-500">{specKey}</span>
                                                <span className="font-semibold text-slate-900 text-right">{String(specVal)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-slate-400">
                                            Belum ada rincian spesifikasi tambahan.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                            {/* <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="h-9 px-4 rounded text-xs font-semibold"
                            >
                                Tutup
                            </Button> */}
                            <Button
                                type="button"
                                onClick={() => onEdit(item)}
                                className="h-9 px-4 ml-auto rounded bg-[#0256D0] hover:bg-[#0243a4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                                {/* <Edit2 className="w-3.5 h-3.5" /> */}
                                <span>Ubah Data Alat Ini</span>
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
