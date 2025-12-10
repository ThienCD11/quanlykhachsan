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

        $rooms = Room::select(['id', 'name', 'price', 'capacity', 'area', 'about', 'image'])
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
                'id' => $room->id,
                'name' => $room->name,
                'price' => number_format($room->price ?? 0, 0, ',', '.'), // Formatted cho hiển thị
                'price_raw' => $room->price, // Raw value cho edit
                'capacity' => $room->capacity,
                'area' => $room->area, // Thêm area
                'about' => $room->about, // Thêm about
                'bookings_count' => $room->bookings_count,
                'reviews_count' => $room->reviews_count,
                'rating_avg' => $room->reviews_avg_rating ? round($room->reviews_avg_rating, 1) : 'Chưa có',
                'status' => $status,
                'image' => $room->image, // Image path
            ];
        });

        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Thêm phòng mới
     */
    public function store(Request $request)
    {
        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'about' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'required|image|mimes:jpeg,jpg,png|max:5120', // 5MB
        ], [
            'name.required' => 'Tên phòng không được để trống.',
            'about.required' => 'Mô tả phòng không được để trống.',
            'price.required' => 'Giá phòng không được để trống.',
            'price.numeric' => 'Giá phòng phải là số.',
            'price.min' => 'Giá phòng phải lớn hơn hoặc bằng 0.',
            'capacity.required' => 'Sức chứa không được để trống.',
            'capacity.integer' => 'Sức chứa phải là số nguyên.',
            'capacity.min' => 'Sức chứa phải lớn hơn hoặc bằng 1.',
            'image.required' => 'Vui lòng chọn hình ảnh phòng.',
            'image.image' => 'File phải là hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng: JPG, JPEG, PNG.',
            'image.max' => 'Dung lượng hình ảnh không được vượt quá 5MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            // Xử lý upload ảnh
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                // storeAs trả về 'room/filename.jpg'
                // Thêm 'storage/' prefix để đường dẫn đầy đủ là 'storage/room/filename.jpg'
                $storedPath = $image->storeAs('room', $imageName, 'public');
                $imagePath = 'storage/' . $storedPath; // Kết quả: storage/room/filename.jpg
            }

            // Tạo phòng mới
            $room = Room::create([
                'name' => $request->name,
                'about' => $request->about,
                'price' => $request->price,
                'capacity' => $request->capacity,
                'area' => $request->area ?? 0, // Giá trị mặc định là 0 nếu không có
                'image' => $imagePath,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thêm phòng thành công!',
                'data' => $room
            ], 201);

        } catch (\Exception $e) {
            // Xóa ảnh nếu có lỗi (bỏ storage/ prefix khi xóa)
            if ($imagePath) {
                $deleteImagePath = str_replace('storage/', '', $imagePath);
                if (Storage::disk('public')->exists($deleteImagePath)) {
                    Storage::disk('public')->delete($deleteImagePath);
                }
            }

            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin phòng
     */
    public function update(Request $request, $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phòng.'
            ], 404);
        }

        // Validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'about' => 'required|string',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:5120', // 5MB
        ], [
            'name.required' => 'Tên phòng không được để trống.',
            'about.required' => 'Mô tả phòng không được để trống.',
            'price.required' => 'Giá phòng không được để trống.',
            'price.numeric' => 'Giá phòng phải là số.',
            'price.min' => 'Giá phòng phải lớn hơn hoặc bằng 0.',
            'capacity.required' => 'Sức chứa không được để trống.',
            'capacity.integer' => 'Sức chứa phải là số nguyên.',
            'capacity.min' => 'Sức chứa phải lớn hơn hoặc bằng 1.',
            'image.image' => 'File phải là hình ảnh.',
            'image.mimes' => 'Hình ảnh phải có định dạng: JPG, JPEG, PNG.',
            'image.max' => 'Dung lượng hình ảnh không được vượt quá 5MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $oldImagePath = $room->image;

            // Cập nhật thông tin cơ bản
            $room->name = $request->name;
            $room->about = $request->about;
            $room->price = $request->price;
            $room->capacity = $request->capacity;
            $room->area = $request->area ?? 0; // Giá trị mặc định là 0 nếu không có

            // Xử lý upload ảnh mới (nếu có)
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ
                if ($oldImagePath && Storage::disk('public')->exists(str_replace('storage/', '', $oldImagePath))) {
                    Storage::disk('public')->delete(str_replace('storage/', '', $oldImagePath));
                }

                // Upload ảnh mới
                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $storedPath = $image->storeAs('room', $imageName, 'public');
                $room->image = 'storage/' . $storedPath; // Thêm storage/ prefix
            }

            $room->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật phòng thành công!',
                'data' => $room
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa phòng
     */
    public function destroy($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phòng.'
            ], 404);
        }

        try {
            // Kiểm tra xem phòng có booking nào không
            $hasBookings = Booking::where('room_id', $id)->exists();
            
            if ($hasBookings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể xóa phòng vì đã có booking liên quan.'
                ], 400);
            }

            // Xóa ảnh (bỏ storage/ prefix khi xóa)
            if ($room->image) {
                $imagePath = str_replace('storage/', '', $room->image);
                if (Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }

            // Xóa phòng
            $room->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa phòng thành công!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết phòng
     */
    public function show($id)
    {
        $room = Room::with(['reviews', 'bookings'])->find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy phòng.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $room
        ], 200);
    }
}