import React, { useEffect, useState, useCallback } from "react"; // 1. THÊM useCallback
import axios from "axios";
import BackToTop from "../components/BackToTop";
import { FaSort } from "react-icons/fa"; 

const StaBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  
  // 2. THÊM STATE CHO LOADING VÀ ERROR
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

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
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Chờ thanh toán" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Chờ thanh toán" } : b));
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

  const handleUseRoom = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/use-room`);
      // Cập nhật state (Dùng functional update để tránh lỗi stale state)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đang sử dụng" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đang sử dụng" } : b));
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      alert("Xác nhận thất bại!");
    }
  };

  const handleCompleteRoom = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/complete-room`);
      // Cập nhật state (Dùng functional update để tránh lỗi stale state)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Hoàn thành" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Hoàn thành" } : b));
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      alert("Xác nhận thất bại!");
    }
  };

  const handleRefund = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/refund`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hoàn tiền" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hoàn tiền" } : b));
    } catch (err) {
      console.error("Lỗi khi xác nhận:", err);
      alert("Hoàn tiền thất bại!");
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
    dropdownBtn: {
      display: "block",
      width: "100%",
      padding: "10px",
      paddingLeft: "6px",
      border: "none",
      textAlign: "center",
      cursor: "pointer",
      fontSize: "13px",
      borderBottom: "1px solid #eee",
      transition: "all 0.2s",
      fontWeight: "500",
    },
    // Định nghĩa màu cho từng loại nút trong dropdown
    btnConfirm: { color: "#ffffffff",fontWeight: "bold", background: "#00008b" }, // Xanh lá
    btnCancel: { color: "#ffffffff",fontWeight: "bold", background: "#b20d0dff" },  // Đỏ
    btnUse: { color: "#ffffffff",fontWeight: "bold", background: "#bcad00ff" },     // Xanh dương
    btnComplete: { color: "#ffffffff",fontWeight: "bold", background: "#036e1cff" }, // Cam
    btnRefund: { color: "#ffffffff",fontWeight: "bold", background: "#782ea3ff" },   // Tím
    statusBackgrounds: {
      "Chờ xác nhận": "#c5c5ffff", // Navy mặc định
      "Chờ thanh toán": "#ffe298ff", // Cam (cảnh báo)
      "Đã thanh toán": "#ebf3abff", // Xanh lá (tích cực)
      "Đang sử dụng": "#fdcee4ff", // Xanh dương (đang diễn ra)
      "Chờ hoàn tiền": "#e4c0ffff", // Tím
    },
    statusColors: {
      "Chờ xác nhận": "#00008b", // Navy mặc định
      "Chờ thanh toán": "#b16d00ff", // Cam (cảnh báo)
      "Đã thanh toán": "#bcad00ff", // Xanh lá (tích cực)
      "Đang sử dụng": "#b9007bff", // Xanh dương (đang diễn ra)
      "Chờ hoàn tiền": "#782ea3ff", // Tím
    },
    statusText: { 
        fontWeight: "bold", 
        padding: "6px", 
        borderRadius: "6px", 
        fontSize: "13px",
        display: "inline-block" // Đảm bảo hiển thị gọn gàng
    },
    // Màu Xanh lá cho Hoàn thành
    completedStatus: { color: "#036e1cff", backgroundColor: "#a4e8b4ff" }, 
    // Màu Đỏ cho Đã hủy
    canceledStatus: { color: "#b40606ff", backgroundColor: "#ffc1c1ff" },   
    // Màu Tím cho Đã hoàn tiền (Mới thêm)
    refundedStatus: { color: "#5c5c5cff", backgroundColor: "#cececeff" },
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
      <h2>Danh Sách Đơn Đặt Phòng</h2>
 
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
              <th style={{...tableHeaderStyle, paddingLeft: '25px'}} onClick={() => handleSort("status")}>
                Quản lý
              </th>
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
                  <td style={tableCellStyle}>
                    {["Hoàn thành", "Đã hủy", "Đã hoàn tiền"].includes(b.status) ? (
                    <span
                      style={{
                        ...styles.statusText,
                        ...(b.status === "Hoàn thành" ? styles.completedStatus : 
                          b.status === "Đã hủy" ? styles.canceledStatus : 
                          styles.refundedStatus) // Nếu không là 2 cái trên thì là Đã hoàn tiền
                      }}
                    >
                      {b.status === "Hoàn thành" ? "Hoàn thành" : b.status}
                    </span>
                  ) : (
                      <div style={{ position: "relative", display: "inline-block" }}>
                        {(() => {
                          const currentStatusBG = styles.statusBackgrounds[b.status] || styles.statusBackgrounds["Chờ xác nhận"];
                          const currentStatusColor = styles.statusColors[b.status] || styles.statusColors["Chờ xác nhận"];
                          return (
                            <div
                              onClick={() => setOpenMenuId(openMenuId === b.id ? null : b.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                background: currentStatusBG, // Áp dụng màu động ở đây
                                color: currentStatusColor,
                                borderRadius: "6px",
                                padding: "6px",
                                cursor: "pointer",
                                border: "1px solid white",
                                fontSize: "13px",
                                fontWeight: "bold",
                                transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8)")} // Làm sáng màu khi hover
                              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                            >
                              <span>{b.status || "Chờ xác nhận"} ▼</span>
                            </div>
                          );
                        })()}

                        {openMenuId === b.id && (
                          <div
                            style={{
                              position: "absolute",
                              zIndex: 10,
                              right: 0,
                              ...(startIndex + currentData.indexOf(b) > currentData.length - 3 
                                  ? { bottom: "100%", marginBottom: "2px" } 
                                  : { top: "100%", marginTop: "2px" }
                              ),
                              color: "white",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              width: "100px",
                              overflow: "hidden"
                            }}
                          >
                            {/* th1: Chờ xác nhận */}
                            {(b.status === "Chờ xác nhận" || !b.status) && (
                              <>
                                <button 
                                  style={{...styles.dropdownBtn, ...styles.btnConfirm}} 
                                  onClick={() => { handleConfirm(b.id); setOpenMenuId(null); }}
                                  onMouseEnter={(e) => e.target.style.background = "#000065ff"}
                                  onMouseLeave={(e) => e.target.style.background = "#00008b"}
                                >Xác nhận</button>
                                <button 
                                  style={{...styles.dropdownBtn, ...styles.btnCancel}} 
                                  onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}
                                  onMouseEnter={(e) => e.target.style.background = "#850404ff"}
                                  onMouseLeave={(e) => e.target.style.background = "#b20d0dff"}
                                >Hủy đơn</button>
                              </>
                            )}

                            {/* th2: Chờ thanh toán */}
                            {b.status === "Chờ thanh toán" && (
                              <button 
                                style={{...styles.dropdownBtn, ...styles.btnCancel}} 
                                onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}
                                onMouseEnter={(e) => e.target.style.background = "#850404ff"}
                                onMouseLeave={(e) => e.target.style.background = "#b20d0dff"}
                              >Hủy đơn</button>
                            )}

                            {/* th3: Đã thanh toán */}
                            {b.status === "Đã thanh toán" && (
                              <>
                                <button 
                                  style={{...styles.dropdownBtn, ...styles.btnUse}} 
                                  onClick={() => { handleUseRoom(b.id); setOpenMenuId(null); }}
                                  onMouseEnter={(e) => e.target.style.background = "#a09300ff"}
                                  onMouseLeave={(e) => e.target.style.background = "#bcad00ff"}
                                >Sử dụng</button>
                                <button 
                                  style={{...styles.dropdownBtn, ...styles.btnCancel}} 
                                  onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}
                                  onMouseEnter={(e) => e.target.style.background = "#850404ff"}
                                  onMouseLeave={(e) => e.target.style.background = "#b20d0dff"}
                                >Hủy đơn</button>
                              </>
                            )}

                            {/* th4: Đang sử dụng */}
                            {b.status === "Đang sử dụng" && (
                              <button 
                                style={{...styles.dropdownBtn, ...styles.btnComplete}} 
                                onClick={() => { handleCompleteRoom(b.id); setOpenMenuId(null); }}
                                onMouseEnter={(e) => e.target.style.background = "#015615ff"}
                                onMouseLeave={(e) => e.target.style.background = "#036e1cff"}
                              >Hoàn thành</button>
                            )}

                            {/* th7: Chờ hoàn tiền */}
                            {b.status === "Chờ hoàn tiền" && (
                              <button 
                                style={{...styles.dropdownBtn, ...styles.btnRefund}} 
                                onClick={() => { handleRefund(b.id); setOpenMenuId(null); }}
                                onMouseEnter={(e) => e.target.style.background = "#4f047bff"}
                                onMouseLeave={(e) => e.target.style.background = "#782ea3ff"}
                              >Hoàn tiền</button>
                            )}
                          </div>
                        )}
                      </div>
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