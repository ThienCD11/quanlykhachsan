<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\HistoryController;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// ===== BẮT ĐẦU PHẦN THÊM MỚI (SLEDGEHAMMER FIX) =====
// Route này sẽ bắt "preflight request" (OPTIONS) mà trình duyệt gửi
// trước khi nó gửi POST, và trả về header "cho phép".
Route::options('/login', function (Request $request) {
    return response()->json(null, 200, [
        'Access-Control-Allow-Origin' => 'http://localhost:3000', // Cho phép origin
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS', // Cho phép các phương thức
        'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization' // Cho phép các header
    ]);
});

Route::options('/register', function (Request $request) {
    return response()->json(null, 200, [
        'Access-Control-Allow-Origin' => 'http://localhost:3000',
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization'
    ]);
});

Route::options('/contact', function (Request $request) {
    return response()->json(null, 200, [
        'Access-Control-Allow-Origin' => 'http://localhost:3000',
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization'
    ]);
});

Route::options('/bookings', function (Request $request) {
    return response()->json(null, 200, [
        'Access-Control-Allow-Origin' => 'http://localhost:3000',
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization'
    ]);
});

// Route::options('/histories', function (Request $request) {
//     return response()->json(null, 200, [
//         'Access-Control-Allow-Origin' => 'http://localhost:3000',
//         'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
//         'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization'
//     ]);
// });

Route::options('/rooms', function (Request $request) {
    return response()->json(null, 200, [
        'Access-Control-Allow-Origin' => 'http://localhost:3000',
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With, Authorization'
    ]);
});

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);
Route::get('/facilities', [FacilityController::class, 'index']);
Route::post('/contact', [ContactController::class, 'store']);
// Route::middleware('auth:sanctum')->post('/bookings', [BookingController::class, 'store']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);
Route::get('/histories', [HistoryController::class, 'index']);