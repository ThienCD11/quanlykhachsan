import React, { useState, useEffect, useContext } from "react"; // Thêm useContext
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

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      setError(null); // Đã xóa dòng lặp

      // const token = ... // Đã xóa dòng không dùng
      
      const apiUrl = `http://127.0.0.1:8000/api/histories?user_id=${user.id}`;

      axios.get(apiUrl)
        .then((res) => {
          setHistories(res.data);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy lịch sử đặt phòng:", err);
          
          if (err.response && err.response.status === 422) {
              setError("User ID không hợp lệ (lỗi từ backend).");
          } else {
              setError("Không thể tải lịch sử đặt phòng. Vui lòng thử lại sau.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
        setIsLoading(false);
        setHistories([]);
    }
  }, [user]);

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
          <p style={{marginTop: '50px', fontSize: '1.2rem'}}>Vui lòng <a href="/login">đăng nhập</a> để xem lịch sử đặt phòng.</p>
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
            <HistoryCard key={h.id} history={h} />
          ))}
        </div>
      )}
      </section>
      <Footer />
    </>
  );
};

export default HistoryPage;