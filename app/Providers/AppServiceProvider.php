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
            if (Schema::hasTable('settings')) {
                View::composer('app', function ($view) {
                    $settings = Setting::all()->pluck('value', 'key');
                    $view->with('settings', $settings);
                });
            }
        } catch (\Exception $e) {
            // Log the error or ignore it if the DB isn't ready yet
        }
    }
}
