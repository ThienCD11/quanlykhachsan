import React, { useContext, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../App.js";
import { Navigate } from "react-router-dom";

const PersonalPage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    avatar: null,
    avatarPreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const baseStorageUrl = "http://127.0.0.1:8000/storage/";
  const avatarUrl = user.avatar
    ? `${baseStorageUrl}${user.avatar}`
    : "https://placehold.co/250x250/e0e0e0/777?text=Avatar";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Vui lòng chọn file ảnh (jpg, jpeg, png, gif)");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 2MB");
        return;
      }

      setFormData({
        ...formData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      });
      setError("");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone || "");
      formDataToSend.append("email", formData.email);
      formDataToSend.append("address", formData.address || "");
      
      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await fetch("http://127.0.0.1:8000/api/update-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Cập nhật thông tin thành công!");
        setUser(data.user);
        setIsEditing(false);
        
        if (formData.avatarPreview) {
          URL.revokeObjectURL(formData.avatarPreview);
        }
        
        setFormData({
          name: data.user.name,
          phone: data.user.phone,
          email: data.user.email,
          address: data.user.address,
          avatar: null,
          avatarPreview: null,
        });
      } else {
        setError(data.message || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Lỗi kết nối server. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordError("Mật khẩu mới không khớp");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setPasswordError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
        setPasswordLoading(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordSuccess("Đổi mật khẩu thành công!");
        setIsChangingPassword(false);
        setPasswordData({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        setPasswordError(data.message || "Đổi mật khẩu thất bại");
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setPasswordError("Lỗi kết nối server. Vui lòng kiểm tra lại.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
      avatar: null,
      avatarPreview: null,
    });
    setError("");
    setSuccess("");
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    });
    setPasswordError("");
    setPasswordSuccess("");
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: isEditing ? "#fff" : "#f9f9f9",
    color: "#333",
    cursor: isEditing ? "text" : "not-allowed",
    boxSizing: "border-box",
  };

  const passwordInputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    color: "#333",
    cursor: "text",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s",
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "80vh",
          padding: "40px 20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "30px",
          maxWidth: "800px",
          width: "100%"
        }}>
          
          {/* BOX 1: THÔNG TIN CÁ NHÂN */}
          <div
            style={{
              background: "white",
              padding: "30px 50px 40px 50px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ textAlign: "center", color: "navy", marginBottom: "30px" }}>
              Thông Tin Cá Nhân
            </h2>

            {error && (
              <div
                style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleUpdateProfile}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "15px 25px",
                  alignItems: "start",
                }}
              >
                <div style={{ gridColumn: "span 2" }}>
                  <label>Họ và Tên</label>
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? formData.name : user.name}
                    onChange={handleInputChange}
                    style={inputStyle}
                    readOnly={!isEditing}
                    required
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={isEditing ? formData.phone : user.phone}
                    onChange={handleInputChange}
                    style={inputStyle}
                    readOnly={!isEditing}
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? formData.email : user.email}
                    onChange={handleInputChange}
                    style={inputStyle}
                    readOnly={!isEditing}
                    required
                  />
                </div>

                <div style={{ gridColumn: "span 2" }}>
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={isEditing ? formData.address : user.address}
                    onChange={handleInputChange}
                    style={inputStyle}
                    readOnly={!isEditing}
                  />
                </div>

                <div
                  style={{
                    gridColumn: "3 / 5",
                    gridRow: "1 / 4",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <label style={{ alignSelf: "flex-start", marginLeft: "10px" }}>
                    Ảnh đại diện
                  </label>
                  <img
                    src={formData.avatarPreview || avatarUrl}
                    alt="Ảnh đại diện"
                    style={{
                      width: "250px",
                      height: "250px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #adadadff",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  />
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ marginTop: "10px", fontSize: "12px" }}
                    />
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  marginTop: "30px",
                }}
              >
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#1976d2",
                      color: "white",
                    }}
                  >
                    Sửa thông tin
                  </button>
                )}

                {isEditing && (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...buttonStyle,
                        backgroundColor: loading ? "#ccc" : "#4caf50",
                        color: "white",
                      }}
                    >
                      {loading ? "Đang lưu..." : "💾 Lưu thay đổi"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={loading}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#757575",
                        color: "white",
                      }}
                    >
                      ❌ Hủy
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* BOX 2: ĐỔI MẬT KHẨU */}
          <div
            style={{
              background: "white",
              padding: "30px 50px 40px 50px",
              borderRadius: "10px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h2 style={{ 
              textAlign: "center", 
              color: "#1976d2", 
              marginBottom: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}>
              
              <span>Đổi Mật Khẩu</span>
            </h2>

            {passwordError && (
              <div
                style={{
                  backgroundColor: "#ffebee",
                  color: "#c62828",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div
                style={{
                  backgroundColor: "#e8f5e9",
                  color: "#2e7d32",
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                {passwordSuccess}
              </div>
            )}

            {!isChangingPassword ? (
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  Bạn muốn thay đổi mật khẩu của mình?
                </p>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#1976d2",
                    color: "white",
                  }}
                >
                  Đổi mật khẩu
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    style={passwordInputStyle}
                    required
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    style={passwordInputStyle}
                    required
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    name="new_password_confirmation"
                    value={passwordData.new_password_confirmation}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                    style={passwordInputStyle}
                    required
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                  }}
                >
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    style={{
                      ...buttonStyle,
                      backgroundColor: passwordLoading ? "#ccc" : "#4caf50",
                      color: "white",
                    }}
                  >
                    {passwordLoading ? "Đang xử lý..." : "✅ Xác nhận đổi"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelPasswordChange}
                    disabled={passwordLoading}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#757575",
                      color: "white",
                    }}
                  >
                    ❌ Hủy
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default PersonalPage;