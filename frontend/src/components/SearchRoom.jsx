import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/SearchRoom.css";

const SearchRoom = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [error, setError] = useState(""); 
  const navigate = useNavigate(); 

  const handleSearch = () => {
    setError(""); 

    // --- Validate đầu vào ---
    // 1. Kiểm tra ngày (phải điền cả 2 hoặc không điền)
    if ((checkIn && !checkOut) || (!checkIn && checkOut)) {
        setError("Vui lòng chọn cả ngày nhận phòng và ngày trả phòng.");
        return;
    }
    // 2. Kiểm tra ngày trả phải và ngày nhận
    if (checkIn && checkOut) {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Chuẩn hóa 'hôm nay' về 0 giờ sáng

        if (checkInDate < today) {
            setError("Ngày nhận phòng phải là hôm nay hoặc một ngày sau đó.");
            return; 
        }

        if (checkOutDate <= checkInDate) {
            setError("Ngày trả phòng phải là ngày sau ngày nhận phòng.");
            return;
        }
    }
    // 3. Kiểm tra giá
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        setError("Giá tối thiểu phải bằng hoặc nhỏ hơn giá tối đa.");
        return;
    }

    // --- Tạo chuỗi query parameters ---
    const params = new URLSearchParams();

    // Thêm các tham số vào 'params' CHỈ KHI chúng có giá trị
    if (checkIn) params.append("check_in", checkIn);
    if (checkOut) params.append("check_out", checkOut);
    if (name) params.append("name", name);
    if (capacity) params.append("capacity", capacity);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);

    // Dùng navigate để cập nhật URL, việc này sẽ trigger
    // useEffect của RoomPage.jsx tự động chạy lại
    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="search-container">
      <h3 className="search-title">Tìm Kiếm Phòng</h3>

      <div className="search-group">
        <h4>Tìm Theo Ngày</h4>
        <label>Ngày Nhận Phòng</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />
        <label>Ngày Trả Phòng</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />
      </div>

      <div className="search-group">
        <h4>Tìm Theo Tên</h4>
        <input
          type="text"
          placeholder="Nhập tên phòng..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="search-group">
        <h4>Tìm Theo Giá</h4>
        <label>Giá tối thiểu</label>
        <input
          type="number"
          min="180000"
          max="2800000"
          placeholder="180000 - 2800000"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <label>Giá tối đa</label>
        <input
          type="number"
          min="200000"
          max="3000000"
          placeholder="200000 - 3000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="search-group">
        <h4>Tìm Theo Sức Chứa</h4>
        <label>Số lượng tối đa</label>
        <input
          type="number"
          min="1"
          max="10"
          placeholder="từ 1 đến 10 người"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />
      </div>

    {error && <p className="search-error" style={{color: 'red', textAlign: 'center', background: 'pink', borderRadius: '3px', margin: '-8px 0 10px 0', padding:'2px 5px'}}>{error}</p>}
      <button className="search-btn" onClick={handleSearch}>Tìm Phòng</button>
    </div>
  );
};

export default SearchRoom;
