<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;

class StaRevenueController extends Controller
{
    public function index()
    {
        // 1. Lấy tất cả booking đã thanh toán/hoàn thành kèm thông tin phòng và user
        // Sắp xếp theo ngày thanh toán (updated_at) mới nhất
        $bookingsCollection = Booking::with(['room', 'user'])
            ->whereIn('status', ['Đã thanh toán', 'Đã hoàn thành'])
            ->orderBy('updated_at', 'desc')
            ->get();

        // 2. Khởi tạo các biến tổng quan
        $totalRevenue = 0;
        $todayRevenue = 0;
        $last7DaysRevenue = 0;
        $totalOrders = $bookingsCollection->count();
        
        // Khởi tạo các nhóm cho biểu đồ tròn
        $capacityGroups = [
            '1 người (Phòng đơn)' => 0,
            '2 người (Phòng đôi)' => 0,
            '3 người (Phòng ba)' => 0,
            '4 người (Nhóm nhỏ)' => 0,
            '5,6 người (Nhóm lớn)' => 0,
            '8,10 người (Đông người)' => 0,
        ];

        $detailedBookings = [];
        
        // Thời gian tham chiếu
        $today = Carbon::today();
        $sevenDaysAgo = Carbon::today()->subDays(7);

        // --- DUYỆT QUA DANH SÁCH BOOKING ĐỂ TÍNH TOÁN ---
        foreach ($bookingsCollection as $index => $booking) {
            // Tính tiền cho từng booking
            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $days = $checkOut->diffInDays($checkIn);
            if ($days <= 0) $days = 1;
            
            $bookingTotal = $booking->price * $days;
            
            // Cộng dồn tổng doanh thu
            $totalRevenue += $bookingTotal;

            // Tính doanh thu hôm nay (dựa trên updated_at - ngày thanh toán)
            $paidDate = Carbon::parse($booking->updated_at);
            if ($paidDate->isSameDay($today)) {
                $todayRevenue += $bookingTotal;
            }

            // Tính doanh thu 7 ngày qua
            if ($paidDate->gte($sevenDaysAgo)) {
                $last7DaysRevenue += $bookingTotal;
            }

            // Phân loại sức chứa cho biểu đồ tròn
            $cap = $booking->room->capacity ?? 0;
            if ($cap == 1) $capacityGroups['1 người (Phòng đơn)']++;
            elseif ($cap == 2) $capacityGroups['2 người (Phòng đôi)']++;
            elseif ($cap == 3) $capacityGroups['3 người (Phòng ba)']++;
            elseif ($cap == 4) $capacityGroups['4 người (Nhóm nhỏ)']++;
            elseif (in_array($cap, [5, 6])) $capacityGroups['5,6 người (Nhóm lớn)']++;
            elseif (in_array($cap, [8, 10])) $capacityGroups['8,10 người (Đông người)']++;

            // Thêm vào danh sách chi tiết để hiển thị bảng
            $detailedBookings[] = [
                'stt' => $index + 1,
                'invoice_id' => $booking->invoice_id,
                'customer_name' => $booking->user->name ?? 'N/A',
                'room_name' => $booking->room->name ?? 'N/A',
                'capacity' => $cap . ' người',
                'duration' => $days . ' ngày', 
                'booked_at' => Carbon::parse($booking->created_at)->format('d-m-Y H:i:s'),
                'paid_at' => $paidDate->format('d-m-Y H:i:s'),
                'total' => $bookingTotal,
            ];
        }

        // Format dữ liệu biểu đồ tròn
        $pieData = [];
        foreach ($capacityGroups as $name => $value) {
            if ($value > 0) {
                $pieData[] = ['name' => $name, 'value' => $value];
            }
        }

        // 3. Tính dữ liệu theo tháng (12 tháng của năm hiện tại)
        $monthlyData = [];
        $currentYear = Carbon::now()->year;

        for ($i = 1; $i <= 12; $i++) {
            $monthRevenue = 0;
            $monthOrders = 0;
            
            // Lọc các đơn trong tháng $i từ collection đã lấy (để tối ưu)
            $monthItems = $bookingsCollection->filter(function ($b) use ($i, $currentYear) {
                $d = Carbon::parse($b->updated_at);
                return $d->month == $i && $d->year == $currentYear;
            });

            foreach ($monthItems as $b) {
                $checkIn = Carbon::parse($b->check_in);
                $checkOut = Carbon::parse($b->check_out);
                $days = $checkOut->diffInDays($checkIn);
                if ($days <= 0) $days = 1;
                $monthRevenue += ($b->price * $days);
                $monthOrders++;
            }

            $monthlyData[] = [
                'name' => "T$i",
                'revenue' => $monthRevenue,
                'orders' => $monthOrders
            ];
        }

        // 4. Tính dữ liệu 7 ngày gần nhất cho biểu đồ vùng
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Lọc các đơn trong ngày cụ thể
            $dayItems = $bookingsCollection->filter(function ($b) use ($date) {
                return Carbon::parse($b->updated_at)->isSameDay($date);
            });

            $dayRevenue = 0;
            foreach ($dayItems as $b) {
                $checkIn = Carbon::parse($b->check_in);
                $checkOut = Carbon::parse($b->check_out);
                $days = $checkOut->diffInDays($checkIn);
                if ($days <= 0) $days = 1;
                $dayRevenue += ($b->price * $days);
            }
            
            $weeklyData[] = [
                'name' => $date->format('d/m'), // VD: 21/11
                'revenue' => $dayRevenue,
            ];
        }

        // 5. Trả về JSON
        return response()->json([
            'totalRevenue' => $totalRevenue,
            'todayRevenue' => $todayRevenue,
            'last7DaysRevenue' => $last7DaysRevenue,
            'totalOrders' => $totalOrders,
            'monthlyData' => $monthlyData,
            'weeklyData' => $weeklyData,
            'pieData' => $pieData,
            'detailedBookings' => $detailedBookings,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}