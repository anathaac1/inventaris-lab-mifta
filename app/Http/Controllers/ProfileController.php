<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display student profile.
     */
    public function index(Request $request): Response
    {
        $user = $request->user() ?? User::where('role', 'siswa')->first();

        return Inertia::render('siswa/profile/index', [
            'initialUser' => $user ? [
                'id' => (string) $user->id,
                'name' => $user->name,
                'username' => $user->username ?? explode('@', $user->email)[0],
                'class' => $user->class ?? 'XII RPL A',
                'email' => $user->email,
                'nisn' => $user->nisn ?? '0067829101',
                'phone' => $user->phone ?? '-',
                'role' => $user->role,
            ] : null,
        ]);
    }

    /**
     * Update student password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'old_password' => ['nullable', 'string'],
            'new_password' => ['required', 'string', 'min:4'],
        ]);

        $user = $request->user() ?? User::where('role', 'siswa')->first();

        if ($user) {
            $user->update([
                'password' => Hash::make($validated['new_password']),
            ]);
        }

        return redirect()->back()->with('success', 'Kata sandi berhasil diperbarui.');
    }
}
