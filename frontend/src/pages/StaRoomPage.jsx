import React, { useEffect, useState } from "react";
import axios from "axios";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let numericRating = parseFloat(rating);

  if (isNaN(numericRating)) {
    return <span style={{ color: '#999', fontStyle: 'italic', paddingLeft:'20px' }}>Chưa có</span>;
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

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

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

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let x = a[sortConfig.key];
    let y = b[sortConfig.key];

    // số thì parseFloat
    if (!isNaN(x) && !isNaN(y)) {
      x = parseFloat(x);
      y = parseFloat(y);
    }

    // chuỗi thì lowercase
    if (typeof x === "string") x = x.toLowerCase();
    if (typeof y === "string") y = y.toLowerCase();

    if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
    if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // PAGINATION  
  const totalItems = rooms.length;
  const totalPages = Math.ceil(rooms.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRooms = sortedRooms.slice(startIndex, startIndex + rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
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
            <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}} onClick={() => handleSort("stt")}>STT</th>
            <th style={tableHeaderStyle} onClick={() => handleSort("name")}>Tên phòng</th>
            <th style={tableHeaderStyle} onClick={() => handleSort("price")}>Giá phòng</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("capacity")}>Sức chứa</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("bookings_count")}>Lượt đặt</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("reviews_count")}>Lượt đánh giá</th>
            <th style={{...tableHeaderStyle, width: '100px', textAlign: 'center'}} onClick={() => handleSort("rating_avg")}>Rating (TB)</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("status")}>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRooms.length === 0 ? (
            <tr>
              <td colSpan="7" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có phòng nào trong hệ thống.</td>
            </tr>
          ) : (
            paginatedRooms.map((room) => (
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
      {/* Pagination */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 5px",
          fontSize: "14px",
        }}>
        {/* LEFT: SHOWING ... */}
        <span>
          SHOWING {startIndex + 1} TO {Math.min(startIndex + rowsPerPage, totalItems)} OF {totalItems}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            disabled={currentPage === 1}
            onClick={() => paginate(currentPage - 1)}
          style={{
              background: "none",
              border: "none",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "18px"
            }}
          >
            ❮
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: i + 1 === currentPage ? "#00008b" : "#eaeaea",
                color: i + 1 === currentPage ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => paginate(currentPage + 1)}
            style={{
              background: "none",
              border: "none",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "18px"
            }}
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaRoomPage;