import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import BackToTop from "../components/BackToTop";
import { FaSort } from "react-icons/fa";

const StaBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/statistic/bookings");
      const newData = res.data;
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
        setBookings(newData);
      }
      setOriginalData(newData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu đặt phòng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [sortConfig]);

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [fetchBookings]);

  // --- HÀM XUẤT HÓA ĐƠN ---
  const handleExportInvoice = async (id) => {
    try {
        // Tham số 1: URL
        // Tham số 2: Body data (truyền object rỗng {} nếu không gửi dữ liệu lên)
        // Tham số 3: Cấu hình config (chứa responseType)
        const response = await axios.post(
            `http://localhost:8000/api/statistic/bookings/${id}/export-invoice`, 
            {}, 
            { responseType: 'blob' } 
        );

        // Kiểm tra nếu file nhận được là PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `hoadon_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Lỗi chi tiết:", err);
        // Nếu lỗi 500, có thể do Backend chưa cài DomPDF hoặc lỗi code Blade
        alert("Lỗi hệ thống khi tạo PDF. Kiểm tra lại Backend!");
    }
  };

  const handleConfirm = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/confirm`);
      if(res.data.success) {
          setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Chờ thanh toán" } : b));
          setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Chờ thanh toán" } : b));
          alert("Đã xác nhận và gửi email thông báo cho khách hàng!");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Xác nhận thất bại!";
      alert(errorMsg);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc muốn hủy đơn này?")) {
      try {
        await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/cancel`);
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
        setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hủy" } : b));
      } catch (err) {
        alert("Hủy đơn thất bại!");
      }
    }
  };

  const handleUseRoom = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/use-room`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đang sử dụng" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đang sử dụng" } : b));
    } catch (err) {
      alert("Xác nhận thất bại!");
    }
  };

  const handleCompleteRoom = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/complete-room`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Hoàn thành" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Hoàn thành" } : b));
    } catch (err) {
      alert("Xác nhận thất bại!");
    }
  };

  const handleRefund = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/statistic/bookings/${id}/refund`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hoàn tiền" } : b));
      setOriginalData(prev => prev.map(b => b.id === id ? { ...b, status: "Đã hoàn tiền" } : b));
    } catch (err) {
      alert("Hoàn tiền thất bại!");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalItems = bookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = bookings.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
    btnConfirm: { color: "#ffffffff", fontWeight: "bold", background: "#00008b" },
    btnCancel: { color: "#ffffffff", fontWeight: "bold", background: "#b20d0dff" },
    btnUse: { color: "#ffffffff", fontWeight: "bold", background: "#bcad00ff" },
    btnComplete: { color: "#ffffffff", fontWeight: "bold", background: "#036e1cff" },
    btnRefund: { color: "#ffffffff", fontWeight: "bold", background: "#782ea3ff" },
    btnExport: { color: "#ffffffff", fontWeight: "bold", background: "#b20d0dff" }, // Màu xám đậm cho xuất file
    statusBackgrounds: {
      "Chờ xác nhận": "#c5c5ffff",
      "Chờ thanh toán": "#ffe298ff",
      "Đã thanh toán": "#ebf3abff",
      "Đang sử dụng": "#fdcee4ff",
      "Chờ hoàn tiền": "#e4c0ffff",
      "Hoàn thành": "#a4e8b4ff", // Thêm màu nền cho hoàn thành
    },
    statusColors: {
      "Chờ xác nhận": "#00008b",
      "Chờ thanh toán": "#b16d00ff",
      "Đã thanh toán": "#bcad00ff",
      "Đang sử dụng": "#b9007bff",
      "Chờ hoàn tiền": "#782ea3ff",
      "Hoàn thành": "#036e1cff", // Thêm màu chữ cho hoàn thành
    },
    statusText: { 
        fontWeight: "bold", 
        padding: "6px", 
        borderRadius: "6px", 
        fontSize: "13px",
        display: "inline-block"
    },
    canceledStatus: { color: "#b40606ff", backgroundColor: "#ffc1c1ff" },   
    refundedStatus: { color: "#5c5c5cff", backgroundColor: "#cececeff" },
  };

  const tableStyle = { width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "5px", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
  const tableHeaderStyle = { backgroundColor: "#000266ff", color: "white", padding: "15px", textAlign: "left", fontSize: "15px", cursor: "pointer" };
  const tableCellStyle = { padding: "15px", borderBottom: "1px solid #e5e5e5", backgroundColor: "white" };

  return (
    <div>
      <h2>Danh Sách Đơn Đặt Phòng</h2>
      {isLoading ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Đang tải danh sách...</h1>
      ) : error ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px", color: 'red' }}>{error}</h1>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={resetOrder}>STT</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("invoice_id")}>Mã đơn</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("customer")}>Khách hàng</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("room")}>Phòng</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("checkin")}>Ngày vào</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("checkout")}>Ngày trả</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("booking_at")}>Thời gian đặt</th>
              <th style={tableHeaderStyle} onClick={() => handleSort("total")}>Thanh toán</th>
              <th style={{...tableHeaderStyle, paddingLeft: '25px'}} onClick={() => handleSort("status")}>Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr><td colSpan="9" style={{ ...tableCellStyle, textAlign: "center" }}>Chưa có đơn đặt phòng nào.</td></tr>
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
                    {/* SỬA LOGIC Ở ĐÂY: "Hoàn thành" giờ sẽ có menu dropdown */}
                    {["Đã hủy", "Đã hoàn tiền"].includes(b.status) ? (
                      <span style={{ ...styles.statusText, ...(b.status === "Đã hủy" ? styles.canceledStatus : styles.refundedStatus) }}>
                        {b.status}
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
                                display: "flex", alignItems: "center", background: currentStatusBG, color: currentStatusColor,
                                borderRadius: "6px", padding: "6px", cursor: "pointer", border: "1px solid white",
                                fontSize: "13px", fontWeight: "bold", transition: "all 0.2s ease",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.8)")}
                              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
                            >
                              <span>{b.status || "Chờ xác nhận"} ▼</span>
                            </div>
                          );
                        })()}

                        {openMenuId === b.id && (
                          <div
                            style={{
                              position: "absolute", zIndex: 10, right: 0,
                              ...(startIndex + currentData.indexOf(b) > currentData.length - 3 ? { bottom: "100%", marginBottom: "2px" } : { top: "100%", marginTop: "2px" }),
                              color: "white", border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: "120px", overflow: "hidden"
                            }}
                          >
                            {/* Menu cho Hoàn thành */}
                            {b.status === "Hoàn thành" && (
                              <button 
                                style={{...styles.dropdownBtn, ...styles.btnExport}} 
                                onClick={() => { handleExportInvoice(b.id); setOpenMenuId(null); }}
                              >Xuất hóa đơn</button>
                            )}

                            {(b.status === "Chờ xác nhận" || !b.status) && (
                              <>
                                <button style={{...styles.dropdownBtn, ...styles.btnConfirm}} onClick={() => { handleConfirm(b.id); setOpenMenuId(null); }}>Xác nhận</button>
                                <button style={{...styles.dropdownBtn, ...styles.btnCancel}} onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}>Hủy đơn</button>
                              </>
                            )}
                            {b.status === "Chờ thanh toán" && (
                              <button style={{...styles.dropdownBtn, ...styles.btnCancel}} onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}>Hủy đơn</button>
                            )}
                            {b.status === "Đã thanh toán" && (
                              <>
                                <button style={{...styles.dropdownBtn, ...styles.btnUse}} onClick={() => { handleUseRoom(b.id); setOpenMenuId(null); }}>Sử dụng</button>
                                <button style={{...styles.dropdownBtn, ...styles.btnCancel}} onClick={() => { handleCancel(b.id); setOpenMenuId(null); }}>Hủy đơn</button>
                              </>
                            )}
                            {b.status === "Đang sử dụng" && (
                              <button style={{...styles.dropdownBtn, ...styles.btnComplete}} onClick={() => { handleCompleteRoom(b.id); setOpenMenuId(null); }}>Hoàn thành</button>
                            )}
                            {b.status === "Chờ hoàn tiền" && (
                              <button style={{...styles.dropdownBtn, ...styles.btnRefund}} onClick={() => { handleRefund(b.id); setOpenMenuId(null); }}>Hoàn tiền</button>
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
      {/* Pagination Footer giữ nguyên */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5px", fontSize: "14px" }}>
        <span>SHOWING {startIndex + 1} TO {Math.min(startIndex + itemsPerPage, totalItems)} OF {totalItems}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} style={{ background: "none", border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "18px" }}>❮</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => goToPage(p)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", background: p === currentPage ? "#00008b" : "#eaeaea", color: p === currentPage ? "white" : "black", fontWeight: "bold" }}>{p}</button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ background: "none", border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "18px" }}>❯</button>
        </div>
      </div>
    </div>
  );
};

export default StaBookingPage;