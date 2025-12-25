<?php
 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking;
use App\Models\Review;      // <-- Đã thêm
use App\Models\Suggestion;  // <-- Đã thêm
use Illuminate\Support\Facades\DB;

class StaCustomerController extends Controller
{
    /**
     * Lấy danh sách khách hàng (customer) và thống kê đơn đặt.
     */
    public function index()
    {
        // Thêm cột 'is_active' vào select để trả về cho Frontend
        // $customersData = User::where('role', 'customer')
        $customersData = User::query()
            ->withCount('bookings')
            ->withCount(['bookings as paid_bookings_count' => function ($query) {
                // Đếm các đơn đã thanh toán: Đã thanh toán (th3), Đang sử dụng (th4), Hoàn thành (th5)
                $query->whereIn('status', ['Đã thanh toán', 'Đang sử dụng', 'Hoàn thành']);
            }])
            ->orderBy('id', 'desc')
            ->get();

        $formattedData = $customersData->map(function ($customer, $index) {
            $paidBookingsCount = $customer->paid_bookings_count ?? 0;
            
            return [
                'stt' => $index + 1,
                'id' => $customer->id, // <-- QUAN TRỌNG: Thêm ID thật để gửi lên API
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'address' => $customer->address,
                'role' => $customer->role, // Trả về role hiện tại
                'is_active' => $customer->is_active, // <-- Trạng thái hoạt động
                'total_bookings' => $customer->bookings_count,
                'paid_bookings' => $paidBookingsCount,
            ];
        });

        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }

    /**
     * Nâng cấp vai trò của người dùng lên 'admin'.
     */
    public function promoteAdmin(User $user)
    {
        // Kiểm tra an toàn: Không cho phép tự nâng cấp/hạ cấp tài khoản của chính mình
        if ($user->id === auth()->id()) {
             return response()->json(['message' => 'Bạn không thể thay đổi vai trò của chính mình.'], 403);
        }
        
        $user->role = 'admin';
        $user->save();

        return response()->json([
            'message' => "Người dùng '{$user->name}' đã được nâng cấp lên Admin thành công.",
            'new_role' => $user->role
        ]);
    }

    /**
     * Vô hiệu hóa (hoặc kích hoạt) tài khoản.
     */
    public function toggleActive(User $user)
    {
        if ($user->role === 'admin' && $user->id !== auth()->id()) {
             return response()->json(['message' => 'Không thể thao tác trên tài khoản Admin khác.'], 403);
        }

        // Chặn vô hiệu hóa nếu đang có đơn hoạt động
        if ($user->is_active) {
            $ongoingBookingCount = $user->bookings()
                ->whereIn('status', ['Chờ xác nhận', 'Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng', 'Chờ hoàn tiền'])
                ->count();

            if ($ongoingBookingCount > 0) {
                return response()->json([
                    'message' => "Không thể vô hiệu hóa tài khoản '{$user->name}' vì còn {$ongoingBookingCount} đơn đặt phòng chưa kết thúc.",
                ], 422); // Trả về 422 để khớp với logic xử lý lỗi FE
            }
        }

        $user->is_active = !$user->is_active;
        $user->save();

        $action = $user->is_active ? 'Kích hoạt' : 'Vô hiệu hóa';
        return response()->json([
            'message' => "Tài khoản '{$user->name}' đã được {$action} thành công.",
            'is_active' => $user->is_active
        ]);
    }

    /**
     * Xóa vĩnh viễn tài khoản (Chỉ khi không còn đơn hoạt động)
     */
    public function destroy(User $user)
    {
        if ($user->role === 'admin' || $user->id === auth()->id()) {
             return response()->json(['message' => 'Không thể xóa tài khoản Admin hoặc tài khoản của chính bạn.'], 403);
        }

        // 1. Kiểm tra đơn hàng đang hoạt động
        $ongoingBookingCount = $user->bookings()
            ->whereIn('status', ['Chờ xác nhận', 'Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng', 'Chờ hoàn tiền'])
            ->count();

        if ($ongoingBookingCount > 0) {
            return response()->json([
                'message' => "Không thể xóa tài khoản này vì còn {$ongoingBookingCount} đơn đặt phòng chưa kết thúc!",
            ], 422);
        }
        
        DB::beginTransaction();
        try {
            // 2. Xóa sạch lịch sử liên quan (Đơn cũ, đánh giá...)
            $user->bookings()->delete(); 
            $user->reviews()->delete();
            // $user->suggestions()->delete(); 
            
            $user->delete();
            DB::commit();

            return response()->json([
                'message' => "Tài khoản '{$user->name}' và toàn bộ lịch sử đã được xóa vĩnh viễn."
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Lỗi hệ thống: ' . $e->getMessage()], 500);
        }
    }
}