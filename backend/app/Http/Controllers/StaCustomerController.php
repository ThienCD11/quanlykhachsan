<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Booking; // Import Booking để dùng hằng số status (nếu cần)
use Illuminate\Support\Facades\DB;

class StaCustomerController extends Controller
{
    /**
     * Lấy danh sách khách hàng (customer) và thống kê đơn đặt.
     */
    public function index()
    {
        // 1. Lấy tất cả user có role là 'customer'
        // 2. Dùng withCount để đếm tổng số 'bookings' liên quan
        // 3. Dùng withCount (với closure) để đếm các booking 'Đã thanh toán' hoặc 'Đã hoàn thành'
        $customersData = User::where('role', 'customer')
            ->withCount('bookings') // Tạo ra cột 'bookings_count'
            ->withCount(['bookings as paid_bookings_count' => function ($query) {
                $query->whereIn('status', ['Đã thanh toán', 'Đã hoàn thành']);
            }])
            ->orderBy('created_at', 'desc') // Sắp xếp khách hàng mới nhất lên đầu
            ->get();

        // Định dạng lại dữ liệu trả về
        $formattedData = $customersData->map(function ($customer, $index) {
            return [
                'stt' => $index + 1,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
                'address' => $customer->address,
                'total_bookings' => $customer->bookings_count, // Lấy từ withCount
                'paid_bookings' => $customer->paid_bookings_count, // Lấy từ withCount tùy chỉnh
            ];
        });

        return response()->json($formattedData, 200, [], JSON_UNESCAPED_UNICODE);
    }
}