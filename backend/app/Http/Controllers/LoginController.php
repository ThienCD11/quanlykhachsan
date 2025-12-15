<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException; // Thường dùng cho lỗi xác thực

class LoginController extends Controller
{ 
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $password = $request->password;
        $email = $request->email;

        // 1. Tìm người dùng
        $user = User::where('email', $email)->first();

        // 2. Kiểm tra user tồn tại VÀ mật khẩu có khớp không
        if ($user && Hash::check($password, $user->password)) {
            
            // --- RÀNG BUỘC KÍCH HOẠT MỚI THÊM ---
            if (!$user->is_active) {
                // Trả về lỗi nếu tài khoản không hoạt động
                return response()->json([
                    'success' => false,
                    'message' => 'Tài khoản của bạn hiện đang bị vô hiệu hóa và không thể đăng nhập. Vui lòng liên hệ quản trị viên.'
                ], 403); // 403 Forbidden (hoặc 401 Unauthorized nếu bạn muốn gộp chung với lỗi sai mật khẩu)
            }
            // --- KẾT THÚC RÀNG BUỘC ---

            // Đăng nhập thành công
            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'success' => true,
                'user' => $user,
                'token' => $token
            ]);
        } else {
            // Sai Email hoặc mật khẩu
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc Mật khẩu không đúng'
            ], 401); 
        }
    }
}
