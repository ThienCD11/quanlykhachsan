import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import SearchRoom from "../components/SearchRoom";
import "../css/RoomPage.css"; // 👈 nhớ tạo file này

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Lỗi:", err));
  }, []);
 
  return (
    <>
      <Header />
      <section style={{ padding: "10px", backgroundColor: "#F0F0F0", }}>
      <h1 style={{ textAlign: "center" ,marginBottom: "0px",}}>Danh sách phòng</h1>
      <hr
        style={{
          width: "300px",
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
        Hãy lựa chọn căn phòng phù hợp cho kỳ nghỉ của bạn!
      </p> 

      <div className="rooms-layout">
        {/* Cột trái - Thanh tìm kiếm */}
        <div className="rooms-search">
          <SearchRoom />
        </div>

        {/* Cột phải - Danh sách phòng */}
        <div className="rooms-list">
          {rooms.length === 0 ? (
            <h1 className="loading">Đang tải thông tin phòng...</h1>
          ) : (
            rooms.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
      </div>
      </section>
      <Footer />
    </>
  );
};

export default RoomsPage;
