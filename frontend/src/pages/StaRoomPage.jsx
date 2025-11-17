import React, { useEffect, useState } from "react";
import axios from "axios";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let numericRating = parseFloat(rating);

  if (isNaN(numericRating)) {
    return <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có</span>;
  }
  
  // Tính toán tỷ lệ phần trăm
  // Ví dụ: 3.6 sao / 5 sao = 0.72 = 72%
  // Ví dụ: 4.5 sao / 5 sao = 0.9 = 90%
  const percentage = (numericRating / totalStars) * 100;
  
  // Làm tròn tỷ lệ phần trăm (ví dụ: 72%)
  const clipPercentage = `${Math.round(percentage)}%`;

  // --- Định nghĩa Style ---
  const starContainerStyle = {
    position: 'relative', // Quan trọng: làm gốc cho 'absolute'
    display: 'inline-block', // Để các sao nằm trên 1 hàng
    fontSize: '20px', // Kích thước sao
    // minWidth: '50px', // Giữ độ rộng cố định (5 sao * 19px)
  };

  const starsEmptyStyle = {
    color: '#e4e5e9', // Màu sao rỗng (nền)
    display: 'flex',
  };

  const starsFullStyle = {
    color: '#ffc107', // Màu sao đầy (vàng)
    position: 'absolute', // Đè lên trên sao rỗng
    top: 0,
    left: 0,
    whiteSpace: 'nowrap', // Ngăn các sao bị xuống dòng
    overflow: 'hidden', // Đây là phần "cắt"
    width: clipPercentage, // "Cắt" lớp sao vàng theo tỷ lệ
  };
  // --- Hết Style ---

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={starContainerStyle}>
        {/* Lớp sao rỗng (nằm dưới) */}
        <div style={starsEmptyStyle}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        {/* Lớp sao đầy (nằm trên và bị cắt) */}
        <div style={starsFullStyle}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
      {/* Hiển thị số (ví dụ: 4.5) */}
      <span>({rating})</span>
    </div>
  );
};


const StaRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/statistic/rooms")
      .then(res => {
        setRooms(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách phòng:", err);
        setError("Không thể tải dữ liệu.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Chỉ chạy 1 lần khi tải trang

  // Định nghĩa style
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "5px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };
  const tableHeaderStyle = {
    backgroundColor: "#000266ff", // Màu navy đậm (giống StaBookingPage)
    color: "white",
    padding: "15px",
    textAlign: "left",
    cursor: "pointer",
  };
  const tableCellStyle = {
    padding: "15px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  // Logic hiển thị
  if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách phòng...</h1>;
  if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

  return (
    <div>
      <h2>Quản Lý Danh Sách Phòng</h2>
      <table style={{...tableStyle, borderRadius: '5px', overflow: 'hidden'}}>
        <thead>
          <tr>
            <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}}>STT</th>
            <th style={tableHeaderStyle}>Tên phòng</th>
            <th style={tableHeaderStyle}>Giá phòng</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Sức chứa</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Số lượt đặt</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Số lượt đánh giá</th>
            <th style={tableHeaderStyle}>Rating (TB)</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="7" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có phòng nào trong hệ thống.</td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.stt}>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{room.stt}</td>
                <td style={{...tableCellStyle, marginLeft: '5px'}}>{room.name}</td>
                <td style={tableCellStyle}>{room.price}</td>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{room.capacity}</td>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{room.bookings_count}</td>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{room.reviews_count}</td>
                <td style={{...tableCellStyle, textAlign: 'left'}}>
                    <StarRating rating={room.rating_avg} />
                </td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <span style={{
                    padding: "5px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: room.status === "Đang có khách" ? "red" : "green",
                    backgroundColor: room.status === "Đang có khách" ? "#fbb5b3ff" : "#9dea9dff",
                    display: "inline-block",
                    minWidth: "110px"
                  }}>
                    {room.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaRoomPage;