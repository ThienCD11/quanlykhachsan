<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Suggestion; // Model cho Góp ý
use App\Models\Review;     // Model cho Đánh giá
use Carbon\Carbon;         // Thư viện xử lý Ngày/Giờ

class StaFeedbackController extends Controller
{
    /**
     * Lấy danh sách Góp ý (từ bảng suggestions).
     */
    public function getSuggestions()
    {
        // Sắp xếp góp ý mới nhất lên đầu
        $suggestions = Suggestion::orderBy('created_at', 'desc')->get();

        // Định dạng lại dữ liệu
        $formattedData = $suggestions->map(function ($item, $index) {
            return [
                'stt' => $index + 1,
                'name' => $item->name,
                'email' => $item->email,
                // Format ngày: 'Ngày-tháng-năm giờ-phút-giây'
                'created_at' => Carbon::parse($item->created_at)->format('d-m-Y H:i:s'),
                'title' => $item->title,
                'content' => $item->content,
            ];
        });
        
        // Thêm JSON_UNESCAPED_UNICODE để hiển thị đúng tiếng Việt
        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Lấy danh sách Đánh giá (từ bảng reviews).
     */
    public function getReviews()
    {
        // Dùng eager loading 'with' để lấy thông tin liên kết
        // (Giả định Model Review đã có các hàm: user(), booking(), room())
        $reviews = Review::with(['user', 'booking', 'room'])
                        ->orderBy('created_at', 'desc')
                        ->get();

        // Định dạng lại dữ liệu
        $formattedData = $reviews->map(function ($item, $index) {
            return [
                'stt' => $index + 1,
                'customer_name' => $item->user->name ?? 'N/A', // Lấy tên từ user
                'invoice_id' => $item->booking->invoice_id ?? 'N/A', // Lấy mã đơn từ booking
                'room_name' => $item->room->name ?? 'N/A', // Lấy tên phòng từ room
                // Dùng thời gian TẠO review
                'created_at' => Carbon::parse($item->created_at)->format('d-m-Y H:i:s'),
                'rating' => $item->rating,
                'comment' => $item->review, // Giả sử cột CSDL là 'comment'
            ];
        });

        // Thêm JSON_UNESCAPED_UNICODE
        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }
}