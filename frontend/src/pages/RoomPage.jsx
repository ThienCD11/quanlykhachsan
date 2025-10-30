// src/pages/RoomsPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // <<-- THÊM IMPORT NÀY
import axios from "axios"; // Dùng axios
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import SearchRoom from "../components/SearchRoom"; // Component mới của bạn
import "../css/RoomPage.css"; 

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state lỗi
  
  const location = useLocation(); // <<-- LẤY LOCATION

  // useEffect SẼ CHẠY LẠI MỖI KHI URL THAY ĐỔI
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const searchParams = location.search;
    const apiUrl = `http://127.0.0.1:8000/api/rooms${searchParams}`;

    console.log("RoomPage đang gọi API:", apiUrl); 

    axios.get(apiUrl)
      .then((res) => {
        setRooms(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách phòng:", err);
        if (err.response && err.response.status === 422) {
            const validationErrors = Object.values(err.response.data.errors).flat().join(' ');
            setError(`Lỗi tìm kiếm: ${validationErrors}`);
        } else {
            setError("Không thể tải danh sách phòng. Vui lòng thử lại."); 
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
      
  }, [location.search]);

  return (
    <>
      <Header />
      <section style={{ padding: "10px", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 80px)'  }}>
        {/* ... (Phần tiêu đề, hr, p giữ nguyên) ... */}
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
            {/* SearchRoom này sẽ cần dùng useNavigate để cập nhật 
                URL và trigger useEffect ở trên chạy lại */}
            <SearchRoom />
          </div>

          {/* Cột phải - Danh sách phòng */}
          <div className="rooms-list">
            {isLoading ? (
                <h1 className="loading">Đang tải thông tin phòng...</h1>
            ) : error ? (
                <h1 className="loading" style={{ color: 'red' }}>{error}</h1>
            ) : rooms.length === 0 ? (
                <h1 className="loading">
                    Không tìm thấy phòng nào phù hợp<br></br>với tiêu chí của bạn!
                </h1>
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