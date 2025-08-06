<?php

use App\Http\Controllers\DivisionController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Task management routes
    Route::resource('tasks', TaskController::class);
    
    // Division management routes (admin only)
    Route::resource('divisions', DivisionController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
