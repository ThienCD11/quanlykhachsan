import React, { useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx"; // Giả sử file tên là Footer.jsx
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App.js"; // Giả sử App.js ở thư mục src/

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken  } = useContext(AuthContext);

  const handleLogin = async (e) => {
    // --- DEBUG BẮT ĐẦU ---
    console.log("Hàm handleLogin ĐÃ ĐƯỢC GỌI!"); // DÒNG DEBUG 1
    e.preventDefault();
    console.log("Hành vi mặc định của Form ĐÃ BỊ CHẶN!"); // DÒNG DEBUG 2
    // --- DEBUG KẾT THÚC ---

    setError(""); // Xóa lỗi cũ

    try {
      // Đảm bảo URL là chính xác
      const res = await axios.post("http://localhost:8000/api/login", {
        phone,
        password,
      });

      if (res.data.success) {
        console.log("Đăng nhập thành công! Response đầy đủ:", res.data);
        setUser(res.data.user);
        setToken(res.data.token);
        // navigate(-1); // Quay lại trang trước
        navigate("/"); 
      }
    } catch (err) {
      console.error("Lỗi Axios:", err); // Log lỗi chi tiết

      if (err.code === "ERR_NETWORK") {
        setError("Không thể kết nối đến máy chủ API. Vui lòng đảm bảo backend đang chạy trên http://127.0.0.1:8000.");
      } else if (err.response) {
        // Có phản hồi lỗi từ server (401, 404, 500...)
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

          {/* Đảm bảo form gọi đúng hàm */}
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
              type="submit" // Đảm bảo đây là type "submit"
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

