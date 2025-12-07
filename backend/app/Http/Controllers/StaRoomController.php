<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;

class StaRoomController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $rooms = Room::select(['id', 'name', 'price', 'capacity'])
            ->withCount(['bookings', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->get();

        $occupiedRoomIds = Booking::where('check_in', '<=', $today)
            ->where('check_out', '>', $today)
            ->whereIn('status', ['Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng'])
            ->pluck('room_id')
            ->unique();

        $formattedData = $rooms->map(function ($room, $index) use ($occupiedRoomIds) {
            $status = $occupiedRoomIds->contains($room->id) ? 'Đang có khách' : 'Đang trống';

            return [
                'stt' => $index + 1,
                'name' => $room->name,
                'price' => number_format($room->price ?? 0, 0, ',', '.'),
                'capacity' => $room->capacity,
                'bookings_count' => $room->bookings_count,
                'reviews_count' => $room->reviews_count,
                'rating_avg' => $room->reviews_avg_rating ? round($room->reviews_avg_rating, 1) : 'Chưa có',
                'status' => $status,
            ];
        });

        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }
}