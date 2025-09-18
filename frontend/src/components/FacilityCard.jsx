import React from "react";

const FacilityCard = ({ facility }) => {
  return (
    <div
      className="facility-card"
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        margin: "10px",
        borderRadius: "8px",
        textAlign: "center",
        width: "220px",
        background: "#f9f9f9"
      }}
    >
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>
        {facility.icon}
      </div>
      <h3>{facility.name}</h3>
      <p>{facility.description}</p>
    </div>
  );
};

export default FacilityCard;
