import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentReturn = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang xác thực thanh toán...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/vnpay/callback${location.search}`
        );

        if (res.data.success) {
          setMessage("✅ Thanh toán thành công!");
        } else {
          setMessage("❌ Thanh toán thất bại!");
        }
      } catch {
        setMessage("⚠️ Lỗi xác thực thanh toán");
      }

      setTimeout(() => navigate("/history"), 3000);
    };

    verify();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 100 }}>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentReturn;
