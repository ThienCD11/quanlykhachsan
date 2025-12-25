import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let numericRating = parseFloat(rating);
  if (isNaN(numericRating)) {
    return <span style={{ color: '#999', fontStyle: 'italic', paddingLeft:'20px' }}>Chưa có</span>;
  }
  const percentage = (numericRating / totalStars) * 100;
  const clipPercentage = `${Math.round(percentage)}%`;
  const starContainerStyle = { position: 'relative', display: 'inline-block', fontSize: '20px' };
  const starsEmptyStyle = { color: '#e4e5e9', display: 'flex' };
  const starsFullStyle = { color: '#ffc107', position: 'absolute', top: 0, left: 0, whiteSpace: 'nowrap', overflow: 'hidden', width: clipPercentage };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={starContainerStyle}>
        <div style={starsEmptyStyle}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        <div style={starsFullStyle}><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
      </div>
      <span>({rating})</span>
    </div>
  );
};

const StaRoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [formData, setFormData] = useState({ name: "", price: "", capacity: "", area: "", about: "", image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const fetchRooms = useCallback(() => {
    setIsLoading(true);
    axios.get("http://127.0.0.1:8000/api/statistic/rooms")
      .then(res => { setRooms(res.data); setError(null); })
      .catch(err => { setError("Không thể tải dữ liệu."); })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let x = a[sortConfig.key];
    let y = b[sortConfig.key];

    if (sortConfig.key === "price") {
      let numX = parseFloat(String(x).replace(/[^0-9]/g, "")) || 0;
      let numY = parseFloat(String(y).replace(/[^0-9]/g, "")) || 0;
      return sortConfig.direction === "asc" ? numX - numY : numY - numX;
    }
    if (sortConfig.key === "rating_avg") {
      let numX = parseFloat(x) || 0;
      let numY = parseFloat(y) || 0;
      return sortConfig.direction === "asc" ? numX - numY : numY - numX;
    }
    if (!isNaN(parseFloat(x)) && isFinite(x) && !isNaN(parseFloat(y)) && isFinite(y)) {
      return sortConfig.direction === "asc" ? parseFloat(x) - parseFloat(y) : parseFloat(y) - parseFloat(x);
    }
    let strX = String(x || "").toLowerCase();
    let strY = String(y || "").toLowerCase();
    if (strX < strY) return sortConfig.direction === "asc" ? -1 : 1;
    if (strX > strY) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalItems = rooms.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRooms = sortedRooms.slice(startIndex, startIndex + rowsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- CẬP NHẬT THÔNG BÁO TẠI ĐÂY ---
  const handleToggleMaintenance = async (room) => {
    setOpenMenuId(null);
    const action = room.is_active ? "ngừng hoạt động để bảo trì" : "mở cửa hoạt động lại";
    
    if (window.confirm(`Bạn có chắc chắn muốn ${action} phòng ${room.name}?`)) {
      try {
        const res = await axios.post(`http://127.0.0.1:8000/api/rooms/${room.id}/toggle-status`);
        alert(res.data.message);
        fetchRooms();
      } catch (err) {
        // Lấy message cụ thể từ backend gửi về (ví dụ: "Phòng đang có khách...")
        const errorMessage = err.response?.data?.message || "Lỗi cập nhật trạng thái.";
        alert(`Thất bại: ${errorMessage}`);
      }
    }
  };

  const handleDeleteRoom = async (room) => {
    setOpenMenuId(null);
    if (window.confirm(`CẢNH BÁO: Xóa phòng "${room.name}" sẽ xóa VĨNH VIỄN toàn bộ lịch sử booking. Bạn có chắc chắn?`)) {
      try {
        const res = await axios.delete(`http://127.0.0.1:8000/api/rooms/${room.id}`);
        alert(res.data.message);
        fetchRooms();
      } catch (err) {
        // Lấy message chặn xóa từ backend (ví dụ: "Không thể xóa phòng vì đơn chưa kết thúc")
        const errorMessage = err.response?.data?.message || "Không thể xóa phòng.";
        alert(`Thất bại: ${errorMessage}`);
      }
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({ name: "", price: "", capacity: "", area: "", about: "", image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (room) => {
    setModalMode("edit");
    setSelectedRoom(room);
    setFormData({ name: room.name, price: room.price_raw || room.price, capacity: room.capacity, area: room.area || "", about: room.about || "", image: null });
    setImagePreview(room.image ? `http://127.0.0.1:8000/${room.image}` : null);
    setShowModal(true);
  };

  const handleCloseModal = () => { setShowModal(false); setSelectedRoom(null); setImagePreview(null); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => { setImagePreview(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('capacity', formData.capacity);
    submitData.append('area', formData.area);
    submitData.append('about', formData.about);
    if (formData.image) submitData.append('image', formData.image);

    const url = modalMode === "add" ? "http://127.0.0.1:8000/api/rooms" : `http://127.0.0.1:8000/api/rooms/${selectedRoom.id}?_method=PUT`;
    axios.post(url, submitData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(() => { alert(modalMode === "add" ? "Thêm thành công!" : "Cập nhật thành công!"); fetchRooms(); handleCloseModal(); })
      .catch(err => { alert(err.response?.data?.message || "Lỗi hệ thống."); });
  };

  const styles = {
    dropdownBtn: { display: "block", width: "100%", padding: "10px", border: "none", textAlign: "center", cursor: "pointer", fontSize: "13px", borderBottom: "1px solid #eee", transition: "all 0.2s", fontWeight: "500" },
    btnMaintenance: { color: "#ffffff", fontWeight: "bold", background: "#c38a05ff" },
    btnActivate: { color: "#ffffff", fontWeight: "bold", background: "#009205ff" },
    btnEdit: { color: "#ffffff", fontWeight: "bold", background: "#00008b" },
    btnDelete: { color: "#ffffff", fontWeight: "bold", background: "#b90f03ff" },
  };

  const tableStyle = { width: "100%", borderCollapse: "collapse", borderRadius: "5px", backgroundColor: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" };
  const tableHeaderStyle = { backgroundColor: "#000266ff", color: "white", padding: "15px", textAlign: "left", cursor: "pointer" };
  const tableCellStyle = { padding: "15px", borderBottom: "1px solid #ddd", textAlign: "left" };
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '10px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' };

  if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách phòng...</h1>;
  if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản Lý Danh Sách Phòng</h2>
        <button onClick={handleOpenAddModal} style={{ padding: '12px 24px', backgroundColor: '#00008b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>+ Thêm phòng mới</button>
      </div>

      <table style={{...tableStyle, borderRadius: '5px', overflow: 'hidden'}}>
        <thead>
          <tr>
            <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}} onClick={() => handleSort("stt")}>STT</th>
            <th style={tableHeaderStyle} onClick={() => handleSort("name")}>Tên phòng</th>
            <th style={tableHeaderStyle} onClick={() => handleSort("price")}>Giá phòng</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("capacity")}>Sức chứa</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("bookings_count")}>Lượt đặt</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("reviews_count")}>Đánh giá</th>
            <th style={{...tableHeaderStyle, width: '100px', textAlign: 'center'}} onClick={() => handleSort("rating_avg")}>Rating (TB)</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}} onClick={() => handleSort("status")}>Trạng thái</th>
            <th style={{...tableHeaderStyle, textAlign: 'center', width: '150px'}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRooms.length === 0 ? (
            <tr><td colSpan="9" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có phòng nào trong hệ thống.</td></tr>
          ) : (
            paginatedRooms.map((room, index) => {
              const isLastThreeRows = index >= paginatedRooms.length - 2;
              return (
                <tr key={room.id}>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{room.stt}</td>
                  <td style={tableCellStyle}>{room.name}</td>
                  <td style={tableCellStyle}>{room.price}</td>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{room.capacity}</td>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{room.bookings_count}</td>
                  <td style={{...tableCellStyle, textAlign: 'center'}}>{room.reviews_count}</td>
                  <td style={tableCellStyle}><StarRating rating={room.rating_avg} /></td>
                  <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                    <span style={{
                      padding: "5px", borderRadius: "5px", fontWeight: "bold", fontSize: "15px",
                      color: room.status === "Đang có khách" ? "red" : room.status === "Đang bảo trì" ? "#b17d03ff" : "green",
                      backgroundColor: room.status === "Đang có khách" ? "#fbb5b3" : room.status === "Đang bảo trì" ? "#f1dc99ff" : "#9dea9d",
                      display: "inline-block", minWidth: "110px"
                    }}>
                      {room.status}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center", position: "relative" }}>
                    <button onClick={() => setOpenMenuId(openMenuId === room.id ? null : room.id)}
                      style={{ padding: '8px 12px', backgroundColor: '#00008b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', minWidth: '90px' }}>
                      Quản lý ▼
                    </button>
                    {openMenuId === room.id && (
                      <div style={{ position: "absolute", zIndex: 10, right: '10%', backgroundColor: 'white', border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", width: "140px", overflow: "hidden", ...(isLastThreeRows ? { bottom: "75%" } : { top: "75%" }) }}>
                        <button style={{...styles.dropdownBtn, ...(room.is_active ? styles.btnMaintenance : styles.btnActivate)}} onClick={() => handleToggleMaintenance(room)}>
                          {room.is_active ? "Bảo trì" : "Kích hoạt"}
                        </button>
                        <button style={{...styles.dropdownBtn, ...styles.btnEdit}} onClick={() => { handleOpenEditModal(room); setOpenMenuId(null); }}>
                          Sửa phòng
                        </button>
                        <button style={{...styles.dropdownBtn, ...styles.btnDelete}} onClick={() => handleDeleteRoom(room)}>
                          Xóa phòng
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5px", fontSize: "14px" }}>
        <span>SHOWING {startIndex + 1} TO {Math.min(startIndex + rowsPerPage, totalItems)} OF {totalItems}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} style={{ background: "none", border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "18px" }}>❮</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => paginate(i + 1)} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", background: i + 1 === currentPage ? "#00008b" : "#eaeaea", color: i + 1 === currentPage ? "white" : "black", fontWeight: "bold" }}>{i + 1}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} style={{ background: "none", border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "18px" }}>❯</button>
        </div>
      </div>

      {showModal && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#000266ff' }}>{modalMode === "add" ? "Thêm Phòng Mới" : "Chỉnh Sửa Phòng"}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Tên phòng: *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '95%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="Ví dụ: Standard" required /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Mô tả phòng: *</label><textarea name="about" value={formData.about} onChange={handleInputChange} style={{ width: '95%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px' }} placeholder="Mô tả chi tiết" required /></div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Giá (VNĐ): *</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} style={{ width: '90%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="Ví dụ: 200000" required /></div>
                <div style={{ flex: 1, marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Diện tích (m²): *</label><input type="number" name="area" value={formData.area} onChange={handleInputChange} style={{ width: '90%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="Ví dụ: 20" required /></div>
              </div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Sức chứa: *</label><input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} style={{ width: '95%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} placeholder="Ví dụ: 2" required /></div>
              <div style={{ marginBottom: '20px' }}><label style={{ display: 'block', fontWeight: 'bold' }}>Hình ảnh: {modalMode === "add" && "*"}</label><input type="file" onChange={handleImageChange} style={{ width: '95%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} required={modalMode === "add"} />{imagePreview && <img src={imagePreview} style={{ width: '100%', marginTop: '10px', borderRadius: '5px' }} alt="Preview" />}</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}><button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#999', color: 'white' }}>Hủy</button><button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: '#00008b', color: 'white', fontWeight: 'bold' }}>{modalMode === "add" ? "Lưu" : "Cập Nhật"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaRoomPage;