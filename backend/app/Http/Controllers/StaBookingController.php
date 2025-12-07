<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StaBookingController extends Controller
{
    /**
     * Lấy dữ liệu thống kê booking (Admin Dashboard).
     * Bổ sung 'reviews' để kiểm tra trạng thái đánh giá.
     */
    public function index()
    {
        // Phải Eager load reviews để kiểm tra has_review
        // Chú ý: Đảm bảo đã định nghĩa reviews() trong Booking Model.
        $bookings = Booking::with(['user', 'room', 'reviews'])->orderBy('created_at', 'desc')->get()->map(function ($b, $index) {
            $checkin = Carbon::parse($b->check_in);
            $checkout = Carbon::parse($b->check_out);
            $days = $checkout->diffInDays($checkin);

            // Giữ nguyên logic tính toán, nhưng đảm bảo có has_review
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
                'has_review' => $b->reviews->count() > 0, // Dùng cho logic th5 (Hiển thị/Ẩn nút Đánh giá)
            ];
        });

        return response()->json($bookings);
    }

    /**
     * Admin: Xác nhận đơn đặt phòng (th1 -> th2: Chờ xác nhận -> Chờ thanh toán)
     */
    public function confirm($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        if ($booking->status !== 'Chờ xác nhận') {
             return response()->json(['success' => false, 'message' => 'Đơn không ở trạng thái Chờ xác nhận để xác nhận.'], 400);
        }

        $booking->status = 'Chờ thanh toán'; // th2
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã xác nhận đơn. Trạng thái chuyển sang Chờ thanh toán!']);
    }

    /**
     * Admin: Hủy đơn đặt phòng (Phân nhánh: th1/th2 -> th6 HOẶC th3 -> th7)
     */
    public function cancel($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        // Kiểm tra trạng thái không cho phép hủy
        if (in_array($booking->status, ['Đang sử dụng', 'Hoàn thành', 'Đã hủy', 'Chờ hoàn tiền', 'Đã hoàn tiền'])) {
            return response()->json(['success' => false, 'message' => 'Đơn này không thể hủy ở trạng thái hiện tại.'], 400);
        }

        // TRƯỜNG HỢP 1: HỦY KHI CHƯA THANH TOÁN (th1, th2) -> Đã hủy (th6)
        if (in_array($booking->status, ['Chờ xác nhận', 'Chờ thanh toán'])) {
            $booking->status = 'Đã hủy';
            $booking->save();
            return response()->json(['success' => true, 'message' => 'Đã hủy đặt phòng thành công.']);
        }
        
        // TRƯỜNG HỢP 2: HỦY KHI ĐÃ THANH TOÁN (th3) -> Chờ hoàn tiền (th7)
        if ($booking->status === 'Đã thanh toán') {
            $booking->status = 'Chờ hoàn tiền';
            $booking->save();
            return response()->json(['success' => true, 'message' => 'Đã hủy đơn. Trạng thái chuyển sang Chờ hoàn tiền.']);
        }
    }

    /**
     * Admin: Khách hàng đến Check-in (th3 -> th4: Đã thanh toán -> Đang sử dụng)
     */
    public function useRoom($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        if ($booking->status !== 'Đã thanh toán') {
             return response()->json(['success' => false, 'message' => 'Chỉ có thể sử dụng đơn đã Đã thanh toán.'], 400);
        }

        $booking->status = 'Đang sử dụng'; // th4
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã xác nhận Check-in. Trạng thái chuyển sang Đang sử dụng.']);
    }

    /**
     * Admin: Khách hàng Check-out (th4 -> th5: Đang sử dụng -> Hoàn thành)
     */
    public function completeRoom($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        if ($booking->status !== 'Đang sử dụng') {
             return response()->json(['success' => false, 'message' => 'Chỉ có thể hoàn thành đơn đang Đang sử dụng.'], 400);
        }

        $booking->status = 'Hoàn thành'; // th5
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã xác nhận Check-out. Trạng thái chuyển sang Hoàn thành.']);
    }
    
    /**
     * Admin: Hoàn tiền (th7 -> th8: Chờ hoàn tiền -> Đã hoàn tiền)
     */
    public function refund($id)
    {
        $booking = Booking::find($id);
        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn!'], 404);
        }

        if ($booking->status !== 'Chờ hoàn tiền') {
             return response()->json(['success' => false, 'message' => 'Chỉ có thể hoàn tiền cho đơn đang Chờ hoàn tiền.'], 400);
        }
        
        // TODO: THỰC HIỆN LOGIC GỌI API HOÀN TIỀN CỦA VNPAY Ở ĐÂY

        $booking->status = 'Đã hoàn tiền'; // th8
        $booking->save();

        return response()->json(['success' => true, 'message' => 'Đã hoàn tiền thành công. Trạng thái chuyển sang Đã hoàn tiền.']);
    }
}