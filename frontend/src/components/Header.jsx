import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/3k.png";
import { AuthContext } from "../App"; 

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  
  // 3. Lấy state 'user' và hàm 'setUser' từ Context
  const { user, setUser } = useContext(AuthContext);
  
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 4. Hàm xử lý Đăng xuất
  const handleLogout = () => {
    setUser(null); // Xóa state toàn cục
    localStorage.removeItem('user'); // Xóa khỏi localStorage
    setAccountMenuOpen(false); // Đóng menu
    navigate('/'); // Điều hướng về trang chủ
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "12px 20px",
    display: "block",
    color: "white",
    borderRadius: "7px",
    background: isActive ? "#060f68ff" : "transparent",
  });

  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "darkblue",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{ fontWeight: "bold", fontSize: "22px", color: "white", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <NavLink
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50px",
            width: "160px",
          }}
        >
          {/* Sửa: Thay vì dùng logo được import, dùng URL placeholder */}
          {hovered ? (
            <img
              src={logo}
              alt="TAMKA HOTEL Logo"
              style={{
                height: "50px",
                objectFit: "contain",
                transition: "opacity 0.5s ease-in-out",
              }}
            />
          ) : (
            <span
              style={{
                transition: "opacity 0.5s ease-in-out",
                fontWeight: "bold",
                fontSize: "22px",
              }}
            >
              TAMKA HOTEL
            </span>
          )}
        </NavLink>
      </div>

      {/* Nút menu khi thu nhỏ (giữ nguyên) */}
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          fontSize: "26px",
          color: "white",
          cursor: "pointer",
          display: "none",
        }}
        className="menu-toggle"
      >
        ☰
      </div>

      {/* Menu giữa */}
      <div
        className="menu-links"
        style={{
          display: menuOpen ? "block" : "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: menuOpen ? "100%" : "auto",
          textAlign: "center",
        }}
      >
        <NavLink to="/" style={navLinkStyle}>
          Trang Chủ
        </NavLink>
        <NavLink to="/rooms" style={navLinkStyle}>
          Đặt Phòng
        </NavLink>
        <NavLink to="/facilities" style={navLinkStyle}>
          Tiện Nghi
        </NavLink>
        <NavLink to="/contact" style={navLinkStyle}>
          Liên Hệ
        </NavLink>

        {user && user.role === 'admin' && (
          <NavLink to="/statistic" style={navLinkStyle}>
            Thống Kê
          </NavLink>
        )}
        {user && user.role === 'customer' && (
          <NavLink to="/history" style={navLinkStyle}>
            Lịch Sử
          </NavLink>
        )}
      </div>

      {/* Góc phải (NÚT ĐĂNG NHẬP / THÔNG TIN USER) */}
      <div style={{ marginTop: menuOpen ? "10px" : "0", position: "relative" }}>
        {/* 6. Kiểm tra 'user' từ Context, không phải state giả lập nữa */}
        {!user ? (
          // --- CHƯA ĐĂNG NHẬP ---
          <NavLink
            to="/login"
            style={{
              padding: "10px 15px",
              border: "1.5px solid white",
              background: "navy",
              color: "white",
              fontSize: "17px",
              borderRadius: "5px",
              fontWeight: "bold",
              transition: "all 0.2s ease",
              textDecoration: "none",
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#041761ff";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "navy";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Đăng nhập
          </NavLink>
        ) : (
          // --- ĐÃ ĐĂNG NHẬP ---
          <div style={{ position: "relative", display: "inline-block" }}>
            <div
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                background: "navy",
                color: "white",
                borderRadius: "8px",
                padding: "3px 11px 3px 7px",
                cursor: "pointer",
                border: "1.5px solid white",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#041761ff";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "navy";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img
                // 7. Lấy avatar từ user
                src={`http://localhost:8000/storage/${user.avatar}`}
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "7px",
                  objectFit: 'cover' // Thêm cái này để ảnh không bị méo
                }}
              />
              {/* 8. Lấy tên từ user */}
              <span style={{ fontWeight: "bold" }}>{user.name}</span>
            </div>

            {/* Menu xổ xuống */}
            {accountMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  marginTop: "4px",
                  background: "navy",
                  border: "2px solid #ccc",
                  borderRadius: "5px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  width: "140px",
                  textAlign: "left",
                  // color: "black"
                }}
              >
                <button
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "13px 10px",
                    border: "none",
                    background: "navy",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "white",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#000052ff")}
                  onMouseLeave={(e) => (e.target.style.background = "navy")}
                >
                  Thông tin tài khoản
                </button>
                <button
                  // 9. Thêm sự kiện onClick để Đăng xuất
                  onClick={handleLogout}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "13px 10px",
                    border: "none",
                    background: "navy",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "white",
                    borderTop: "1px solid #ddd",
                  }}
                  onMouseEnter={(e) => (e.target.style.background = "#000052ff")}
                  onMouseLeave={(e) => (e.target.style.background = "navy")}
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive style (giữ nguyên) */}
      <style>
        {`
          @media (max-width: 850px) {
            .menu-toggle {
              display: block;
            }
            .menu-links {
              display: none;
            }
            nav {
              flex-direction: column;
              align-items: flex-start;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default Header;
