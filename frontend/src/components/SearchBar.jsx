import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <<-- THÊM MỚI

export default function SearchBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [error, setError] = useState(""); // <<-- THÊM MỚI: State cho lỗi
  const navigate = useNavigate(); // <<-- THÊM MỚI: Hook để chuyển trang

  const handleSearch = () => {
    setError(""); // Xóa lỗi cũ mỗi khi nhấn nút

    // 1. Kiểm tra ngày tháng có được nhập chưa
    if (!checkIn || !checkOut) {
      setError("Vui lòng chọn cả ngày nhận phòng và trả phòng.");
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt về 0 giờ để so sánh ngày

    // 2. Kiểm tra ngày nhận phòng
    if (checkInDate < today) {
      setError("Ngày nhận phòng phải là hôm nay hoặc một ngày sau đó.");
      return;
    }

    // 3. Kiểm tra ngày trả phòng phải sau ngày nhận phòng
    if (checkOutDate <= checkInDate) {
      setError("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    // 4. Nếu mọi thứ hợp lệ -> Chuyển trang
    console.log("Đang tìm kiếm với:", { checkIn, checkOut, adults });

    // Tạo chuỗi query parameters
    const queryParams = new URLSearchParams({
        check_in: checkIn,
        check_out: checkOut,
        capacity: adults
    });

    // Chuyển hướng đến trang /rooms (RoomPage) với các tham số tìm kiếm
    navigate(`/rooms?${queryParams.toString()}`);
  };

  return ( 
    <div
      style={{
        background: "#ffffffff",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "15px 15px 20px rgba(0,0,0,0.3)",
        maxWidth: "1000px",
        margin: "5px auto",
        border: "0px solid #061797ff",
        // marginTop: "-300px",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: "5px", color: "#0d0248ff" }}>
        Tìm Phòng Ngay
      </h3>

      {/* THÊM MỚI: Hiển thị lỗi */}
      {error && (
        <p style={{ color: 'red', textAlign: 'center', margin: '5px 0' }}>
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {/* Ngày nhận phòng */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Ngày Nhận Phòng
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        {/* Ngày trả phòng */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Ngày Trả Phòng
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        {/* Sức chứa */}
        <div style={{ flex: 0.5 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Sức chứa 
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}
              onMouseEnter={(e) => (e.target.style.background = "#00008b")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
              >
                {num}
              </option>
            ))}
          </select>
        </div>
        
        {/* Nút tìm phòng */}
        <div style={{ flex: 0.6, alignSelf: "flex-end" }}>
          <button
            onClick={handleSearch} // <<-- Đã kết nối hàm
            style={{
              width: "100%",
              padding: "10px",
              background: "#ffffffff",
              // border: "none",
              borderRadius: "5px",
              color: "black",
              fontWeight: "bold",
              cursor: "pointer",
              border: "1px solid #ccc",
              marginBottom: "1.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00008b";
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "black";
            }}
          >
            Tìm Phòng
          </button>
        </div>
      </div>
    </div>
  );
}