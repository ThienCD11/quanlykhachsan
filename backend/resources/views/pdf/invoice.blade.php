<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /* Sử dụng font DejaVu Sans để hiển thị tiếng Việt */
        body { 
            font-family: 'DejaVu Sans', sans-serif; 
            font-size: 13px; 
            color: #333; 
            margin: 0; 
            padding: 0;
            line-height: 1.6;
        }
        .container { padding: 30px; }
        .header { margin-bottom: 40px; border-bottom: 2px solid #00008b; padding-bottom: 20px; }
        .hotel-name { font-size: 24px; font-weight: bold; color: #00008b; margin: 0; }
        .invoice-title { font-size: 20px; font-weight: bold; text-align: right; margin: 0; color: #111827; }
        
        .info-table { width: 100%; margin-bottom: 30px; border: none; }
        .info-table td { vertical-align: top; width: 50%; }
        .label { font-size: 11px; text-transform: uppercase; color: #6b7280; font-weight: bold; margin-bottom: 5px; }
        
        .main-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .main-table th { 
            background-color: #f3f4f6; 
            border-bottom: 1px solid #d1d5db; 
            padding: 12px; 
            text-align: left; 
            color: #374151;
            font-size: 12px;
        }
        .main-table td { 
            padding: 12px; 
            border-bottom: 1px solid #e5e7eb; 
        }
        
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .summary-wrapper { margin-top: 30px; width: 100%; }
        .summary-table { width: 250px; margin-left: auto; border-collapse: collapse; }
        .summary-table td { padding: 5px 0; }
        .total-row td { 
            border-top: 2px solid #00008b; 
            padding-top: 10px; 
            font-weight: bold; 
            font-size: 16px; 
            color: #00008b; 
        }
        
        .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #9ca3af; font-style: italic; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table style="width: 100%; margin-bottom: 20px;">
            <tr>
                <td>
                    <h1 class="hotel-name">TAMKA HOTEL</h1>
                    <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">Mã đặt phòng: #{{ str_pad($booking->invoice_id, 6, '0', STR_PAD_LEFT) }}</p>
                </td>
                <td class="text-right">
                    <h2 class="invoice-title">HÓA ĐƠN</h2>
                    <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">Ngày lập: {{ $date }}</p>
                </td>
            </tr>
        </table>

        <!-- Customer & Stay Info -->
        <table class="info-table">
            <tr>
                <td>
                    <div class="label">Khách hàng</div>
                    <div style="font-weight: bold;">Tên: {{ $booking->user->name ?? 'N/A' }}</div>
                    <div>Email: {{ $booking->user->email ?? '' }}</div>
                    <div>Số điện thoại: {{ $booking->user->phone ?? '' }}</div>
                </td>
                <td class="text-right">
                    <div class="label">Thông tin lưu trú</div>
                    <div style="font-weight: bold;">Phòng: {{ $booking->room->room_number ?? $booking->room->name ?? 'N/A' }}</div>
                    <div>Nhận phòng: {{ $checkin }}</div>
                    <div>Trả phòng: {{ $checkout }}</div>
                </td>
            </tr>
        </table>

        <!-- Details Table -->
        <table class="main-table">
            <thead>
                <tr>
                    <th>Mô tả dịch vụ</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-center">Đơn giá</th>
                    <th class="text-center">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <p>Tiền thuê phòng</p>
                        <!-- <small style="color: #666 italic">Thời gian: {{ $days }} đêm</small> -->
                    </td>
                    <td class="text-left">{{ $days }} ngày</td>
                    <td class="text-left">{{ number_format($booking->price, 0, ',', '.') }}đ</td>
                    <td class="text-left">{{ number_format($totalPrice, 0, ',', '.') }}đ</td>
                </tr>
                {{-- Ví dụ nếu có services --}}
                @if(isset($booking->services) && count($booking->services) > 0)
                    @foreach($booking->services as $service)
                    <tr>
                        <td>{{ $service->name }}</td>
                        <td class="text-center">{{ $service->pivot->quantity }}</td>
                        <td class="text-right">{{ number_format($service->price, 0, ',', '.') }}đ</td>
                        <td class="text-right">{{ number_format($service->pivot->quantity * $service->price, 0, ',', '.') }}đ</td>
                    </tr>
                    @endforeach
                @endif
            </tbody>
        </table>

        <!-- Summary -->
        <div class="summary-wrapper">
            <table class="summary-table">
                <tr>
                    <td style="color: #6b7280;">Tạm tính:</td>
                    <td class="text-right">{{ number_format($totalPrice, 0, ',', '.') }}đ</td>
                </tr>
                <tr class="total-row">
                    <td>TỔNG CỘNG:</td>
                    <td class="text-right">{{ number_format($totalPrice, 0, ',', '.') }}đ</td>
                </tr>
            </table>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Đây là hóa đơn điện tử được xuất từ hệ thống TAMKA HOTEL.</p>
            <p>Cảm ơn quý khách và hẹn gặp lại!</p>
        </div>
    </div>
</body>
</html>