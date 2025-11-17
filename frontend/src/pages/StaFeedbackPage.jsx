import React, { useEffect, useState } from "react";
import axios from "axios";

// Component con để hiển thị sao
const StarRating = ({ rating }) => {
    const totalStars = 5;
    let numericRating = parseFloat(rating);
    if (isNaN(numericRating)) return null;
    
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(<span key={i} style={{ color: i <= numericRating ? '#ffc107' : '#e4e5e9' }}>★</span>);
    }
    return <div>{stars}</div>;
};

// Component Bảng Góp Ý
const SuggestionTable = ({ data }) => {
    const tableHeaderStyle = { backgroundColor: "#003366", color: "white", padding: "15px", textAlign: "left",cursor: 'pointer', };
    const tableCellStyle = { padding: "15px", borderBottom: "1px solid #ddd", verticalAlign: "top" };

    return (
        <table 
        style={{ 
            width: "100%", 
            borderCollapse: "collapse", 
            backgroundColor: "white", 
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            borderRadius: '5px',
            overflow: "hidden",
        }}>
            <thead>
                <tr>
                    <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}}>STT</th>
                    <th style={{...tableHeaderStyle,}}>Khách hàng</th>
                    <th style={{...tableHeaderStyle,}}>Email</th>
                    <th style={{...tableHeaderStyle,}}>Thời điểm gửi</th>
                    <th style={{...tableHeaderStyle,}}>Tiêu đề</th>
                    <th style={tableHeaderStyle}>Nội dung</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.stt}>
                        <td style={{...tableCellStyle, textAlign: 'center'}}>{item.stt}</td>
                        <td style={tableCellStyle}>{item.name}</td>
                        <td style={tableCellStyle}>{item.email}</td>
                        <td style={tableCellStyle}>{item.created_at}</td>
                        <td style={tableCellStyle}>{item.title}</td>
                        <td style={tableCellStyle}>{item.content}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

// Component Bảng Đánh Giá
const ReviewTable = ({ data }) => {
    const tableHeaderStyle = { backgroundColor: "#003366", color: "white", padding: "15px", textAlign: "left",cursor: 'pointer' };
    const tableCellStyle = { padding: "15px", borderBottom: "1px solid #ddd", verticalAlign: "top" };

    return (
        <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", borderRadius: '5px',overflow: "hidden"}}>
            <thead>
                <tr>
                    <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}}>STT</th>
                    <th style={{...tableHeaderStyle}}>Khách hàng</th>
                    <th style={{...tableHeaderStyle,}}>Mã đơn</th>
                    <th style={{...tableHeaderStyle,}}>Phòng</th>
                    <th style={{...tableHeaderStyle,}}>Thời điểm gửi</th>
                    <th style={{...tableHeaderStyle,}}>Rating</th>
                    <th style={{...tableHeaderStyle,}}>Nội dung</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item) => (
                    <tr key={item.stt}>
                        <td style={{...tableCellStyle, textAlign: 'center'}}>{item.stt}</td>
                        <td style={tableCellStyle}>{item.customer_name}</td>
                        <td style={tableCellStyle}>{item.invoice_id}</td>
                        <td style={tableCellStyle}>{item.room_name}</td>
                        <td style={tableCellStyle}>{item.created_at}</td>
                        <td style={tableCellStyle}><StarRating rating={item.rating} /></td>
                        <td style={tableCellStyle}>{item.comment}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


// Component Cha (Trang chính)
const StaFeedbackPage = () => {
  // 'suggestions' hoặc 'reviews'
  const [activeTab, setActiveTab] = useState('suggestions'); 
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Style cho các tab
  const tabStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    border: 'none',
    borderBottom: '3px solid transparent',
    backgroundColor: 'transparent',
    color: '#555',
  };
  const activeTabStyle = {
    ...tabStyle,
    color: 'navy',
    borderBottom: '3px solid navy',
  };

  // Logic gọi API khi tab thay đổi
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setData([]); // Xóa dữ liệu cũ

    const endpoint = activeTab === 'suggestions' 
      ? 'http://127.0.0.1:8000/api/statistic/suggestions'
      : 'http://127.0.0.1:8000/api/statistic/reviews';

    axios.get(endpoint)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error(`Lỗi khi tải ${activeTab}:`, err);
        setError(`Không thể tải dữ liệu. Vui lòng thử lại.`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeTab]); // Chạy lại khi activeTab thay đổi

  return (
    <div>
      <h2>Góp Ý & Đánh Giá Khách Hàng</h2>

      {/* 1. Thanh chuyển Tab */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
        <button 
          style={activeTab === 'suggestions' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('suggestions')}
        >
          Góp Ý (từ Trang Liên Hệ)
        </button>
        <button 
          style={activeTab === 'reviews' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('reviews')}
        >
          Đánh Giá (từ Lịch Sử Đặt Phòng)
        </button>
      </div>

      {/* 2. Hiển thị nội dung dựa trên trạng thái */}
      {isLoading ? (
        <h1 style={{ textAlign: "center", color: "#555", marginTop: "100px" }}>Đang tải dữ liệu...</h1>
      ) : error ? (
        <h1 style={{ textAlign: "center", color: "red", marginTop: "100px" }}>{error}</h1>
      ) : data.length === 0 ? (
        <h1 style={{ textAlign: "center", color: "#888", marginTop: "100px" }}>Không có dữ liệu.</h1>
      ) : (
        // 3. Hiển thị bảng tương ứng
        activeTab === 'suggestions' 
          ? <SuggestionTable data={data} /> 
          : <ReviewTable data={data} />
      )}
    </div>
  );
};

export default StaFeedbackPage;