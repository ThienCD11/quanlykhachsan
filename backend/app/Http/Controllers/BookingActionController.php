<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class BookingActionController extends Controller
{
    /**
     * Hủy đơn (do khách hàng)
     * Logic: 
     * - th1/th2 (Chưa thanh toán) -> th6 (Đã hủy)
     * - th3 (Đã thanh toán) -> th7 (Chờ hoàn tiền)
     */
    public function customerCancel($id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
            }

            // Chặn hủy nếu đang sử dụng hoặc đã xong
            if (in_array($booking->status, ['Đang sử dụng', 'Hoàn thành', 'Đã hủy', 'Đã hoàn tiền'])) {
                return response()->json(['message' => 'Đơn hàng đã ở trạng thái không thể hủy.'], 400);
            }

            // THÁNH NHÁNH 1: Chưa thanh toán (th1: Chờ xác nhận hoặc th2: Chờ thanh toán)
            // (Thêm check null để tương thích với dữ liệu cũ)
            if (in_array($booking->status, ['Chờ xác nhận', 'Chờ thanh toán', null])) {
                $booking->status = 'Đã hủy'; // Chuyển sang th6
                $booking->save();
                return response()->json(['success' => true, 'message' => 'Đã hủy đơn thành công.']);
            }

            // THÁNH NHÁNH 2: Đã thanh toán (th3) -> Chờ hoàn tiền (th7)
            if ($booking->status === 'Đã thanh toán') {
                $booking->status = 'Chờ hoàn tiền'; 
                $booking->save();
                return response()->json(['success' => true, 'message' => 'Yêu cầu hủy đã gửi. Vui lòng chờ Admin hoàn tiền.']);
            }

        } catch (\Exception $e) {
            Log::error('Lỗi Hủy Đơn (Khách): ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ khi hủy đơn.'], 500);
        }
    }

    /**
     * Xử lý thanh toán (do khách hàng)
     * Logic: th2 (Chờ thanh toán) -> th3 (Đã thanh toán)
     */
    public function processPayment(Request $request, $id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
            }

            if ($booking->status !== 'Chờ thanh toán') {
                return response()->json(['message' => 'Đơn này hiện không ở trạng thái chờ thanh toán.'], 400);
            }

            // @TODO: Tích hợp VNPay/Momo tại đây

            $booking->status = 'Đã thanh toán'; // Chuyển sang th3
            $booking->save();

            return response()->json(['success' => true, 'message' => 'Thanh toán thành công.']);
        
        } catch (\Exception $e) {
            Log::error('Lỗi Thanh Toán (Khách): ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ khi thanh toán.'], 500);
        }
    }

    /**
     * Gửi đánh giá (do khách hàng)
     * Logic: th5 (Hoàn thành) -> Lưu Review -> Ẩn nút Review ở FE
     */
    public function submitReview(Request $request, $id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) return response()->json(['message' => 'Không tìm thấy đơn.'], 404);

            if ($booking->status !== 'Hoàn thành') {
                return response()->json(['message' => 'Bạn chỉ có thể đánh giá sau khi hoàn thành kỳ nghỉ.'], 400);
            }

            // Kiểm tra chắc chắn xem bản ghi Review đã tồn tại chưa
            if (\App\Models\Review::where('booking_id', $id)->exists()) {
                return response()->json(['message' => 'Bạn đã đánh giá đơn này rồi.'], 400);
            }

            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000',
            ]);

            if ($validator->fails()) return response()->json(['errors' => $validator->errors()], 422);

            // Lưu bản ghi (Đảm bảo cột trong CSDL là 'review')
            \App\Models\Review::create([
                'booking_id' => $booking->id,
                'room_id'    => $booking->room_id,
                'user_id'    => $booking->user_id,
                'rating'     => $request->rating,
                'review'     => $request->comment, 
            ]);

            return response()->json(['success' => true, 'message' => 'Gửi đánh giá thành công.']);
        
        } catch (\Exception $e) {
            Log::error('Lỗi Review: ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }
}