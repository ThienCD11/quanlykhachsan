<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File; // Không dùng nữa, nhưng giữ lại nếu cần cho các hàm khác
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; // <<< ĐÃ THÊM

class StaFacilityController extends Controller
{
    /**
     * Lấy danh sách tiện nghi
     */
    public function index()
    {
        $facilities = Facility::select(['id', 'name', 'icon', 'description'])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($facilities, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Thêm tiện nghi mới
     */
    public function store(Request $request)
    {
        // Validation (Giữ nguyên)
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:facilities,name',
            'description' => 'required|string',
            'icon' => 'required|image|mimes:jpeg,jpg,png,svg|max:2048', // 2MB
        ], [
            'name.required' => 'Tên tiện nghi không được để trống.',
            'name.unique' => 'Tiện nghi này đã tồn tại.',
            'description.required' => 'Mô tả không được để trống.',
            'icon.required' => 'Vui lòng chọn icon tiện nghi.',
            'icon.image' => 'File phải là hình ảnh.',
            'icon.mimes' => 'Icon phải có định dạng: JPG, PNG hoặc SVG.',
            'icon.max' => 'Dung lượng icon không được vượt quá 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $iconPath = null;
            
            if ($request->hasFile('icon')) {
                $icon = $request->file('icon');
                
                // Thư mục lưu trong disk 'public' (storage/app/public/icon)
                $directory = 'icon'; 
                
                // Tạo tên file
                $iconName = time() . '_' . uniqid() . '.' . $icon->getClientOriginalExtension();
                
                // 1. LƯU TỆP VÀO STORAGE
                // $tempPath là 'icon/tên_file.ext'
                $tempPath = $icon->storeAs($directory, $iconName, 'public'); 
                
                // 2. LƯU ĐƯỜNG DẪN VÀO DB VỚI TIỀN TỐ 'storage/'
                $iconPath = 'storage/' . $tempPath; 
            }

            // Tạo tiện nghi mới
            $facility = Facility::create([
                'name' => $request->name,
                'description' => $request->description,
                'icon' => $iconPath, // Lưu: storage/icon/tên_file.ext
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Thêm tiện nghi thành công!',
                'data' => $facility
            ], 201);

        } catch (\Exception $e) {
            // 3. XÓA ICON NẾU CÓ LỖI (Cần loại bỏ tiền tố 'storage/')
            if ($iconPath) {
                $relativePath = str_replace('storage/', '', $iconPath);
                Storage::disk('public')->delete($relativePath);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật tiện nghi
     */
    public function update(Request $request, $id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện nghi.'
            ], 404);
        }

        // Validation (Giữ nguyên)
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:facilities,name,' . $id,
            'description' => 'required|string',
            'icon' => 'nullable|image|mimes:jpeg,jpg,png,svg|max:2048',
        ], [
            'name.required' => 'Tên tiện nghi không được để trống.',
            'name.unique' => 'Tiện nghi này đã tồn tại.',
            'description.required' => 'Mô tả không được để trống.',
            'icon.image' => 'File phải là hình ảnh.',
            'icon.mimes' => 'Icon phải có định dạng: JPG, PNG hoặc SVG.',
            'icon.max' => 'Dung lượng icon không được vượt quá 2MB.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $oldIconPath = $facility->icon;

            $facility->name = $request->name;
            $facility->description = $request->description;

            // Xử lý upload icon mới (nếu có)
            if ($request->hasFile('icon')) {
                // Xóa icon cũ (Dùng Storage Facade và loại bỏ tiền tố 'storage/')
                if ($oldIconPath) {
                    $oldRelativePath = str_replace('storage/', '', $oldIconPath);
                    Storage::disk('public')->delete($oldRelativePath);
                }

                // Upload icon mới
                $icon = $request->file('icon');
                $directory = 'icon'; // Thư mục lưu trong storage/app/public
                $iconName = time() . '_' . uniqid() . '.' . $icon->getClientOriginalExtension();
                
                // Lưu vào Storage
                $tempPath = $icon->storeAs($directory, $iconName, 'public');
                
                // Cập nhật DB với tiền tố 'storage/'
                $facility->icon = 'storage/' . $tempPath; 
            }

            $facility->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật tiện nghi thành công!',
                'data' => $facility
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa tiện nghi
     */
    public function destroy($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện nghi.'
            ], 404);
        }

        try {
            // Xóa icon (Dùng Storage Facade và loại bỏ tiền tố 'storage/')
            if ($facility->icon) {
                $relativePath = str_replace('storage/', '', $facility->icon);
                Storage::disk('public')->delete($relativePath);
            }

            // Xóa tiện nghi
            $facility->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa tiện nghi thành công!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy chi tiết tiện nghi
     */
    public function show($id)
    {
        $facility = Facility::find($id);

        if (!$facility) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy tiện nghi.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $facility
        ], 200);
    }
}