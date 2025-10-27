<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Facility;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $facilities = Facility::all()->map(function ($facilities) {
            return [
                'name' => $facilities->name,
                'icon' => asset($facilities->icon),
                'description' => $facilities->description,
            ];
        });
        return response()->json($facilities);
    }
}
