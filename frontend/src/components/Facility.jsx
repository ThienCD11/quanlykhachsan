import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { NavLink } from "react-router-dom";
import img from "../images/next.png";

export default function Facility() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/facilities?limit=6") // lấy tối đa 6 tiện nghi
      .then((res) => setFacilities(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section style={{ padding: "40px 0", textAlign: "center" }}>
      {/* Tiêu đề */}
      <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", marginBottom: "30px" }}>
        Tiện nghi nổi bật
      </h3>
      <hr
        style={{
          width: "300px",
          marginTop: "-29px",
          marginBottom: "20px",
          border: "1px solid black",
          borderRadius: "2px",
        }}
      />

      {/* Danh sách tiện nghi */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "25px",
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        {facilities.slice(0, 5).map((f) => (
          <div
            key={f.id}
            style={{
              // border: "0.2px solid #061797ff",
              padding: "15px",
              width: "170px",
              borderRadius: "8px",
              boxShadow: "8px 8px 10px rgba(0,0,0,0.2)",
              backgroundColor: "#fff",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.2)";
            }}
          >
            {/* Icon */}

                <img
                  src={f.icon}
                  alt={f.name}
                  style={{ width: "60%", objectFit: "contain" }}
                />


            {/* Tên tiện nghi */}
            <h3 style={{ fontWeight: "bold", color: "#061797ff", marginBottom: "8px" }}>
              {f.name}
            </h3>

          </div>
        ))}
      </div>

      {/* Nút xem thêm */}
      <div style={{ marginTop: "40px" }}>
        <NavLink
          to="/facilities"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px",
            border: "0.2px dashed #061797ff",
            backgroundColor: "#F0F0F0",
            color: "black",
            borderRadius: "5px",
            height: "20px",
            marginTop: "-25px",
            textDecoration: "none",
            transition: "border 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.border = "1px solid #000000ff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.border = "0.5px dashed #061797ff")
          }
        >
          Xem tất cả
          <img
            src={img}
            style={{
              width: "25px",
              height: "15px",
              objectFit: "cover",
              marginLeft: "5px",
              marginTop: "2px",
            }}
            alt="Next"
          />
        </NavLink>
      </div>
    </section>
  );
}
