<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        // demo dữ liệu tĩnh (sau này sẽ lấy từ DB)
        $rooms = [
            ["id" => 1, "name" => "Phòng Deluxe", "price" => 1200000, "image_url" => "https://via.placeholder.com/200x120"],
            ["id" => 2, "name" => "Phòng Standard", "price" => 800000, "image_url" => "https://via.placeholder.com/200x120"],
            ["id" => 3, "name" => "Phòng VIP", "price" => 2500000, "image_url" => "https://via.placeholder.com/200x120"],
        ];
        return response()->json($rooms);
    }
}
