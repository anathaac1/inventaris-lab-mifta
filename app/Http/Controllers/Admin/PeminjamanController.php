<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Peminjaman;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PeminjamanController extends Controller
{
    public function index(): Response
    {
        $loans = Peminjaman::with('alat')->latest()->get();

        return Inertia::render('admin/peminjaman', [
            'initialLoans' => $loans,
        ]);
    }

    public function returnItem(Peminjaman $peminjaman): RedirectResponse
    {
        if ($peminjaman->status === 'Dikembalikan') {
            return redirect()->back()->with('info', 'Barang ini sudah dikembalikan.');
        }

        DB::transaction(function () use ($peminjaman) {
            $peminjaman->update([
                'status' => 'Dikembalikan',
                'return_date' => now()->toDateString(),
            ]);

            $alat = Alat::where('id', $peminjaman->alat_id)->lockForUpdate()->first();
            if ($alat) {
                $alat->update([
                    'stock' => min($alat->total, $alat->stock + 1),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Barang telah dikonfirmasi kembali oleh admin.');
    }
}
