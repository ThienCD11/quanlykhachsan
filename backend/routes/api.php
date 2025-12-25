<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\StaFacilityController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingActionController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\StaBookingController;
use App\Http\Controllers\StaRoomController;
use App\Http\Controllers\StaFeedbackController;
use App\Http\Controllers\StaCustomerController;
use App\Http\Controllers\StaRevenueController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\ChatbotController;

// ===== PUBLIC ROUTES =====

// routes/api.php
Route::post('/chatbot', [ChatbotController::class, 'chat']);
Route::get('/reviews/room/{roomId}', [ReviewController::class, 'getReviewsByRoom']);
Route::get('/reviews/user/{userId}', [ReviewController::class, 'getReviewsByUser']);
Route::delete('/reviews/{id}', [ReviewController::class, 'deleteReview']);

Route::post('/vnpay/create-payment', [PaymentController::class, 'createPayment']);
Route::get('/vnpay/callback', [PaymentController::class, 'callback']);

Route::post('/password/email', [PasswordController::class, 'sendResetCode']);
Route::post('/password/reset', [PasswordController::class, 'resetPassword']);

// routes/api.php
Route::get('/reviews/room/{roomId}', [ReviewController::class, 'getReviewsByRoom']);
// Auth Routes
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// Room Routes (Public)
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{room}', [RoomController::class, 'show']);

// ===== CRUD ROUTES CHO QUẢN LÝ PHÒNG (ADMIN) =====
Route::prefix('rooms')->group(function () {
    Route::post('/', [StaRoomController::class, 'store']);
    Route::put('/{id}', [StaRoomController::class, 'update']);
    Route::post('/{id}', [StaRoomController::class, 'update']);
    Route::delete('/{id}', [StaRoomController::class, 'destroy']);
    Route::post('/{id}/toggle-status', [StaRoomController::class, 'toggleStatus']);
});

// Facility Routes (Public)
Route::get('/facilities', [StaFacilityController::class, 'index']);

// ===== CRUD ROUTES CHO QUẢN LÝ TIỆN NGHI (ADMIN) =====
Route::prefix('facilities')->group(function () {
    Route::post('/', [StaFacilityController::class, 'store']);
    Route::put('/{id}', [StaFacilityController::class, 'update']);
    Route::post('/{id}', [StaFacilityController::class, 'update']);
    Route::delete('/{id}', [StaFacilityController::class, 'destroy']);
});

// Contact Route
Route::post('/contact', [ContactController::class, 'store']);

// Booking Route (Public)
Route::post('/bookings', [BookingController::class, 'store']);

// Statistic Routes (Public)
Route::get('/statistic', [StatisticController::class, 'index']);
Route::get('/statistic/bookings', [StaBookingController::class, 'index']);
Route::get('/statistic/suggestions', [StaFeedbackController::class, 'getSuggestions']);
Route::get('/statistic/reviews', [StaFeedbackController::class, 'getReviews']);
Route::get('/statistic/rooms', [StaRoomController::class, 'index']);
Route::get('/statistic/customers', [StaCustomerController::class, 'index']);
Route::get('/statistic/revenue', [StaRevenueController::class, 'index']);

// Booking Management (Admin)
Route::post('/statistic/bookings/{id}/confirm', [StaBookingController::class, 'confirm']);
Route::post('/statistic/bookings/{id}/cancel', [StaBookingController::class, 'cancel']);
Route::post('/statistic/bookings/{id}/use-room', [StaBookingController::class, 'useRoom']);
Route::post('/statistic/bookings/{id}/complete-room', [StaBookingController::class, 'completeRoom']);
Route::post('/statistic/bookings/{id}/refund', [StaBookingController::class, 'refund']);
Route::post('/statistic/bookings/{id}/export-invoice', [StaBookingController::class, 'exportInvoice']);

Route::post('/statistic/customers/{user}/promote', [StaCustomerController::class, 'promoteAdmin']);
Route::post('/statistic/customers/{user}/toggle-active', [StaCustomerController::class, 'toggleActive']);
Route::post('/statistic/customers/{user}/delete', [StaCustomerController::class, 'destroy']);

// Booking Actions
Route::post('/bookings/{id}/customer-cancel', [BookingActionController::class, 'customerCancel']);
Route::post('/bookings/{id}/pay', [BookingActionController::class, 'processPayment']);
Route::post('/bookings/{id}/review', [BookingActionController::class, 'submitReview']);

// History
Route::get('/histories', [HistoryController::class, 'index']);

// User Management (Admin)
Route::get('/users', [UserController::class, 'getAllUsers']);
Route::get('/users/{id}', [UserController::class, 'getUserById']);

// ===== PROTECTED ROUTES (CẦN ĐĂNG NHẬP) =====
Route::middleware('auth:sanctum')->group(function () {
    
    // ===== USER PROFILE ROUTES (MỚI THÊM) =====
    Route::get('/profile', [UserController::class, 'getProfile']);
    Route::post('/update-profile', [UserController::class, 'updateProfile']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    Route::delete('/delete-avatar', [UserController::class, 'deleteAvatar']);
    
});

// ===== OPTIONS ROUTES (CORS Preflight) =====
Route::options('/login', function () {
    return response()->json(null, 200);
});

Route::options('/register', function () {
    return response()->json(null, 200);
});

Route::options('/contact', function () {
    return response()->json(null, 200);
});

Route::options('/bookings', function () {
    return response()->json(null, 200);
});

Route::options('/rooms', function () {
    return response()->json(null, 200);
});

Route::options('/rooms/{id}', function () {
    return response()->json(null, 200);
});

Route::options('/facilities/{id}', function () {
    return response()->json(null, 200);
});

Route::options('/users/{id}', function () {
    return response()->json(null, 200);
});

Route::options('/bookings/{id}/review', function () {
    return response()->json(null, 200);
});

// ===== OPTIONS CHO USER PROFILE (MỚI THÊM) =====
Route::options('/profile', function () {
    return response()->json(null, 200);
});

Route::options('/update-profile', function () {
    return response()->json(null, 200);
});

Route::options('/change-password', function () {
    return response()->json(null, 200);
});