import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import arrow from "../images/arrow.png";
import BackToTop from "../components/BackToTop";
import Chatbot from "../components/Chatbot";
import Messenger from "../components/Messenger";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import userIcon from "../images/user.png"; // Import icon user

// Hàm để ẩn tên: Thanh -> T*****h
const maskName = (name) => {
  if (!name) return "K*****h"; // Mặc định nếu không có tên
  const str = String(name);
  const firstChar = str.charAt(0);
  const lastChar = str.charAt(str.length - 1);
  return `${firstChar}*****${lastChar}`;
};

const BookingPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]); // State cho đánh giá
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy thông tin phòng
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  // Lấy đánh giá của phòng
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/reviews/room/${roomId}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá:", error);
      }
    };
    fetchReviews();
  }, [roomId]);

  useEffect(() => {
    console.log('useEffect for user update is running. User:', user);
    if (user) {
      console.log('Updating form state with:', {
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email
      });
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setEmail(user.email || '');
    } else {
       console.log('User prop is null or undefined, not updating form.');
    }
  }, [user]);

  const handleBooking = async (e) => { 
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập để đặt phòng!");
      return;
    }

    if (user.role === 'admin') {
      alert("Tài khoản Quản trị viên (Admin) không có chức năng đặt phòng. Vui lòng dùng tài khoản khách hàng!");
      return;
    }

    if (!room) {
      alert("Thông tin phòng chưa được tải xong, vui lòng đợi giây lát.");
      setError("Thông tin phòng chưa được tải xong, vui lòng đợi giây lát.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError("Cung cấp ngày nhận phòng và trả phòng!");
      return;
    }
    
    setIsSubmitting(true);

    const bookingData = {
        room_id: parseInt(roomId),
        user_id: user.id,
        check_in: checkInDate,
        check_out: checkOutDate,
        price: room.price
    };

    console.log("Đang gửi dữ liệu đặt phòng:", bookingData);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingData);

      console.log('Đặt phòng thành công:', response.data);
      const successMessage = response.data.message || "Đặt phòng thành công!";

      alert(successMessage);

      setTimeout(() => {
          navigate("/history");
      }, 50);

    } catch (error) {
      console.error("Lỗi khi đặt phòng:", error);
      let errorMessage = "Đã có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.";
      if (error.response && error.response.data && error.response.data.message) {
         errorMessage = error.response.data.message;
      } else if (error.response && error.response.status === 422) {
         const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
         errorMessage = `${validationErrors}`;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm render sao đánh giá
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? '#FFD700' : '#DDD', fontSize: '20px' }}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Hàm tính trung bình rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const inputStyle = {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxSizing: 'border-box',
  };

  return (
    <div>
      <Header />
      <section style={{ padding: "40px 20px", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 60px)'  }}>
        <h2 style={{ textAlign: "center" ,marginBottom: "0px", marginTop:"-10px"}}>Thông tin đặt phòng</h2>
        <hr style={{
            width: "290px",
            margin: "0 auto",
            border: "1px solid black",
            borderRadius: "2px",
          }}/>
        <p
          style={{
            textAlign: "center",
            fontSize: "16px",
            color: "navy",
            marginTop: "5px",
            marginBottom: "30px",
          }}
        >
          Chọn ngày nhận/trả phòng và đặt phòng ngay để có thể trải nghiệm dịch vụ!
        </p> 
        {!room ? (
          <h1 style={{ textAlign: 'center', padding: '0px', margin: '200px 380px 500px 380px'}}>
            Đang tải thông tin phòng...
          </h1>
        ) : (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", alignItems: 'stretch' }}>
            <div style={{ flex: "1.2", padding: '10px', backgroundColor: 'white', boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <img src={room.image_url} alt={room.name} style={{ width: '100%', display: 'block', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            <div style={{ flex: "1", backgroundColor: 'white', boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '30px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #00008b', paddingBottom: '10px' }}>
                  XÁC NHẬN THÔNG TIN
                </h3>
                <form onSubmit={handleBooking} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flexGrow: 1 }}>
                  <div style={{ gridColumn: '1 / 2' }}>
                    <label>Tên khách hàng</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
                  </div>
                  <div style={{ gridColumn: '2 / 3' }}>
                    <label>Số Điện Thoại</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} required />
                  </div>

                  <div style={{ gridColumn: '1 / 2' }}>
                    <label>Địa Chỉ</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} required />
                  </div>
                  <div style={{ gridColumn: '2 / 3' }}>
                      <label>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                  </div>

                  <div style={{ gridColumn: '1 / 2' }}>
                    <label>Ngày Nhận Phòng</label>
                    <input type="date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '2 / 3' }}>
                    <label>Ngày Trả Phòng</label>
                    <input type="date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} style={inputStyle} />
                  </div>
                  
                  {error && <p 
                  style={{ 
                    color: 'red', 
                    gridColumn: '1 / 3', 
                    textAlign: 'center', 
                    margin: '-15px 0', 
                    padding: '3px',
                    background:'pink',
                    borderRadius: '5px', 
                  }}>{error}</p>}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      gridColumn: '1 / 3',
                      padding: '15px',
                      border: 'none',
                      borderRadius: '5px',
                      backgroundColor: isSubmitting ? '#000054ff' : '#00007aff',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: 'auto', 
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={!isSubmitting ? e => e.currentTarget.style.backgroundColor = '#000054ff' : null}
                    onMouseLeave={!isSubmitting ? e => e.currentTarget.style.backgroundColor = '#00007aff' : null}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Đặt Ngay'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '40px', marginBottom: '40px', padding: '30px 40px', backgroundColor: 'white', boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '25px', margin: 0 }}><strong>Phòng {room.name}</strong></h3>
              <p style={{ fontSize: '22px', margin: '0 8px 0 0', fontWeight: 'bold' }}>{Number(room.price).toLocaleString("vi-VN")} VNĐ / đêm</p>
            </div>
            <hr style={{ border: '0.1px solid #1e0166ff' }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img src={arrow} style={{ height: "20px", marginTop: "-15px" }} alt="arrow icon"/>
              <p style={{ margin: 0 }}>{room.about}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <img src={arrow} style={{ height: "20px", marginTop: "-15px"  }} alt="arrow icon"/>
              <p style={{ margin: 0 }}>
                Phòng có diện tích {room.area}m², thiết kế hiện đại, trang nhã và được trang bị đầy đủ tiện nghi để mang đến sự thoải mái tối đa cho mọi khách lưu trú.{" "}
                {room.capacity === 1
                  ? `Phù hợp cho một người ở, mang lại không gian riêng tư và yên tĩnh tuyệt đối.`
                  : room.capacity === 2
                  ? `Rất lý tưởng cho cặp đôi, mang đến không gian thư giãn vừa đủ và thiết kế ấm cúng.`
                  : room.capacity === 3
                  ? `Thích hợp cho nhóm nhỏ ${room.capacity} người hoặc gia đình có con nhỏ, cân bằng giữa tiện nghi và sự thoải mái.`
                  : room.capacity === 4
                  ? `Lựa chọn hoàn hảo cho nhóm bạn ${room.capacity} người hoặc gia đình nhỏ, mang đến không gian sinh hoạt thoải mái.`
                  : room.capacity === 6 || room.capacity === 5 
                  ? `Phòng rộng rãi với bố cục linh hoạt, đủ sức chứa cho nhóm bạn thân tối đa ${room.capacity} người hoặc gia đình đông thành viên.`
                  : room.capacity === 8
                  ? `Không gian lớn, phù hợp cho các nhóm du lịch lên đến ${room.capacity} người hoặc gia đình nhiều thế hệ cùng tận hưởng kỳ nghỉ.`
                  : room.capacity === 10
                  ? `Phòng Penthouse đặc biệt với thiết kế sang trọng, dành cho tối đa 10 người – trải nghiệm đẳng cấp và riêng tư.`
                  : `Rộng thoáng và tiện nghi, có thể phục vụ nhóm lớn lên đến ${room.capacity} người.`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <img src={arrow} style={{ height: "20px", marginTop: "-38px"  }} alt="arrow icon" />
              <p style={{ margin: 0 }}>
                Thời gian nhận phòng bắt đầu <strong>từ 14h00</strong> và trả phòng <strong>trước 12h00 ngày hôm sau</strong>, tạo sự linh hoạt và thuận tiện cho lịch trình di chuyển của quý khách. 
                Đội ngũ lễ tân luôn sẵn sàng hỗ trợ check-in sớm hoặc check-out muộn tùy theo tình trạng phòng và yêu cầu cụ thể của khách hàng.
              </p>
            </div>

            <h4 style={{ marginBottom: '10px' }}>Tiện nghi phòng cơ bản:</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Wi-Fi tốc độ cao</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> TV màn hình phẳng</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Điều hòa không khí</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Dịch vụ phòng 24/7</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Ấm siêu tốc</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Máy sấy tóc</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Tủ lạnh mini</li>
                <li><img src={arrow} style={{height: "20px", marginBottom:"-4px"}}/> Còn nhiều tiện nghi nữa</li>
            </ul>
          </div>

          {/* Box hiển thị đánh giá */}
          <div style={{ marginBottom: '100px', padding: '30px 40px', backgroundColor: 'white', boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '25px', margin: 0 }}>
                <strong>Đánh giá từ khách hàng</strong>
              </h3>
              {reviews.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div>{renderStars(Math.round(calculateAverageRating()))}</div>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    {calculateAverageRating()} / 5.0
                  </span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    ({reviews.length} đánh giá)
                  </span>
                </div>
              )}
            </div>
            <hr style={{ border: '0.1px solid #1e0166ff', marginBottom: '20px' }} />

            {reviews.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px 0' }}>
                Chưa có đánh giá nào cho phòng này.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((review) => (
                  <div 
                    key={review.id} 
                    style={{ 
                      padding: '20px', 
                      backgroundColor: '#F9F9F9', 
                      borderRadius: '8px',
                      borderLeft: '5px solid #00007aff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {/* Thay div chứa user_id bằng icon user */}
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          backgroundColor: '#E0E0E0', // Màu nền nhẹ cho icon
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          overflow: 'hidden',
                          padding: '0', 
                        }}>
                          <img 
                            src={userIcon} 
                            alt="user icon" 
                            style={{ width: '40px', height: '40px', }} 
                          />
                        </div>
                        
                        <div>
                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                          {/* KIỂM TRA: review.user.name phải tồn tại nhờ with('user') ở BE */}
                          {maskName(review.user.name)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      </div>
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        {new Date(review.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p style={{ margin: '10px 0 0 55px', fontSize: '15px', lineHeight: '1.6', color: '#333' }}>
                      {review.review}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}  
      </section>
      <Footer />
      <BackToTop />
      <Chatbot />
      <Messenger />
    </div>
  );
};

export default BookingPage;