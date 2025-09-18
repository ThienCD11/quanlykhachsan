import React, { useState } from "react";

export default function SearchBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [capacity, setCapacity] = useState(1);

  const handleSearch = () => {
    alert(`Tìm phòng từ ${checkIn} đến ${checkOut}, cho ${capacity} người`);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      <input
        type="number"
        min="1"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm phòng</button>
    </div>
  );
}
