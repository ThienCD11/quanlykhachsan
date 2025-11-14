import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSort } from "react-icons/fa"; 

const StaBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [originalData, setOriginalData] = useState([]);  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/statistic/bookings");
        const newData = res.data;

        // Nếu đang có sort hiện tại thì giữ nguyên sort
        if (sortConfig.key) {
          const sorted = [...newData].sort((a, b) => {
            const { key, direction } = sortConfig;
            if (key === "total") {
              return direction === "asc" ? a.total - b.total : b.total - a.total;
            } else {
              const valA = a[key]?.toString().toLowerCase() || "";
              const valB = b[key]?.toString().toLowerCase() || "";
              if (valA < valB) return direction === "asc" ? -1 : 1;
              if (valA > valB) return direction === "asc" ? 1 : -1;
              return 0;
            }
          });
          setBookings(sorted);
        } else {
          // Nếu chưa sort thì giữ thứ tự mặc định
          setBookings(newData);
        }

        // Lưu bản gốc để reset khi cần
        setOriginalData(newData);
      } catch (err) {
        console.error(err);
      }
    };

  // Gọi ngay khi load
  fetchBookings();

  // Auto refresh mỗi 10 giây (hoặc tùy bạn)
  const interval = setInterval(fetchBookings, 5000);

  // Cleanup khi rời trang
  return () => clearInterval(interval);
}, [sortConfig]);


  const handleConfirm = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/confirm`);
      // Cập nhật state cục bộ (frontend) với trạng thái tiếng Việt
      setBookings(bookings.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
      setOriginalData(originalData.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      alert("Xác nhận thất bại!");
    }
  };

  const handleCancel = async (id) => {
    // Thêm confirm box
    if (window.confirm("Bạn có chắc muốn hủy đơn này?")) {
      try {
        await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/cancel`);
        // Cập nhật state cục bộ (frontend) với trạng thái tiếng Việt
        setBookings(bookings.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
        setOriginalData(originalData.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
      } catch (err) {
        console.error("Lỗi khi hủy:", err);
        alert("Hủy đơn thất bại!");
      }
    }
  };
  // Admin xác nhận đã nhận thanh toán (Status: Đã thanh toán -> Đã hoàn thành)
  const handleConfirmPayment = async (id) => {
     if (window.confirm("Xác nhận khách hàng này ĐÃ THANH TOÁN?")) {
        try {
            // Chúng ta cần một API route mới
            await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/confirm-payment`);
            // Trạng thái cuối cùng (ví dụ: 'Đã hoàn thành')
            setBookings(bookings.map(b => b.id === id ? { ...b, status: "Đã hoàn thành" } : b));
            setOriginalData(originalData.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
          } catch (err) {
            console.error("Lỗi khi xác nhận thanh toán:", err);
            alert("Xác nhận thanh toán thất bại!");
        }
     }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...bookings].sort((a, b) => {
      if (key === "total") {
        return direction === "asc" ? a.total - b.total : b.total - a.total;
      } else {
        const valA = a[key]?.toString().toLowerCase() || "";
        const valB = b[key]?.toString().toLowerCase() || "";
        if (valA < valB) return direction === "asc" ? -1 : 1;
        if (valA > valB) return direction === "asc" ? 1 : -1;
        return 0;
      }
    });

    setBookings(sorted);
    setSortConfig({ key, direction });
  };

  const resetOrder = () => {
    setBookings([...originalData]);
    setSortConfig({ key: null, direction: "asc" });
  };


  const styles = {
    button: {
      border: "none",
      padding: "8px 12px",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      margin: "0 2px",
      fontSize: "12px",
    },
    // Nút Xác nhận 
    confirmButton: {
      backgroundColor: "#00008b", 
      color: "white",
    },
    // Nút Xác nhận thanh toán
    confirmButton2: {
      backgroundColor: "#057e0dff", 
      color: "white",
    },
    // Nút Hủy 
    cancelButton: {
      backgroundColor: "#ce1726ff",
      color: "white",
      marginLeft: "15px",
    },
    // Kiểu cơ bản cho văn bản trạng thái
    statusText: {
      fontWeight: "bold",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "12px",
    },
    // Trạng thái Chờ thanh toán
    pendingStatus: {
      color: "#0b055eff", 
      backgroundColor: "#c2d4f9ff", 
    },
    // Trạng thái Đã hoàn thành 
    completedStatus: {
      color: "#0c4f1cff", 
      backgroundColor: "#b5f0c3ff", 
    },
    // Trạng thái Đã hủy 
    canceledStatus: {
      color: "#960a0aff", 
      backgroundColor: "#efc1c1ff", 
    },
    sortIcon: {
      marginLeft: "10px",
      position: "relative",
      top: "4px", // điều chỉnh cao/thấp
      fontSize: "18px", // điều chỉnh kích thước
    },
  };

  return (
    <div>
      <h2>Danh Sách Yêu Cầu Đặt Phòng</h2>
      <table border="1" cellPadding="20" cellSpacing="10" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse", }}>
        <thead style={{ backgroundColor: "#003366", color: "white" }}>
          <tr>
            <th style={{ cursor: "pointer" }} onClick={resetOrder}>
              STT
            </th>
            <th
              onClick={() => handleSort("invoice_id")}
              style={{ cursor: "pointer" }}
            >
              Mã đơn
              <FaSort style={styles.sortIcon} />
            </th>
            <th
              onClick={() => handleSort("customer")}
              style={{ cursor: "pointer" }}
            >
              Khách hàng
              <FaSort style={styles.sortIcon} />
            </th>
            <th
              onClick={() => handleSort("room")}
              style={{ cursor: "pointer" }}
            >
              Phòng
              <FaSort style={styles.sortIcon} />
            </th>
            <th
              onClick={() => handleSort("booking_at")}
              style={{ cursor: "pointer" }}
            >
              Thời gian đặt
              <FaSort style={styles.sortIcon} />
            </th>
            <th
              onClick={() => handleSort("total")}
              style={{ cursor: "pointer" }}
            >
              Thanh toán
              <FaSort style={styles.sortIcon} />
            </th>
            <th>Quản lý</th>
          </tr>
        </thead>

        <tbody>
          {/* Kiểm tra nếu không có booking */}
          {bookings.length === 0 && (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>Chưa có đơn đặt phòng nào.</td>
            </tr>
          )}

          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.stt}</td>
              <td>{b.invoice_id}</td>
              <td>{b.customer}</td>
              <td>{b.room}</td>
              <td>{b.booking_at}</td>
              {/* Đảm bảo 'total' tồn tại trước khi gọi toLocaleString */}
              <td>{Number(b.total || 0).toLocaleString("vi-VN")}</td>
              <td>
                {/* *** SỬA LẠI TOÀN BỘ LOGIC <td> QUẢN LÝ *** */}

                {/* 1. Trạng thái 'Đã đặt phòng' (hoặc null cho đơn cũ) */}
                {(b.status === "Đã đặt phòng" || b.status === null) ? (
                  <>
                    <button 
                      onClick={() => handleConfirm(b.id)} 
                      style={{ ...styles.button, ...styles.confirmButton }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#10034dff'} // Màu xanh lá đậm hơn
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.confirmButton.backgroundColor}
                    >
                       Xác nhận
                    </button>
                    <button 
                      onClick={() => handleCancel(b.id)} 
                      style={{ ...styles.button, ...styles.cancelButton }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#850808ff'} // Màu xanh lá đậm hơn
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ce1726ff'}
                    >
                       Hủy
                    </button>
                  </>
                
                // 2. Trạng thái 'Đã xác nhận' -> Hiển thị "Chờ thanh toán"
                ) : b.status === "Đã xác nhận" ? (
                  <span style={{ ...styles.statusText, ...styles.pendingStatus }}>
                    Chờ thanh toán
                  </span>
                
                // 3. Trạng thái 'Đã thanh toán' (Khách vừa trả tiền) -> Hiển thị nút
                ) : b.status === "Đã thanh toán" ? (
                  <button 
                    onClick={() => handleConfirmPayment(b.id)} 
                    style={{ ...styles.button, ...styles.confirmButton2 }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#034f13ff'} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.confirmButton2.backgroundColor}
                  >
                    Xác nhận thanh toán
                  </button>

                // 4. Trạng thái 'Đã hoàn thành' (Admin đã xác nhận thanh toán)
                ) : b.status === "Đã hoàn thành" ? (
                  <span style={{ ...styles.statusText, ...styles.completedStatus }}>
                    Đã hoàn thành
                  </span>

                // 5. Trạng thái 'Đã hủy'
                ) : b.status === "Đã hủy" ? (
                  <span style={{ ...styles.statusText, ...styles.canceledStatus }}>
                    Đã hủy
                  </span>

                // 6. Các trạng thái khác (dự phòng)
                ) : (
                  <span style={{ ...styles.statusText }}>{b.status}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaBookingPage;