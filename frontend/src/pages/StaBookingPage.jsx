import React, { useEffect, useState, useCallback } from "react"; // 1. THÊM useCallback
import axios from "axios";
import { FaSort } from "react-icons/fa"; 

const StaBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  
  // 2. THÊM STATE CHO LOADING VÀ ERROR
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. TÁCH LOGIC FETCH RA HÀM RIÊNG (ĐỂ SỬ DỤNG LẠI)
  // useCallback đảm bảo hàm này chỉ được tạo lại khi sortConfig thay đổi
  const fetchBookings = useCallback(async () => {
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
      
      setOriginalData(newData); // Luôn cập nhật bản gốc
      setError(null); // Xóa lỗi cũ nếu fetch thành công

    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu đặt phòng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Dừng loading
    }
  }, [sortConfig]); // Hàm này phụ thuộc vào sortConfig

  // 4. SỬA LẠI useEffect ĐỂ CHẠY POLLING 5 GIÂY (ĐÚNG CÁCH)
  useEffect(() => {
    // Gọi ngay khi load
    fetchBookings();

    // Auto refresh mỗi 5 giây
    const interval = setInterval(fetchBookings, 5000);

    // Cleanup khi rời trang
    return () => clearInterval(interval);
  }, [fetchBookings]); // useEffect này sẽ chạy lại khi hàm fetchBookings thay đổi (tức là khi sortConfig đổi)  
  // --- CÁC HÀM XỬ LÝ (ĐÃ SỬA LỖI COPY-PASTE) ---
  const handleConfirm = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/confirm`);
      // Cập nhật state (Dùng functional update để tránh lỗi stale state)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đã xác nhận" } : b));
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      alert("Xác nhận thất bại!");
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn này?")) {
      try {
        await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/cancel`);
        // SỬA LỖI: status phải là "Đã hủy"
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
        setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
      } catch (err) {
        console.error("Lỗi khi hủy:", err);
        alert("Hủy đơn thất bại!");
      }
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    // Sửa logic: Luôn sắp xếp dựa trên 'originalData' (bản gốc)
    const sorted = [...originalData].sort((a, b) => {
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
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  //Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = bookings.slice(startIndex, startIndex + itemsPerPage);
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // (Const styles giữ nguyên)
  const styles = {
    button: {
      border: "none", padding: "8px 12px", borderRadius: "4px", cursor: "pointer",
      fontWeight: "bold", margin: "0 2px", fontSize: "12px",
    },
    confirmButton: { backgroundColor: "#00008b", color: "white" },
    confirmButton2: { backgroundColor: "#057e0dff", color: "white" },
    cancelButton: { backgroundColor: "#ce1726ff", color: "white", marginLeft: "5px" },
    statusText: { fontWeight: "bold", padding: "8px 12px", borderRadius: "4px", fontSize: "12px" },
    pendingStatus: { color: "#0b055eff", backgroundColor: "#c2d4f9ff" },
    completedStatus: { color: "#0c4f1cff", backgroundColor: "#b5f0c3ff" },
    canceledStatus: { color: "#960a0aff", backgroundColor: "#efc1c1ff" },
    sortIcon: { marginLeft: "0px", position: "relative", top: "2px", fontSize: "15px" },
    // <FaSort style={styles.sortIcon} />
  };
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "5px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };
  const tableHeaderStyle = {
    backgroundColor: "#000266ff",
    color: "white",
    padding: "15px",
    textAlign: "left",
    fontSize: "15px",
    cursor: "pointer",
    // border: "0.5px solid white"
  };
  const tableCellStyle = {
    padding: "15px",
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: "white",
  };

  return (
    <div>
      <h2>Danh Sách Yêu Cầu Đặt Phòng</h2>

      {/* 5. THÊM LOGIC LOADING/ERROR/EMPTY VÀO ĐÂY */}
      {isLoading ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Đang tải danh sách...</h1>
      ) : error ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px", color: 'red' }}>{error}</h1>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={resetOrder}>STT</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("invoice_id")}>
                Mã đơn 
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("customer")}>
                Khách hàng 
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("room")}>
                Phòng
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("checkin")}>
                Ngày vào 
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("checkout")}>
                Ngày trả 
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("booking_at")}>
                Thời gian đặt 
              </th>
              <th style={tableHeaderStyle} onClick={() => handleSort("total")}>
                Thanh toán 
              </th>
              <th style={tableHeaderStyle}>Quản lý</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ ...tableCellStyle, textAlign: "center" }}>
                  Chưa có đơn đặt phòng nào.
                </td>
              </tr>
            ) : (
              currentData.map((b) => (
                <tr key={b.id}>
                  <td style={{ ...tableCellStyle, textAlign: "center" }}>{b.stt}</td>
                  <td style={tableCellStyle}>{b.invoice_id}</td>
                  <td style={tableCellStyle}>{b.customer}</td>
                  <td style={tableCellStyle}>{b.room}</td>
                  <td style={tableCellStyle}>{formatDate(b.checkin)}</td>
                  <td style={tableCellStyle}>{formatDate(b.checkout)}</td>
                  <td style={tableCellStyle}>{b.booking_at}</td>
                  <td style={tableCellStyle}>{Number(b.total || 0).toLocaleString("vi-VN")}</td>
                  <td>
                    {(b.status === "Đã đặt phòng" || b.status === null) ? (
                      <>
                        <button 
                          onClick={() => handleConfirm(b.id)} 
                          style={{ ...styles.button, ...styles.confirmButton }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#10034dff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.confirmButton.backgroundColor}
                        >
                            Xác nhận
                        </button>
                        <button 
                          onClick={() => handleCancel(b.id)} 
                          style={{ ...styles.button, ...styles.cancelButton }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#850808ff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ce1726ff'}
                        >
                            Hủy
                        </button>
                      </>
                    ) : b.status === "Đã xác nhận" ? (
                      <span style={{ ...styles.statusText, ...styles.pendingStatus }}>
                        Chờ thanh toán
                      </span>
                    ) : b.status === "Đã thanh toán" ? (
                      <span style={{ ...styles.statusText, ...styles.completedStatus }}>
                        Đã thanh toán
                      </span>
                    ) : b.status === "Đã hoàn thành" ? (
                      <span style={{ ...styles.statusText, ...styles.completedStatus }}>
                        Đã hoàn thành
                      </span>
                    ) : b.status === "Đã hủy" ? (
                      <span style={{ ...styles.statusText, ...styles.canceledStatus }}>
                        Đã hủy
                      </span>
                    ) : (
                      <span style={{ ...styles.statusText }}>{b.status}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      {/* Pagination Footer */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 5px",
        fontSize: "14px",
      }}>
        {/* LEFT: SHOWING ... */}
        <span>
          SHOWING {startIndex + 1} TO {Math.min(startIndex + itemsPerPage, totalItems)} OF {totalItems}
        </span>

        {/* RIGHT: PAGINATION */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Prev */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              background: "none",
              border: "none",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "18px"
            }}
          >
            ❮
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: p === currentPage ? "#00008b" : "#eaeaea",
                color: p === currentPage ? "white" : "black",
                fontWeight: "bold",
              }}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
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

export default StaBookingPage;