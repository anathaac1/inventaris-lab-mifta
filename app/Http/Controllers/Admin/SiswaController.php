<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class SiswaController extends Controller
{
    /**
     * Display student account management page.
     */
    public function index(Request $request): Response
    {
        $students = User::where('role', 'siswa')
            ->latest()
            ->get()
            ->map(function ($u) {
                return [
                    'id' => (string) $u->id,
                    'username' => $u->username ?? explode('@', $u->email)[0],
                    'name' => $u->name,
                    'class' => $u->class ?? 'X RPL A',
                    'email' => $u->email,
                    'password' => '••••••••',
                    'role' => 'siswa',
                    'nisn' => $u->nisn ?? '-',
                    'phone' => $u->phone ?? '-',
                    'avatar' => strtoupper(substr($u->name, 0, 2)),
                ];
            });

        return Inertia::render('admin/siswa/index', [
            'initialStudents' => $students,
        ]);
    }

    /**
     * Store new student account.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:100', 'unique:users,username'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:4'],
            'role' => ['required', 'in:siswa,admin'],
            'class' => ['required', 'string', 'max:50'],
            'nisn' => ['nullable', 'string', 'max:30'],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        User::create([
            'name' => $validated['name'],
            'username' => strtolower(trim($validated['username'])),
            'email' => strtolower(trim($validated['email'])),
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'class' => $validated['class'],
            'nisn' => $validated['nisn'] ?? null,
            'phone' => $validated['phone'] ?? null,
        ]);

        return redirect()->back()->with('success', "Akun untuk {$validated['name']} berhasil dibuat!");
    }

    /**
     * Reset student password.
     */
    public function resetPassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:4'],
        ]);

        $username = trim($validated['username']);
        $user = User::where('username', $username)
            ->orWhere('email', $username)
            ->orWhere('email', $username . '@smkn1.sch.id')
            ->first();

        if (!$user) {
            return redirect()->back()->with('error', "Akun {$username} tidak ditemukan.");
        }

        $user->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return redirect()->back()->with('success', "Password untuk akun {$user->name} ({$username}) berhasil diperbarui.");
    }

    /**
     * Delete student account.
     */
    public function destroy(User $user): RedirectResponse
    {
        $activeLoans = $user->peminjamans()->where('status', 'Sedang Dipinjam')->count();

        if ($activeLoans > 0) {
            return redirect()->back()->with('error', "Akun {$user->name} sedang memiliki pinjaman alat aktif.");
        }

        $user->delete();

        return redirect()->back()->with('success', "Akun {$user->name} berhasil dihapus.");
    }
}
