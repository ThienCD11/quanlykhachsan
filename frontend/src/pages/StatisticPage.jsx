// src/pages/StatisticPage.jsx
import React from "react";
// We still need NavLink and Outlet here
import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const StatisticPage = () => {
    // --- Styles remain the same ---
    const sidebarStyle = {
        width: "200px",
        backgroundColor: "navy",
        padding: "20px 10px",
        color: "white",
        minHeight: "calc(100vh - 100px)", // Adjust height as needed
    };

    const navLinkStyle = {
        display: "block",
        color: "white",
        padding: "10px 15px",
        textDecoration: "none",
        borderRadius: "4px",
        marginBottom: "5px",
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
    // --- End of Styles ---

    return (
        <div>
            <Header />
            <div style={mainLayoutStyle}>
                {/* Sidebar */}
                <div style={sidebarStyle}>
                    <h3 style={{ paddingLeft: '15px', marginBottom: '20px', borderBottom: '1px solid #ffffff50', paddingBottom: '10px' }}>ADMIN</h3>
                    {/* NavLinks now use absolute paths */}
                    <NavLink
                        to="/statistic"
                        end
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Thống Kê Tổng Quan
                    </NavLink>
                    <NavLink
                        to="/statistic/bookings"
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Yêu Cầu Đặt Phòng
                    </NavLink>
                    <NavLink
                        to="/statistic/feedbacks"
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Góp Ý & Đánh Giá
                    </NavLink>
                    <NavLink
                        to="/statistic/rooms"
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Danh Sách Phòng
                    </NavLink>
                                        <NavLink
                        to="/statistic/customers"
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Khách Hàng
                    </NavLink>
                    <NavLink
                        to="/statistic/revenue"
                        style={({ isActive }) => ({ ...navLinkStyle, ...(isActive ? activeStyle : {}) })}
                    >
                        Doanh Thu
                    </NavLink>
                </div>

                {/* Main Content Area */}
                <div style={contentStyle}>
                    {/* Outlet will render the component matched by the nested route in App.js */}
                    <Outlet />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StatisticPage;