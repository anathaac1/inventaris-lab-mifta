<?php

use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');
Route::inertia('dashboard', 'siswa/dashboard')->name('dashboard');
Route::inertia('alat', 'siswa/alat')->name('alat.index');
Route::inertia('peminjaman', 'siswa/peminjaman')->name('peminjaman.index');
Route::inertia('profile', 'siswa/profile')->name('profile.index');

// Admin CMS Routes
Route::prefix('admin')->group(function () {
    Route::inertia('/', 'admin/dashboard')->name('admin.dashboard');
    Route::inertia('alat', 'admin/alat')->name('admin.alat.index');
    Route::inertia('peminjaman', 'admin/peminjaman')->name('admin.peminjaman.index');
    Route::inertia('siswa', 'admin/siswa')->name('admin.siswa.index');
    Route::inertia('profile', 'admin/profile')->name('admin.profile.index');
    Route::post('siswa/reset-password', function (\Illuminate\Http\Request $request) {
        $request->validate([
            'username' => 'required|string',
            'new_password' => 'required|string|min:4',
        ]);

        $username = trim($request->username);
        $user = \App\Models\User::where('email', $username)
            ->orWhere('email', $username . '@smkn1.sch.id')
            ->first();

        if ($user) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->new_password);
            $user->save();
        }

        return back()->with('status', "Password untuk akun {$username} berhasil diperbarui.");
    })->name('admin.siswa.reset_password');
});
