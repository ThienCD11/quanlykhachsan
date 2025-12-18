<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Mail\ResetPasswordMail; // Đã thêm Mailable

class PasswordController extends Controller
{
    // Bước 1: Gửi mã reset
    public function sendResetCode(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'success' => true,
                    'message' => 'Nếu email tồn tại, mã đặt lại đã được gửi.'
                ]);
            }
        
        // 1. Tạo mã 6 chữ số ngẫu nhiên
        $code = random_int(100000, 999999);
        
        // 2. Lưu mã vào bảng password_resets (sử dụng tên bảng của bạn)
        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => (string)$code,
                'created_at' => now(),
            ]
        );

        // 3. Gửi Email
        try {
            Mail::to($user->email)->send(new ResetPasswordMail($code, $user->name));
        } catch (\Exception $e) {
            // Log lỗi nếu email không gửi được 
            \Log::error("Lỗi gửi email reset password cho user {$user->email}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Lỗi hệ thống gửi email. Vui lòng kiểm tra lại cấu hình email hoặc thử lại sau.'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Mã đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.'
        ]);
    }
    
    // Bước 2: Xác thực mã và Đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|numeric|digits:6',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $resetData = DB::table('password_resets') // Tên bảng của bạn
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        // 1. Kiểm tra mã hợp lệ
        if (!$resetData) {
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực hoặc Email không hợp lệ.'
            ], 400);
        }

        // 2. Kiểm tra thời gian (15 phút)
        $expiryMinutes = 15;
        if (now()->diffInMinutes($resetData->created_at) > $expiryMinutes) {
            DB::table('password_resets')->where('email', $request->email)->delete();
            return response()->json([
                'success' => false,
                'message' => 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.'
            ], 400);
        }
        
        // 3. Cập nhật mật khẩu và xóa token
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.'
        ]);
    }
}