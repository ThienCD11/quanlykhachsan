import React, { useState, useContext } from "react";
import axios from "axios";

    const cardStyle = {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "10px",
        boxShadow: "10px 10px 10px rgba(0, 0, 0, 0.2)",
        width: "300px", // Độ rộng cố định cho mỗi card
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        gap: "5px", // Khoảng cách giữa các dòng
    };
    const titleStyle = {
        fontSize: "1.3rem",
        fontWeight: "bold",
        margin: "0 0 5px 0",
        borderBottom: '1px solid #00008b',
        paddingBottom: '5px',
    };
    const detailStyle = {
        fontSize: "1rem",
        margin: 0,
        color: "#555",
    };
    const strongDetailStyle = {
        ...detailStyle,
        // fontWeight: 'bold',
        color: '#333',
    };
    const buttonContainerStyle = {
        marginTop: '10px',
        display: 'flex',
        justifyContent: 'space-between', // Đặt 2 nút ở 2 góc
    };
    const statusButtonStyle = {
        padding: '5px 10px',
        borderRadius: '5px',
        border: 'none',
        fontWeight: 'bold',
        backgroundColor: '#ffc107', // Màu vàng cho "Đã Đặt"
        color: '#000000ff',
    };
    const cancelButtonStyle = {
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        fontWeight: 'bold',
        backgroundColor: '#dc3545', // Màu đỏ cho nút Hủy
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    };

const HistoryCard = ({ history, onUpdate }) => {
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelError, setCancelError] = useState("");

  const handleCancelBooking = async () => {
    if(window.confirm(`Bạn có chắc muốn hủy đặt phòng ${history.room_name} không?`)) {
        setIsCanceling(true);
        setCancelError("");


        try {
            // 5. GỌI API VỚI TOKEN (TỪ CONTEXT)
            await axios.post(
                `http://127.0.0.1:8000/api/bookings/${history.id}/customer-cancel`,
                {},
            );
            
            onUpdate(); // Tải lại trang cha
            
        } catch (err) {
            console.error("Lỗi khi hủy đơn:", err);
            setCancelError(err.response?.data?.message || "Lỗi: Không thể hủy đơn.");
        } finally {
            setIsCanceling(false);
        }
    }
  }

    return (
        <div style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.2)";
            }}
        >
            <h4 style={titleStyle}>Phòng {history.room_name}</h4>
            <p style={detailStyle}>Chi phí: {history.price_per_night} / đêm</p>
            <p style={strongDetailStyle}>Ngày vào: {history.check_in}</p>
            <p style={strongDetailStyle}>Ngày trả: {history.check_out}</p>
            <p style={detailStyle}>Ngày đặt: {history.booked_at}</p>
            <p style={detailStyle}>ID đơn: {history.invoice_id}</p>
            <p style={detailStyle}>Thanh toán: {history.total_price}</p>

            {cancelError && <p style={{color: 'red', fontSize: '0.9rem', margin: '5px 0 0 0'}}>{cancelError}</p>}
            
            {/* 6. LOGIC HIỂN THỊ (giữ nguyên thiết kế cũ) */}
        <div style={buttonContainerStyle}>
            
            {(history.status === 'Đã đặt phòng' || history.status === null) ? (
                // TH1: 'Đã đặt phòng'
                <>
                    <button style={statusButtonStyle} disabled>
                        {history.status || 'Đã đặt phòng'}
                    </button>
                    <button
                        style={cancelButtonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a91c2aff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        onClick={handleCancelBooking}
                        disabled={isCanceling}
                    >
                        {isCanceling ? "Đang hủy..." : "Hủy Đặt Phòng"}
                    </button>
                </>
            ) : (history.status === 'Đã hủy') ? (
                // TH4: 'Đã hủy'
                <button 
                    style={{ ...statusButtonStyle,}} 
                    disabled
                >
                    Đã hủy
                </button>
            ) : (
                // Các trạng thái khác
                <button 
                    style={{ ...statusButtonStyle,}} 
                    disabled
                >
                    {history.status}
                </button>
            )}
        </div>
        </div>
    );
};

export default HistoryCard;