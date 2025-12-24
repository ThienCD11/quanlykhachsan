import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import SearchRoom from "../components/SearchRoom"; 
import BackToTop from "../components/BackToTop";
import Chatbot from "../components/Chatbot";
import Messenger from "../components/Messenger";
import "../css/RoomPage.css"; 

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- PHÂN TRANG STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6; // Giới hạn 6 RoomCard mỗi trang

  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1); // Reset về trang 1 mỗi khi tìm kiếm mới

    const searchParams = location.search;
    const apiUrl = `http://127.0.0.1:8000/api/rooms${searchParams}`;

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

  // --- LOGIC PHÂN TRANG ---
  const totalItems = rooms.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRooms = rooms.slice(startIndex, startIndex + rowsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu khi sang trang
  };

  return (
    <>
      <Header />
      <section style={{ padding: "10px", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 80px)' }}>
        <h1 style={{ textAlign: "center", marginBottom: "0px" }}>Danh sách phòng</h1>
        <hr style={{ width: "300px", margin: "0 auto", border: "1px solid black", borderRadius: "2px" }} />
        <p style={{ textAlign: "center", fontSize: "16px", color: "navy", marginTop: "5px", marginBottom: "20px" }}>
          Hãy lựa chọn căn phòng phù hợp cho kỳ nghỉ của bạn!
        </p> 
        
        <div className="rooms-layout">
          <div className="rooms-search">
            <SearchRoom />
          </div>

          <div className="rooms-list-container"> {/* Thêm container để bọc list và phân trang */}
            <div className="rooms-list">
              {isLoading ? (
                  <h1 className="loading">Đang tải thông tin phòng...</h1>
              ) : error ? (
                  <h1 className="loading" style={{ color: 'red' }}>{error}</h1>
              ) : rooms.length === 0 ? (
                  <h1 className="loading">
                      Không tìm thấy phòng nào phù hợp<br />với tiêu chí của bạn!
                  </h1>
              ) : (
                  paginatedRooms.map((room) => <RoomCard key={room.id} room={room} />)
              )}
            </div>

            {/* --- Pagination (Giữ đúng thiết kế StaRoomPage) --- */}
            {!isLoading && rooms.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "30px 20px",
                  fontSize: "14px",
                  width: "100%",
                  boxSizing: "border-box"
                }}>
                <span>
                  SHOWING {startIndex + 1} TO {Math.min(startIndex + rowsPerPage, totalItems)} OF {totalItems}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      fontSize: "18px",
                      color: currentPage === 1 ? "#ccc" : "#000"
                    }}
                  >
                    ❮
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: "none",
                        cursor: "pointer",
                        background: i + 1 === currentPage ? "#00008b" : "#eaeaea",
                        color: i + 1 === currentPage ? "white" : "black",
                        fontWeight: "bold",
                        transition: "all 0.3s"
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      fontSize: "18px",
                      color: currentPage === totalPages ? "#ccc" : "#000"
                    }}
                  >
                    ❯
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
      <Chatbot />
      <Messenger />
    </>
  );
};

export default RoomsPage;