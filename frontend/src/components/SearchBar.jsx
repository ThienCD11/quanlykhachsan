import React, { useState } from "react";

export default function SearchBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);

  const handleSearch = () => {

  };

  return ( 
    <div
      style={{
        background: "#ffffffff",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "15px 15px 20px rgba(0,0,0,0.3)",
        maxWidth: "1000px",
        margin: "5px auto",
        border: "0px solid #061797ff",
        // marginTop: "-20px",
      }}
    >
      <h3 style={{ textAlign: "center", marginTop: "5px", color: "#0d0248ff" }}>
        Tìm Phòng Ngay
      </h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {/* Ngày nhận phòng */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Ngày Nhận Phòng
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        {/* Ngày trả phòng */}
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Ngày Trả Phòng
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>

        {/* Sức chứa */}
        <div style={{ flex: 0.5 }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Sức chứa 
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(e.target.value)}
            style={{
              width: "80%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* Nút tìm phòng */}
        <div style={{ flex: 0.6, alignSelf: "flex-end" }}>
          <button
            onClick={handleSearch}
            style={{
              width: "100%",
              padding: "10px",
              background: "#ffffffff",
              // border: "none",
              borderRadius: "5px",
              color: "gray",
              fontWeight: "bold",
              cursor: "pointer",
              border: "1px solid #ccc",
              marginBottom: "1.5px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00008b";
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "gray";
            }}
          >
            Tìm Phòng
          </button>
        </div>
      </div>
    </div>
  );
}
