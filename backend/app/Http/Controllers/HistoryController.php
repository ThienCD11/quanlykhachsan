<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Booking;
use Carbon\Carbon;

class HistoryController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'User ID không hợp lệ.', 'errors' => $validator->errors()], 422);
        } 

        $userId = $request->query('user_id');

        $bookings = Booking::where('user_id', $userId)
                            ->with(['room', 'reviews']) 
                            ->orderBy('created_at', 'desc')
                            ->get();

        $historyData = $bookings->map(function ($booking) {
            $checkIn = Carbon::parse($booking->check_in);
            $checkOut = Carbon::parse($booking->check_out);
            $numberOfDays = $checkOut->diffInDays($checkIn);
            
            $pricePerNight = $booking->room ? $booking->room->price : $booking->price;
            $totalPrice = $pricePerNight * $numberOfDays;

            return [
                'id' => $booking->id,
                'room_name' => $booking->room ? $booking->room->name : 'Phòng không xác định',
                'price_per_night' => number_format($pricePerNight, 0, ',', '.') . ' VND',
                'check_in' => $checkIn->format('d-m-Y'),
                'check_out' => $checkOut->format('d-m-Y'),
                'total_price' => number_format($totalPrice, 0, ',', '.') . ' VND',
                'invoice_id' => $booking->invoice_id,
                'booked_at' => Carbon::parse($booking->created_at)->format('d-m-Y'),
                'status' => $booking->status, 
                'has_review' => $booking->reviews->count() > 0,
            ];
        });

        return response()->json($historyData);
    }
}