import React, { useState } from "react";
import axios from "axios";
import qrCodeImage from "../images/QR.png";
import "../css/HistoryCard.css"

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0); // 0 = chưa chọn
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Yêu cầu: Phải đủ cả 2 trường
    if (rating === 0) {
        setError("Vui lòng chọn số sao đánh giá.");
        return;
    }
    if (comment.trim() === "") {
        setError("Vui lòng nhập nội dung đánh giá.");
        return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Gọi API gửi đánh giá (Backend sẽ đổi status -> 'Đã hoàn thành')
      await axios.post(
        `http://127.0.0.1:8000/api/bookings/${booking.id}/review`,
        { rating, comment } // Gửi rating và comment
      );

      alert("Cảm ơn đánh giá của bạn!");
      onSuccess(); // Báo HistoryPage tải lại
      onClose(); // Đóng modal
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      // Hiển thị lỗi validation từ backend (nếu có)
      if (err.response && err.response.status === 422) {
          setError(Object.values(err.response.data.errors).flat().join(' '));
      } else {
          setError(err.response?.data?.message || "Lỗi: Không thể gửi đánh giá.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <h2 style={{color: 'navy' }}>Đánh giá kỳ nghỉ</h2>
        <p>Phòng: <strong>{booking.room_name}</strong></p>

        <form onSubmit={handleReviewSubmit}>
            {/* Hệ thống 5 sao */}
            <div style={{ margin: '20px 0' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={ (hoverRating || rating) >= star ? "review-star-active" : "review-star" }
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </span>
                ))}
            </div>

            {/* Textarea */}
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn..."
                className="review-textarea" // Thêm class cho textarea
            />

            {error && <p className="modal-error">{error}</p>}

            <button 
                type="submit"
                disabled={isSubmitting}
                className="modal-submit-btn" // Thêm class cho nút
            >
                {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
            </button>
        </form>
      </div>
    </div>
  );
};

const HistoryCard = ({ history, onUpdate }) => { 
  
  const [isProcessing, setIsProcessing] = useState(false); // Dùng chung cho Hủy, Thanh toán
  const [apiError, setApiError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleCancelBooking = async () => {
    if(window.confirm(`Bạn có chắc muốn hủy đặt phòng ${history.room_name} không?`)) {
        setIsProcessing(true);
        setApiError("");
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/bookings/${history.id}/customer-cancel`
            );
            onUpdate(); // Tải lại trang cha
        } catch (err) {
            console.error("Lỗi khi hủy đơn:", err);
            setApiError(err.response?.data?.message || "Lỗi: Không thể hủy đơn.");
        } finally {
            setIsProcessing(false);
        }
    }
  }

  const handleConfirmPayment = async () => {
        setIsProcessing(true);
        setApiError("");
        try {
            await axios.post(
                `http://127.0.0.1:8000/api/bookings/${history.id}/pay`
            );
            onUpdate(); 
            setShowPaymentModal(false);
        } catch (err) {
            console.error("Lỗi khi thanh toán:", err);
            setApiError(err.response?.data?.message || "Lỗi: Thanh toán thất bại.");
        } finally {
            setIsProcessing(false);
        }
  };
  
  const handlePaymentClick = () => {
      setApiError(""); // Xóa lỗi trên thẻ (nếu có)
      setShowPaymentModal(true); // Mở modal
  };
 
  const handleReview = () => {
    setApiError("");
    setShowReviewModal(true);
  };

  const renderActions = () => {
    const status = history.status;

    // TH1: 'Đã đặt phòng'
    if (status === "Đã đặt phòng" || status === null) {
      return (
        <>
          <button className="status-badge status-pending" disabled>
            {status || 'Đã đặt phòng'}
          </button>
          <button
            className="action-button btn-cancel"
            // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#a91c2aff'}
            // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
            onClick={handleCancelBooking}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Hủy Đặt Phòng"}
          </button>
        </>
      );
    }

    // TH2: 'Đã xác nhận'
    if (status === "Đã xác nhận") {
      return (
        <>
          <button className="status-badge status-pending" disabled>
            Đã xác nhận
          </button>
          <button
            className={`action-button btn-payment ${isProcessing ? 'disabled' : ''}`}
            // onMouseEnter={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = '#0e6722ff')}
            // onMouseLeave={(e) => !isProcessing && (e.currentTarget.style.backgroundColor = '#23973eff')}
            onClick={handlePaymentClick}
            disabled={isProcessing}
          >
            {isProcessing ? "Xử lý..." : "Thanh toán"}
          </button>
        </>
      );
    }

    // TH3: 'Đã thanh toán'
    if (status === "Đã thanh toán") {
      return (
        <>
          <button className="status-badge status-paid" disabled>
            Đã thanh toán
          </button>
          <button
            className={`action-button btn-review ${isProcessing ? 'disabled' : ''}`}
            // onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#03164fff'}
            // onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#00008b'}
            onClick={handleReview}
            disabled={isProcessing}
          >
            {isProcessing ? "Xử lý..." : "Đánh giá"}
          </button>
        </>
      );
    }

    // TH4: 'Đã hủy'
    if (status === "Đã hủy") {
       return (
        <button className="status-badge full-width status-canceled" disabled >
            Đã hủy
        </button>
       );
    }
    
    // TH5: 'Đã hoàn thành'
    if (status === "Đã hoàn thành") {
        return (
         <button className="status-badge full-width status-completed" disabled >
             Đã hoàn thành
         </button>
        );
     }

    // Các trạng thái khác
    return (
        <button className="status-badge full-width status-other" disabled>
            {status}
        </button>
    );
  };
  

  return (
    <>
    <div 
      className="history-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "8px 8px 10px rgba(0,0,0,0.2)";
      }}
    >
        {/* ... (Phần thông tin: h4, p giữ nguyên) ... */}
        <h4 className="history-title">Phòng {history.room_name}</h4>
        <p className="history-detail">Chi phí: {history.price_per_night} / đêm</p>
        <p className="history-detail">Ngày vào: {history.check_in}</p>
        <p className="history-detail">Ngày trả: {history.check_out}</p>
        <p className="history-detail">Ngày đặt: {history.booked_at}</p>
        <p className="history-detail">ID đơn: {history.invoice_id}</p>
        <p className="history-detail">Thanh toán: {history.total_price}</p>

        {/* Hiển thị lỗi (Hủy hoặc Thanh toán) nếu có */}
        {apiError && <p className="api-error">{apiError}</p>}

        <div className="history-actions">
            {renderActions()}
        </div>
    </div>

    {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}> 
            
            <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>
              &times;
            </button>
            
            <h2 style={{ marginTop: 0, color: 'navy' }}>Xác nhận thanh toán</h2>
            <p>Vui lòng quét mã QR để thanh toán cho đơn hàng:</p>
            <p style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{history.invoice_id}</p>
            
            <img 
                src={qrCodeImage} 
                alt="QR Code"
                className="modal-qr-image"
            />
            
            <p>Tổng tiền: <strong style={{color: 'red', fontSize: '1.1rem'}}>{history.total_price}</strong></p>
            
            <div className="modal-actions">
              <button 
                className="action-button btn-cancel"
                onClick={() => setShowPaymentModal(false)}
                disabled={isProcessing}
              >
                Hủy
              </button>
              <button 
                className={`action-button btn-payment ${isProcessing ? 'disabled' : ''}`}
                onClick={handleConfirmPayment} // Gọi API để xác nhận
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "OK (Xác nhận đã thanh toán)"}
              </button>
            </div>
            
          </div>
        </div>
    )}

    {showReviewModal && (
        <ReviewModal
            booking={history}
            onClose={() => setShowReviewModal(false)}
            onSuccess={() => {
                onUpdate(); // Tải lại trang cha
                setShowReviewModal(false); // Đóng modal
            }}
        />
      )}
    </>
  );
};

export default HistoryCard;