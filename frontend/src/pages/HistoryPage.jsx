import React, { useState, useEffect, useContext, useCallback } from "react"; // Thêm useContext
import axios from "axios"; // Dùng axios cho nhất quán
import Header from "../components/Header";
import Footer from "../components/Footer";
import HistoryCard from "../components/HistoryCard"; // Import HistoryCard
import { AuthContext } from "../App"; // Import AuthContext

const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state loading
  const [error, setError] = useState(null); // Thêm state lỗi
  const { user } = useContext(AuthContext); // Lấy user từ context

  // 2. TÁCH LOGIC TẢI DỮ LIỆU RA HÀM RIÊNG (SỬ DỤNG useCallback)
  // useCallback giúp hàm này không bị tạo lại mỗi lần re-render,
  // chỉ tạo lại khi 'user' thay đổi.
  const fetchHistory = useCallback(() => {
    if (!user) {
      setIsLoading(false);
      setHistories([]);
      return;
    }
    
    // Không set isLoading = true ở đây, để nó tải lại "âm thầm"
    // (isLoading chỉ set ở useEffect)
    setError(null);

    const apiUrl = `http://127.0.0.1:8000/api/histories?user_id=${user.id}`;

    axios.get(apiUrl)
      .then((res) => {
        setHistories(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy lịch sử đặt phòng:", err);
        setError("Không thể tải lịch sử đặt phòng. Vui lòng thử lại sau.");
      })
      .finally(() => {
        setIsLoading(false); // Set loading false sau khi xong
      });
  }, [user]); // Phụ thuộc vào 'user'

  // 3. useEffect GIỜ CHỈ GỌI HÀM fetchHistory
  useEffect(() => {
    setIsLoading(true); // Chỉ set loading ở lần chạy đầu (hoặc khi user đổi)
    fetchHistory();
  }, [fetchHistory]); // Chạy lại khi hàm fetchHistory thay đổi (tức là khi user thay đổi)

  return (
    <>
      <Header />
      <section style={{ padding: "10px", textAlign: "center", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 80px)' }}> {/* Thêm minHeight */}
      <h1 style={{ textAlign: "center" ,marginBottom: "0px",}}>Lịch sử đặt phòng</h1>
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
        Xem lại và quản lý các kỳ nghỉ của bạn nhanh chóng, mọi lúc mọi nơi.
      </p>

      {/* Xử lý các trạng thái: Chưa đăng nhập, Đang tải, Lỗi, Có dữ liệu */}
      {!user ? (
          <p style={{marginTop: '50px', fontSize: '1.2rem'}}>Vui lòng <a href="/login">Đăng nhập</a> để xem lịch sử đặt phòng.</p>
      ) : isLoading ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Đang tải lịch sử đặt phòng...</h1>
      ) : error ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px", color: 'red' }}>{error}</h1>
      ) : histories.length === 0 ? (
        <h1 style={{ textAlign: "center", margin: "100px 50px" }}>Bạn chưa có lịch sử đặt phòng nào.</h1>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "30px 50px", // Tăng khoảng cách
            padding: "0 20px", // Thêm padding ngang
            marginBottom: "70px",
            marginTop: "10px",
          }}
        >
          {histories.map((h) => (
            <HistoryCard 
              key={h.id} 
              history={h} 
              onUpdate={fetchHistory} 
            />
          ))}
        </div>
      )}
      </section>
      <Footer />
    </>
  );
};

export default HistoryPage;