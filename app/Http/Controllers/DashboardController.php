<?php

namespace App\Http\Controllers;

use App\Models\Alat;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display student dashboard with active items and user loans.
     */
    public function index(Request $request): Response
    {
        $items = Alat::where('is_visible_to_students', true)
            ->latest()
            ->get();

        $activeLoans = Peminjaman::with('alat')
            ->where('status', 'Sedang Dipinjam')
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'initialItems' => $items,
            'initialActiveLoans' => $activeLoans,
        ]);
    }
}
