import React, { useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../App.js"; // Import Context
import { Navigate } from "react-router-dom"; // Import Navigate để bảo vệ route

const PersonalPage = () => {
  // 1. LẤY USER TỪ CONTEXT
  const { user } = useContext(AuthContext);

  // 2. BẢO VỆ ROUTE: Nếu chưa đăng nhập (user=null), chuyển về /login
  if (!user) {
    // replace: thay thế lịch sử, người dùng không thể nhấn "back" quay lại
    return <Navigate to="/login" replace />; 
  }
  
  // 3. XỬ LÝ URL ẢNH ĐẠI DIỆN
  // Giả sử API trả về đường dẫn tương đối (ví dụ: 'avatars/ten_file.png')
  const baseStorageUrl = "http://127.0.0.1:8000/storage/";
  // Nếu user.avatar có giá trị, nối chuỗi; nếu không, dùng ảnh placeholder
  const avatarUrl = user.avatar
    ? `${baseStorageUrl}${user.avatar}`
    : 'https://placehold.co/130x130/e0e0e0/777?text=Avatar';
  
  // 4. STYLE CHO CÁC Ô INPUT (chỉ đọc)
  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9", // Màu nền xám nhạt
    color: "#333", // Màu chữ đậm
    cursor: "not-allowed", // Biểu tượng con trỏ "cấm"
    boxSizing: 'border-box', // Đảm bảo padding không vỡ layout
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          padding: "40px 0",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px 50px 50px 50px",
            borderRadius: "10px",
            boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
            width: "800px",
            marginBottom: "200px",            
          }}
        >
          {/* 5. THAY ĐỔI TIÊU ĐỀ */}
          <h2 style={{ textAlign: "center", color: "navy", marginBottom: "30px" }}>
            Thông Tin Cá Nhân
          </h2>

          {/* 6. DÙNG <div> THAY VÌ <form> */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "15px 25px",
              alignItems: "start",
            }}
          >
            {/* Họ và Tên */}
            <div style={{ gridColumn: "span 2" }}>
              <label>Họ và Tên</label>
              <input
                type="text"
                value={user.name}
                style={inputStyle}
                readOnly // Chỉ đọc
              />
            </div>

            {/* Số điện thoại */}
            <div style={{ gridColumn: "span 2" }}>
              <label>Số điện thoại</label>
              <input
                type="text"
                value={user.phone}
                style={inputStyle}
                readOnly
              />
            </div>

            {/* Email */}
            <div style={{ gridColumn: "span 2" }}>
              <label>Email</label>
              <input
                type="email"
                value={user.email}
                style={inputStyle}
                readOnly
              />
            </div>

            {/* Địa chỉ */}
            {/* (Chuyển Địa chỉ lên trên để lấp đầy cột trái) */}
            <div style={{ gridColumn: "span 2" }}>
              <label>Địa chỉ</label>
              <input
                type="text"
                value={user.address}
                style={inputStyle}
                readOnly
              />
            </div>

            {/* Ảnh đại diện (Hiển thị) */}
            <div
              style={{
                gridColumn: "3 / 5", // Nằm bên phải
                gridRow: "1 / 4",    // Kéo dài 3 hàng
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Căn giữa
                justifyContent: "center",
                height: "100%",
              }}
            >
              <label style={{alignSelf: 'flex-start', marginLeft: '10px'}}>Ảnh đại diện</label>
              <img
                src={avatarUrl} // Dùng URL đã xử lý
                alt="Ảnh đại diện"
                style={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #adadadff",
                  marginTop: "10px",
                  marginBottom: "-70px",
                }}
              />
            </div>
            
            {/* 7. XÓA BỎ: Mật khẩu, Lỗi, Nút Đăng Ký */}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;