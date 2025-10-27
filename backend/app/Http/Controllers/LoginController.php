<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// 1. Sử dụng Model User thay vì DB::table
use App\Models\User;
// 2. Import thư viện Hash để kiểm tra mật khẩu
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = $request->phone;
        $password = $request->password;

        // 3. Tìm người dùng bằng Model
        // (Hãy đảm bảo bạn đã tạo model User: php artisan make:model User)
        $user = User::where('phone', $phone)->first();

        // 4. Kiểm tra user tồn tại VÀ mật khẩu đã mã hóa có khớp không
        if ($user && Hash::check($password, $user->password)) {
            // Đăng nhập thành công
            return response()->json([
                'success' => true,
                'user' => $user // Trả về toàn bộ thông tin user (bao gồm cả 'role')
            ]);
        } else {
            // Sai SĐT hoặc mật khẩu
            return response()->json([
                'success' => false,
                'message' => 'Số điện thoại hoặc Mật khẩu không đúng'
            ], 401); // 401: Lỗi xác thực
        }
    }
}