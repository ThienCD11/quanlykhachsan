import React from "react";

export default function Contact() {
  return (
    <section style={{ padding: "20px" }}>
      <h3>Liên hệ</h3>
      <p>📍 Địa chỉ: 123 Đường ABC, Hà Nội</p>
      <p>📞 SĐT: 0123 456 789</p>
      <iframe
        src="https://maps.google.com/maps?q=Hanoi&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="250"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </section>
  );
}
