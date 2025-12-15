import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWifi, FaCoffee, FaSpa, FaSwimmingPool, FaParking, FaDumbbell, FaUtensils, FaConciergeBell } from "react-icons/fa";

const StaFacilityPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedFacility, setSelectedFacility] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/facilities";

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = () => {
    setIsLoading(true);
    axios.get(API_URL)
      .then(res => {
        setFacilities(res.data);
        setError(null);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu tiện nghi:", err);
        setError("Không thể tải danh sách tiện nghi.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormData({
      name: "",
      description: "",
      icon: null
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (facility) => {
    setModalMode("edit");
    setSelectedFacility(facility);
    setFormData({
      name: facility.name,
      description: facility.description,
      icon: null
    });
    setImagePreview(facility.icon ? `http://127.0.0.1:8000/${facility.icon}` : null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFacility(null);
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
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file ảnh định dạng JPG, JPEG, PNG hoặc SVG!');
        e.target.value = '';
        return;
      }
      
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Dung lượng icon không được vượt quá 2MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        icon: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Tên tiện nghi không được để trống!");
      return;
    }
    
    if (!formData.description.trim()) {
      alert("Mô tả không được để trống!");
      return;
    }
    
    if (modalMode === "add" && !formData.icon) {
      alert("Vui lòng chọn icon tiện nghi!");
      return;
    }
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    
    if (formData.icon) {
      submitData.append('icon', formData.icon);
    }
    
    if (modalMode === "add") {
      axios.post(API_URL, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          alert("Thêm tiện nghi thành công!");
          fetchFacilities();
          handleCloseModal();
        })
        .catch(err => {
          console.error("Lỗi khi thêm tiện nghi:", err);
          alert(err.response?.data?.message || "Không thể thêm tiện nghi mới.");
        });
    } else {
      axios.post(`${API_URL}/${selectedFacility.id}?_method=PUT`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => {
          alert("Cập nhật tiện nghi thành công!");
          fetchFacilities();
          handleCloseModal();
        })
        .catch(err => {
          console.error("Lỗi khi cập nhật tiện nghi:", err);
          alert(err.response?.data?.message || "Không thể cập nhật tiện nghi.");
        });
    }
  };

  const handleDelete = (facility) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tiện nghi "${facility.name}"?`)) {
      axios.delete(`${API_URL}/${facility.id}`)
        .then(res => {
          alert("Xóa tiện nghi thành công!");
          fetchFacilities();
        })
        .catch(err => {
          console.error("Lỗi khi xóa tiện nghi:", err);
          alert(err.response?.data?.message || "Không thể xóa tiện nghi.");
        });
    }
  };

  const getIconComponent = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("wifi")) return <FaWifi style={{ color: '#007bff', fontSize: '24px' }} />;
    if (lowerName.includes("spa") || lowerName.includes("massage")) return <FaSpa style={{ color: '#e74c3c', fontSize: '24px' }} />;
    if (lowerName.includes("cafe") || lowerName.includes("coffee") || lowerName.includes("bar")) return <FaCoffee style={{ color: '#8b4513', fontSize: '24px' }} />;
    if (lowerName.includes("pool") || lowerName.includes("bể bơi")) return <FaSwimmingPool style={{ color: '#3498db', fontSize: '24px' }} />;
    if (lowerName.includes("parking") || lowerName.includes("bãi đỗ")) return <FaParking style={{ color: '#2ecc71', fontSize: '24px' }} />;
    if (lowerName.includes("gym") || lowerName.includes("fitness")) return <FaDumbbell style={{ color: '#e67e22', fontSize: '24px' }} />;
    if (lowerName.includes("nhà hàng") || lowerName.includes("restaurant")) return <FaUtensils style={{ color: '#c0392b', fontSize: '24px' }} />;
    return <FaConciergeBell style={{ color: '#95a5a6', fontSize: '24px' }} />;
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
  };
  
  const tableCellStyle = {
    padding: "15px",
    borderBottom: "1px solid #e5e5e5",
    backgroundColor: "white",
  };

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
    width: '500px',
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

  if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách tiện nghi...</h1>;
  if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản Lý Tiện Nghi Khách Sạn</h2>
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
          + Thêm tiện nghi mới
        </button>
      </div>

      {facilities.length === 0 ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Chưa có tiện nghi nào được thêm vào.</h1>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{...tableHeaderStyle, width: '5%', textAlign: 'center'}}>STT</th>
              <th style={{...tableHeaderStyle, width: '10%', textAlign: 'center'}}>Icon</th>
              <th style={{...tableHeaderStyle, width: '15%', textAlign: 'left'}}>Tên tiện nghi</th>
              <th style={{...tableHeaderStyle, textAlign: 'center'}}>Mô tả</th>
              <th style={{...tableHeaderStyle, textAlign: 'center', width: '130px'}}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((facility, index) => (
              <tr key={facility.id || index}>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>{index + 1}</td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  {facility.icon ? (
                    <img 
                      src={`http://127.0.0.1:8000/${facility.icon}`} 
                      alt={facility.name} 
                      style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
                    />
                  ) : (
                    getIconComponent(facility.name)
                  )}
                </td>
                <td style={tableCellStyle}>{facility.name}</td>
                <td style={{...tableCellStyle, textAlign: 'justify'}}>{facility.description}</td>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>
                  <button
                    onClick={() => handleOpenEditModal(facility)}
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
                    onClick={() => handleDelete(facility)}
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
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div style={modalOverlayStyle} onClick={handleCloseModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, marginBottom: '25px', color: '#000266ff' }}>
              {modalMode === "add" ? "Thêm Tiện Nghi Mới" : "Chỉnh Sửa Tiện Nghi"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Tên tiện nghi: <span style={{color: 'red'}}>*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Ví dụ: Wifi miễn phí"
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Mô tả: <span style={{color: 'red'}}>*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                  placeholder="Nhập mô tả chi tiết về tiện nghi..."
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>
                  Icon: {modalMode === "add" && <span style={{color: 'red'}}>*</span>}
                  <span style={{fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '5px'}}>
                    (JPG, PNG, SVG - Tối đa 2MB)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
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
                        maxWidth: '100px',
                        maxHeight: '100px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        objectFit: 'contain'
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

export default StaFacilityPage;