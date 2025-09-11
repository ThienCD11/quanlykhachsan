<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bài 2</title>
    <style>
        .div{
            background: ghostwhite;
            border: 1px grey solid;
            font-size: 15px;
            border-radius: 10px;
            margin: 50px;
            padding: 20px;
            width: 400px;
        }
    </style>
</head>
<body>
    <div class="div">
    <?php
        $students = [
			["001" => "Nguyen Van A"],
			["002" => "Tran Thi B"],
			["003" => "Le Van C"],
			["004" => "Pham Thi D"],
			["005" => "Vo Van E"]
		];

        echo "<b><p>Danh sách sinh viên:</p></b>";
        foreach ($students as $student) {
            foreach ($student as $key => $value) {
                echo "Mã SV: $key --- Tên: $value <br>";
            }
        }
        echo "<br>";
        echo "<hr>";
    ?>

    <form method="get">
        <b>Nhập mã sinh viên: </b>
        <input type="text" name="msv" required>
        <button type="submit">Tìm</button>
    </form>
    <?php
    if (isset($_GET['msv'])) {
        $msv = $_GET['msv'];
        $tim = false;

        foreach ($students as $student) {
            if (array_key_exists($msv, $student)) {
                echo "<p>Sinh viên có mã sinh viên $msv --- " . $student[$msv] . "</p>";
                $tim = true;
                break;
            }
        }

        if (!$tim) {
            echo "<p>Không tìm thấy sinh viên có mã $msv</p>";
        }
    }
    ?>

    </div>
</body>
</html>