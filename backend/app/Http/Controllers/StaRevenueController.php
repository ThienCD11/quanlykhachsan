<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Carbon\Carbon;

class StaRevenueController extends Controller
{
    public function index()
    {
        // 1. Chỉ lấy đơn có doanh thu (th3, th4, th5)
        $bookingsCollection = Booking::with(['room', 'user'])
            ->whereIn('status', ['Đã thanh toán', 'Đang sử dụng', 'Hoàn thành'])
            ->orderBy('updated_at', 'desc')
            ->get();

        $totalRevenue = 0;
        $todayRevenue = 0;
        $last7DaysRevenue = 0;
        $totalOrders = $bookingsCollection->count();
        // 1. Số lượng đơn đã hoàn tiền (Trạng thái th8)
        $refundedCollection = Booking::where('status', 'Đã hoàn tiền')->get();
        $totalRefundedOrders = $refundedCollection->count();

        // 2. Tổng số tiền đã hoàn
        $totalRefundedAmount = 0;
        foreach ($refundedCollection as $refund) {
            $checkIn = Carbon::parse($refund->check_in);
            $checkOut = Carbon::parse($refund->check_out);
            $days = $checkOut->diffInDays($checkIn) ?: 1;
            
            $totalRefundedAmount += ($refund->price * $days);
        }
        
        $capacityGroups = [
            '1 người (Phòng đơn)' => 0, '2 người (Phòng đôi)' => 0,
            '3 người (Phòng ba)' => 0, '4 người (Nhóm nhỏ)' => 0,
            '5,6 người (Nhóm lớn)' => 0, '8,10 người (Đông người)' => 0,
        ];

        $detailedBookings = [];
        $today = Carbon::today();
        $sevenDaysAgo = Carbon::today()->subDays(7);

        foreach ($bookingsCollection as $index => $booking) {
            // Kiểm tra an toàn: nếu phòng bị xóa khỏi DB nhưng booking vẫn còn
            if (!$booking->room) continue;

            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $days = $checkOut->diffInDays($checkIn) ?: 1;
            
            $bookingTotal = $booking->price * $days;
            $totalRevenue += $bookingTotal;

            $paidDate = Carbon::parse($booking->updated_at);
            if ($paidDate->isSameDay($today)) {
                $todayRevenue += $bookingTotal;
            }

            if ($paidDate->gte($sevenDaysAgo)) {
                $last7DaysRevenue += $bookingTotal;
            }

            $cap = $booking->room->capacity ?? 0;
            if ($cap == 1) $capacityGroups['1 người (Phòng đơn)']++;
            elseif ($cap == 2) $capacityGroups['2 người (Phòng đôi)']++;
            elseif ($cap == 3) $capacityGroups['3 người (Phòng ba)']++;
            elseif ($cap == 4) $capacityGroups['4 người (Nhóm nhỏ)']++;
            elseif ($cap >= 5 && $cap <= 6) $capacityGroups['5,6 người (Nhóm lớn)']++;
            elseif ($cap >= 8) $capacityGroups['8,10 người (Đông người)']++;

            $detailedBookings[] = [
                'stt' => count($detailedBookings) + 1,
                'invoice_id' => $booking->invoice_id,
                'customer_name' => $booking->user->name ?? 'N/A',
                'room_name' => $booking->room->name,
                'duration' => $days . ' ngày', 
                'booked_at' => Carbon::parse($booking->created_at)->format('d-m-Y H:i:s'),
                'paid_at' => $paidDate->format('d-m-Y H:i:s'),
                'total' => $bookingTotal,
            ];
        }

        $pieData = [];
        foreach ($capacityGroups as $name => $value) {
            if ($value > 0) $pieData[] = ['name' => $name, 'value' => $value];
        }

        $monthlyData = [];
        $currentYear = Carbon::now()->year;
        for ($i = 1; $i <= 12; $i++) {
            $monthItems = $bookingsCollection->filter(function ($b) use ($i, $currentYear) {
                $d = Carbon::parse($b->updated_at);
                return $d->month == $i && $d->year == $currentYear;
            });

            $monthRevenue = 0;
            foreach ($monthItems as $b) {
                $days = Carbon::parse($b->check_out)->diffInDays(Carbon::parse($b->check_in)) ?: 1;
                $monthRevenue += ($b->price * $days);
            }
            $monthlyData[] = ['name' => "T$i", 'revenue' => $monthRevenue, 'orders' => $monthItems->count()];
        }

        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            // $dayItems = $bookingsCollection->filter(fn($b) => Carbon::parse($b->updated_at)->isSameDay($date));
            $dayItems = $bookingsCollection->filter(function ($b) use ($date) {
                if (!$b->updated_at) return false;
                return Carbon::parse($b->updated_at)->startOfDay()->equalTo($date->copy()->startOfDay());
            });

            $dayRevenue = 0;
            foreach ($dayItems as $b) {
                $days = Carbon::parse($b->check_out)->diffInDays(Carbon::parse($b->check_in)) ?: 1;
                $dayRevenue += ($b->price * $days);
            }
            $weeklyData[] = ['name' => $date->format('d/m'), 'revenue' => $dayRevenue];
        }

        return response()->json([
            'totalRevenue' => (int)$totalRevenue,
            'todayRevenue' => (int)$todayRevenue,
            'last7DaysRevenue' => (int)$last7DaysRevenue,
            'totalRefundedOrders' => $totalRefundedOrders,
            'totalRefundedAmount' => (int)$totalRefundedAmount,
            'totalOrders' => $totalOrders,
            'monthlyData' => $monthlyData,
            'weeklyData' => $weeklyData,
            'pieData' => $pieData,
            'detailedBookings' => $detailedBookings,
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}