<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;
use App\Models\Setting;
use Illuminate\Support\Facades\Schema;

use Illuminate\Support\Facades\URL;

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
        if (env('APP_ENV') !== 'local') {
            URL::forceScheme('https');
        }

        $settings = [];
        try {
            if (Schema::hasTable('settings')) {
                $settings = Setting::query()->pluck('value', 'key')->toArray();
            }
        } catch (\Throwable $e) {
            $settings = [];
        }

        View::share('settings', $settings);
    }
}
