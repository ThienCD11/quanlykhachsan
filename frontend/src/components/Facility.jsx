import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

export default function FacilitySection() {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    axiosInstance.get("/facilities?limit=3")
      .then(data => setFacilities(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <section style={{ padding: "20px" }}>
      <h3>Tiện nghi</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        {facilities.map((f) => (
          <div key={f.id} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "40px" }}>{f.icon}</div>
            <p>{f.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
