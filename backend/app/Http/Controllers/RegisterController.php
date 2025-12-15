<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
        // Định nghĩa các quy tắc xác thực
        $rules = [
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'regex:/^0\d{9}$/',
                'unique:users,phone'
            ], 
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'address' => 'required|string|max:255',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ];

        // --- ĐỊNH NGHĨA CÁC THÔNG BÁO TIẾNG VIỆT TÙY CHỈNH ---
        $messages = [
            'name.required' => 'Trường Tên không được để trống.',
            'name.string' => 'Tên phải là chuỗi ký tự.',
            'name.max' => 'Tên không được vượt quá 50 ký tự.',
            
            'phone.required' => 'Trường Số điện thoại không được để trống.',
            'phone.string' => 'Số điện thoại phải là chuỗi ký tự.',
            'phone.regex' => 'Định dạng số điện thoại không hợp lệ (Phải bắt đầu bằng 0 và có 10 chữ số).', // Sửa lỗi này
            'phone.unique' => 'Số điện thoại này đã được đăng ký.',

            'email.required' => 'Trường Email không được để trống.',
            'email.email' => 'Email phải là định dạng email hợp lệ.',
            'email.unique' => 'Email này đã được đăng ký.',

            'password.required' => 'Trường Mật khẩu không được để trống.',
            'password.string' => 'Mật khẩu phải là chuỗi ký tự.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed' => 'Xác nhận mật khẩu không khớp.',

            'address.required' => 'Trường Địa chỉ không được để trống.',
            'address.string' => 'Địa chỉ phải là chuỗi ký tự.',
            'address.max' => 'Địa chỉ không được vượt quá 50 ký tự.',

            'avatar.image' => 'File tải lên phải là hình ảnh.',
            'avatar.mimes' => 'Hình ảnh phải có định dạng JPG, JPEG hoặc PNG.',
            'avatar.max' => 'Kích thước hình ảnh không được vượt quá 2MB.',
        ];
        // ----------------------------------------------------

        // 1. Xác thực dữ liệu đầu vào (THÊM $messages)
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                // 'message' => $validator->errors()->first(), // Chỉ lấy thông báo lỗi đầu tiên
                'message' => $validator->errors()->first()
            ], 422);
        }

        // 2. Xử lý upload avatar nếu có
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
        }

        // 3. Lưu vào DB
        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'avatar' => $avatarPath,
        ]);

        // 4. Trả kết quả
        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công!',
            'user' => $user
        ], 201);
    }
}