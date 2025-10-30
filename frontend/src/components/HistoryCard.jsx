import React from "react";

const HistoryCard = ({ history }) => {
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
        fontWeight: 'bold',
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

    const handleCancelBooking = () => {
        // TODO: Xử lý logic hủy đặt phòng (gọi API)
        if(window.confirm(`Bạn có chắc muốn hủy đặt phòng ${history.room_name} không?`)) {
            console.log("Hủy đặt phòng ID:", history.id);
            // Gọi API hủy ở đây...
            // alert("Đã gửi yêu cầu hủy (chức năng chưa hoàn thiện).");
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
            <p style={detailStyle}>{history.price_per_night} / đêm</p>
            <p style={strongDetailStyle}>Ngày vào: {history.check_in}</p>
            <p style={strongDetailStyle}>Ngày trả: {history.check_out}</p>
            <p style={detailStyle}>Thanh toán: {history.total_price}</p>
            <p style={detailStyle}>Ngày đặt: {history.booked_at}</p>
            <p style={detailStyle}>ID đơn: {history.invoice_id}</p>

            <div style={buttonContainerStyle}>
                {/* Nút trạng thái (ví dụ: Đã Đặt) */}
                <button style={statusButtonStyle} disabled>{history.status}</button>

                {/* Nút Hủy Đặt Phòng (chỉ hiển thị nếu trạng thái cho phép hủy?) */}
                {/* {history.status === 'Đã Đặt' && ( */}
                    <button
                        style={cancelButtonStyle}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a91c2aff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                        onClick={handleCancelBooking}
                    >
                        Hủy Đặt Phòng
                    </button>
                {/* )} */}
            </div>
        </div>
    );
};

export default HistoryCard;