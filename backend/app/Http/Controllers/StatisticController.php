<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\User;
use App\Models\Booking;
use App\Models\Suggestion;
use App\Models\Review;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatisticController extends Controller
{
    /**
     * Lấy tất cả số liệu thống kê cho trang tổng quan.
     */
    public function index()
    {
        // --- Tính toán Doanh thu & Đơn đã thanh toán ---
        $paidBookings = Booking::whereIn('status', ['Đã thanh toán', 'Đã hoàn thành'])->get();
        $totalRevenue = 0;
        foreach ($paidBookings as $booking) {
            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $days = $checkOut->diffInDays($checkIn);
            if ($days <= 0) $days = 1; // Ít nhất là 1 ngày
            $totalRevenue += ($booking->price * $days); // $booking->price là giá 1 đêm
        }

        // --- Tính toán Phòng (Logic phức tạp) ---
        $today = Carbon::today();
        
        // Lấy tổng số phòng
        $totalRooms = Room::count();

        // Lấy ID các phòng ĐANG CÓ NGƯỜI Ở (check_in <= today < check_out)
        // và status không phải là 'Đã hủy'
        $occupiedRoomIds = Booking::where('check_in', '<=', $today)
                                  ->where('check_out', '>', $today)
                                  ->where('status', '!=', 'Đã hủy')
                                  ->distinct('room_id') // Chỉ đếm mỗi phòng 1 lần
                                  ->pluck('room_id'); // Lấy danh sách ID

        $occupiedRoomsCount = $occupiedRoomIds->count();
        $availableRoomsCount = $totalRooms - $occupiedRoomsCount;

        // --- Gộp kết quả ---
        $stats = [
            'availableRooms' => $availableRoomsCount,
            'occupiedRooms' => $occupiedRoomsCount,
            'totalCustomers' => User::where('role', 'customer')->count(),
            'totalSuggestions' => Suggestion::count(),
            'totalReviews' => Review::count(),
            'pendingBookings' => Booking::where('status', 'Đã đặt phòng')->orWhereNull('status')->count(),
            'canceledBookings' => Booking::where('status', 'Đã hủy')->count(),
            'paidBookings' => $paidBookings->count(), // Số đơn đã thanh toán
            'totalRevenue' => $totalRevenue, // Tổng doanh thu
        ];

        return response()->json($stats, 200, [], JSON_UNESCAPED_UNICODE);
    }
}