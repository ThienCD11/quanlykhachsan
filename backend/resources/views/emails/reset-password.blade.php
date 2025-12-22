<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - TAMKA HOTEL</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #00008b; /* Navy Blue */
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 2px;
        }
        .content {
            padding: 40px;
            color: #333333;
            line-height: 1.6;
        }
        .code-box {
            background-color: #f0f4ff;
            border: 2px dashed #00008b;
            border-radius: 6px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .code-number {
            font-size: 36px;
            font-weight: bold;
            color: #00008b;
            letter-spacing: 10px;
            margin: 0;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
            border-top: 1px solid #eeeeee;
        }
        .warning {
            color: #e53e3e;
            font-weight: bold;
            font-size: 14px;
        }
        .btn {
            display: inline-block;
            padding: 12px 25px;
            background-color: #00008b;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>TAMKA HOTEL</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p>Xin chào,</p>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>TAMKA HOTEL</strong>. Vui lòng sử dụng mã xác minh dưới đây để hoàn tất quy trình:</p>
            
            <div class="code-box">
                <p style="margin-top: 0; color: #666;">Mã xác minh của bạn là:</p>
                <h2 class="code-number">{{ $code }}</h2>
            </div>

            <p class="warning">Lưu ý: Mã này chỉ có hiệu lực trong vòng 15 phút.</p>
            
            <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi để đảm bảo an toàn cho tài khoản.</p>
            
            <p>Trân trọng,<br>Đội ngũ quản lý TAMKA HOTEL</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>&copy; 2025 TAMKA HOTEL. All rights reserved.</p>
        </div>
    </div>
</body>
</html>