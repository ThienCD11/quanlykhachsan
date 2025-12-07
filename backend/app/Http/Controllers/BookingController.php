<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Room;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Lưu một booking mới vào database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // 1. Validate dữ liệu gửi lên (giữ nguyên)
        $validator = Validator::make($request->all(), [
            'room_id' => 'required|integer|exists:rooms,id',
            'user_id' => 'required|integer|exists:users,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'price' => 'required|numeric|min:0',

            'check_in' => [
                'required',
                'date',
                'after_or_equal:today',
                
                // --- BẮT ĐẦU QUY TẮC TÙY CHỈNH ---
                function ($attribute, $value, $fail) use ($request) {
                    // $value chính là 'check_in'
                    $checkIn = $value;
                    // Lấy các giá trị khác từ request
                    $checkOut = $request->input('check_out');
                    $roomId = $request->input('room_id');

                    // Nếu check_out hoặc room_id không tồn tại (sẽ bị các rule khác bắt), thì bỏ qua rule này
                    if (!$checkOut || !$roomId) {
                        return;
                    }

                    // Query để tìm các booking bị chồng lấn
                    $overlappingBookings = Booking::where('room_id', $roomId)
                        ->where(function ($query) use ($checkIn, $checkOut) {
                            $query->where('check_in', '<', $checkOut)  // check_in mới < check_out cũ
                                  ->where('check_out', '>', $checkIn); // check_out mới > check_in cũ
                        })
                        ->exists(); // Trả về true nếu tìm thấy dù chỉ 1

                    // Nếu tìm thấy (true), báo lỗi
                    if ($overlappingBookings) {
                        $fail('Phòng này đã được đặt trong khoảng thời gian bạn chọn. Vui lòng chọn ngày khác!');
                    }
                }
                // --- KẾT THÚC QUY TẮC TÙY CHỈNH ---
            ],

        ], [
            // THÊM MẢNG THÔNG BÁO TIẾNG VIỆT NÀY VÀO
            'check_in.after_or_equal' => 'Ngày nhận phòng phải là hôm nay hoặc một ngày sau đó.', 
            'check_out.after' => 'Ngày trả phòng phải sau ngày nhận phòng.'    
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();

        try {
            // 2. Lấy thông tin phòng (giữ nguyên)
            $room = Room::find($validatedData['room_id']);
            if (!$room) {
                return response()->json(['message' => 'Phòng không tồn tại.'], 404);
            }

            // 3. Tạo base invoice_id (phần đầu không đổi)
            $roomNamePrefix = strtoupper(substr($room->name, 0, 3));
            $currentDate = Carbon::now()->format('dm'); // NgàyTháng hiện tại
            
            $baseInvoiceId = $roomNamePrefix . $currentDate; // Ví dụ: 01STA2710

            // Đếm số lượng booking trong ngày hôm nay có invoice_id bắt đầu bằng $baseInvoiceId
            $todayBookingsCount = Booking::where('invoice_id', 'like', $baseInvoiceId . 'S%')
                                        ->whereDate('created_at', Carbon::today())
                                        ->count();

            // Tạo số thứ tự (S1, S2, ...)
            $sequenceNumber = $todayBookingsCount + 1;
            $invoiceId = $baseInvoiceId . 'S' . $sequenceNumber; // Ví dụ: 01STA2710S1


            // 4. Chuẩn bị dữ liệu để tạo Booking (giữ nguyên)
            $bookingData = [
                'room_id' => $validatedData['room_id'],
                'user_id' => $validatedData['user_id'],
                'check_in' => $validatedData['check_in'],
                'check_out' => $validatedData['check_out'],
                'price' => $validatedData['price'],
                'invoice_id' => $invoiceId, // Sử dụng invoiceId mới
                'status' => 'Chờ xác nhận',
            ];

            // 5. Tạo booking mới (giữ nguyên)
            $booking = Booking::create($bookingData);

            // 6. Trả về response thành công (giữ nguyên)
            return response()->json([
                'success' => true,
                'message' => 'Đặt phòng thành công!',
                'data' => $booking->load(['room', 'user'])
            ], 201);

        } catch (\Exception $e) { // Giữ nguyên phần catch lỗi
            Log::error('Error creating booking: '.$e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Đã có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.',
            ], 500);
        }
    }
}