import React, { useState, useEffect } from "react";
import img1 from "../images/20.png";
import img2 from "../images/20nam.png";
import img3 from "../images/OP.png";

const Slider = () => {
  const images = [img1, img2, img3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh mỗi 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ width: "100%", height: "400px", overflow: "hidden" }}>
      <img
        src={images[currentIndex]}
        alt="slider"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
};

export default Slider;
