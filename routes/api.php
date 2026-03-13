<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TimelineController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::match(['get', 'post'], '/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'update']);
});

Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::post('upload', [ProjectController::class, 'upload']);
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('skills', SkillController::class);
        Route::apiResource('settings', SettingController::class);
        Route::apiResource('timeline', TimelineController::class)->except(['show']);
        Route::get('timeline-audit', [TimelineController::class, 'audit']);
        Route::get('contacts', [ContactController::class, 'index']);
        Route::get('contacts/{id}', [ContactController::class, 'show']);
        Route::post('contacts/{id}/reply', [ContactController::class, 'reply']);
        Route::delete('contacts/{id}', [ContactController::class, 'destroy']);
    });
});

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/timeline', [TimelineController::class, 'publicIndex']);
