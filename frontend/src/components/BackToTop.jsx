import React, { useState, useEffect } from 'react';
import top from "../images/top.png";

// Trong dự án thực tế của bạn, dòng này sẽ hoạt động:
// import top from "../images/top.png";
// Tuy nhiên, trong môi trường này (không có hệ thống file cục bộ), chúng tôi dùng placeholder URL.

// Nút cuộn về đầu trang (Back to Top)
const BackToTop = () => {
    // State kiểm soát việc hiển thị nút
    const [showScroll, setShowScroll] = useState(false);

    // Hàm kiểm tra vị trí cuộn
    const checkScrollTop = () => {
        // Hiển thị nút khi cuộn xuống hơn 400px
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    // Hàm cuộn về đầu trang
    const scrollToTop = () => {
        // Cuộn mượt về vị trí top 0
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    // Thiết lập listener cho sự kiện cuộn
    useEffect(() => {
        window.addEventListener('scroll', checkScrollTop);
        // Clean up function: xóa listener khi component unmount
        return () => {
            window.removeEventListener('scroll', checkScrollTop);
        };
    }, [showScroll]); 

    // Nếu không cần hiển thị, trả về null
    if (!showScroll) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            style={{
                position: 'fixed',
                bottom: '90px',
                right: '30px',
                zIndex: 1000,
                // backgroundColor: '#00008b', // Màu nền nút
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                padding: 0, 
                border: '3px #00008b solid',
                transition: 'opacity 0.3s, transform 0.3s',
                overflow: 'hidden', // Đảm bảo ảnh nằm gọn trong nút tròn
            }}
            className="hover:bg-indigo-700 active:scale-95"
            aria-label="Trở về đầu trang"
        >
            <img 
                src={top} 
                alt="Trở về đầu trang" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%',
                }}
                // Xử lý lỗi tải hình ảnh: nếu ảnh lỗi, hiển thị lại chữ ▲
                onError={(e) => {
                    e.target.style.display = 'none'; // Ẩn ảnh lỗi
                    e.target.parentNode.style.backgroundColor = '#00008b';
                    e.target.parentNode.innerHTML = '<span style="font-size: 24px; line-height: 50px; color: white;">▲</span>'; 
                }}
            />
        </button>
    );
};

export default BackToTop;