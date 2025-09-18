import React from "react";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card" style={{ border: "1px solid #ddd", padding: "16px", margin: "10px", borderRadius: "8px" }}>
      <h3>{room.name}</h3>
      <p>💰 Giá: {room.price} VND / đêm</p>
      <p>🛏️ Tiện nghi: {room.facilities.join(", ")}</p>
      <p>👥 Sức chứa: {room.capacity} người</p>
      <button style={{ marginRight: "10px" }}>Đặt ngay</button>
      <button>Chi tiết</button>
    </div>
  );
};

export default RoomCard;
