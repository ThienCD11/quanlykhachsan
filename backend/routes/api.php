<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('/hotels', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Khách sạn Hà Nội', 'stars' => 5],
        ['id' => 2, 'name' => 'Khách sạn Sài Gòn', 'stars' => 4],
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
