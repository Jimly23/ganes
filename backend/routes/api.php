<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaketTourController;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\UserAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;

Route::post('/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('paket-tours', PaketTourController::class);
Route::apiResource('tours', TourController::class);
Route::apiResource('events', EventController::class);
Route::apiResource('articles', ArticleController::class);
Route::apiResource('user-admins', UserAdminController::class);
