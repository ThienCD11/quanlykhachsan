import React from "react";
import logo from "../images/logo.png";
import "../css/RoomCard.css";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  // Kiểm tra trạng thái is_active
  const isActive = room.is_active;

  return (
    <div className="room-card">
      <img src={room.image_url} alt={room.name} className="room-image" /> 
      <div className="room-info">
        <div className="room-text">
          <h2>Phòng {room.name}</h2>
          <h3 className="label">Giá phòng</h3>
          <p>{Number(room.price).toLocaleString("vi-VN")} VND / 1 đêm</p>
          <h3 className="label">Sức chứa</h3>
          <p>Tối đa {room.capacity} Người</p>
        </div>
        <div className="room-action">
          <img src={logo} alt="logo" className="room-logo" />
          
          {isActive ? (
            <Link to={`/booking/${room.id}`} className="book-now-btn">
              Xem chi tiết
            </Link>
          ) : (
            <button className="book-now-btn disabled-btn" disabled 
                    style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>
              Đang bảo trì
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default RoomCard;