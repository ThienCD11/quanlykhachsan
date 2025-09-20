<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = [
            ["id" => 1, "name" => "Game", "icon" => "🎮"],
            ["id" => 2, "name" => "Bồn tắm", "icon" => "🛁"],
            ["id" => 3, "name" => "Radio", "icon" => "📻"],
            ["id" => 4, "name" => "TV", "icon" => "📺"],
            ["id" => 5, "name" => "Giường", "icon" => "🛌"],
        ];
        return response()->json($facilities);
    }
}
