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
        $this->ensureDefaultAccounts();
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
                        'name' => 'Ahmad Rizky Pratama',
                        'password' => \Illuminate\Support\Facades\Hash::make('siswa123'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa2@smkn1.sch.id'],
                    [
                        'name' => 'Nabila Putri Syahrani',
                        'password' => \Illuminate\Support\Facades\Hash::make('rpl2024!'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa3@smkn1.sch.id'],
                    [
                        'name' => 'Muhammad Fajar Ramadhan',
                        'password' => \Illuminate\Support\Facades\Hash::make('rplfajar11'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa4@smkn1.sch.id'],
                    [
                        'name' => 'Siti Aisyah Azzahra',
                        'password' => \Illuminate\Support\Facades\Hash::make('aisyah2024'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa5@smkn1.sch.id'],
                    [
                        'name' => 'Dimas Arya Saputra',
                        'password' => \Illuminate\Support\Facades\Hash::make('dimasrpl10'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'siswa6@smkn1.sch.id'],
                    [
                        'name' => 'Zahra Amelia Dewi',
                        'password' => \Illuminate\Support\Facades\Hash::make('zahra10rpl'),
                    ]
                );

                \App\Models\User::firstOrCreate(
                    ['email' => 'admin@smkn1.sch.id'],
                    [
                        'name' => 'Agus Wibowo (Admin Lab)',
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
