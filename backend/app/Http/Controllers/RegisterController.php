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
        // 1. Xác thực dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            // 'phone' => 'required|string|max:15|unique:users,phone',
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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
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
