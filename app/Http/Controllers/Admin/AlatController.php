<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Alat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AlatController extends Controller
{
    public function index(Request $request): Response
    {
        $items = Alat::latest()->get();

        return Inertia::render('admin/alat/index', [
            'initialItems' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:alats,code'],
            'category' => ['required', 'string', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'icon_type' => ['nullable', 'string'],
            'is_visible_to_students' => ['boolean'],
            'specs' => ['nullable', 'array'],
        ]);

        Alat::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'category' => $validated['category'],
            'stock' => $validated['stock'],
            'total' => $validated['total'],
            'description' => $validated['description'] ?? '',
            'icon_type' => $validated['icon_type'] ?? 'laptop',
            'is_visible_to_students' => $validated['is_visible_to_students'] ?? true,
            'specs' => $validated['specs'] ?? [],
        ]);

        return redirect()->back()->with('success', 'Alat baru berhasil ditambahkan.');
    }

    public function update(Request $request, Alat $alat): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:alats,code,' . $alat->id],
            'category' => ['required', 'string', 'max:100'],
            'stock' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'icon_type' => ['nullable', 'string'],
            'is_visible_to_students' => ['boolean'],
            'specs' => ['nullable', 'array'],
        ]);

        $alat->update($validated);

        return redirect()->back()->with('success', 'Alat berhasil diperbarui.');
    }

    public function destroy(Alat $alat): RedirectResponse
    {
        $activeLoans = $alat->peminjamans()->where('status', 'Sedang Dipinjam')->count();

        if ($activeLoans > 0) {
            return redirect()->back()->with('error', 'Alat sedang dipinjam dan tidak dapat dihapus.');
        }

        $alat->delete();

        return redirect()->back()->with('success', 'Alat berhasil dihapus dari inventaris.');
    }

    public function toggleVisibility(Alat $alat): RedirectResponse
    {
        $alat->update([
            'is_visible_to_students' => !$alat->is_visible_to_students,
        ]);

        return redirect()->back()->with('success', 'Status visibilitas alat berhasil diubah.');
    }
}
