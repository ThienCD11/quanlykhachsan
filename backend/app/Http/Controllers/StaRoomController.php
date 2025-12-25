<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StaRoomController extends Controller
{
    /**
     * Lấy danh sách phòng với thống kê
     */
    public function index()
    {
        $today = Carbon::today();

        $rooms = Room::select(['id', 'name', 'price', 'capacity', 'area', 'about', 'image', 'is_active'])
            ->withCount(['bookings', 'reviews'])
            ->withAvg('reviews', 'rating')
            ->get();

        // LẤY TẤT CẢ ID PHÒNG CÓ ĐƠN HÀNG CHƯA KẾT THÚC
        $occupiedRoomIds = Booking::whereIn('status', [
                'Chờ xác nhận', 
                'Chờ thanh toán', 
                'Đã thanh toán', 
                'Đang sử dụng', 
                'Chờ hoàn tiền'
            ])
            ->where('check_out', '>', $today) // Đơn hàng có ngày trả phòng lớn hơn hôm nay
            ->pluck('room_id')
            ->unique()
            ->toArray();

        $formattedData = $rooms->map(function ($room, $index) use ($occupiedRoomIds) {
            if (!$room->is_active) {
                $status = 'Đang bảo trì';
            } else {
                // Kiểm tra xem ID phòng có nằm trong danh sách bận không
                $status = in_array($room->id, $occupiedRoomIds) ? 'Đang có khách' : 'Đang trống';
            }

            return [
                'stt' => $index + 1,
                'id' => $room->id,
                'name' => $room->name,
                'price' => number_format($room->price ?? 0, 0, ',', '.'),
                'price_raw' => $room->price,
                'capacity' => $room->capacity,
                'area' => $room->area,
                'about' => $room->about,
                'bookings_count' => $room->bookings_count,
                'reviews_count' => $room->reviews_count,
                'rating_avg' => $room->reviews_avg_rating ? round($room->reviews_avg_rating, 1) : 'Chưa có',
                'status' => $status,
                'is_active' => $room->is_active,
                'image' => $room->image,
            ];
        });

        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Bật/Tắt trạng thái bảo trì (Có kiểm tra phòng trống)
     */
    public function toggleStatus($id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['success' => false, 'message' => 'Không tìm thấy phòng.'], 404);

        // Nếu đang hoạt động (is_active = 1) và muốn chuyển sang bảo trì
        if ($room->is_active) {
            $today = Carbon::today();
            $isOccupied = Booking::where('room_id', $id)
                ->where('check_in', '<=', $today)
                ->where('check_out', '>', $today)
                ->whereIn('status', ['Chờ xác nhận', 'Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng','Chờ hoàn tiền'])
                ->exists();

            if ($isOccupied) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Phòng đang có khách lưu trú, không thể chuyển sang trạng thái bảo trì!'
                ], 422);
            }
        }

        $room->is_active = !$room->is_active;
        $room->save();

        $msg = $room->is_active ? 'Phòng đã sẵn sàng hoạt động!' : 'Phòng đã chuyển sang trạng thái bảo trì!';
        return response()->json(['success' => true, 'message' => $msg]);
    }

    /**
     * Thêm phòng mới (giữ nguyên)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'about' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'required|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        try {
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $storedPath = $image->storeAs('room', $imageName, 'public');
                $imagePath = 'storage/' . $storedPath;
            }

            $room = Room::create([
                'name' => $request->name,
                'about' => $request->about,
                'price' => $request->price,
                'capacity' => $request->capacity,
                'area' => $request->area ?? 0,
                'image' => $imagePath,
                'is_active' => true
            ]);

            return response()->json(['success' => true, 'message' => 'Thêm phòng thành công!', 'data' => $room], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Cập nhật thông tin phòng (giữ nguyên)
     */
    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['success' => false, 'message' => 'Không tìm thấy phòng.'], 404);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'about' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        try {
            $room->name = $request->name;
            $room->about = $request->about;
            $room->price = $request->price;
            $room->capacity = $request->capacity;
            $room->area = $request->area ?? 0;

            if ($request->hasFile('image')) {
                if ($room->image && Storage::disk('public')->exists(str_replace('storage/', '', $room->image))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $room->image));
                }
                $imageName = time() . '_' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
                $storedPath = $request->file('image')->storeAs('room', $imageName, 'public');
                $room->image = 'storage/' . $storedPath;
            }

            $room->save();
            return response()->json(['success' => true, 'message' => 'Cập nhật thành công!', 'data' => $room]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Xóa phòng và toàn bộ dữ liệu liên quan (Có chặn nếu còn khách)
     */
    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['success' => false, 'message' => 'Không tìm thấy phòng.'], 404);

        try {
            // 1. Chặn xóa nếu có đơn chưa kết thúc
            $activeBookings = Booking::where('room_id', $id)
                ->whereIn('status', ['Chờ xác nhận', 'Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng', 'Chờ hoàn tiền'])
                ->exists();
            
            if ($activeBookings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa phòng này vì đang có đơn đặt phòng chưa kết thúc!'
                ], 422);
            }

            // 2. Xóa các đơn đặt phòng đã kết thúc (Lịch sử)
            Booking::where('room_id', $id)->delete();

            // 3. Xóa ảnh
            if ($room->image) {
                $imagePath = str_replace('storage/', '', $room->image);
                Storage::disk('public')->delete($imagePath);
            }

            // 4. Xóa phòng
            $room->delete();

            return response()->json(['success' => true, 'message' => 'Đã xóa phòng và toàn bộ lịch sử liên quan!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $room = Room::with(['reviews', 'bookings'])->find($id);
        return $room ? response()->json(['success' => true, 'data' => $room]) 
                    : response()->json(['success' => false, 'message' => 'Không tìm thấy phòng.'], 404);
    }
}