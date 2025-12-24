<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Room;
use App\Models\Booking;
use App\Models\Facility;
use App\Models\User;
use Exception;

class ChatbotController extends Controller
{
    public function chat(Request $request)
    {
        $message = $request->input('message');
        $apiKey = env('GEMINI_API_KEY');

        if (!$message) {
            return response()->json(['success' => false, 'message' => 'Bạn chưa nhập tin nhắn!']);
        }

        try {
            // 1. Chỉ lấy những dữ liệu thực sự cần thiết để tiết kiệm Token
            $rooms = Room::all(['name', 'price', 'capacity', 'area', 'about']); 
            $facilities = Facility::all(['name', 'description']);
            
            // 2. Xử lý tra cứu Đơn hàng (Booking)
            $foundBooking = null;
            // Regex bắt các mã Invoice ID theo định dạng bạn tạo (Ví dụ: DOD2312S1)
            preg_match('/([A-Z0-9]+S[0-9]+|[A-Z0-9]{5,})/', strtoupper($message), $matches);

            if (!empty($matches)) {
                $invoiceId = $matches[0];
                // Lấy thông tin booking kèm theo thông tin User và Room
                $booking = Booking::with(['room', 'user'])
                    ->where('invoice_id', $invoiceId)
                    ->first();
                
                if ($booking) {
                    $foundBooking = [
                        'invoice_id' => $booking->invoice_id,
                        'customer_name' => $booking->user->name,
                        'room_name' => $booking->room->name,
                        'check_in' => $booking->check_in,
                        'check_out' => $booking->check_out,
                        'total_price' => number_format($booking->price) . ' VNĐ',
                        'status' => $booking->status, // Đọc trực tiếp chữ "Chờ xác nhận", "Đã thanh toán"...
                        'booked_at' => $booking->booked_at
                    ];
                }
            }

            // 3. System Prompt tối ưu để tránh trả lời dài dòng/cắt ngang
            $systemPrompt = "Bạn là trợ lý ảo TAMKA HOTEL. Nhiệm vụ của bạn:\n"
                . "1. Trả lời bằng tiếng Việt, phong cách lịch sự, ngắn gọn.\n"
                . "2. KHÔNG giải thích dài dòng. Nếu liệt kê phòng, dùng danh sách GẠCH ĐẦU DÒNG, không được dùng **.\n"
                . "3. NẾU LIỆT KÊ thông tin về phòng, phải dùng GẠCH ĐẦU DÒNG, không được dùng **.\n"
                . "4. Nếu khách hỏi về đơn hàng, dùng dữ liệu 'inquiry_result' bên dưới.\n"
                . "5. PHẢI hoàn thành câu trả lời trong tối đa 4-5 câu.\n\n"
                . "DỮ LIỆU KHÁCH SẠN:\n" . json_encode([
                    'rooms' => $rooms,
                    'amenities' => $facilities,
                    'inquiry_result' => $foundBooking,
                    'system_time' => now()->toDateTimeString()
                ], JSON_UNESCAPED_UNICODE);

            // 4. Gọi API Gemini với cơ chế chuyển đổi giữa 2 model
            $models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
            $lastResponse = null;

            foreach ($models as $model) {
                $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
                
                $response = Http::withoutVerifying()->post($url, [
                    'contents' => [
                        ['role' => 'user', 'parts' => [['text' => $systemPrompt . "\n\nKhách hàng: " . $message]]]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.5, // Giảm temperature để câu trả lời ổn định
                        'maxOutputTokens' => 800,
                        'topP' => 0.8,
                        'topK' => 40
                    ]
                ]);

                $lastResponse = $response;

                // Nếu thành công, trả về kết quả ngay lập tức
                if ($response->successful()) {
                    $result = $response->json();
                    $answer = $result['candidates'][0]['content']['parts'][0]['text'] ?? 'Tôi chưa hiểu ý bạn.';
                    
                    return response()->json([
                        'success' => true,
                        'data' => trim($answer)
                    ]);
                }

                // Nếu không phải lỗi 429 (hết hạn mức), có thể dừng sớm hoặc Log lỗi
                if ($response->status() !== 429) {
                    Log::error("Model {$model} gặp lỗi: " . $response->body());
                } else {
                    Log::warning("Model {$model} hết hạn mức, đang thử model tiếp theo...");
                }
            }

            // Xử lý lỗi sau khi đã thử tất cả các model
            if ($lastResponse && $lastResponse->status() === 429) {
                return response()->json(['success' => false, 'message' => 'Hệ thống AI hiện đang quá tải (Hết hạn mức cả 2 model). Vui lòng thử lại sau ít phút.']);
            }

            return response()->json(['success' => false, 'message' => 'Lỗi kết nối AI sau khi thử nhiều model.']);

        } catch (Exception $e) {
            Log::error("Chatbot Error: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Lỗi hệ thống.']);
        }
    }
}