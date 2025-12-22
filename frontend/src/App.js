import React, { useState, createContext, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import RoomPage from "./pages/RoomPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import PasswordPage from './pages/PasswordPage';
import BookingPage from "./pages/BookingPage";
import StatisticPage from "./pages/StatisticPage";
import HistoryPage from './pages/HistoryPage';
import ScrollToTop from "./components/ScrollToTop";
import StaBookingPage from "./pages/StaBookingPage";
import PersonalPage from './pages/PersonalPage';
import StaRoomPage from './pages/StaRoomPage';
import StaFeedbackPage from './pages/StaFeedbackPage';
import StaCustomerPage from './pages/StaCustomerPage.jsx';
import StaRevenuePage from './pages/StaRevenuePage.jsx';
import StaFacilityPage from './pages/StaFacilityPage.jsx';
import PaymentReturn from './pages/PaymentReturn';
// 1. Tạo một Context để chia sẻ state 'user'
export const AuthContext = createContext(null);

function App() {
  // 2. Lấy thông tin user từ localStorage (nếu có) khi tải ứng dụng
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('authToken'));

  // 3. Tự động lưu thông tin user vào localStorage mỗi khi state 'user' thay đổi
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  // 2. THÊM useEffect MỚI ĐỂ LƯU TOKEN
  useEffect(() => {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [token]);

  // 3. CẬP NHẬT CONTEXT VALUE (Quan trọng nhất)
  // Giờ đây Context sẽ cung cấp cả 4 giá trị
  const authContextValue = useMemo(() => ({
    user,
    setUser,
    token,
    setToken 
  }), [user, token]); // Thêm 'token' vào dependency

  return (
    // 5. Cung cấp state 'user' và hàm 'setUser' cho toàn bộ ứng dụng
    <AuthContext.Provider value={authContextValue}>
      <Router>

        <ScrollToTop />

        <Routes>
          {/* Các trang này (HomePage, RoomPage...) bên trong chúng có
            render <Header /> và <Footer />. Header sẽ tự động
            lấy 'user' từ Context.
          */}
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password" element={<PasswordPage />} />
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/history/*" element={<HistoryPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/payment-return" element={<PaymentReturn />} />

          <Route path="/statistic/*" element={<StatisticPage />} >
            <Route path="bookings" element={<StaBookingPage />} />
            <Route path="rooms" element={<StaRoomPage />} />
            <Route path="feedbacks" element={<StaFeedbackPage />} />
            <Route path="customers" element={<StaCustomerPage />} />
            <Route path="revenue" element={<StaRevenuePage />} />
            <Route path="facilities" element={<StaFacilityPage/>} />
          </Route>
          
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
 
export default App;
