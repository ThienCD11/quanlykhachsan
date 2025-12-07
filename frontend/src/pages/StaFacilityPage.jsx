import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWifi, FaCoffee, FaSpa } from "react-icons/fa"; // Thêm icons để hiển thị các tiện nghi

const StaFacilityPage = () => {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL API được định nghĩa trong FacilityController.php
  const API_URL = "http://localhost:8000/api/facilities"; 

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await axios.get(API_URL);
        // Dữ liệu từ controller đã được map sẵn: {name, icon, description}
        setFacilities(res.data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu tiện nghi:", err);
        setError("Không thể tải danh sách tiện nghi. Vui lòng kiểm tra API.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Hàm chọn Icon dựa trên tên (Tùy chọn, nếu bạn không muốn dùng trường 'icon' từ DB)
  const getIconComponent = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("wifi")) return <FaWifi style={{ color: '#007bff' }} />;
    if (lowerName.includes("spa") || lowerName.includes("massage")) return <FaSpa style={{ color: '#e74c3c' }} />;
    if (lowerName.includes("cafe") || lowerName.includes("bar")) return <FaCoffee style={{ color: '#8b4513' }} />;
    return null; // Trả về null nếu không khớp
  };

  // --- STYLES (Dùng lại cấu trúc style từ StaBookingPage.jsx) ---
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "5px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginTop: "20px",
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

  return (
    <div>
      <h2>Danh Sách Tiện Nghi Khách Sạn</h2>

      {isLoading ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Đang tải tiện nghi...</h1>
      ) : error ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px", color: 'red' }}>{error}</h1>
      ) : facilities.length === 0 ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Chưa có tiện nghi nào được thêm vào.</h1>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{...tableHeaderStyle, width: '5%', textAlign: 'center'}}>STT</th>
              <th style={{...tableHeaderStyle, width: '10%', textAlign: 'center'}}>Icon</th>
              <th style={{...tableHeaderStyle, width: '25%'}}>Tên tiện nghi</th>
              <th style={{...tableHeaderStyle, textAlign: 'center'}}>Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f, index) => (
              <tr key={index}>
                <td style={{ ...tableCellStyle, textAlign: 'center' }}>{index + 1}</td>
                <td style={{ ...tableCellStyle, textAlign: 'center', fontSize: '20px' }}>
                    {/* Hiển thị icon từ DB (nếu có) hoặc dùng hàm getIconComponent */}
                    {f.icon ? <img src={f.icon} alt={f.name} style={{ width: '50px', height: '50px' }} /> : getIconComponent(f.name)}
                </td>
                <td style={tableCellStyle}>{f.name}</td>
                <td style={tableCellStyle}>{f.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaFacilityPage;