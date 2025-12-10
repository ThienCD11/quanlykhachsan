<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Facility;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $facilities = Facility::all()->map(function ($facility) {
            $iconUrl = null;

            if ($facility->icon) {
                // SỬ DỤNG NỐI CHUỖI TRỰC TIẾP VỚI APP_URL ĐÃ XÁC ĐỊNH
                // Kết quả: http://localhost:8000/storage/icon/tên_file.png
                $iconUrl = "http://localhost:8000/" . $facility->icon; 
            }

            return [
                'id' => $facility->id, 
                'name' => $facility->name,
                'icon' => $iconUrl, // <<< Đã là URL tuyệt đối chắc chắn
                'description' => $facility->description,
            ];
        });
        return response()->json($facilities);
    }
}