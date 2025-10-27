import React from "react";
import { NavLink } from "react-router-dom";
import img from "../images/next.png";

// HÌNH ẢNH MẪU - Bạn hãy thay thế bằng ảnh thật của khách sạn nhé
import aboutImg1 from "../images/a1.png"; 
import aboutImg2 from "../images/a2.png"; 
import Img1 from "../images/v1.png"; 
import Img2 from "../images/v2.png"; 
import Img3 from "../images/v3.png"; 
import Img4 from "../images/v4.png"; 
import Img5 from "../images/v5.png"; 
import Img6 from "../images/v6.png"; 
import Img7 from "../images/v7.png"; 

export default function About() {
  
  // ----- CÁC BIẾN STYLE ĐỂ TÁI SỬ DỤNG -----

  const twoColumnStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "50px auto",
    gap: "40px",
    textAlign: "left",
  };

  const imageContainerStyle = {
    flex: "0.5 1 300px", // flex-grow, flex-shrink, flex-basis
  };

  const imageStyle = {
    width: "100%",
    borderRadius: "8px",
    height: "300px", // Thêm dòng này
    objectFit: "cover", // Thêm dòng này để ảnh không bị méo
    boxShadow: "20px 20px 0px rgba(11, 41, 174, 0.5)",
  };
  const imageStyle2 = {
    width: "100%",
    borderRadius: "8px",
    height: "300px", // Thêm dòng này
    objectFit: "cover", // Thêm dòng này để ảnh không bị méo
    boxShadow: "-20px 20px 0px rgba(11, 41, 174, 0.5)",
  };

  const textContainerStyle = {
    flex: "1 1 400px",
  };

  const subheadingStyle = {
    fontSize: "1.8rem",
    fontWeight: "600",
    color: "navy",
    marginBottom: "15px",
  };

  const paragraphStyle = {
    fontSize: "1rem",
    lineHeight: "1.7",
    color: "#000000ff",
    marginBottom: "20px",
    textAlign: "justify",
  };

  const gridContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "40px auto",
    textAlign: "center",
  };

  const gridItemStyle = {
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "10px 10px 15px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
  };
  
  const iconStyle = {
    fontSize: '2.5rem',
    color: 'navy'
  };
  
  const gridTitleStyle = {
    fontSize: '1.4rem',
    fontWeight: '600',
    margin: '15px 0 10px 0'
  };
  
  const gridTextStyle = {
    fontSize: '0.95rem',
    // color: '#000000ff',
    lineHeight: '1.6',
  };

  const serviceGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    margin: "40px auto",
    textAlign: "left",    
  };
  
  const serviceCardStyle = {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
  };
  
  const serviceIconStyle = {
    fontSize: "2.5rem",
    color: "#007bff", // Màu xanh dương
  };

  const serviceTitleStyle = {
    fontSize: "1.3rem",
    fontWeight: "bold",
    margin: "15px 0 10px 0",
  };
  
  const serviceTextStyle = {
    color: "#555",
    fontSize: "0.9rem",
    opacity: 0.9,
  };

  // ----- STYLE CHO KHỐI "ẤN TƯỢNG" MỚI -----
  const impactSectionStyle = {
    backgroundColor: "darkblue", // Màu nền xanh đậm
    color: "white",
    padding: "30px 20px",
    // borderRadius: "10px",
    // width: "100%",
    margin: "0",
  };

  const impactGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "50px",
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "left",
  };

  const impactNumberStyle = {
    fontSize: "2.8rem",
    fontWeight: "bold",
    marginBottom: "5px",
  };
  
  const impactTitleStyle = {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
  };
  
  const impactTextStyle = {
    fontSize: "0.9rem",
    opacity: 0.9,
  };
  
  // ------------------------------------------

  return (
    <section style={{ padding: "40px 0px", textAlign: "center", backgroundColor: "#f0f0f0" }}>
      {/* --- 1. TIÊU ĐỀ CHÍNH --- */}
      <h1 style={{ textAlign: "center" ,marginBottom: "0px",}}>Về chúng tôi</h1>
      <hr style={{
          width: "250px",
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
          marginBottom: "20px",
        }}
      >
        Chào mừng đến với TAMKA HOTEL, nơi sự sang trọng hòa quyện cùng lòng hiếu khách
        tận tâm, mang đến cho bạn một kỳ nghỉ không thể nào quên.
      </p> 

      {/* --- 2. KHỐI NỘI DUNG 1 (Ảnh trái, Chữ phải) --- */}
      <div style={twoColumnStyle}>
        <div style={imageContainerStyle}>
          <img src={aboutImg1} alt={aboutImg1} style={imageStyle} />
        </div>
        <div style={textContainerStyle}>
          <h4 style={subheadingStyle}>Sứ Mệnh Của Chúng Tôi</h4>
          <p style={paragraphStyle}>
            Tại TAMKA HOTEL, sứ mệnh của chúng tôi là tạo ra một "ngôi nhà thứ hai"
            đích thực cho mọi du khách. Chúng tôi tin rằng sự xa hoa không chỉ
            nằm ở thiết kế lộng lẫy, mà còn ở chất lượng dịch vụ cá nhân hóa
            và những trải nghiệm chân thực, giúp bạn tái tạo năng lượng và
            tìm thấy sự bình yên.
          </p>
          <p style={paragraphStyle}>
            Từ sảnh chính rộng lớn đến từng chi tiết nhỏ trong phòng, tất cả đều
            được thiết kế để mang lại sự thoải mái tối đa.
          </p>
        </div>
      </div>

      {/* --- 3. KHỐI NỘI DUNG 2 (Chữ trái, Ảnh phải) --- */}
      <div style={{...twoColumnStyle, flexDirection: 'row-reverse'}}>
        <div style={imageContainerStyle}>
          <img src={aboutImg2} alt={aboutImg2} style={imageStyle2} />
        </div>
        <div style={textContainerStyle}>
          <h4 style={subheadingStyle}>Trải Nghiệm Đẳng Cấp</h4>
          <p style={paragraphStyle}>
            Chúng tôi tự hào mang đến hệ thống tiện ích đa dạng bao gồm nhà
            hàng Á - Âu thượng hạng, quầy bar tầng thượng với tầm nhìn
            toàn cảnh thành phố, khu vực spa &amp; wellness hiện đại và hồ bơi
            vô cực.
          </p>
          <p style={paragraphStyle}>
            Đội ngũ nhân viên chuyên nghiệp của chúng tôi được đào tạo để
            phục vụ 24/7, luôn sẵn sàng lắng nghe và đáp ứng mọi yêu cầu của
            bạn với nụ cười thân thiện.
          </p>
        </div>
      </div>

      {/* --- 4. THÀNH PHẦN --- */}
      <hr style={{
          width: "50px",
          marginLeft: "105px",
          marginBottom: "-15px",
          border: "2.5px solid navy",
          borderRadius: "2px",
        }}/>
      <p style={{ fontSize: "1.6rem", marginBottom: "-10px",fontWeight: "bold", marginLeft: "105px", color: "navy", textAlign:"left" }}>
        Thành phần TAMKA HOTEL
      </p>
      <div style={serviceGridStyle}>
        {/* Item 1 */}
        <div 
          style={serviceCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00008b';
            e.currentTarget.style.color = 'white'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#000000ff'; 
          }}
        >
          <img src={Img4} alt={Img4} style={{ width: "20%", borderRadius: "5px", objectFit: "cover", marginBottom: "10px",}}/>
          <div style={impactTitleStyle}>Phòng & Suites</div>
          <div style={impactNumberStyle}>1.5K+</div>
          <p style={impactTextStyle}>Đáp ứng mọi nhu cầu từ du lịch cá nhân đến nghỉ dưỡng gia đình.</p>
        </div>
        {/* Item 2 */}
        <div 
          style={serviceCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00008b';
            e.currentTarget.style.color = 'white'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#000000ff'; 
          }}
        >
          <img src={Img5} alt={Img5} style={{ width: "20%", borderRadius: "5px", objectFit: "cover", marginBottom: "10px",}}/>
          <div style={impactTitleStyle}>Nhân viên</div>
          <div style={impactNumberStyle}>1K+</div>
          <p style={impactTextStyle}>Đội ngũ nhân viên được đào tạo bài bản và chuyên nghiệp.</p>
        </div>
        {/* Item 3 */}
        <div 
          style={serviceCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00008b';
            e.currentTarget.style.color = 'white'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#000000ff'; 
          }}
        >
          <img src={Img6} alt={Img6} style={{ width: "20%", borderRadius: "5px", objectFit: "cover", marginBottom: "10px",}}/>
          <div style={impactTitleStyle}>Khách sạn</div>
          <div style={impactNumberStyle}>20+</div>
          <p style={impactTextStyle}>Trải dài trên nhiều thành phố và các địa điểm du lịch nổi tiếng.</p>
        </div>
        {/* Item 4 */}
        <div 
          style={serviceCardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#00008b';
            e.currentTarget.style.color = 'white'; 
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#000000ff'; 
          }}
        >
          <img src={Img7} alt={Img7} style={{ width: "20%", borderRadius: "5px", objectFit: "cover", marginBottom: "10px",}}/>
          <div style={impactTitleStyle}>Thành phố</div>
          <div style={impactNumberStyle}>10+</div>
          <p style={impactTextStyle}>Mạng lưới hoạt động tại nhiều thành phố lớn trên toàn quốc.</p>
        </div>
      </div>

      {/* --- 5. KHỐI ẤN TƯỢNG --- */}
      <div style={impactSectionStyle}>
        <hr style={{
          width: "50px",
          marginLeft: "85px",
          marginBottom: "-15px",
          border: "2.5px solid white",
          borderRadius: "2px",
        }}/>
        <p style={{ fontSize: "1.6rem", marginBottom: "15px",fontWeight: "bold", marginLeft: "85px", color: "white", textAlign:"left" }}>
          Ấn tượng TAMKA HOTEL
        </p>
        <div style={impactGridStyle}>
          {/* Item 1 */}
          <div>
            <div style={impactNumberStyle}>10K+</div>
            <div style={impactTitleStyle}>Khách hàng hài lòng</div>
            <p style={impactTextStyle}>Lượt khách hàng thường xuyên quay lại mỗi năm.</p>
          </div>
          {/* Item 2 */}
          <div>
            <div style={impactNumberStyle}>50K+</div>
            <div style={impactTitleStyle}>Lượt đặt phòng</div>
            <p style={impactTextStyle}>Được xử lý qua hệ thống website và các đối tác.</p>
          </div>
          {/* Item 3 */}
          <div>
            <div style={impactNumberStyle}>100K+</div>
            <div style={impactTitleStyle}>Lượt tải app</div>
            <p style={impactTextStyle}>Đáp ứng tất cả nhu cầu đặt phòng mọi lúc mọi nơi.</p>
          </div>
          {/* Item 4 */}
          <div>
            <div style={impactNumberStyle}>50+</div>
            <div style={impactTitleStyle}>Đối tác & Giải thưởng</div>
            <p style={impactTextStyle}>Nhiều giải thưởng uy tín trong nước và quốc tế.</p>
          </div>
        </div>
      </div>
      
      {/* --- 6. KHỐI GIÁ TRỊ CỐT LÕI (Lưới 3 cột) --- */}
      <hr style={{
          width: "50px",
          // marginLeft: "105px",
          // marginBottom: "-20px",
          margin: "50px 0px -20px 105px",
          border: "2.5px solid navy",
          borderRadius: "2px",
        }}/>
      <p style={{ fontSize: "1.6rem", marginBottom: "-10px",fontWeight: "bold", marginLeft: "105px", color: "navy", textAlign:"left" }}>
        Giá trị cốt lõi TAMKA HOTEL
      </p>
      <div style={gridContainerStyle}>
        {/* Item 1 */}
        <div style={gridItemStyle}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <img
            src={Img1}
            alt={Img1}
            style={{ width: "30%", borderRadius: "3px",
              objectFit: "cover", margin: "10px 0px -10px 0px",}}
          />
          <h5 style={gridTitleStyle}>Chất Lượng Vượt Trội</h5>
          <p style={gridTextStyle}>Cam kết dịch vụ và tiện nghi 5 sao, vượt trên cả sự mong đợi của khách hàng.</p>
        </div>
        {/* Item 2 */}
        <div style={gridItemStyle}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <img
            src={Img2}
            alt={Img2}
            style={{ width: "30%", borderRadius: "3px",
              objectFit: "cover", margin: "10px 0px -10px 0px",}}
          />
          <h5 style={gridTitleStyle}>Tận Tâm Phục Vụ</h5>
          <p style={gridTextStyle}>Đội ngũ nhân viên xem sự hài lòng của bạn là ưu tiên số một, phục vụ 24/7.</p>
        </div>
        {/* Item 3 */}
        <div style={gridItemStyle}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <img
            src={Img3}
            alt={Img3}
            style={{ width: "30%", borderRadius: "3px",
              objectFit: "cover", margin: "10px 0px -10px 0px",}}
          />
          <h5 style={gridTitleStyle}>Phát Triển Bền Vững</h5>
          <p style={gridTextStyle}>Kinh doanh gắn liền với trách nhiệm bảo vệ môi trường và hỗ trợ cộng đồng địa phương.</p>
        </div>
      </div>

      {/* --- 7. NÚT GÓP Ý  --- */}
      <div style={{ marginTop: "40px" }}>
              <NavLink
                to="/contact" // 👉 dẫn sang trang RoomPage
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "10px",
                  border: "0.2px dashed #061797ff",
                  backgroundColor: "#F0F0F0",
                  color: "black",
                  borderRadius: "5px",
                  height: "20px",
                  marginTop: "-25px",
                  textDecoration: "none",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.border = "1px solid #000000ff")}
                onMouseLeave={(e) => (e.currentTarget.style.border = "0.5px dashed #061797ff")}
              >
                Liên hệ & Góp ý
                <img src={img} style={{ width: "25px", height: "15px", objectFit: "cover" , marginLeft: "5px", marginTop: "2px", background: "#F0F0F0", }}/>  {/* icon mũi tên */}
              </NavLink>
            </div>
    </section>
  );
}