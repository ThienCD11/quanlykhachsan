<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StaBookingController extends Controller
{
    public function index()
    {
        $bookings = Booking::with(['user', 'room'])->orderBy('created_at', 'desc')->get()->map(function ($b, $index) {
            $checkin = Carbon::parse($b->check_in);
            $checkout = Carbon::parse($b->check_out);
            $days = $checkout->diffInDays($checkin);

            $pricePerNight = $b->price;
            $total = $pricePerNight * $days;

            return [
                'stt' => $index + 1,
                'id' => $b->id,
                'invoice_id' => $b->invoice_id,
                'customer' => $b->user->name ?? 'N/A',
                'room' => $b->room->name ?? 'N/A',
                'checkin' => $b->check_in,
                'checkout' => $b->check_out,
                'booking_at' => Carbon::parse($b->created_at)->format('d-m-Y H:i:s'),
                'total' => $total,
                'status' => $b->status,
            ];
        });

        return response()->json($bookings);
    }

    public function confirm($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        $booking->status = 'Đã xác nhận';
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã xác nhận đặt phòng!']);
    }

    public function cancel($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        $booking->status = 'Đã hủy';
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã hủy đặt phòng!']);
    }

    public function confirmPayment($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }
        
        // Chỉ xác nhận nếu status đang là 'Đã thanh toán' (do khách trả)
        if ($booking->status == 'Đã thanh toán') {
            $booking->status = 'Đã hoàn thành'; // Status cuối cùng
            $booking->save();
            return response()->json(['success' => true, 'message' => 'Đã xác nhận thanh toán!']);
        }
        
        // Nếu admin cố nhấn nút này khi status chưa phải là 'Đã thanh toán'
        return response()->json([
            'success' => false, 
            'message' => 'Không thể xác nhận (Trạng thái đơn không phải "Đã thanh toán").'
        ], 400); // Bad Request
    }
}
