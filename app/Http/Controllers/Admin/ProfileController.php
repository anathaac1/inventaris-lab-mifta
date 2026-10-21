<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display administrator profile.
     */
    public function index(Request $request): Response
    {
        try {
            $admin = $request->user() ?? User::where('role', 'admin')->first();
        } catch (\Throwable) {
            $admin = null;
        }

        return Inertia::render('admin/profile/index', [
            'initialAdmin' => $admin ? [
                'id' => (string) $admin->id,
                'name' => $admin->name,
                'username' => $admin->username ?? 'admin',
                'class' => $admin->class ?? 'Kepala Lab RPL SMKN 1',
                'email' => $admin->email,
                'phone' => $admin->phone ?? '0811-2233-4455',
                'role' => 'admin',
            ] : null,
        ]);
    }

    /**
     * Update administrator password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'old_password' => ['nullable', 'string'],
            'new_password' => ['required', 'string', 'min:4'],
        ]);

        $admin = $request->user() ?? User::where('role', 'admin')->first();

        if ($admin) {
            $admin->update([
                'password' => Hash::make($validated['new_password']),
            ]);
        }

        return redirect()->back()->with('success', 'Kata sandi administrator berhasil diperbarui.');
    }
}
