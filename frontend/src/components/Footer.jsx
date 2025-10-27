import React from 'react';
import logo from "../images/3k.png";
import ggP from "../images/ggPlay.png";
import appS from "../images/appStore.png";

// Định nghĩa tất cả các style dưới dạng object của JavaScript
const styles = {
  footer: {
    backgroundColor: '#000060ff',
    color: '#E0E0E0',
    paddingTop: '50px',
    // marginTop: '50px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  footerSection: {
    minWidth: '200px',
    marginBottom: '30px',
  },
  h4: {
    color: '#FFFFFF',
    fontSize: '16px',
    marginTop: '0',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  logo: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'white',
  },
  certImages: {
    // Style cho thẻ div chứa ảnh
  },
  certImage: {
    maxWidth: '178px',
    height: 'auto',
    marginBottom: '10px',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: '12px',
  },
  link: {
    color: '#E0E0E0',
    textDecoration: 'none',
  },
  socialIconsLink: {
    color: '#E0E0E0',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
  },
  socialIcon: {
    marginRight: '10px',
    fontSize: '18px',
    width: '20px',
  },
  appDownloadsImage: {
    maxWidth: '150px',
    marginBottom: '5x',
    borderRadius: '5px',
  },
  footerBottomWrapper: {
    backgroundColor: '#00003eff', // Màu đậm hơn
    padding: '20px 0',
    marginTop: '20px',
  },
  footerBottom: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
    color: '#B0B0B0',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  footerBottomP: {
    margin: '5px 0',
  }
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        {/* === PHẦN BÊN TRÁI === */}
        <div style={styles.footerSection}>
          <div style={styles.logo}>TamkaHotel</div>
          <div style={styles.certImages}>
            <img style={styles.certImage} src={logo} alt="logo" />
          </div>
        </div>

        {/* === CÁC CỘT LIÊN KẾT === */}
        <div style={styles.footerSection}>
          <h4 style={styles.h4}>Về TamkaHotel</h4>
          <ul style={styles.ul}>
            <li style={styles.li}><a href="/" style={styles.link}>Về chúng tôi</a></li>
            <li style={styles.li}><a href="/rooms" style={styles.link}>Cách đặt phòng</a></li>
            <li style={styles.li}><a href="/facilities" style={styles.link}>Tiện nghi khách sạn</a></li>
            <li style={styles.li}><a href="/contact" style={styles.link}>Liên hệ & góp ý</a></li>
          </ul>
        </div>

        <div style={styles.footerSection}>
          <h4 style={styles.h4}>Theo dõi chúng tôi</h4>
          <div>
            <a href="https://www.facebook.com/" style={styles.socialIconsLink}>
              <i className="fab fa-facebook-f" style={styles.socialIcon}></i> Facebook
            </a>
            <a href="https://www.instagram.com/" style={styles.socialIconsLink}>
              <i className="fab fa-instagram" style={styles.socialIcon}></i> Instagram
            </a>
            <a href="https://www.tiktok.com/" style={styles.socialIconsLink}>
              <i className="fab fa-tiktok" style={styles.socialIcon}></i> TikTok
            </a>
            <a href="https://www.youtube.com/" style={styles.socialIconsLink}>
              <i className="fab fa-youtube" style={styles.socialIcon}></i> Youtube
            </a>
          </div>
        </div>
        
        {/* === PHẦN BÊN PHẢI === */}
        <div style={styles.footerSection}>
          <h4 style={styles.h4}>Tải ứng dụng TamkaHotel</h4>
          <div>
            <a href="https://play.google.com/store/apps"><img style={styles.appDownloadsImage} src={ggP} alt="Tải trên Google Play" /></a>
            <br />
            <a href="https://www.apple.com/vn/app-store/"><img style={styles.appDownloadsImage} src={appS} alt="Tải trên App Store" /></a>
          </div>
        </div>
      </div>

      {/* === PHẦN CHÂN CÙNG (MÀU ĐẬM HƠN) === */}
      <div style={styles.footerBottomWrapper}>
        <div style={styles.footerBottom}>
          <p style={styles.footerBottomP}>Web quản lý khách sạn - Nhóm sinh viên 725105163_725105163_725105163</p>
          <p style={styles.footerBottomP}>Chuyên đề TN dự án Công nghệ/Khoa học © 2025. GVHD - Vũ Thị Xuyến</p>
        </div>
      </div>
    </footer>
  );
}