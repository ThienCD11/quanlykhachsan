<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    // Lấy đánh giá theo phòng
    public function getReviewsByRoom($roomId)
    {
        $reviews = Review::with('user')
            ->where('room_id', $roomId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($reviews);
    }

    // Lấy đánh giá theo user (kèm thông tin phòng)
    public function getReviewsByUser($userId)
    {
        $reviews = Review::with('room', 'booking')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($reviews);
    }

    // Xóa đánh giá
    public function deleteReview($id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->delete();
            
            return response()->json([
                'message' => 'Xóa đánh giá thành công!'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Không thể xóa đánh giá.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}