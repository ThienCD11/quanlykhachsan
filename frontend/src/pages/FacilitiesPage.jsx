// src/pages/FacilitiesPage.jsx
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FacilityCard from "../components/FacilityCard";
import { FaWifi, FaSwimmer, FaConciergeBell, FaDumbbell } from "react-icons/fa";


const facilities = [
  {
    id: 1,
    name: "Wifi miễn phí",
    icon: "📶",
    description: "Kết nối Internet tốc độ cao trong toàn bộ khách sạn."
  },
  {
    id: 2,
    name: "Bể bơi",
    icon: "🏊",
    description: "Bể bơi ngoài trời rộng rãi, thoải mái thư giãn."
  },
  {
    id: 3,
    name: "Phòng Gym",
    icon: "💪",
    description: "Trang bị đầy đủ dụng cụ tập luyện hiện đại."
  },
  {
    id: 4,
    name: "Dịch vụ phòng",
    icon: "🛎️",
    description: "Hỗ trợ 24/7, luôn sẵn sàng phục vụ nhu cầu của bạn."
  }
];

const FacilitiesPage = () => {
  return (
    <div>
      <Header />
      <section className="facilities-section" style={{ padding: "20px" }}>
        <h2>Tiện nghi của chúng tôi</h2>
        <div
          className="facilities-list"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center"
          }}
        >
          {facilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};


export default FacilitiesPage;
