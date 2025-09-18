<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = [
            ["id" => 1, "name" => "Bể bơi", "icon" => "🏊‍♂️"],
            ["id" => 2, "name" => "Gym", "icon" => "🏋️‍♂️"],
            ["id" => 3, "name" => "Spa", "icon" => "💆‍♀️"],
        ];
        return response()->json($facilities);
    }
}
