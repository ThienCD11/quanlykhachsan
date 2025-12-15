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
    // public function toggleActive(User $user)
    // {
    //     // Kiểm tra an toàn: Không cho phép vô hiệu hóa Admin khác
    //     if ($user->role === 'admin' && $user->id !== auth()->id()) {
    //          return response()->json(['message' => 'Không thể vô hiệu hóa tài khoản Admin khác.'], 403);
    //     }

    //     // Đảo ngược trạng thái
    //     $user->is_active = !$user->is_active;
    //     $user->save();

    //     $action = $user->is_active ? 'Kích hoạt' : 'Vô hiệu hóa';

    //     return response()->json([
    //         'message' => "Tài khoản '{$user->name}' đã được {$action} thành công.",
    //         'is_active' => $user->is_active
    //     ]);
    // }
    public function toggleActive(User $user)
    {
        // Kiểm tra an toàn: Không cho phép vô hiệu hóa Admin khác
        if ($user->role === 'admin' && $user->id !== auth()->id()) {
             return response()->json(['message' => 'Không thể vô hiệu hóa tài khoản Admin khác.'], 403);
        }

        // --- YÊU CẦU 1: VÔ HIỆU HÓA ---
        // $user->is_active là true nghĩa là tài khoản đang hoạt động và sắp bị Vô hiệu hóa
        $isDeactivating = $user->is_active;

        if ($isDeactivating) {
            // Đếm các đơn đặt phòng ĐANG TIẾP DIỄN/CHƯA HOÀN THÀNH
            // Sử dụng các trạng thái thường là 'đang có đơn đặt phòng'
            $ongoingBookingCount = $user->bookings()
                ->whereIn('status', ['Chờ xác nhận', 'Chờ thanh toán', 'Đã thanh toán', 'Đang sử dụng', 'Chờ hoàn tiền'])
                ->count();

            if ($ongoingBookingCount > 0) {
                return response()->json([
                    'message' => "Không thể vô hiệu hóa tài khoản '{$user->name}' vì còn {$ongoingBookingCount} đơn đặt phòng đang diễn ra.",
                ], 400); // 400 Bad Request
            }
        }
        // --- KẾT THÚC YÊU CẦU 1 ---


        // Đảo ngược trạng thái
        $user->is_active = !$user->is_active;
        $user->save();

        $action = $user->is_active ? 'Kích hoạt' : 'Vô hiệu hóa';

        return response()->json([
            'message' => "Tài khoản '{$user->name}' đã được {$action} thành công.",
            'is_active' => $user->is_active
        ]);
    }

    /**
     * Xóa vĩnh viễn tài khoản người dùng và dữ liệu liên quan.
     */
    public function destroy(User $user)
    {
        // Kiểm tra an toàn: Không cho phép xóa Admin khác hoặc tài khoản của chính mình
        if ($user->role === 'admin' || $user->id === auth()->id()) {
             return response()->json(['message' => 'Không thể xóa tài khoản Admin hoặc tài khoản của chính bạn.'], 403);
        }
        
        DB::beginTransaction();
        try {
            // Xóa tất cả Booking của user này
            $user->bookings()->delete(); 
            
            // Xóa tất cả Review của user này
            $user->reviews()->delete();
            
            // Xóa tất cả Suggestion của user này
            // $user->suggestions()->delete(); // <-- Đã thêm xóa Suggestion
            
            // Xóa người dùng
            $user->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            // Ghi log lỗi để debug
            \Log::error("Lỗi xóa user ID: {$user->id}. Lỗi: " . $e->getMessage());
            return response()->json([
                'message' => 'Lỗi hệ thống: Không thể xóa dữ liệu liên quan hoặc tài khoản người dùng.',
            ], 500);
        }

        return response()->json([
            'message' => "Tài khoản '{$user->name}' và toàn bộ dữ liệu liên quan đã được xóa vĩnh viễn."
        ]);
    }
}