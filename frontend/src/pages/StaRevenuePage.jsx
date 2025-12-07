import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const StaRevenuePage = () => {
  // --- 1. KHAI BÁO TẤT CẢ HOOKS Ở ĐẦU COMPONENT ---
  
  // State dữ liệu chính
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho phân trang và sắp xếp (Di chuyển lên đây)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // useEffect gọi API
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/statistic/revenue")
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  // --- 2. LOGIC XỬ LÝ DỮ LIỆU (Sắp xếp & Phân trang) ---
  
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Chỉ thực hiện sort/phân trang khi có data (data không null)
  let paginatedData = [];
  let totalItems = 0;
  let totalPages = 0;
  let startIndex = 0;

  if (data && data.detailedBookings) {
      // Clone mảng detailedBookings để sort
      const sortedData = [...data.detailedBookings].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let x = a[sortConfig.key];
        let y = b[sortConfig.key];

        // Xử lý số tiền (loại bỏ ký tự không phải số nếu cần, hoặc backend trả về số thì ok)
        // Ở đây giả sử backend trả về số cho cột 'total', 'capacity'
        
        if (typeof x === "string") x = x.toLowerCase();
        if (typeof y === "string") y = y.toLowerCase();

        if (x < y) return sortConfig.direction === "asc" ? -1 : 1;
        if (x > y) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });

      totalItems = sortedData.length;
      totalPages = Math.ceil(totalItems / rowsPerPage);
      startIndex = (currentPage - 1) * rowsPerPage;
      paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- 3. RETURN SỚM (LOADING/ERROR) ---
  // (Đặt sau hooks nhưng trước khi render giao diện chính)
  
  if (isLoading) return <h2 style={{textAlign:'center', marginTop:'50px', color: '#555'}}>Đang tải dữ liệu...</h2>;
  if (!data) return <h2 style={{textAlign:'center', color:'red', marginTop:'50px'}}>Không có dữ liệu</h2>;

  // --- 4. RENDER GIAO DIỆN ---

  // --- Styles ---
  const containerStyle = {
    // padding: '20px' 
  };

  // 1. Style cho Hàng chứa Cards và Pie Chart
  const topSectionStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  };

  const cardGridStyle = {
    flex: 2, // Chiếm 2 phần
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '30px',
  };
  
  const cardStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '10px 10px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: '5px solid navy', // Điểm nhấn
    minHeight: '80px',
    minWidth: '200px',
  };

  const cardTitle = { fontSize: '1.1rem', color: '#0b0411ff', marginBottom: '5px', fontWeight: 'bold', textAlign: 'center' };
  const cardValue = { fontSize: '1.7rem', color: '#00008b', fontWeight: 'bold', margin: 0 }; 
  
  // Style cho vùng Biểu đồ (Hàng 2)
  const chartsRowStyle = {
    display: 'flex',
    gap: '30px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  };

  const chartSectionStyle = {
    flex: 1,
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '10px 10px 15px rgba(0,0,0,0.3)',
    minWidth: '300px'
  };

  const chartTitle = { marginBottom: '20px', color: '#333', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' };

  // Style cho Bảng
  const tableStyle = { 
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "5px",
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: 'hidden'
  };
  const tableHeaderStyle = { 
    backgroundColor: '#00008b', 
    color: 'white', 
    padding: '12px', 
    textAlign: 'left', 
    cursor: "pointer",
  };
  const tableCellStyle = {
    padding: "15px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '20px'}}>Thống Kê Doanh Thu</h2>
      
      {/* --- PHẦN 1: TỔNG QUAN --- */}
      <div style={topSectionStyle}>
        <div style={cardGridStyle}>
            <div style={cardStyle}>
              <span style={cardTitle}>Doanh thu hôm nay</span>
              <p style={cardValue}>{formatCurrency(data.todayRevenue)}</p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Doanh thu 7 ngày qua</span>
              <p style={cardValue}>{formatCurrency(data.last7DaysRevenue)}</p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Tổng doanh thu</span>
              <p style={cardValue}>{formatCurrency(data.totalRevenue)}</p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Tổng đơn thanh toán</span>
              <p style={cardValue}>{data.totalOrders} đơn</p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Tổng đơn đã hoàn</span>
              <p style={cardValue}>{data.totalRefundedOrders} đơn</p>
            </div>
            <div style={cardStyle}>
              <span style={cardTitle}>Tổng tiền đã hoàn</span>
              <p style={cardValue}>{formatCurrency(data.totalRefundedAmount)}</p>
            </div>
        </div>
      </div>

      {/* --- PHẦN 2: HAI BIỂU ĐỒ CÙNG 1 DÒNG --- */}
      <div style={chartsRowStyle}>
        
        {/* Biểu đồ 1: Doanh thu 7 ngày (Area Chart) */}
        <div style={chartSectionStyle}>
          <h3 style={chartTitle}>Doanh Thu 7 Ngày Gần Nhất</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={data.weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueWeekly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00008b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00008b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} style={{ fontSize: '12px' }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#00008b" fillOpacity={1} fill="url(#colorRevenueWeekly)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ 2: Doanh thu theo tháng (Bar Chart) */}
        <div style={chartSectionStyle}>
          <h3 style={chartTitle}>Doanh Thu Theo Tháng</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={data.monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" style={{ fontSize: '12px' }} />
                <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact" }).format(value)} style={{ fontSize: '12px' }} />
                <Tooltip formatter={(value) => formatCurrency(value)} cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="revenue" name="Doanh thu" fill="#00008b" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- PHẦN 3: BIỂU ĐỒ ĐƯỜNG & PIE CHART --- */}
      <div style={chartsRowStyle}>
        {/* Cột phải: Biểu đồ tròn */}
        <div style={chartSectionStyle}> 
             <h3 style={chartTitle}>Xu Hướng Đặt Phòng</h3>
             <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data.pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={1}
                            dataKey="value"
                            label={({percent}) => `${(percent * 100).toFixed(0)}%`}
                        >
                            {data.pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value} đơn`} />
                        <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize: '12px'}}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
        </div>

        <div style={chartSectionStyle}>
          <h3 style={chartTitle}>Xu Hướng Đơn Thanh Toán</h3>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={data.monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" name="Số đơn thanh toán" stroke="#00008b" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- PHẦN 4: BẢNG CHI TIẾT ĐƠN HÀNG --- */}
      <div>
        <h2 style={{margin:'50px 0px 20px 0px',}}>Chi Tiết Đơn Đã Thanh Toán</h2>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }} onClick={() => handleSort("stt")}>STT</th>
                <th style={{...tableHeaderStyle, paddingLeft: '15px'}} onClick={() => handleSort("invoice_id")}>Mã đơn</th>
                <th style={tableHeaderStyle} onClick={() => handleSort("customer_name")}>Khách hàng</th>
                <th style={tableHeaderStyle} onClick={() => handleSort("room_name")}>Tên Phòng</th>
                <th style={{ ...tableHeaderStyle, textAlign: 'center' }}>Thời lượng</th>
                <th style={{...tableHeaderStyle, paddingLeft: '20px'}} onClick={() => handleSort("booked_at")}>Ngày đặt</th>
                <th style={{...tableHeaderStyle, paddingLeft: '20px'}} onClick={() => handleSort("paid_at")}>Ngày thanh toán</th>
                <th style={{ ...tableHeaderStyle, paddingLeft: '15px'}} onClick={() => handleSort("total")}>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan="9" style={{textAlign: 'center', padding: '20px', color: '#888'}}>Chưa có đơn hàng nào.</td></tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={item.invoice_id}>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{item.stt}</td>
                    <td style={{ ...tableCellStyle, }}>{item.invoice_id}</td>
                    <td style={tableCellStyle}>{item.customer_name}</td>
                    <td style={tableCellStyle}>{item.room_name}</td>
                    <td style={{ ...tableCellStyle, textAlign: 'center' }}>{item.duration}</td>
                    <td style={tableCellStyle}>{item.booked_at}</td>
                    <td style={tableCellStyle}>{item.paid_at}</td>
                    <td style={{ ...tableCellStyle, fontWeight: 'bold'}}>
                      {formatCurrency(item.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          {totalItems > rowsPerPage && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 5px", fontSize: "14px" }}>
                <span>
                SHOWING {startIndex + 1} TO {Math.min(startIndex + rowsPerPage, totalItems)} OF {totalItems}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => paginate(currentPage - 1)}
                    style={{ background: "none", border: "none", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: "18px" }}
                >
                    ❮
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    style={{
                        width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer",
                        background: i + 1 === currentPage ? "#00008b" : "#eaeaea",
                        color: i + 1 === currentPage ? "white" : "black", fontWeight: "bold",
                    }}
                    >
                    {i + 1}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => paginate(currentPage + 1)}
                    style={{ background: "none", border: "none", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: "18px" }}
                >
                    ❯
                </button>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default StaRevenuePage;