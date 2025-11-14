<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class BookingActionController extends Controller
{
    /**
     * Hủy đơn (do khách hàng)
     * Logic: (Đã đặt phòng) -> (Đã hủy)
     */
    public function customerCancel($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
        }


        // Chỉ được hủy nếu status là "Đã đặt phòng"
        if ($booking->status !== 'Đã đặt phòng') {
            return response()->json(['message' => 'Không thể hủy đơn ở trạng thái này.'], 400);
        }

        $booking->status = 'Đã hủy';
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã hủy đơn thành công.']);
    }

    /**
     * Xử lý thanh toán (do khách hàng)
     * Logic: (Đã xác nhận) -> (Đã thanh toán)
     */
    public function processPayment(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
        }

        // KIỂM TRA BẢO MẬT
        if ($booking->user_id !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền truy cập.'], 403);
        }

        // Chỉ được thanh toán nếu Admin đã "Xác nhận"
        if ($booking->status !== 'Đã xác nhận') {
            return response()->json(['message' => 'Đơn này chưa sẵn sàng để thanh toán.'], 400);
        }

        // ----
        // @TODO: XỬ LÝ LOGIC THANH TOÁN THẬT (VNPAY, MOMO...) Ở ĐÂY
        //
        // (Giả lập là thanh toán thành công)
        // ----

        $booking->status = 'Đã hủy';
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Thanh toán thành công.']);
    }

    /**
     * Gửi đánh giá (do khách hàng)
     * Logic: (Đã thanh toán) -> (Lưu đánh giá)
     */
    public function submitReview(Request $request, $id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['message' => 'Không tìm thấy đơn.'], 404);
        }

        // KIỂM TRA BẢO MẬT
        if ($booking->user_id !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền truy cập.'], 403);
        }

        // Chỉ được đánh giá nếu đã "Thanh toán" (hoặc "Đã hoàn thành" nếu admin có bước đó)
        if ($booking->status !== 'Đã thanh toán' && $booking->status !== 'Đã hoàn thành') {
            return response()->json(['message' => 'Bạn chưa thể đánh giá đơn này.'], 400);
        }
        
        // Kiểm tra xem đã đánh giá đơn này chưa
        $existingReview = Review::where('booking_id', $id)->first();
        if ($existingReview) {
             return response()->json(['message' => 'Bạn đã đánh giá đơn này rồi.'], 400);
        }

        // Validate dữ liệu gửi lên (rating, comment)
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Tạo đánh giá
        Review::create([
            'booking_id' => $booking->id,
            'room_id' => $booking->room_id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'review' => $request->review,
        ]);

        return response()->json(['success' => true, 'message' => 'Gửi đánh giá thành công.']);
    }
}
