import React, { useState, createContext, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from './pages/HomePage';
import RoomPage from "./pages/RoomPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import BookingPage from "./pages/BookingPage";
import StatisticPage from "./pages/StatisticPage";
import HistoryPage from './pages/HistoryPage';

// 1. Tạo một Context để chia sẻ state 'user'
export const AuthContext = createContext(null);

function App() {
  // 2. Lấy thông tin user từ localStorage (nếu có) khi tải ứng dụng
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 3. Tự động lưu thông tin user vào localStorage mỗi khi state 'user' thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 4. Dùng useMemo để tối ưu, tránh re-render không cần thiết
  const authContextValue = useMemo(() => ({ user, setUser }), [user]);

  return (
    // 5. Cung cấp state 'user' và hàm 'setUser' cho toàn bộ ứng dụng
    <AuthContext.Provider value={authContextValue}>
      <Router>
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
          <Route path="/booking/:roomId" element={<BookingPage />} />
          <Route path="/statistic/*" element={<StatisticPage />} />
          <Route path="/history/*" element={<HistoryPage />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
