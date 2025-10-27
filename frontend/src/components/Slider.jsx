import React, { useState, useEffect } from "react";
// 1. QUAY LẠI CÁCH IMPORT THỦ CÔNG ĐỂ ĐẢM BẢO HOẠT ĐỘNG
import img1 from "../images/s1.png";
import img2 from "../images/s2.png";
import img3 from "../images/s3.png";
import img4 from "../images/s4.png";
import img5 from "../images/s5.png";
import img6 from "../images/s6.png";
import img7 from "../images/s7.png";
import img8 from "../images/s8.png";
import img9 from "../images/s9.png";
import img10 from "../images/s10.png";
import img11 from "../images/s11.png";
import img12 from "../images/s12.png";

const Slider = ({ children }) => {
  const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div style={{ position: "relative", width: "100%", height: "580px", marginBottom: "100px"}}>
      
      {/* 2. THÊM THẺ STYLE ĐỂ NHÚNG CSS TRỰC TIẾP */}
      <style>
        {`
          .slider-image-fade {
            animation-name: fadeIn;
            animation-duration: 2s;
            animation-timing-function: ease-in-out;
            transition: "transform 2s ease",
          }
          @keyframes fadeIn {
            from {
              opacity: 0.5;
            }
            to {
              opacity: 1;
            }
          }
        `}
        {/* {`
          .slider-image-slide {
            animation-name: slideIn;
            animation-duration: 1.5s; 
            animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); 
          }

          @keyframes slideIn {
            from {
              transform: translateX(5%);
              opacity: 0.7;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `} */}
      </style>

      <img
        key={currentIndex}
        src={images[currentIndex]}
        alt="slider"
        className="slider-image-fade" // Class này giờ sẽ được style từ thẻ <style> bên trên
        style={{ width: "100%", height: "600px", objectFit: "cover",}}
      />

      <div style={{ width: "100%", position: "absolute", bottom: "-115px", left: "50%", transform: "translateX(-50%)" }}>
        {children}
      </div>
    </div> 
  );
};

export default Slider;