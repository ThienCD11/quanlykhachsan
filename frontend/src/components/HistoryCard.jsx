import React, { useState } from "react";
import axios from "axios";
import qrCodeImage from "../images/QR.png";
import "../css/HistoryCard.css"


const ReviewModal = ({ booking, onClose, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) { setError("Vui lòng chọn số sao đánh giá."); return; }
        if (comment.trim() === "") { setError("Vui lòng nhập nội dung đánh giá."); return; }

        setIsSubmitting(true);
        setError("");

        try {
            await axios.post(`http://127.0.0.1:8000/api/bookings/${booking.id}/review`, { rating, comment });
            alert("Cảm ơn đánh giá của bạn!");
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi: Không thể gửi đánh giá.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2 style={{ color: 'navy' }}>Đánh giá kỳ nghỉ</h2>
                <p>Phòng: <strong>{booking.room_name}</strong></p>
                <form onSubmit={handleReviewSubmit}>
                    <div style={{ margin: '20px 0' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={(hoverRating || rating) >= star ? "review-star-active" : "review-star"}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            > ★ </span>
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn..."
                        className="review-textarea"
                    />
                    {error && <p className="modal-error">{error}</p>}
                    <button type="submit" disabled={isSubmitting} className="modal-submit-btn">
                        {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const HistoryCard = ({ history, onUpdate }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [apiError, setApiError] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleCancelBooking = async () => {
        if (window.confirm(`Bạn có chắc muốn hủy đặt phòng ${history.room_name} không?`)) {
            setIsProcessing(true);
            try {
                await axios.post(`http://127.0.0.1:8000/api/bookings/${history.id}/customer-cancel`);
                onUpdate();
            } catch (err) {
                setApiError(err.response?.data?.message || "Lỗi: Không thể hủy đơn.");
            } finally { setIsProcessing(false); }
        }
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/bookings/${history.id}/pay`);
            onUpdate();
            setShowPaymentModal(false);
        } catch (err) {
            setApiError(err.response?.data?.message || "Lỗi: Thanh toán thất bại.");
        } finally { setIsProcessing(false); }
    };
 
    const renderActions = () => {
        const { status, has_review } = history;
        if (status === "Chờ xác nhận" || status === null) {
            return (
                <>
                    <button className="status-badge status-pending" disabled>{status || 'Chờ xác nhận'}</button>
                    <button className="action-button btn-cancel" onClick={handleCancelBooking} disabled={isProcessing}>Hủy đặt phòng</button>
                </>
            );
        }
        if (status === "Chờ thanh toán") {
            return (
                <>
                    <button className="action-button btn-payment" onClick={() => setShowPaymentModal(true)} disabled={isProcessing}>Thanh toán</button>
                    <button className="action-button btn-cancel" onClick={handleCancelBooking} disabled={isProcessing}>Hủy đặt phòng</button>
                </>
            );
        }
        if (status === "Đã thanh toán") {
            return (
                <>
                    <button className="status-badge status-pending" disabled>Đã thanh toán</button>
                    <button className="action-button btn-cancel" onClick={handleCancelBooking} disabled={isProcessing}>Hủy đặt phòng</button>
                </>
            );
        }
        if (status === "Hoàn thành") {
            return (
                <>
                    <button 
                        className={`status-badge status-paid ${has_review ? 'full-width' : ''}`} 
                        disabled
                    >
                        Hoàn thành
                    </button>
                    {!has_review && (
                        <button className="action-button btn-review" 
                        onClick={() => setShowReviewModal(true)}
                        disabled={isProcessing}
                        >
                            Đánh giá
                        </button>
                    )}
                </>
            );
        }
        // Các trạng thái full-width
        const canceledBadges = ["Đang sử dụng", "Đã hủy"];
        if (canceledBadges.includes(status)) {
            return <button className="status-badge full-width status-canceled" disabled>{status}</button>;
        }
        const completedBadges = ["Chờ hoàn tiền", "Đã hoàn tiền"];
        if (completedBadges.includes(status)) {
            return <button className="status-badge full-width status-completed" disabled>{status}</button>;
        }
        return <button className="status-badge full-width status-other" disabled>{status}</button>;
    };

    return (
        <>
            <div className="history-card" 
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }} 
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                <h4 className="history-title">Phòng {history.room_name}</h4>
                <p className="history-detail">Chi phí: {history.price_per_night} / đêm</p>
                <p className="history-detail">Ngày vào: {history.check_in}</p>
                <p className="history-detail">Ngày trả: {history.check_out}</p>
                <p className="history-detail">Ngày đặt: {history.booked_at}</p>
                <p className="history-detail">ID đơn: {history.invoice_id}</p>
                <p className="history-detail">Thanh toán: {history.total_price}</p>
                {apiError && <p className="api-error">{apiError}</p>}
                <div className="history-actions">{renderActions()}</div>
            </div>

            {showPaymentModal && (
                <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>&times;</button>
                        <h2 style={{ color: 'navy' }}>Xác nhận thanh toán</h2>
                        <p>ID đơn: <strong>{history.invoice_id}</strong></p>
                        <img src={qrCodeImage} alt="QR Code" className="modal-qr-image" />
                        <p>Tổng tiền: <strong style={{ color: 'red' }}>{history.total_price}</strong></p>
                        <div className="modal-actions">
                            <button className="action-button btn-cancel" onClick={() => setShowPaymentModal(false)}>Hủy</button>
                            <button className="action-button btn-payment" onClick={handleConfirmPayment} >Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {showReviewModal && (
                <ReviewModal booking={history} onClose={() => setShowReviewModal(false)} onSuccess={() => onUpdate()} />
            )}
        </>
    );
};

export default HistoryCard;