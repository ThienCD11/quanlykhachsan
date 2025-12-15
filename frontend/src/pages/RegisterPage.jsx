import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        address: "",
        avatar: null,
    });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Xử lý khi chọn ảnh đại diện hoặc nhập text
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "avatar") {
            const file = files[0];
            setFormData({ ...formData, avatar: file });
            // Tạo URL xem trước cho ảnh
            setAvatarPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Cleanup: Giải phóng bộ nhớ của URL xem trước ảnh khi component unmount
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
        };
    }, [avatarPreview]);

    // Gửi form đăng ký
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // LOGIC XÁC NHẬN MẬT KHẨU ĐÃ BỎ (ĐỂ BACKEND XỬ LÝ)
        
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'avatar' && formData[key] === null) {
                // Bỏ qua avatar nếu chưa chọn
                return;
            }
            data.append(key, formData[key]);
        });

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/register", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                alert(res.data.message || "Đăng ký thành công!");
                navigate("/login");
            }
        } catch (err) {
            // Hiển thị lỗi từ Backend (ví dụ: lỗi validation tiếng Việt)
            setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
        }
    };
    const handleGoBack = () => {
        navigate('/login'); 
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
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
                        padding: "40px 50px",
                        borderRadius: "10px",
                        boxShadow: "10px 10px 10px rgba(0,0,0,0.2)",
                        width: "800px",
                    }}
                >
                    <h2 style={{ textAlign: "center", color: "navy", marginBottom: "25px" }}>
                        Đăng Ký Tài Khoản
                    </h2>

                    <form
                        onSubmit={handleSubmit}
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
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div style={{ gridColumn: "span 2" }}>
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div style={{ gridColumn: "span 2" }}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Mật khẩu */}
                        <div style={{ gridColumn: "span 1" }}>
                            <label>Mật khẩu</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Nhập lại mật khẩu */}
                        <div style={{ gridColumn: "span 1" }}>
                            <label>Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                placeholder="Xác nhận mật khẩu"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Ảnh đại diện */}
                        <div
                            style={{
                                gridColumn: "3 / 5",
                                gridRow: "1 / 4",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "left",
                                width: "94.5%",
                            }}
                        >
                            <label>Ảnh đại diện</label>
                            <input
                                type="file"
                                name="avatar"
                                onChange={handleChange}
                                style={{ ...inputStyle, marginBottom: "15px" }}
                                accept="image/*"
                            />
                            {avatarPreview && (
                                <img
                                    src={avatarPreview}
                                    alt="Xem trước"
                                    style={{
                                        width: "130px",
                                        height: "130px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                        border: "2px solid #adadadff",
                                        alignSelf: "center",
                                        marginBottom: "-8px",
                                    }}
                                />
                            )}
                        </div>

                        {/* Địa chỉ */}
                        <div style={{ gridColumn: "3 / 5", gridRow: "4", width: "94.5%" }}>
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Lỗi */}
                        {error && (
                            <p
                                style={{
                                    color: "red",
                                    textAlign: "center",
                                    gridColumn: "1 / 5",
                                    margin: "0",
                                    backgroundColor: "#f5d5d5ff",
                                    padding: "5px",
                                    borderRadius: "5px",
                                }}
                            >
                                {error}
                            </p>
                        )}

                        {/* Nút đăng ký */}
                        <button
                            type="submit"
                            style={{
                                alignItems: "center",
                                width: "100%",
                                gridColumn: "1 / 5",
                                padding: "12px",
                                backgroundColor: "darkblue",
                                color: "white",
                                fontWeight: "bold",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.background = "#041761ff")
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background = "darkblue")
                            }
                        >
                            Đăng Ký
                        </button>
                        <button
                            type="button" // Sử dụng type="button" để tránh gửi form
                            onClick={handleGoBack}
                            // style={backButtonStyle}
                            style={{
                                alignItems: "center",
                                width: "100%",
                                gridColumn: "1 / 5",
                                padding: "10px",
                                backgroundColor: "white",
                                color: "navy",
                                fontWeight: "bold",
                                border: "2px solid navy",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
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
            </div>
            <Footer />
        </>
    );
};

export default RegisterPage;