<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\ResetPasswordMail;

class PasswordController extends Controller
{
    // 1. Gửi mã OTP
    public function sendResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $code = random_int(100000, 999999);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $code,
                'created_at' => now()
            ]
        );

        Mail::to($request->email)->send(new ResetPasswordMail($code));

        return response()->json([
            'message' => 'Mã đặt lại mật khẩu đã được gửi.'
        ]);
    }

    // 2. Xác nhận OTP & đổi mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|digits:6',
            'password' => 'required|min:6|confirmed'
        ]);

        $row = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->code)
            ->first();

        if (!$row || now()->diffInMinutes($row->created_at) > 15) {
            return response()->json([
                'message' => 'Mã không hợp lệ hoặc đã hết hạn'
            ], 400);
        }

        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password)
        ]);

        DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Đặt lại mật khẩu thành công'
        ]);
    }
}
