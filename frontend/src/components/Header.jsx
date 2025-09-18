import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav
      style={{
        display: "flex",
        height: "50px",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
        background: "#fff"
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>
          Triệu Hotel
        </Link>
      </div>

      {/* Menu giữa */}
      <div style={{ flex: 1, textAlign: "center" }}>
        <Link to="/" style={{ margin: "0 15px" }}>Trang Chủ</Link>
        <Link to="/rooms" style={{ margin: "0 15px" }}>Phòng</Link>
        <Link to="/facilities" style={{ margin: "0 15px" }}>Tiện Nghi</Link>
        <Link to="/contact" style={{ margin: "0 15px" }}>Liên Hệ</Link>
      </div>

      {/* Góc phải */}
      <div>
        <button
          style={{
            marginRight: "10px",
            padding: "6px 12px",
            border: "1px solid #000000ff",
            background: "#053c77ff",
            color: "white",
            borderRadius: "5px"
          }}
        >
          Đăng nhập
        </button>
        <button
          style={{
            padding: "6px 12px",
            border: "1px solid black",
            background: "whitesmoke",
            borderRadius: "5px"
          }}
        >
          Đăng ký
        </button>
      </div>
    </nav>
  );
};

export default Header;
