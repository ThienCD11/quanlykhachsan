import React from "react";
import { NavLink } from "react-router-dom";
import img from "../images/next.png";

export default function Contact() {
  return (
    <section style={{ padding: "40px", textAlign: "center" }}>
      {/* Tiêu đề */}
      <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "30px" }}>
        Địa chỉ liên hệ
      </h3>
      <hr style={{
        width: "250px",
        marginTop: "-29px",
        marginBottom: "20px",
        border: "1px solid black",
        borderRadius: "2px"
      }} />
      <div style={{ margin: "0 50px" ,padding: "10px", width: "90%", background: "white", borderRadius: "10px", boxShadow: '10px 10px 10px rgba(0,0,0,0.2)',}}>
      <p style={{ textAlign: "left", marginLeft: "20px" }}>
        <i className="fa-solid fa-location-dot" style={{ color: "navy", marginRight: "8px" }}></i>
        Địa chỉ: 123 Đường ABC, Quận XYZ, Hà Nội
      </p>
      <p style={{ textAlign: "left", marginLeft: "20px" }}>
        <i className="fa-solid fa-phone" style={{ color: "navy", marginRight: "8px" }}></i>
        SĐT: 0123 456 789 - 0987 654 321
      </p>
      <iframe
        src="https://maps.google.com/maps?q=Hanoi&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="250"
        style={{ border: 0, }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>

      </div>
      <div style={{ marginTop: "40px" }}>
        <NavLink
          to="/contact" // 👉 dẫn sang trang RoomPage
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
          Liên hệ & Góp ý
          <img src={img} style={{ width: "25px", height: "15px", objectFit: "cover" , marginLeft: "5px", marginTop: "2px", background: "#F0F0F0", }}/>  {/* icon mũi tên */}
        </NavLink>
      </div>
    </section>
  );
}
