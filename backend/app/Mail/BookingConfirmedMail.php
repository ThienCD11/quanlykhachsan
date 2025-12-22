<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;

class BookingConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    // Biến public sẽ tự động được truyền vào Blade view
    public $booking;

    /**
     * Khởi tạo class với dữ liệu đặt phòng.
     */
    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    /**
     * Build the message.
     * Tính toán tổng tiền và định dạng ngày tháng trước khi gửi sang view.
     */
    public function build()
    {
        // 1. Tính số ngày (Đảm bảo ít nhất là 1 ngày nếu khách đi trong ngày)
        $checkIn = Carbon::parse($this->booking->check_in);
        $checkOut = Carbon::parse($this->booking->check_out);
        $days = $checkOut->diffInDays($checkIn);
        $days = $days <= 0 ? 1 : $days;

        // 2. Lấy giá phòng (ưu tiên giá lưu trong booking, nếu không có thì lấy từ Room model)
        $pricePerNight = $this->booking->price ?? ($this->booking->room->price ?? 0);
        
        // 3. Tính tổng tiền
        $totalPrice = $pricePerNight * $days;

        return $this->subject('Xác Nhận Đặt Phòng Thành Công - TAMKA HOTEL')
                    ->view('emails.booking-confirmed')
                    ->with([
                        'display_total' => number_format($totalPrice, 0, ',', '.') . ' VND',
                        'format_check_in' => $checkIn->format('d/m/Y'),
                        'format_check_out' => $checkOut->format('d/m/Y'),
                    ]);
    }
}