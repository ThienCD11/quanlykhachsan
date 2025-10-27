import React from "react";

const FacilityCard = ({ facility }) => {
  return (
    <div
      className="facility-card"
      style={{
        padding: "15px",
        margin: "10px",
        borderRadius: "10px",
        textAlign: "center",
        width: "230px",
        cursor: "pointer",
        background: "white",
        boxShadow: "8px 8px 15px rgba(0, 0, 0, 0.5)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0, 0, 0, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "8px 8px 15px rgba(0, 0, 0, 0.5)";
      }}
    >
      
      <img
          src={facility.icon}
          alt={facility.name}
          style={{ width: "50%", borderRadius: "3px",
            objectFit: "cover", margin: "15px 5px -5px 5px",}}
        />
      <h3 style={{ color: "#00008b", marginBottom: "8px" }}>{facility.name}</h3>
      <p style={{ fontSize: "13px", color: "#000000ff", textAlign: "Justify"}}>{facility.description}</p>
    </div>
  );
};

export default FacilityCard;
