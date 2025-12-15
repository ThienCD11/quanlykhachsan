import React, { useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import Messenger from "../components/Messenger";

const ContactPage = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      title: '',
      content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }; 

  const handleSubmit = async (event) => {
    event.preventDefault(); // Luôn ngăn chặn gửi form mặc định
    setSubmitMessage(''); // Xóa thông báo cũ
    setMessageType('');

    const isConfirmed = window.confirm("Bạn có chắc chắn muốn gửi góp ý này không?");

    if (!isConfirmed) {
      console.log("Hủy gửi góp ý.");
      return; // Dừng lại nếu không xác nhận
    }

    setIsSubmitting(true); // Bắt đầu gửi -> Vô hiệu hóa nút
    console.log("Đang gửi góp ý...", formData);

    try {
      // Gửi yêu cầu POST đến backend Laravel
      const response = await axios.post('http://127.0.0.1:8000/api/contact', formData);

      // Xử lý thành công
      console.log('Response:', response.data);
      setSubmitMessage(response.data.message || "Gửi góp ý thành công!");
      setMessageType('success');
      // Xóa form sau khi gửi thành công
      setFormData({ name: '', email: '', title: '', content: '' });

    } catch (error) {
      // Xử lý lỗi
      console.error("Lỗi khi gửi góp ý:", error);
      let errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      // Kiểm tra lỗi validation từ Laravel (status 422)
      if (error.response && error.response.status === 422 && error.response.data.errors) {
         const validationErrors = Object.values(error.response.data.errors).flat().join(' ');
         errorMessage = `Lỗi nhập liệu: ${validationErrors}`;
      } else if (error.response && error.response.data && error.response.data.message) {
         errorMessage = error.response.data.message; // Lấy thông báo lỗi từ backend
      }
      setSubmitMessage(errorMessage);
      setMessageType('error');

    } finally {
      setIsSubmitting(false); // Gửi xong (dù thành công hay lỗi) -> Kích hoạt lại nút
    }  
  };

  return (
    <div>
      <Header />
      <section style={{ padding: "20px", textAlign: "center", backgroundColor: "#F0F0F0", minHeight: 'calc(100vh - 100px)'  }}>
        <h1 style={{ textAlign:"center", marginBottom: "0px", marginTop:"10px", }}>Liên hệ chúng tôi</h1>   
        <hr style={{
          width: "300px",
          margin: "0 auto",
          border: "1px solid black",
          borderRadius: "2px"
        }} />
        <p style={{
          textAlign: "center",
          fontSize: "16px",
          color: "navy",
          marginTop: "5px",
          marginBottom: "15px"
        }}>
          Chúng tôi xin chân thành cảm ơn những góp ý của bạn!
        </p> 

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            gap: "50px",
            margin: "30px 30px 300px 30px",
            
          }}
        >
          {/* Bên trái: Map + địa chỉ */}
          <div style={{ flex: 1, borderRadius: "8px", padding: "10px", boxShadow: '10px 10px 10px rgba(0,0,0,0.2)', backgroundColor: "white",}}>
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=Hanoi&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>

            <h3>Địa Chỉ</h3>
            <p>
              <i className="fa-solid fa-location-dot" style={{ color: "navy", marginRight: "8px" }}></i>
              Số: 123 Đường ABC, Quận XYZ, Hà Nội
            </p>

            <p>
              <i className="fa-solid fa-phone" style={{ color: "navy", marginRight: "8px" }}></i>
              SĐT: 0123 456 789 - 0987 654 321
            </p>

            <p>
              <i className="fa-solid fa-envelope" style={{ color: "navy", marginRight: "8px" }}></i>
              Email: tamkahotel@gmail.com
            </p>
          </div>

          {/* Bên phải: Form góp ý */}
          <div style={{ flex: 1, borderRadius: "8px", padding: "20px", textAlign: "left", boxShadow: '10px 10px 10px rgba(0,0,0,0.2)', backgroundColor: "white",}}>
            <h3 style={{ textAlign: "Center"}}>Gửi Tin Nhắn</h3>
            {submitMessage && (
              <p style={{
                  color: messageType === 'success' ? 'green' : 'red',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '10px',
                  // border: `1px solid ${messageType === 'success' ? 'green' : 'red'}`,
                  borderRadius: '5px',
                  backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                  marginBottom: '15px'
              }}>
                {submitMessage}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Họ và Tên</label>
              <input
                type="text"
                id="name"
                name="name" // Add name attribute
                value={formData.name} // Bind value to state
                onChange={handleInputChange} // Handle changes
                style={{ width: "100%", padding: '8px', boxSizing: 'border-box', marginBottom: "10px" }} required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email" // Add name attribute
                value={formData.email} // Bind value to state
                onChange={handleInputChange} // Handle changes
                style={{ width: "100%", padding: '8px', boxSizing: 'border-box', marginBottom: "10px" }} required
              />

              <label htmlFor="title">Tiêu đề</label>
              <input
                type="text"
                id="title"
                name="title" // Add name attribute
                value={formData.title} // Bind value to state
                onChange={handleInputChange} // Handle changes
                style={{ width: "100%", padding: '8px', boxSizing: 'border-box', marginBottom: "10px" }} required
              />

              <label htmlFor="content">Nội dung</label>
              <textarea
                id="content"
                name="content" // Add name attribute
                value={formData.content} // Bind value to state
                onChange={handleInputChange} // Handle changes
                rows="6" style={{ width: "100%", padding: '8px', boxSizing: 'border-box', marginBottom: "10px", resize: 'vertical' }} required>
              </textarea>

              <div style={{ textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={isSubmitting} // Disable button while submitting
                  style={{
                    padding: "10px",
                    background: isSubmitting ? '#ccc' : "#00008b", // Grey out when disabled
                    border: "none",
                    color: "white",
                    borderRadius: "5px",
                    width: "40%",
                    cursor: isSubmitting ? 'not-allowed' : "pointer",
                    fontSize: '16px',
                  }}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi ngay'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
      <Messenger />
    </div>
  );
};

export default ContactPage;
