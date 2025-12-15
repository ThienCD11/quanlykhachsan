import React, { useState, useContext } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom"; // 1. IMPORT useNavigate

const PasswordPage = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // 2. KHỞI TẠO navigate

    const handleGoBack = () => {
        // Chuyển hướng đến trang Đăng Nhập
        navigate('/login'); 
    };

    const submitButtonStyle = {
        width: "100%",
        padding: "12px",
        backgroundColor: "darkblue",
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        marginBottom: "10px", // Khoảng cách giữa nút Gửi mã và Quay lại
    };

    const backButtonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#ffffffff", // Màu xám cho nút quay lại
        color: "navy",
        fontWeight: "bold",
        border: "2px solid navy",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        marginTop: "10px", // Khoảng cách giữa nút Gửi mã và Quay lại
    };

    return (
        <>
            <Header />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "50px",
                    gap: "20px",
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
                        width: "390px",
                        boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    <h2 style={{ textAlign: "center", color: "navy", marginBottom: "25px" }}>
                        Quên Mật Khẩu
                    </h2>

                    <form>
                        <label>Nhập email để gửi mã</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email của bạn"
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
                                    marginBottom: "15px", // Thêm khoảng cách dưới lỗi
                                }}
                            >
                                {error}
                            </p>
                        )}
                        
                        {/* Nút Gửi mã */}
                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseEnter={(e) => (e.target.style.background = "#041761ff")}
                            onMouseLeave={(e) => (e.target.style.background = "darkblue")}
                        >
                            Gửi mã
                        </button>
                        
                        {/* Nút Quay lại mới */}
                        <button
                            type="button" // Sử dụng type="button" để tránh gửi form
                            onClick={handleGoBack}
                            style={backButtonStyle}
                            onMouseEnter={(e) => (
                                e.target.style.background = "#00008b",
                                e.target.style.color = "#ffffffff"
                            )}
                            onMouseLeave={(e) => (
                                e.target.style.background = "#ffffffff",
                                e.target.style.color = "navy"
                            )}
                        >
                            Quay lại trang Đăng nhập
                        </button>
                    </form>
                </div>

                <div
                    style={{
                        background: "white",
                        padding: "40px 50px",
                        borderRadius: "10px",
                        width: "390px",
                        boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    <h2 style={{ textAlign: "center", color: "navy", marginBottom: "25px" }}>
                        Đổi Mật Khẩu
                    </h2>

                    <form>
                        <label>Nhập mã</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập mã"
                            style={{
                                width: "94%",
                                padding: "10px",
                                marginBottom: "15px",
                                borderRadius: "5px",
                                border: "1px solid #ccc",
                            }}
                            required
                        />
                        <label>Mật khẩu mới</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
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
                                    marginBottom: "15px", // Thêm khoảng cách dưới lỗi
                                }}
                            >
                                {error}
                            </p>
                        )}
                        
                        {/* Nút Gửi mã */}
                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseEnter={(e) => (e.target.style.background = "#041761ff")}
                            onMouseLeave={(e) => (e.target.style.background = "darkblue")}
                        >
                            Đổi mật khẩu
                        </button>
                    </form>
                </div>
            </div> 
            <Footer />
        </>
    );
};

export default PasswordPage;