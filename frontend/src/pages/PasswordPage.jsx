import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

const PasswordPage = () => {
    // 1. STATE CHÍNH
    const [step, setStep] = useState(1); // 1: Gửi Email, 2: Nhập mã & Đổi mật khẩu
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    // 2. STATE CHO FORM RESET (Bước 2)
    const [resetData, setResetData] = useState({
        code: "",
        password: "",
        password_confirmation: "",
    });
    
    const navigate = useNavigate();

    // --- CÁC HÀM XỬ LÝ ---
    const handleGoBack = () => {
        // Quay lại trang đăng nhập
        navigate('/login'); 
    };

    const handleResetDataChange = (e) => {
        setResetData({ ...resetData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý Bước 1: Gửi Email
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            // Gọi API gửi mã reset
            const res = await axios.post("http://127.0.0.1:8000/api/password/email", { email });
            
            setMessage(res.data.message);
            setStep(2); // Chuyển sang bước 2 (Form Reset)
            
        } catch (err) {
            const msg = err.response?.data?.message || "Lỗi khi gửi mã. Vui lòng kiểm tra Email.";
            setError(msg);
        }
    };

    // Hàm xử lý Bước 2: Đặt lại Mật khẩu
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (resetData.password !== resetData.password_confirmation) {
            setError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/password/reset", {
                email: email, // Sử dụng email đã nhập ở bước 1
                code: resetData.code,
                password: resetData.password,
                password_confirmation: resetData.password_confirmation,
            });

            alert(res.data.message);
            navigate('/login'); // Quay về trang đăng nhập

        } catch (err) {
            const msg = err.response?.data?.message || "Đặt lại mật khẩu thất bại.";
            setError(msg);
        }
    };


    // --- STYLES ---
    const inputStyle = {
        width: "94%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
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
        marginBottom: "10px",
    };

    const backButtonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#ffffffff",
        color: "navy",
        fontWeight: "bold",
        border: "2px solid navy",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.2s",
        marginTop: "10px",
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
                        width: "450px", 
                        boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
                    }}
                >
                    <h2 style={{ textAlign: "center", color: "navy", marginBottom: "25px" }}>
                        Quên Mật Khẩu
                    </h2>
                    
                    {/* KHỐI HIỂN THỊ THÔNG BÁO CHUNG */}
                    {(error || message) && (
                        <p
                            style={{
                                color: error ? "red" : "green",
                                textAlign: "center",
                                background: error ? "#fff0f0" : "#f0fff0",
                                padding: "8px",
                                borderRadius: "5px",
                                marginBottom: "15px",
                                border: error ? "1px solid red" : "1px solid green"
                            }}
                        >
                            {error || message}
                        </p>
                    )}

                    {/* --- STEP 1: NHẬP EMAIL & GỬI MÃ --- */}
                    {step === 1 && (
                        <form onSubmit={handleSendCode}>
                            <label>Nhập email để gửi mã đặt lại</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn"
                                style={inputStyle}
                                required
                            />
                            
                            <button
                                type="submit"
                                style={submitButtonStyle}
                                onMouseEnter={(e) => (e.target.style.background = "#041761ff")}
                                onMouseLeave={(e) => (e.target.style.background = "darkblue")}
                            >
                                Gửi mã đặt lại
                            </button>
                            
                            <button
                                type="button"
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
                    )}
                    
                    {/* --- STEP 2: NHẬP MÃ & ĐẶT LẠI MẬT KHẨU --- */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword}>
                             <p style={{marginBottom: "20px", color: "gray"}}>
                                **Mã xác thực đã được gửi tới: ** <strong style={{color: 'navy'}}>{email}</strong>
                            </p>
                            
                            <label>Mã xác thực (6 số)</label>
                            <input 
                                type="text"
                                name="code"
                                value={resetData.code}
                                onChange={handleResetDataChange}
                                placeholder="Nhập mã xác thực từ Email"
                                style={inputStyle}
                                required
                            />

                            <label>Mật khẩu mới</label>
                            <input
                                type="password"
                                name="password"
                                value={resetData.password}
                                onChange={handleResetDataChange}
                                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                                style={inputStyle}
                                required
                            />

                            <label>Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={resetData.password_confirmation}
                                onChange={handleResetDataChange}
                                placeholder="Xác nhận mật khẩu mới"
                                style={inputStyle}
                                required
                            />
                            
                            <button
                                type="submit"
                                style={submitButtonStyle}
                                onMouseEnter={(e) => (e.target.style.background = "#041761ff")}
                                onMouseLeave={(e) => (e.target.style.background = "darkblue")}
                            >
                                Đặt Lại Mật Khẩu
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(''); setMessage('');}} // Reset lỗi và chuyển về bước 1
                                style={{...backButtonStyle, marginTop: '10px'}}
                                onMouseEnter={(e) => (
                                    e.target.style.background = "#00008b",
                                    e.target.style.color = "#ffffffff"
                                )}
                                onMouseLeave={(e) => (
                                    e.target.style.background = "#ffffffff",
                                    e.target.style.color = "navy"
                                )}
                            >
                                Yêu cầu mã mới
                            </button>
                        </form>
                    )}

                </div>
            </div> 
            <Footer />
        </>
    );
};

export default PasswordPage;