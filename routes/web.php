<?php

use App\Http\Controllers\Admin\AlatController as AdminAlatController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\PeminjamanController as AdminPeminjamanController;
use App\Http\Controllers\AlatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PeminjamanController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

// Student Facing Routes
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('alat', [AlatController::class, 'index'])->name('alat.index');

Route::get('peminjaman', [PeminjamanController::class, 'index'])->name('peminjaman.index');
Route::post('peminjaman', [PeminjamanController::class, 'store'])->name('peminjaman.store');
Route::post('peminjaman/{peminjaman}/kembalikan', [PeminjamanController::class, 'returnItem'])->name('peminjaman.kembalikan');

Route::inertia('profile', 'profile')->name('profile.index');

// Admin CMS Routes
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::get('alat', [AdminAlatController::class, 'index'])->name('alat.index');
    Route::post('alat', [AdminAlatController::class, 'store'])->name('alat.store');
    Route::put('alat/{alat}', [AdminAlatController::class, 'update'])->name('alat.update');
    Route::delete('alat/{alat}', [AdminAlatController::class, 'destroy'])->name('alat.destroy');
    Route::patch('alat/{alat}/visibility', [AdminAlatController::class, 'toggleVisibility'])->name('alat.visibility');

    Route::get('peminjaman', [AdminPeminjamanController::class, 'index'])->name('peminjaman.index');
    Route::post('peminjaman/{peminjaman}/kembalikan', [AdminPeminjamanController::class, 'returnItem'])->name('peminjaman.kembalikan');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Authenticated settings
});

require __DIR__.'/settings.php';
