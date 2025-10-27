<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $rooms = Room::all()->map(function ($room) {
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
        // Nhờ Route Model Binding, Laravel đã tự động tìm thấy
        // phòng có ID tương ứng và inject nó vào biến $room.

        // Chúng ta cần trả về dữ liệu với cấu trúc tương tự như hàm index()
        // để frontend có thể đọc được, đặc biệt là trường 'image_url'
        return response()->json([
            'id' => $room->id,
            'name' => $room->name,
            'price' => $room->price,
            'image_url' => asset($room->image), // Dùng asset() để có đường dẫn đầy đủ
            'capacity' => $room->capacity,
            'area' => $room->area,
            'about' => $room->about,
        ]);
    }
}

