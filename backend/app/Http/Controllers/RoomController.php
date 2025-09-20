<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        // demo dữ liệu tĩnh (sau này sẽ lấy từ DB)
        $rooms = [
            ["id" => 1, "name" => "Phòng Deluxe", "price" => 1200000, "image_url" => asset("storage/room/1.png")],
            ["id" => 2, "name" => "Phòng Standard", "price" => 800000, "image_url" => asset("storage/room/2.png")],
            ["id" => 3, "name" => "Phòng VIP", "price" => 2500000, "image_url" => asset("storage/room/3.png")],
        ];
        return response()->json($rooms);
    }
}
