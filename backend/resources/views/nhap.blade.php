<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bài tập nhanh 2</title>
    <style>
        .box{ 
            width: 1000px;
            height: 400px;
            margin: 50px auto;
            border: 1px black solid;
            box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.25);
            display: flex;
            justify-content: space-evenly;
            text-align: left;           
        }
        .box h2{ 
            text-align: center;
        }
        .box1{
            width: 30%;
            height: 90%;
            background: pink;
            margin: 20px auto;
            
        }
        .box2{
            width: 30%;
            height: 90%;
            background: lightblue;
            margin: 20px auto;
        }
        .box3{
            width: 30%;
            height: 90%;
            background: lightgreen;
            margin: 20px auto;
        }
        .input {
            margin: 15px;
        }
        .input input[type="text"],
        .input input[type="number"]{
            width: 250px;
            padding: 5px;
            border: 1px solid black;
            border-radius: 5px;
            margin: 5px;
        }
        button{
            margin: 20px 20px;
            text-align: center;
            width: 260px;
            height: 30px;
            border-radius: 5px;
            background: RoyalBlue;
            border: none;
            color: white;
        }
        button:hover{
            background: MediumBlue;
        }
    </style>
</head>
<body>
        <?php
        $user = $_GET['user'] ?? '';
        $age = $_GET['age'] ?? '';
        $soLuong = $_GET['soLuong'] ?? '';
        $donGia = 5000;
 
        $khuyenMai = 0;
        if ($age !== '') {
            if ($age >= 0 && $age <= 10) {
                $khuyenMai = 50;
            } elseif ($age >= 11 && $age <= 18) {
                $khuyenMai = 30;
            } else {
                $khuyenMai = 0;
            }
        }

        $tongTien = $soTienGiam = $thanhTien = 0;
        if ($soLuong !== '' && is_numeric($soLuong)) {
            $tongTien = $donGia * $soLuong;
            $soTienGiam = $tongTien * ($khuyenMai / 100);
            $thanhTien = $tongTien - $soTienGiam;
        }
        ?>

        <?php
        echo date('Y-m-d H:i:s');
        ?>

    <div class="box">
        <div class="box1">
        <h3 style="text-align: center;">Thông tin cá nhân</h3>
        <form method="GET" action="">
            <div class="input">
                <label for="user">Họ tên:</label>
                <input type="text" id="user" name="user" value="<?php echo $user; ?>" required>
            </div>
            <div class="input">
                <label for="age">Tuổi:</label>
                <input type="number" id="age" name="age" value="<?php echo $age; ?>" required>
            </div>    
            <div>
                <button type="submit" name="btn">Xác nhận</button>
            </div>
        </div>

        <div class="box2">
        <h3 style="text-align: center;">Chọn vé</h3>
            <div class="input">
                <label for="donGia">Đơn giá:</label>
                <input type="text" id="donGia" name="donGia" value="<?php echo $donGia; ?>" readonly>
            </div>
            <div class="input">
                <label for="kMai">Khuyến mại:</label>
                <input type="text" id="kMai" name="kMai" value="<?php echo $khuyenMai; ?>%" readonly>
            </div>   
            <div class="input">
                <label for="soLuong">Số lượng:</label>
                <input type="number" id="soLuong" name="soLuong" min="0" step="0" value="<?php echo $soLuong; ?>" required>
            </div>  
            <div>
                <button type="submit" name="submit">Mua</button>
            </div>
        </div>

        <div class="box3">
        <h3 style="text-align: center;">Thành tiền</h3>
            <div class="input">
                <label for="tongTien">Tổng tiền:</label>
                <input type="text" id="tongTien" name="tongTien" value="<?php echo $tongTien; ?>" readonly>
            </div>
            <div class="input">
                <label for="giamGia">Số tiền được giảm giá:</label>
                <input type="text" id="giamGia" name="giamGia" value="<?php echo $soTienGiam; ?>" readonly>
            </div>   
            <div class="input">
                <label for="raTien">Thành tiền:</label>
                <input type="text" id="raTien" name="raTien" value="<?php echo $thanhTien; ?>" readonly>
            </div>  
        </form>
        </div>
    </div>
</body>
</html>