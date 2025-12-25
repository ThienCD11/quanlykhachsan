<?php

namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Booking; 
use Illuminate\Support\Facades\Validator;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        // Thêm điều kiện: CHỈ lấy các phòng đang hoạt động (is_active = true)
        $query = Room::query()->where('is_active', true);

        // 1. Lọc theo sức chứa
        if ($request->filled('capacity') && $request->input('capacity') > 0) {
            $query->where('capacity', '>=', $request->input('capacity'));
        } 

        // 2. Lọc theo ngày (kiểm tra phòng còn trống)
        if ($request->filled('check_in') && $request->filled('check_out')) {
            $validator = Validator::make($request->all(), [
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
            ], [
                'check_in.required' => 'Vui lòng chọn ngày nhận phòng.',
                'check_in.after_or_equal' => 'Ngày nhận phòng phải là hôm nay hoặc một ngày sau đó.',
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

        $filteredRooms = $query->get();
        
        $rooms = $filteredRooms->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->name,
                'price' => $room->price,
                'image_url' => asset($room->image),
                'capacity' => $room->capacity,
                'area' => $room->area,
                'about' => $room->about,
                'is_active' => $room->is_active, // Trả về để FE có thể dùng nếu cần
            ];
        });

        return response()->json($rooms);
    }

    public function show($id)
    {
        // Chỉnh sửa ở đây: Dùng find và kiểm tra thủ công 
        // để chặn khách truy cập trực tiếp ID phòng bảo trì qua URL
        $room = Room::where('id', $id)->where('is_active', true)->first();

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Phòng này hiện đang bảo trì hoặc không tồn tại.'
            ], 404);
        }

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