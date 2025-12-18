<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        $request->validate([
        'booking_id' => 'required|integer',
        'amount' => 'required'
    ]);

        $bookingId = $request->booking_id;
        $rawAmount = $request->amount;

        // Loại bỏ ký tự không phải số
        $amountNumber = preg_replace('/[^0-9]/', '', $rawAmount);

        $amount = (int)$amountNumber * 100;


        $vnp_TmnCode = env('VNPAY_TMN_CODE');
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $vnp_Url = env('VNPAY_URL');
        $vnp_ReturnUrl = env('VNPAY_RETURN_URL');

        $vnp_TxnRef = time(); // Mã giao dịch
        $vnp_OrderInfo = "Thanh toan don hang #" . $bookingId;
        $vnp_OrderType = "billpayment";
        $vnp_Locale = "vn";
        $vnp_IpAddr = request()->ip();

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef
        ];

        ksort($inputData);

        $hashdata = "";
        $query = "";
        foreach ($inputData as $key => $value) {
            $hashdata .= ($hashdata ? '&' : '') . urlencode($key) . "=" . urlencode($value);
            $query .= urlencode($key) . "=" . urlencode($value) . "&";
        }

        $vnp_SecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $paymentUrl = $vnp_Url . "?" . $query . "vnp_SecureHash=" . $vnp_SecureHash;

        // Lưu log giao dịch
        DB::table('payments')->insert([
            'booking_id' => $bookingId,
            'txn_ref' => $vnp_TxnRef,
            'amount' => $amount / 100,
            'status' => 'pending',
            'created_at' => now()
        ]);

        return response()->json([
            'paymentUrl' => $paymentUrl
        ]);
    }

    public function callback(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET');
        $inputData = $request->all();

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash'], $inputData['vnp_SecureHashType']);

        ksort($inputData);

        $hashData = "";
        foreach ($inputData as $key => $value) {
            $hashData .= ($hashData ? '&' : '') . urlencode($key) . "=" . urlencode($value);
        }

        $checkHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        if ($checkHash !== $vnp_SecureHash) {
            return response()->json([
                'success' => false,
                'message' => 'Sai chữ ký'
            ]);
        }

        if ($request->vnp_ResponseCode === '00') {
            DB::table('payments')
                ->where('txn_ref', $request->vnp_TxnRef)
                ->update(['status' => 'success']);

            DB::table('bookings')
                ->where('id', function ($q) use ($request) {
                    $q->select('booking_id')
                      ->from('payments')
                      ->where('txn_ref', $request->vnp_TxnRef);
                })
                ->update(['status' => 'Đã thanh toán']);

            return response()->json([
                'success' => true
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Thanh toán thất bại'
        ]);
    }
}
