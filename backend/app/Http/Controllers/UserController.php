<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

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
            $oldEmail = $user->email;

            // 1. Đồng bộ Quy tắc (Rules) giống lúc Đăng ký
            $rules = [
                'name' => 'required|string|max:50', // Khớp với Register (max 50)
                'email' => 'required|email|unique:users,email,' . $user->id,
                'phone' => [
                    'required',
                    'string',
                    'regex:/^0\d{9}$/', // Khớp regex Register
                    'unique:users,phone,' . $user->id
                ],
                'address' => 'required|string|max:50', // Khớp với Register
                'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ];

            // 2. Đồng bộ Thông báo lỗi (Messages) giống Register
            $messages = [
                'name.required' => 'Trường Tên không được để trống.',
                'name.max' => 'Tên không được vượt quá 50 ký tự.',
                'phone.required' => 'Trường Số điện thoại không được để trống.',
                'phone.regex' => 'Định dạng số điện thoại không hợp lệ (Phải bắt đầu bằng 0 và có 10 chữ số).',
                'phone.unique' => 'Số điện thoại này đã được sử dụng.',
                'email.required' => 'Trường Email không được để trống.',
                'email.email' => 'Email phải là định dạng email hợp lệ.',
                'email.unique' => 'Email này đã được sử dụng.',
                'address.required' => 'Trường Địa chỉ không được để trống.',
                'address.max' => 'Địa chỉ không được vượt quá 50 ký tự.',
                'avatar.image' => 'File tải lên phải là hình ảnh.',
                'avatar.mimes' => 'Hình ảnh phải có định dạng JPG, JPEG hoặc PNG.',
                'avatar.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
            ];

            $validator = Validator::make($request->all(), $rules, $messages);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->errors()->first() // Lấy lỗi đầu tiên để hiển thị cho khớp FE
                ], 422);
            }

            if ($request->email !== $oldEmail) {
            // Xóa tất cả yêu cầu reset mật khẩu liên quan đến email cũ để tránh lỗi khóa ngoại
            DB::table('password_resets')->where('email', $oldEmail)->delete();
        }

            // Cập nhật thông tin
            $user->name = $request->name;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->address = $request->address;

            // Xử lý avatar
            if ($request->hasFile('avatar')) {
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $user->avatar = $avatarPath;
            }

            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật thông tin thành công!',
                'user' => $user
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
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