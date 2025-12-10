import React, { useEffect, useState } from "react";
import axios from "axios";

const StarRating = ({ rating }) => {
  const totalStars = 5;
  let numericRating = parseFloat(rating);

  if (isNaN(numericRating)) {
    return <span style={{ color: '#999', fontStyle: 'italic', paddingLeft:'20px' }}>Chưa có</span>;
  }
  
  const percentage = (numericRating / totalStars) * 100;
  const clipPercentage = `${Math.round(percentage)}%`;

  const starContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    fontSize: '20px',
  };

  const starsEmptyStyle = {
    color: '#e4e5e9',
    display: 'flex',
  };

  const starsFullStyle = {
    color: '#ffc107',
    position: 'absolute',
    top: 0,
    left: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    width: clipPercentage,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <div style={starContainerStyle}>
        <div style={starsEmptyStyle}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div style={starsFullStyle}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
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

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" hoặc "edit"
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    capacity: "",
    area: "",
    about: "",
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    setIsLoading(true);
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
  };

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

    if (!isNaN(x) && !isNaN(y)) {
      x = parseFloat(x);
      y = parseFloat(y);
    }

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

  // Modal handlers
  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      price: "",
      capacity: "",
      area: "",
      about: "",
      image: null
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (room) => {
    setModalMode("edit");
    setSelectedRoom(room);
    setFormData({
      name: room.name,
      price: room.price_raw || room.price, // Dùng price_raw nếu có, fallback về price
      capacity: room.capacity,
      area: room.area || "",
      about: room.about || "",
      image: null // Keep current image
    });
    setImagePreview(room.image ? `http://127.0.0.1:8000/${room.image}` : null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG!');
        e.target.value = '';
        return;
      }
      
      // Validate file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('Dung lượng ảnh không được vượt quá 5MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert("Tên phòng không được để trống!");
      return;
    }
    
    if (parseFloat(formData.price) < 0) {
      alert("Giá phòng phải lớn hơn hoặc bằng 0!");
      return;
    }
    
    if (modalMode === "add" && !formData.image) {
      alert("Vui lòng chọn hình ảnh phòng!");
      return;
    }
    
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('price', formData.price);
    submitData.append('capacity', formData.capacity);
    submitData.append('area', formData.area);
    submitData.append('about', formData.about);
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    if (modalMode === "add") {
      // API thêm phòng mới
      axios.post("http://127.0.0.1:8000/api/rooms", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          alert("Thêm phòng thành công!");
          fetchRooms();
          handleCloseModal();
        })
        .catch(err => {
          console.error("Lỗi khi thêm phòng:", err);
          alert(err.response?.data?.message || "Không thể thêm phòng mới.");
        });
    } else {
      // API cập nhật phòng
      axios.post(`http://127.0.0.1:8000/api/rooms/${selectedRoom.id}?_method=PUT`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          alert("Cập nhật phòng thành công!");
          fetchRooms();
          handleCloseModal();
        })
        .catch(err => {
          console.error("Lỗi khi cập nhật phòng:", err);
          alert(err.response?.data?.message || "Không thể cập nhật phòng.");
        });
    }
  };

  const handleDelete = (room) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa phòng "${room.name}"?`)) {
      axios.delete(`http://127.0.0.1:8000/api/rooms/${room.id}`)
        .then(res => {
          alert("Xóa phòng thành công!");
          fetchRooms();
        })
        .catch(err => {
          console.error("Lỗi khi xóa phòng:", err);
          alert("Không thể xóa phòng.");
        });
    }
  };
  
  // Định nghĩa style
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "5px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  };
  const tableHeaderStyle = {
    backgroundColor: "#000266ff",
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

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    width: '600px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  // Logic hiển thị
  if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách phòng...</h1>;
  if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản Lý Danh Sách Phòng</h2>
        <button 
          onClick={handleOpenAddModal}
          style={{
            padding: '12px 24px',
            backgroundColor: '#00008b',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          + Thêm phòng mới
        </button>
      </div>

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
            <th style={{...tableHeaderStyle, textAlign: 'center', width: '150px'}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRooms.length === 0 ? (
            <tr>
              <td colSpan="9" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có phòng nào trong hệ thống.</td>
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
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <button
                    onClick={() => handleOpenEditModal(room)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px',
                      fontSize: '13px'
                    }}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(room)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Xóa
                  </button>
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

      {/* Modal */}
      {showModal && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#000266ff' }}>
              {modalMode === "add" ? "Thêm Phòng Mới" : "Chỉnh Sửa Phòng"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Tên phòng: <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Ví dụ: Phòng Standard"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Mô tả phòng: <span style={{color: 'red'}}>*</span></label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                  placeholder="Nhập mô tả chi tiết về phòng..."
                  required
                />
              </div>

              <div style={{display: 'flex', gap: '15px'}}>
                <div style={{...formGroupStyle, flex: 1}}>
                  <label style={labelStyle}>Giá phòng (VNĐ): <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    placeholder="200000"
                    required
                  />
                </div>

                <div style={{...formGroupStyle, flex: 1}}>
                  <label style={labelStyle}>Diện tích (m²): <span style={{color: 'red'}}>*</span></label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    style={inputStyle}
                    min="0"
                    placeholder="18"
                    required
                  />
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Sức chứa (người): <span style={{color: 'red'}}>*</span></label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  style={inputStyle}
                  min="1"
                  placeholder="2"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  Hình ảnh phòng: {modalMode === "add" && <span style={{color: 'red'}}>*</span>}
                  <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '5px'}}>
                    (JPG, JPEG, PNG - Tối đa 5MB)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  style={{...inputStyle, padding: '8px'}}
                  required={modalMode === "add"}
                />
                {imagePreview && (
                  <div style={{marginTop: '10px', textAlign: 'center'}}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={buttonGroupStyle}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#999',
                    color: 'white'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#00008b',
                    color: 'white'
                  }}
                >
                  {modalMode === "add" ? "Lưu" : "Cập Nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaRoomPage;