import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import RoomCard from "../components/RoomCard";

const RoomsPage = () => {
  // Demo dữ liệu, sau này sẽ fetch từ BE
  const rooms = [
    { id: 1, name: "Phòng Deluxe", price: 1200000, facilities: ["Giường đôi", "Điều hòa", "TV"], capacity: 2 },
    { id: 2, name: "Phòng Standard", price: 800000, facilities: ["Giường đơn", "Điều hòa"], capacity: 1 },
    { id: 3, name: "Phòng Family", price: 2000000, facilities: ["2 Giường đôi", "Điều hòa", "Ban công"], capacity: 4 },
  ];

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <h2>Danh sách phòng</h2>
        <SearchBar />
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RoomsPage;
