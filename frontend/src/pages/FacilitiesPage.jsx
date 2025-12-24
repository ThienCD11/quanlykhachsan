import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FacilityCard from "../components/FacilityCard";
import BackToTop from "../components/BackToTop";
import Messenger from "../components/Messenger";
import Chatbot from "../components/Chatbot";

const FacilitiesPage = () => {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/facilities")
      .then((res) => {
        if (!res.ok) throw new Error("Lỗi kết nối API");
        return res.json();
      })
      .then((data) => setFacilities(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);

  return (
    <>
      <Header />
      <section style={{ padding: "10px", textAlign: "center", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 120px)'  }}>
      <h1 style={{ textAlign: "center" ,marginBottom: "0px",}}>Tiện nghi khách sạn</h1>
      <hr
        style={{
          width: "350px",
          margin: "0 auto",
          border: "1px solid black",
          borderRadius: "2px",
        }}
      />
      <p
        style={{
          textAlign: "center",
          fontSize: "16px",
          color: "navy",
          marginTop: "5px",
          marginBottom: "20px",
        }}
      >
        Trải nghiệm các tiện nghi của chúng tôi giúp kỳ nghỉ của bạn thêm trọn vẹn!
      </p>

      {/* Nếu đang load hoặc rỗng */}
      {facilities.length === 0 ? (
        <h1 style={{ textAlign: "center", margin: "200px 50px 500px 50px" }}>Đang tải thông tin tiện nghi...</h1>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginBottom: "70px"
          }}
        >
          {facilities.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
      </section>
      <Footer />
      <BackToTop />
      <Chatbot />
      <Messenger />
    </>
  );
};

export default FacilitiesPage;
