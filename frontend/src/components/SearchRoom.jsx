import React, { useState } from "react";
import "../css/SearchRoom.css";

const SearchRoom = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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

      <button className="search-btn">Tìm Phòng</button>
    </div>
  );
};

export default SearchRoom;
