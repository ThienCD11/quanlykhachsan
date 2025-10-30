<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Booking; 
use Illuminate\Support\Facades\Validator;
// use Illuminate\Support\Facades\Log;

class RoomController extends Controller
{
    /**
     * Hiển thị danh sách phòng, có lọc theo
     * sức chứa và ngày tháng.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Room::query();

        // 1. Lọc theo sức chứa (nếu có)
        if ($request->filled('capacity') && $request->input('capacity') > 0) {
            $query->where('capacity', '>=', $request->input('capacity'));
        } 

        // 2. Lọc theo ngày (kiểm tra phòng còn trống)
        if ($request->filled('check_in') && $request->filled('check_out')) {

            $validator = Validator::make($request->all(), [
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
            ], [
                // <<< THÊM MẢNG NÀY ĐỂ DỊCH LỖI (Giải pháp cho Q2 & Q3)
                'check_in.required' => 'Vui lòng chọn ngày nhận phòng.',
                'check_in.after_or_equal' => 'Ngày nhận phòng phải là hôm nay hoặc một ngày sau đó.', // <-- Đây là thông báo bạn muốn (Q3)
                'check_out.required' => 'Vui lòng chọn ngày trả phòng.',
                'check_out.after' => 'Ngày trả phòng phải sau ngày nhận phòng.'    
            ]);

            if (!$validator->fails()) {
                $checkIn = $request->input('check_in');
                $checkOut = $request->input('check_out');

                $query->whereDoesntHave('bookings', function ($bookingQuery) use ($checkIn, $checkOut) {
                    $bookingQuery->where(function ($q) use ($checkIn, $checkOut) {
                        $q->where('check_in', '<', $checkOut)
                          ->where('check_out', '>', $checkIn);
                    });
                });
            } else {
                return response()->json(['errors' => $validator->errors()], 422);
            }
        }

        if ($request->filled('name')) {
            $query->where('name', 'LIKE', '%' . $request->input('name') . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // 3. Lấy kết quả ĐÃ LỌC
        $filteredRooms = $query->get();
        // 4. Áp dụng map() 
        $rooms = $filteredRooms->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->name,
                'price' => $room->price,
                'image_url' => asset($room->image),
                'capacity' => $room->capacity,
                'area' => $room->area,
                'about' => $room->about,
            ];
        });

        return response()->json($rooms);
    }

    public function show(Room $room)
    {
        return response()->json([
            'id' => $room->id,
            'name' => $room->name,
            'price' => $room->price,
            'image_url' => asset($room->image),
            'capacity' => $room->capacity,
            'area' => $room->area,
            'about' => $room->about,
        ]);
    }
}