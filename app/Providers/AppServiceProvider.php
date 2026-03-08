<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

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
        try {
            // Only run if not in console and the table exists
            if (!$this->app->runningInConsole() && Schema::hasTable('settings')) {
                View::composer('app', function ($view) {
                    try {
                        $settings = Setting::all()->pluck('value', 'key');
                        $view->with('settings', $settings);
                    } catch (\Throwable $e) {
                        $view->with('settings', collect());
                    }
                });
            }
        } catch (\Throwable $e) {
            // Silently fail during boot to avoid exception loops on Vercel
        }
    }
}
