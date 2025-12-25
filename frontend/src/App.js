import React, { useState, createContext, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import Chatbot from './components/Chatbot';
import Messenger from './components/Messenger.jsx';

// 1. Tạo một Context để chia sẻ state 'user'
export const AuthContext = createContext(null);

// TẠO COMPONENT PHỤ ĐỂ SỬ DỤNG useLocation
const MainContent = () => {
  const location = useLocation();

  // DANH SÁCH CÁC TRANG KHÔNG HIỆN CHATBOT
  // Bạn có thể thêm hoặc bớt các đường dẫn vào mảng này
  const hiddenPages = [
    "/login",
    "/register",
    "/password",
    "/statistic", // Chặn tất cả trang statistic và trang con của nó
    "/payment-return"
  ];

  // Kiểm tra xem đường dẫn hiện tại có bắt đầu bằng các từ khóa trong danh sách ẩn không
  const shouldHideChat = hiddenPages.some(path => location.pathname.startsWith(path));

  return (
    <>
      <ScrollToTop />
      {!shouldHideChat && (
        <>
          <Chatbot />
          <Messenger />
        </>
      )}

      <Routes>
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
    </>
  );
};

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem('authToken'));

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('authToken', token);
    } else {
      sessionStorage.removeItem('authToken');
    }
  }, [token]);

  const authContextValue = useMemo(() => ({
    user,
    setUser,
    token,
    setToken 
  }), [user, token]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {/* Router bọc ngoài cùng */}
      <Router>
        {/* Render MainContent chứa logic ẩn/hiện chatbot và Routes */}
        <MainContent />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;