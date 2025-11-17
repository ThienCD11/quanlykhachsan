import React, { useContext, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, Navigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../App";

// -------------------------------------------------------------------
// (1) TẠO COMPONENT CON MỚI (STATCARD) ĐỂ TÁI SỬ DỤNG
// Component này chứa logic hover
// -------------------------------------------------------------------
const StatCard = ({ title, value, unit, isRevenue = false }) => {
    
    // Style cơ bản cho card
    const cardStyle = {
        backgroundColor: isRevenue ? "navy" : "white", // Nền xanh navy nếu là Doanh thu
        color: isRevenue ? "white" : "black",
        padding: "20px 25px",
        borderRadius: "8px",
        boxShadow: "5px 5px 10px rgba(0,0,0,0.3)",
        textAlign: 'left',
        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Thêm transition
    };
    
    // Các style con
    const cardTitleStyle = {
        fontSize: "1rem",
        color: isRevenue ? "#f0f0f0" : "#555", // Chữ nhạt hơn trên nền đậm
        fontWeight: "600",
        margin: "0 0 10px 0",
    };
    const cardNumberStyle = {
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: isRevenue ? "white" : "navy",
        margin: 0,
    };
    const cardUnitStyle = {
        fontSize: "1rem",
        color: isRevenue ? "#f0f0f0" : "#333",
        marginLeft: '10px'
    };

    return (
        <div 
            style={cardStyle}
            // Logic hover được đặt TẠI MỘT NƠI DUY NHẤT
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "8px 8px 20px rgba(0,0,0,0.25)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.3)";
            }}
        >
            <h4 style={cardTitleStyle}>{title}</h4>
            <p style={cardNumberStyle}>{value}<span style={cardUnitStyle}>{unit}</span></p>
        </div>
    );
};


// -------------------------------------------------------------------
// (2) COMPONENT STATISTIC DASHBOARD (ĐÃ DỌN GỌN)
// -------------------------------------------------------------------
const StatisticDashboard = () => {
    
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
    };

    useEffect(() => {
        setIsLoading(true);
        axios.get("http://127.0.0.1:8000/api/statistic") 
            .then(res => {
                setStats(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("Lỗi tải thống kê:", err);
                setError("Không thể tải dữ liệu thống kê.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <h1 style={{ textAlign: "center", color: "#555", marginTop: "100px" }}>Đang tải dữ liệu thống kê...</h1>;
    }
    if (error) {
        return <h1 style={{ textAlign: "center", color: "red", marginTop: "100px" }}>{error}</h1>;
    }
    if (!stats) {
        return <h1>Không có dữ liệu.</h1>;
    }

    const formattedRevenue = Number(stats.totalRevenue || 0).toLocaleString("vi-VN");

    // (3) SỬ DỤNG COMPONENT StatCard 9 LẦN (Sạch sẽ hơn)
    return (
        <div style={gridStyle}>
            {/* Hàng 1 */}
            <StatCard title="Phòng Đang Trống" value={stats.availableRooms} unit="phòng" />
            <StatCard title="Phòng Đang Có Khách" value={stats.occupiedRooms} unit="phòng" />
            <StatCard title="Tổng Số Khách Hàng" value={stats.totalCustomers} unit="người" />
            
            {/* Hàng 2 */}
            <StatCard title="Yêu Cầu Đặt Phòng Mới" value={stats.pendingBookings} unit="đơn" />
            <StatCard title="Đơn Đã Hủy" value={stats.canceledBookings} unit="đơn" />
            <StatCard title="Đơn Đã Thanh Toán" value={stats.paidBookings} unit="đơn" />
            
            {/* Hàng 3 */}
            <StatCard title="Tổng Góp Ý" value={stats.totalSuggestions} unit="góp ý" />
            <StatCard title="Tổng Đánh Giá" value={stats.totalReviews} unit="đánh giá" />
            <StatCard title="Tổng Doanh Thu" value={formattedRevenue} unit="VNĐ" isRevenue={true} />
        </div>
    );
};


// -------------------------------------------------------------------
// (4) COMPONENT CHA (LAYOUT) - (Giữ nguyên logic)
// -------------------------------------------------------------------
const StatisticPage = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // --- Styles ---
    const sidebarStyle = {
        width: "200px",
        backgroundColor: "navy",
        padding: "20px 10px",
        color: "white",
        minHeight: "calc(100vh - 100px)",
    };
    const navLinkStyle = {
        display: "block", color: "white", padding: "10px 15px",
        textDecoration: "none", borderRadius: "4px", marginBottom: "5px",
    };
    const activeStyle = {
        backgroundColor: "#060f68ff",
        fontWeight: "bold",
    };
    const contentStyle = {
        flex: 1,
        padding: "30px",
        backgroundColor: "#f4f7f6",
    };
    const mainLayoutStyle = {
        display: "flex",
    };
    // --- Hết Styles ---

    // --- Logic bảo vệ (Auth Check) ---
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const isDashboardPage = location.pathname === '/statistic' || location.pathname === '/statistic/';

    return (
        <div>
            <Header />
            <div style={mainLayoutStyle}>
                {/* Sidebar */}
                <div style={sidebarStyle}>
                    <h3 style={{ paddingLeft: '15px', marginBottom: '20px', borderBottom: '1px solid #ffffff50', paddingBottom: '10px' }}>ADMIN</h3>
                    <NavLink to="/statistic" end style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Thống Kê Tổng Quan
                    </NavLink>
                    <NavLink to="/statistic/bookings" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Yêu Cầu Đặt Phòng
                    </NavLink>
                    <NavLink to="/statistic/feedbacks" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Góp Ý & Đánh Giá
                    </NavLink>
                    <NavLink to="/statistic/rooms" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Danh Sách Phòng
                    </NavLink>
                    <NavLink to="/statistic/customers" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Khách Hàng
                    </NavLink>
                    <NavLink to="/statistic/revenue" style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}>
                        Doanh Thu
                    </NavLink>
                </div>

                {/* Main Content Area */}
                <div style={contentStyle}>
                    {isDashboardPage ? <StatisticDashboard /> : <Outlet />}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StatisticPage;