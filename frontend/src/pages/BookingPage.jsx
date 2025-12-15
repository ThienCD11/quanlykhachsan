import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Hook để lấy tham số URL
import axios from "axios"; // Thư viện để gọi API
import Header from "../components/Header";
import Footer from "../components/Footer";
import arrow from "../images/arrow.png";
import BackToTop from "../components/BackToTop";
import Messenger from "../components/Messenger";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const { roomId } = useParams(); // Lấy `roomId` từ URL, ví dụ: "3"
  const [room, setRoom] = useState(null); // State để lưu thông tin phòng lấy từ API
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

  // useEffect sẽ chạy khi component được tải lần đầu (hoặc khi roomId thay đổi)
  useEffect(() => {
    // Hàm để gọi API lấy chi tiết phòng
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}`);
        setRoom(response.data); // Lưu dữ liệu phòng vào state
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
        // Có thể hiển thị một trang lỗi ở đây
      }
    };
    fetchRoomDetails();
  }, [roomId]); // Dependency array, đảm bảo effect chỉ chạy lại khi roomId thay đổi

  useEffect(() => {
    // Chỉ cập nhật nếu có thông tin người dùng được truyền vào
    console.log('useEffect for user update is running. User:', user);
    if (user) {
      console.log('Updating form state with:', {
        name: user.name,
        phone: user.phone,
        address: user.address,
        email: user.email
      });
      setName(user.name || ''); // Lấy tên, nếu không có thì để rỗng
      setPhone(user.phone || ''); // Lấy SĐT, nếu không có thì để rỗng
      setAddress(user.address || ''); // Lấy địa chỉ, nếu không có thì để rỗng
      setEmail(user.email || ''); // Lấy email, nếu không có thì để rỗng
    } else {
       console.log('User prop is null or undefined, not updating form.');
    }
  }, [user]); // Chạy lại effect này khi prop `user` thay đổi

  const handleBooking = async (e) => { 
    e.preventDefault();

    // 1. Kiểm tra đăng nhập
    if (!user) {
      alert("Vui lòng đăng nhập để đặt phòng!");
      return; // Dừng lại nếu chưa đăng nhập
    }

    // 2. Kiểm tra thông tin phòng (đảm bảo room đã được load)
    if (!room) {
      alert("Thông tin phòng chưa được tải xong, vui lòng đợi giây lát.");
      setError("Thông tin phòng chưa được tải xong, vui lòng đợi giây lát.");
      return;
    }

    // 3. Kiểm tra ngày tháng
    if (!checkInDate || !checkOutDate) {
      // alert("Cung cấp đầy đủ ngày nhận phòng và trả phòng!");
      setError("Cung cấp ngày nhận phòng và trả phòng!");
      return;
    }
    
    setIsSubmitting(true); // Bắt đầu vô hiệu hóa nút

    // 4. Chuẩn bị dữ liệu gửi đi
    const bookingData = {
        room_id: parseInt(roomId), // Đảm bảo roomId là số
        user_id: user.id,          // Lấy từ context
        check_in: checkInDate,
        check_out: checkOutDate,
        price: room.price          // Lấy từ state 'room'
    };

    console.log("Đang gửi dữ liệu đặt phòng:", bookingData);

    // 5. Gọi API
    try {
      // Gọi đến endpoint /api/bookings mà bạn đã tạo ở backend
      const response = await axios.post('http://127.0.0.1:8000/api/bookings', bookingData);

      // // Xử lý thành công
      // console.log('Đặt phòng thành công:', response.data);
      // alert(response.data.message || "Đặt phòng thành công!"); // Hiển thị alert thành công
      
      // navigate("/history");
      // setCheckInDate("");
      // setCheckOutDate("");
      console.log('Đặt phòng thành công:', response.data);
      const successMessage = response.data.message || "Đặt phòng thành công!";

      // 1. Hiển thị thông báo (chặn luồng)
      alert(successMessage);

      // 2. Bọc navigate trong setTimeout
      // Đảm bảo lệnh điều hướng chạy sau khi alert đã bị tắt.
      setTimeout(() => {
          navigate("/history");
      }, 50);

    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi đặt phòng:", error);
      let errorMessage = "Đã có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.";
      // Lấy thông báo lỗi cụ thể từ backend nếu có
      if (error.response && error.response.data && error.response.data.message) {
         errorMessage = error.response.data.message;
      } else if (error.response && error.response.status === 422) { // Lỗi validation
         const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
         errorMessage = `${validationErrors}`;
      }
      // alert(`Đặt phòng thất bại!\n${errorMessage}`); // Hiển thị alert lỗi
      setError(errorMessage);
    } finally {
      setIsSubmitting(false); // Kích hoạt lại nút dù thành công hay lỗi
    }
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
                  {/* Hàng 1: Tên & Số điện thoại */}
                  <div style={{ gridColumn: '1 / 2' }}>
                    <label>Tên khách hàng</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} required />
                  </div>
                  <div style={{ gridColumn: '2 / 3' }}>
                    <label>Số Điện Thoại</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} required />
                  </div>

                  {/* Hàng 2: Địa chỉ & Email */}
                  <div style={{ gridColumn: '1 / 2' }}> {/* <<-- Sửa từ '1 / 3' thành '1 / 2' */}
                    <label>Địa Chỉ</label>
                    {/* <<-- Đổi textarea thành input cho đồng bộ */}
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} required />
                  </div>
                  <div style={{ gridColumn: '2 / 3' }}> {/* <<-- Thêm ô Email mới */}
                      <label>Email</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
                  </div>

                  {/* Hàng 3: Ngày nhận & trả phòng */}
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
                  
                  {/* Nút đặt ngay được đẩy xuống dưới cùng */}
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
          
          <div style={{ marginTop: '40px', marginBottom: '100px', padding: '30px 40px', backgroundColor: 'white', boxShadow: '10px 10px 10px rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* DÙNG DỮ LIỆU THẬT TỪ API */}
              <h3 style={{ fontSize: '25px', margin: 0 }}><strong>Phòng {room.name}</strong></h3>
              <p style={{ fontSize: '22px', margin: '0 8px 0 0', fontWeight: 'bold' }}>{Number(room.price).toLocaleString("vi-VN")} VNĐ / đêm</p>
            </div>
            <hr style={{ border: '0.1px solid #1e0166ff' }} />
            
            {/* Thêm icon arrow vào trước các thẻ p */}
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

            {/* ... Phần tiện nghi không đổi ... */}
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
        </div>
        )}  
      </section>
      <Footer />
      <BackToTop />
      <Messenger />
    </div>
  );
};

export default BookingPage;