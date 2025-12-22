<!DOCTYPE html>
<html>
<head>
    <title>Xác nhận đặt phòng</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { width: 80%; margin: 20px auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; }
        .header { background: #040d97ff; color: white; padding: 10px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { margin: 20px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>TAMKA HOTEL</h1>
        </div>
        <div class="content">
            <p>Xin chào {{ $booking->user->name ?? 'Quý khách' }},</p>
            <p>Chúng tôi rất vui mừng thông báo rằng đơn đặt phòng của bạn đã được <strong>XÁC NHẬN THÀNH CÔNG</strong>.</p>
            
            <div class="details">
                <h3>Chi tiết đặt phòng:</h3>
                <ul>
                    <li><strong>Mã đơn hàng:</strong> #{{ $booking->invoice_id }}</li>
                    <li><strong>Ngày nhận phòng:</strong> {{ $format_check_in }}</li>
                    <li><strong>Ngày trả phòng:</strong> {{ $format_check_out }}</li>
                    <li><strong>Tổng tiền:</strong> {{ $display_total }}</li>
                </ul>
            </div>

            <p>Hẹn gặp lại bạn tại TAMKA HOTEL. Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua số điện thoại hỗ trợ.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 TAMKA HOTEL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>