<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Lấy thông tin user hiện tại
     */
    public function getProfile()
    {
        try {
            $user = Auth::user();
            
            return response()->json([
                'success' => true,
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật thông tin cá nhân
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            // Validate dữ liệu
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'phone' => 'nullable|string|max:15',
                'address' => 'nullable|string|max:255',
                'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            ], [
                'name.required' => 'Tên không được để trống',
                'name.max' => 'Tên không được vượt quá 255 ký tự',
                'email.required' => 'Email không được để trống',
                'email.email' => 'Email không hợp lệ',
                'email.unique' => 'Email đã được sử dụng',
                'phone.max' => 'Số điện thoại không được vượt quá 15 ký tự',
                'address.max' => 'Địa chỉ không được vượt quá 255 ký tự',
                'avatar.image' => 'File phải là ảnh',
                'avatar.mimes' => 'Ảnh phải có định dạng: jpeg, jpg, png, gif',
                'avatar.max' => 'Kích thước ảnh không được vượt quá 2MB',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Cập nhật thông tin cơ bản
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone ?? '';
            $user->address = $request->address ?? '';

            // Xử lý upload ảnh đại diện
            if ($request->hasFile('avatar')) {
                // Xóa ảnh cũ nếu có
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }

                // Lưu ảnh mới
                $file = $request->file('avatar');
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $avatarPath = $file->storeAs('avatars', $fileName, 'public');
                $user->avatar = $avatarPath;
            }

            // Lưu vào database
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Update Profile Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật thông tin',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Đổi mật khẩu
     */
    public function changePassword(Request $request)
    {
        try {
            $user = Auth::user();

            // Validate dữ liệu
            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:6',
                'new_password_confirmation' => 'required|string|same:new_password',
            ], [
                'current_password.required' => 'Vui lòng nhập mật khẩu hiện tại',
                'new_password.required' => 'Vui lòng nhập mật khẩu mới',
                'new_password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự',
                'new_password_confirmation.required' => 'Vui lòng xác nhận mật khẩu mới',
                'new_password_confirmation.same' => 'Mật khẩu xác nhận không khớp',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không hợp lệ',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Kiểm tra mật khẩu hiện tại
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu hiện tại không đúng'
                ], 401);
            }

            // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
            if (Hash::check($request->new_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
                ], 422);
            }

            // Cập nhật mật khẩu mới
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Đổi mật khẩu thành công'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Change Password Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đổi mật khẩu',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Xóa ảnh đại diện
     */
    public function deleteAvatar()
    {
        try {
            $user = Auth::user();

            // Xóa ảnh khỏi storage
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Cập nhật database
            $user->avatar = null;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Xóa ảnh đại diện thành công',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Delete Avatar Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xóa ảnh',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy danh sách tất cả users (Admin only - nếu cần)
     */
    public function getAllUsers()
    {
        try {
            $users = \App\Models\User::all();
            
            return response()->json([
                'success' => true,
                'users' => $users
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Lấy thông tin user theo ID (Admin only - nếu cần)
     */
    public function getUserById($id)
    {
        try {
            $user = \App\Models\User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy user'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}