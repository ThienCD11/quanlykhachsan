import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export default function Room() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axiosInstance.get("/rooms?limit=3")
      .then(data => setRooms(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section style={{ padding: "20px" }}>
      <h3>Phòng nổi bật</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        {rooms.map((room) => (
          <div key={room.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <img src={room.image_url} alt={room.name} style={{ width: "200px", height: "120px", objectFit: "cover" }} />
            <h4>{room.name}</h4>
            <p>{room.price} VND / đêm</p>
            <button>Đặt ngay</button>
            <button>Chi tiết</button>
          </div>
        ))}
      </div>
    </section>
  );
}
