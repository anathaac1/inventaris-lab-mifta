<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Seed default student and admin accounts if missing.
     */
    protected function ensureDefaultAccounts(): void
    {
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('users')) {
                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa1@smkn1.sch.id'],
                    [
                        'username' => 'siswa1',
                        'name' => 'Ahmad Rizky Pratama',
                        'role' => 'siswa',
                        'class' => 'XII RPL A',
                        'nisn' => '0067829101',
                        'phone' => '0812-9876-1101',
                        'password' => \Illuminate\Support\Facades\Hash::make('siswa123'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa2@smkn1.sch.id'],
                    [
                        'username' => 'siswa2',
                        'name' => 'Nabila Putri Syahrani',
                        'role' => 'siswa',
                        'class' => 'XII RPL B',
                        'nisn' => '0067829102',
                        'phone' => '0813-4455-2202',
                        'password' => \Illuminate\Support\Facades\Hash::make('rpl2024!'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa3@smkn1.sch.id'],
                    [
                        'username' => 'siswa3',
                        'name' => 'Muhammad Fajar Ramadhan',
                        'role' => 'siswa',
                        'class' => 'XI RPL A',
                        'nisn' => '0078912301',
                        'phone' => '0812-3344-5566',
                        'password' => \Illuminate\Support\Facades\Hash::make('rplfajar11'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa4@smkn1.sch.id'],
                    [
                        'username' => 'siswa4',
                        'name' => 'Siti Aisyah Azzahra',
                        'role' => 'siswa',
                        'class' => 'XI RPL B',
                        'nisn' => '0078912302',
                        'phone' => '0813-9988-7766',
                        'password' => \Illuminate\Support\Facades\Hash::make('aisyah2024'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa5@smkn1.sch.id'],
                    [
                        'username' => 'siswa5',
                        'name' => 'Dimas Arya Saputra',
                        'role' => 'siswa',
                        'class' => 'X RPL A',
                        'nisn' => '0089123401',
                        'phone' => '0821-1122-3344',
                        'password' => \Illuminate\Support\Facades\Hash::make('dimasrpl10'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa6@smkn1.sch.id'],
                    [
                        'username' => 'siswa6',
                        'name' => 'Zahra Amelia Dewi',
                        'role' => 'siswa',
                        'class' => 'X RPL B',
                        'nisn' => '0089123402',
                        'phone' => '0822-4455-6677',
                        'password' => \Illuminate\Support\Facades\Hash::make('zahra10rpl'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'admin@smkn1.sch.id'],
                    [
                        'username' => 'admin',
                        'name' => 'Bambang Haryanto, S.T.',
                        'role' => 'admin',
                        'class' => 'Kepala Lab RPL SMKN 1',
                        'phone' => '0811-2233-4455',
                        'password' => \Illuminate\Support\Facades\Hash::make('adminlab123'),
                    ]
                );
            }
        } catch (\Throwable) {
            // Silently continue if database or migration not ready
        }
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
