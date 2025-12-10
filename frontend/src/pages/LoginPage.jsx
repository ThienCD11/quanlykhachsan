import React, { useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App.js";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // CHỈ CẦN setUser

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Đang đăng nhập...");

    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        phone,
        password,
      });

      console.log("Response đầy đủ:", res.data);

      if (res.data.success) {
        console.log("Đăng nhập thành công!");
        console.log("Token nhận được:", res.data.token);
        
        // *** QUAN TRỌNG: LƯU TOKEN VÀO LOCALSTORAGE ***
        localStorage.setItem("token", res.data.token);
        
        // Kiểm tra token đã lưu chưa
        const savedToken = localStorage.getItem("token");
        console.log("Token đã lưu vào localStorage:", savedToken);
        
        // Lưu user vào Context
        setUser(res.data.user);
        console.log("User đã lưu vào Context:", res.data.user);
        
        // Chuyển hướng
        navigate("/");
      }
    } catch (err) {
      console.error("Lỗi Axios:", err);

      if (err.code === "ERR_NETWORK") {
        setError("Không thể kết nối đến máy chủ API. Vui lòng đảm bảo backend đang chạy.");
      } else if (err.response) {
        setError(err.response.data.message || "Lỗi từ server.");
      } else {
        setError("Lỗi đăng nhập. Vui lòng thử lại.");
      }
    }
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
          backgroundColor: "#F0F0F0",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px 50px",
            borderRadius: "10px",
            width: "350px",
            boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ textAlign: "center", color: "navy", marginBottom: "25px" }}>
            Đăng Nhập
          </h2>

          <form onSubmit={handleLogin}>
            <label>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
              style={{
                width: "94%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              style={{
                width: "94%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />

            {error && (
              <p
                style={{
                  color: "red",
                  textAlign: "center",
                  background: "#fff0f0",
                  padding: "8px",
                  borderRadius: "5px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "darkblue",
                color: "white",
                fontWeight: "bold",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#041761ff")}
              onMouseLeave={(e) => (e.target.style.background = "darkblue")}
            >
              Đăng nhập
            </button>

            <p style={{ textAlign: "center", marginTop: "20px", fontSize: "14px" }}>
              Chưa có tài khoản?{" "}
              <Link to="/register" style={{ color: "darkblue", fontWeight: "bold", textDecoration: "none" }}>
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;