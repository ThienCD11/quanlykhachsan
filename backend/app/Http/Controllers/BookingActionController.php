<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // << Thêm Log để ghi lỗi

class BookingActionController extends Controller
{
    /**
     * Hủy đơn (do khách hàng)
     */
    public function customerCancel($id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
            }

            // Cho phép hủy cả đơn 'null' (đơn cũ) hoặc 'Đã đặt phòng'
            if ($booking->status !== 'Đã đặt phòng' && $booking->status !== null) {
                return response()->json(['message' => 'Không thể hủy đơn ở trạng thái này.'], 400);
            }

            $booking->status = 'Đã hủy';
            $booking->save();

            return response()->json(['success' => true, 'message' => 'Đã hủy đơn thành công.']);
        
        } catch (\Exception $e) {
            Log::error('Lỗi Hủy Đơn (Khách): ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ khi hủy đơn.'], 500);
        }
    }

    /**
     * Xử lý thanh toán (do khách hàng)
     * Logic: (Đã xác nhận) -> (Đã thanh toán)
     */
    public function processPayment(Request $request, $id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
            }

            // Chỉ được thanh toán nếu Admin đã "Xác nhận"
            if ($booking->status !== 'Đã xác nhận') {
                return response()->json(['message' => 'Đơn này chưa sẵn sàng để thanh toán.'], 400);
            }

            // @TODO: XỬ LÝ LOGIC THANH TOÁN THẬT (VNPAY, MOMO...)

            $booking->status = 'Đã thanh toán';
            $booking->save();

            return response()->json(['success' => true, 'message' => 'Thanh toán thành công.']);
        
        } catch (\Exception $e) {
            Log::error('Lỗi Thanh Toán (Khách): ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ khi thanh toán.'], 500);
        }
    }

    /**
     * Gửi đánh giá (do khách hàng)
     * Logic: (Đã thanh toán) -> (Lưu Review) -> (Status: Đã hoàn thành)
     */
    public function submitReview(Request $request, $id)
    {
        try {
            $booking = Booking::find($id);
            if (!$booking) {
                return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
            }

            // Chỉ được đánh giá nếu đã "Thanh toán" (hoặc "Đã hoàn thành" - nếu lỡ)
            if ($booking->status !== 'Đã thanh toán' && $booking->status !== 'Đã hoàn thành') {
                return response()->json(['message' => 'Bạn chưa thể đánh giá đơn này.'], 400);
            }
            
            // Kiểm tra xem đã đánh giá đơn này chưa
            $existingReview = Review::where('booking_id', $id)->first();
            if ($existingReview) {
                 return response()->json(['message' => 'Bạn đã đánh giá đơn này rồi.'], 400);
            }

            // === SỬA LẠI VALIDATOR THEO YÊU CẦU ===
            // (Yêu cầu cả 2 trường)
            $validator = Validator::make($request->all(), [
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'required|string|max:1000', // Đổi 'nullable' -> 'required'
            ], [
                'rating.required' => 'Vui lòng chọn số sao.',
                'comment.required' => 'Vui lòng nhập nội dung đánh giá.',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Tạo đánh giá
            Review::create([
                'booking_id' => $booking->id,
                'room_id' => $booking->room_id,
                'user_id' => $booking->user_id,
                'rating' => $request->rating,
                // Sửa lại tên cột: Giả sử cột CSDL là 'review' (như bạn comment)
                // nhưng Validator dùng 'comment' (như code bạn gửi).
                // Tôi sẽ dùng 'comment' cho cả 2 để nhất quán.
                // Nếu cột CSDL của bạn tên là 'review', hãy đổi 'comment' dưới đây thành 'review'
                'review' => $request->comment, 
            ]);
            
            // Đổi status booking thành 'Đã hoàn thành'
            $booking->status = 'Đã hoàn thành';
            $booking->save();

            return response()->json(['success' => true, 'message' => 'Gửi đánh giá thành công.']);
        
        } catch (\Exception $e) {
            Log::error('Lỗi Gửi Đánh Giá (Khách): ' . $e->getMessage());
            return response()->json(['message' => 'Lỗi máy chủ khi gửi đánh giá.'], 500);
        }
    }
}