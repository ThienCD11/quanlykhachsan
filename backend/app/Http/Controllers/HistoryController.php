<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Booking; // Sử dụng trực tiếp Booking Model để query
use Carbon\Carbon; // Để tính toán ngày

class HistoryController extends Controller
{
    /**
     * Lấy lịch sử đặt phòng của người dùng đã đăng nhập.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // 1. Lấy user_id từ query string và validate
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id'
        ]);

        // Nếu validation thất bại (không có user_id, hoặc không phải số, hoặc user không tồn tại)
        if ($validator->fails()) {
            return response()->json(['message' => 'User ID không hợp lệ hoặc bị thiếu.', 'errors' => $validator->errors()], 422);
        }

        $userId = $request->query('user_id');

        // Lấy các booking của user đó, sắp xếp mới nhất lên đầu
        // Eager load thông tin phòng ('room') để tránh N+1 query
        $bookings = Booking::where('user_id', $userId)
                            ->with('room') // Lấy kèm thông tin phòng liên quan
                            ->orderBy('created_at', 'desc') // Sắp xếp mới nhất trước
                            ->get();

        // Chuyển đổi dữ liệu trả về cho frontend (tính toán, định dạng)
        $historyData = $bookings->map(function ($booking) {
            // Tính số ngày ở
            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $numberOfDays = $checkOut->diffInDays($checkIn);
            // Tính tổng tiền (nếu giá lưu là giá 1 đêm)
            // Đảm bảo $booking->room tồn tại trước khi truy cập price
            $pricePerNight = $booking->room ? $booking->room->price : $booking->price; // Lấy giá từ room nếu có, nếu không lấy giá đã lưu
            $totalPrice = $pricePerNight * $numberOfDays;

            return [
                'id' => $booking->id, // ID của booking
                'room_name' => $booking->room ? $booking->room->name : 'Phòng không xác định', // Lấy tên phòng
                'price_per_night' => number_format($pricePerNight, 0, ',', '.') . ' VND', // Định dạng giá 1 đêm
                'check_in' => $checkIn->format('d-m-Y'), // Định dạng ngày vào
                'check_out' => $checkOut->format('d-m-Y'), // Định dạng ngày ra
                'total_price' => number_format($totalPrice, 0, ',', '.') . ' VND', // Định dạng tổng tiền
                'invoice_id' => $booking->invoice_id, // ID Đơn (giống ảnh)
                'booked_at' => Carbon::parse($booking->created_at)->format('d-m-Y'), // Định dạng ngày đặt
                'status' => $booking->status, // Lấy trạng thái nếu có, mặc định là "Đã Đặt"
            ];
        });

        return response()->json($historyData);
    }
}