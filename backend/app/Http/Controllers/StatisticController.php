<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use App\Models\Booking;
use App\Models\Suggestion;
use App\Models\Review;
use Carbon\Carbon;

class StatisticController extends Controller
{
    /**
     * Lấy tất cả số liệu thống kê cho Dashboard tổng quan.
     */
    public function index()
    {
        $today = Carbon::today();

        // 1. Tính toán doanh thu (th3, th4, th5 - Các trạng thái đã thu tiền)
        // Lưu ý: Không tính th7, th8 (Chờ hoàn/Đã hoàn) vào doanh thu thực
        $paidBookings = Booking::whereIn('status', ['Đã thanh toán', 'Đang sử dụng', 'Hoàn thành'])->get();
        $totalRevenue = 0;

        foreach ($paidBookings as $booking) {
            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $days = $checkOut->diffInDays($checkIn) ?: 1;
            
            $totalRevenue += ($booking->price * $days);
        }

        // 2. Tính toán trạng thái phòng (Logic real-time)
        $totalRoomsCount = Room::count();

        // Phòng có khách: Phải thuộc các đơn đang trong quá trình sử dụng (th2, th3, th4)
        // th1 (Chờ xác nhận) tính là phòng trống. th5 (Xong) tính là phòng trống.
        $occupiedRoomIds = Booking::where('check_in', '<=', $today)
            ->where('check_out', '>', $today)
            ->whereIn('status', ['Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng'])
            ->distinct()
            ->pluck('room_id');

        $occupiedRoomsCount = $occupiedRoomIds->count();
        $availableRoomsCount = $totalRoomsCount - $occupiedRoomsCount;

        // 3. Tổng hợp kết quả trả về Frontend
        $stats = [
            'availableRooms'   => $availableRoomsCount,
            'occupiedRooms'    => $occupiedRoomsCount,
            'totalCustomers'   => User::where('role', 'customer')->count(),
            'totalSuggestions' => Suggestion::count(),
            'totalReviews'     => Review::count(),
            'pendingBookings'  => Booking::whereIn('status', ['Chờ xác nhận', null])->count(),
            'canceledBookings' => Booking::where('status', 'Đã hủy')->count(),
            'refundBookings'   => Booking::where('status', 'Đã hoàn tiền')->count(),
            'paidBookings'     => $paidBookings->count(), 
            'totalRevenue'     => $totalRevenue,
        ];

        return response()->json($stats, 200, [], JSON_UNESCAPED_UNICODE);
    }
}