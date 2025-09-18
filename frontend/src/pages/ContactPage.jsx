import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div>
      <Header />

      <section style={{ padding: "20px", textAlign: "center" }}>
        <h2>LIÊN HỆ CHÚNG TÔI</h2>
        <p>Liên hệ và góp ý với chúng tôi</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginTop: "20px"
          }}
        >
          {/* Bên trái: Map + địa chỉ */}
          <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}>
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.315841047292!2d105.689!3d18.666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3139d104!2zVHLGsOG7nW5nIMSQ4buRYyBI4buTbmcgVsSpbmggLSBVbml2ZXJzaXR5IG9mIFZpbmggVW5pdmVyc2l0eQ!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
            <h3>Địa Chỉ</h3>
            <p>📍 Số: 123 Đường ABC, Quận XYZ, Hà Nội</p>
            <p>📞 SĐT: 0123 456 789</p>
            <p>✉ Email: info@hotel.com</p>
          </div>

          {/* Bên phải: Form góp ý */}
          <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: "8px", padding: "20px", textAlign: "left" }}>
            <h3>Gửi Tin Nhắn</h3>
            <form>
              <label>Họ và Tên</label>
              <input type="text" style={{ width: "100%", marginBottom: "10px" }} />

              <label>Email</label>
              <input type="email" style={{ width: "100%", marginBottom: "10px" }} />

              <label>Tiêu Đề</label>
              <input type="text" style={{ width: "100%", marginBottom: "10px" }} />

              <label>Tin Nhắn</label>
              <textarea rows="4" style={{ width: "100%", marginBottom: "10px" }}></textarea>

              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: "#007bff",
                  border: "none",
                  color: "white",
                  borderRadius: "5px"
                }}
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
