import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate
import Header from "../components/Header";
import Footer from "../components/Footer";
import HistoryCard from "../components/HistoryCard"; 
import BackToTop from "../components/BackToTop";
import { AuthContext } from "../App";
 
const HistoryPage = () => {
  const [histories, setHistories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Khởi tạo navigate

  // Helper function để tạo URL ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150x110?text=No+Image';
    return `http://127.0.0.1:8000/${imagePath}`;
  };

  // Hàm tải lịch sử đặt phòng
  const fetchHistory = useCallback(() => {
    if (!user) {
      setIsLoading(false);
      setHistories([]);
      return;
    }
    
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
        setIsLoading(false);
      });
  }, [user]);

  // Hàm tải đánh giá của user
  const fetchUserReviews = useCallback(() => {
    if (!user) {
      setIsLoadingReviews(false);
      setReviews([]);
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/reviews/user/${user.id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy đánh giá:", err);
      })
      .finally(() => {
        setIsLoadingReviews(false);
      });
  }, [user]);

  useEffect(() => {
    if (user) {
        const firstLoad = histories.length === 0;
        if(firstLoad) {
            setIsLoading(true);
        }

        fetchHistory();
        fetchUserReviews();

        const intervalId = setInterval(() => {
            console.log("Polling: Đang tải lại lịch sử...");
            fetchHistory();
            fetchUserReviews();
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    } else {
        setIsLoading(false);
        setIsLoadingReviews(false);
        setHistories([]);
        setReviews([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#DDD', fontSize: '18px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Hàm xóa đánh giá
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}`);
      alert("Xóa đánh giá thành công!");
      fetchUserReviews();
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá:", error);
      alert("Không thể xóa đánh giá. Vui lòng thử lại!");
    }
  };

  // Hàm điều hướng đến trang booking
  const handleViewDetails = (roomId) => {
    navigate(`/booking/${roomId}`);
  };

  return (
    <>
      <Header />
      <section style={{ padding: "10px", textAlign: "center", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 80px)' }}>
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
            gap: "30px 50px",
            padding: "0 20px",
            marginBottom: "40px",
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

      {/* Box hiển thị đánh giá của user với thông tin phòng */}
      {user && (
        <div style={{ 
          maxWidth: '1100px', 
          margin: '40px auto 70px', 
          padding: '30px 40px', 
          backgroundColor: 'white', 
          boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', 
          borderRadius: '8px',
          textAlign: 'left'
        }}>
          <h2 style={{ fontSize: '25px', margin: '0 0 20px 0', textAlign: 'center' }}>
            <strong>Đánh giá của bạn</strong>
          </h2>
          <hr style={{ border: '0.1px solid #1e0166ff', marginBottom: '20px' }} />

          {isLoadingReviews ? (
            <p style={{ textAlign: 'center', padding: '20px 0' }}>Đang tải đánh giá...</p>
          ) : reviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>
              Bạn chưa có đánh giá nào.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  style={{ 
                    padding: '20px', 
                    backgroundColor: '#F9F9F9', 
                    borderRadius: '8px',
                    borderLeft: '5px solid #00007aff',
                    position: 'relative'
                  }}
                >
                  {/* Hiển thị thông tin phòng */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #ddd'
                  }}>
                    {/* Ảnh phòng */}
                    <div style={{ 
                      width: '150px', 
                      height: '110px', 
                      borderRadius: '8px', 
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <img 
                        src={getImageUrl(review.room?.image)}
                        alt={review.room?.name || 'Phòng'} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150x110?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Thông tin phòng */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#00007aff' }}>
                            {review.room?.name || `Phòng #${review.room_id}`}
                          </h3>
                          <span style={{ 
                            padding: '4px 12px', 
                            backgroundColor: '#00007aff', 
                            color: 'white', 
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {review.booking?.invoice_id ? `#${review.booking.invoice_id}` : `#BK${review.booking_id}`}
                          </span>
                        </div>
                        
                        <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                          <strong>Diện tích:</strong> {review.room?.area || 'N/A'}m² | 
                          <strong> Sức chứa:</strong> {review.room?.capacity || 'N/A'} người
                        </p>
                        
                        <p style={{ margin: '5px 0', fontSize: '16px', fontWeight: 'bold', color: '#00007aff' }}>
                          {review.room?.price ? Number(review.room.price).toLocaleString("vi-VN") : 'N/A'} VNĐ / đêm
                        </p>
                      </div>
                    </div>

                    {/* Nhóm nút bên phải */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '10px',
                      alignItems: 'flex-end'
                    }}>
                      {/* Nút Xem chi tiết */}
                      <button
                        onClick={() => handleViewDetails(review.room_id)}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#00008b',
                          width: '130px',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'background-color 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#03035aff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#00008b'}
                      >
                        Xem chi tiết
                      </button>

                      {/* Nút xóa */}
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: '#c2071aff',
                          width: '130px',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'background-color 0.3s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#890815ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#c2071aff'}
                      >
                        Xóa đánh giá
                      </button>
                    </div>
                  </div>

                  {/* Phần đánh giá */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div>{renderStars(review.rating)}</div>
                      <span style={{ fontSize: '14px', color: '#666' }}>
                        {new Date(review.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div style={{
                      backgroundColor: 'white',
                      padding: '15px',
                      borderRadius: '5px',
                      borderLeft: '3px solid #FFD700'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '15px', 
                        lineHeight: '1.6', 
                        color: '#333',
                        fontStyle: 'italic'
                      }}>
                        "{review.review}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </section>
      <Footer />
      <BackToTop />
    </>
  );
};

export default HistoryPage;