import React from 'react';
import MESSENGER_ICON from "../images/messenger.png";

// URL của trang Messenger
const MESSENGER_URL = "https://www.facebook.com/messages/t/859879233880682";

const Messenger = () => {
    return (
        <>
        <style>
                {`
                @keyframes spin-5s {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .spinning-button {
                    animation: spin-5s 5s linear infinite; 
                }
                `}
        </style>
        <a
            href={MESSENGER_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '30px', // Vị trí cố định ở dưới cùng
                right: '30px', // Đã chuyển sang bên PHẢI
                zIndex: 999, // Z-index thấp hơn BackToTop
                // backgroundColor: '#0078FF', // Màu xanh Messenger
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
                padding: 0, 
                border: 'none',
                // transition: 'background-color 0.3s, transform 0.3s',
                overflow: 'hidden', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
            }}
            className="spinning-button hover:bg-blue-600 active:scale-95"
            aria-label="Liên hệ qua Messenger"
        >
            <img 
                src={MESSENGER_ICON} 
                alt="Messenger" 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '50%',
                }}
                // Xử lý lỗi tải hình ảnh: nếu ảnh lỗi, hiển thị chữ 'Chat'
                onError={(e) => {
                    e.target.style.display = 'none'; 
                    e.target.parentNode.style.fontSize = '12px';
                    e.target.parentNode.style.color = 'white';
                    e.target.parentNode.innerHTML = 'Chat'; 
                }}
            />
        </a>
        </>
    );
};

export default Messenger;