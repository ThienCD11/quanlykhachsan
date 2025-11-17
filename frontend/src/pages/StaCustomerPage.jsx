import React, { useEffect, useState } from "react";
import axios from "axios";

const StaCustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API mới
    axios.get("http://127.0.0.1:8000/api/statistic/customers")
      .then(res => {
        setCustomers(res.data);
      })
      .catch(err => {
        console.error("Lỗi khi tải danh sách khách hàng:", err);
        setError("Không thể tải dữ liệu khách hàng.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []); // Chỉ chạy 1 lần khi tải trang

  // Định nghĩa style (Tương tự các trang Sta... khác)
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "5px",
    overflow: "hidden",
  };
  const tableHeaderStyle = {
    backgroundColor: "#000266ff",
    color: "white",
    padding: "15px",
    textAlign: "left",
    cursor: "pointer",
  };
  const tableCellStyle = {
    padding: "15px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    verticalAlign: "top", // Căn lề trên
  };

  // Logic hiển thị
  if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách khách hàng...</h1>;
  if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

  return (
    <div>
      <h2>Quản Lý Khách Hàng</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}}>STT</th>
            <th style={tableHeaderStyle}>Tên</th>
            <th style={{...tableHeaderStyle,}}>Số điện thoại</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Địa chỉ</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Tổng đơn</th>
            <th style={{...tableHeaderStyle, textAlign: 'center'}}>Đã thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có khách hàng nào đăng ký.</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.stt}>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{customer.stt}</td>
                <td style={{...tableCellStyle, }}>{customer.name}</td>
                <td style={tableCellStyle}>{customer.phone}</td>
                <td style={tableCellStyle}>{customer.email}</td>
                <td style={tableCellStyle}>{customer.address}</td>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{customer.total_bookings}</td>
                <td style={{...tableCellStyle, textAlign: 'center'}}>{customer.paid_bookings}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaCustomerPage;