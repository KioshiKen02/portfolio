<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::put('/auth/profile', [AuthController::class, 'update']);

    Route::prefix('admin')->group(function () {
        Route::post('/projects', [ProjectController::class, 'store']);
        Route::put('/projects/{project}', [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

        Route::post('/skills', [SkillController::class, 'store']);
        Route::put('/skills/{skill}', [SkillController::class, 'update']);
        Route::delete('/skills/{skill}', [SkillController::class, 'destroy']);

        Route::get('/contacts', [ContactController::class, 'index']);
        Route::get('/contacts/{contact}', [ContactController::class, 'show']);
        Route::post('/contacts/{contact}/reply', [ContactController::class, 'reply']);
        Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'update']);
    });
});

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/skills', [SkillController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
