<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Peminjaman;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $items = Alat::latest()->get();
        $loans = Peminjaman::with('alat')->latest()->get();

        return Inertia::render('admin/dashboard', [
            'initialItems' => $items,
            'initialLoans' => $loans,
        ]);
    }
}
