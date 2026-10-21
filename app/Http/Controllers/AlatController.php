<?php

namespace App\Http\Controllers;

use App\Models\Alat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlatController extends Controller
{
    /**
     * Display student catalog of items.
     */
    public function index(Request $request): Response
    {
        try {
            $query = Alat::where('is_visible_to_students', true);

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            }

            if ($request->filled('category') && $request->input('category') !== 'Semua') {
                $query->where('category', $request->input('category'));
            }

            $items = $query->latest()->get();
        } catch (\Throwable) {
            $items = collect();
        }

        return Inertia::render('siswa/alat/index', [
            'initialItems' => $items,
            'filters' => $request->only(['search', 'category']),
        ]);
    }
}
