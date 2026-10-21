<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use App\Models\Peminjaman;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        try {
            $items = Alat::latest()->get();
            $loans = Peminjaman::with('alat')->latest()->get();
            $students = User::where('role', 'siswa')->get();
        } catch (\Throwable) {
            $items = collect();
            $loans = collect();
            $students = collect();
        }

        return Inertia::render('admin/dashboard/index', [
            'initialItems' => $items,
            'initialLoans' => $loans,
            'initialStudents' => $students,
        ]);
    }
}
