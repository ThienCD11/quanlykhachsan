<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ContactController;


// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/facilities', [FacilityController::class, 'index']);
Route::get('/contact', [ContactController::class, 'index']);

