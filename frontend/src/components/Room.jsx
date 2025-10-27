import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { NavLink, useNavigate } from "react-router-dom";
import img from "../images/next.png";

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/rooms?limit=5") // lấy tối đa 5 phòng
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  // const handleBooking = (roomId) => {
  //   navigate('/booking/' + room.id);
  // };

  return (
    <section style={{ padding: "40px 0", textAlign: "center" }}>
      {/* Tiêu đề */}
      <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "30px" }}>
        Phòng nổi bật
      </h3>
      <hr style={{
        width: "250px",
        marginTop: "-29px",
        marginBottom: "20px",
        border: "1px solid black",
        borderRadius: "2px"
      }} />

      {/* Danh sách phòng */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap", // tự xuống dòng nếu hẹp
          justifyContent: "center", // căn giữa hàng
          gap: "25px", // khoảng cách giữa các thẻ
          maxWidth: "1500px",
          margin: "0 auto", // căn giữa toàn vùng
        }}
      >
        {rooms.slice(0, 5).map((room) => (
          <div
            key={room.id}
            style={{
              // border: "0.2px solid #061797ff",
              padding: "10px",
              width: "220px",
              borderRadius: "8px",
              boxShadow: "8px 8px 10px rgba(0,0,0,0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              backgroundColor: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.2)";
            }}
          >
            <img
              src={room.image_url}
              alt={room.name}
              style={{
                width: "100%",
                height: "140px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
            <h4 style={{ margin: "10px 0 5px" }}>{room.name}</h4>
            <p style={{ color: "#000000ff", margin: "15px" }}>
              {Number(room.price).toLocaleString("vi-VN")} VND / đêm
            </p>

            <button
              onClick={() => navigate('/booking/' + room.id)}
              style={{
                backgroundColor: "#073f7bff",
                color: "white",
                border: "none",
                fontWeight: "bold",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "5px"
              }}
            >
              Đặt phòng ngay
            </button>
          </div>
        ))}
      </div>
      {/* Nút xem thêm */}
      <div style={{ marginTop: "40px" }}>
        <NavLink
          to="/rooms" // 👉 dẫn sang trang RoomPage
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px",
            border: "0.2px dashed #061797ff",
            backgroundColor: "#F0F0F0",
            color: "black",
            borderRadius: "5px",
            height: "20px",
            marginTop: "-25px",
            textDecoration: "none",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid #000000ff")}
          onMouseLeave={(e) => (e.currentTarget.style.border = "0.5px dashed #061797ff")}
        >
          Xem tất cả 
          <img src={img} style={{ width: "25px", height: "15px", objectFit: "cover" , marginLeft: "5px", marginTop: "2px"}}/>  {/* icon mũi tên */}
        </NavLink>
      </div>
    </section> 
  );
}
