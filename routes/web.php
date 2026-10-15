<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('dashboard', 'dashboard')->name('dashboard');
Route::inertia('alat', 'alat')->name('alat.index');
Route::inertia('peminjaman', 'peminjaman')->name('peminjaman.index');
Route::inertia('profile', 'profile')->name('profile.index');

// Admin CMS Routes
Route::prefix('admin')->group(function () {
    Route::inertia('/', 'admin/dashboard')->name('admin.dashboard');
    Route::inertia('alat', 'admin/alat')->name('admin.alat.index');
    Route::inertia('peminjaman', 'admin/peminjaman')->name('admin.peminjaman.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Authenticated settings
});

require __DIR__.'/settings.php';
