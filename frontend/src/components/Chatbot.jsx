import React, { useState, useEffect, useRef } from 'react';
import CHATBOT_ICON from "../images/chatbot.png";
import X from "../images/x.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý ảo của Tamka Hotel. Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
 
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });

      const result = await response.json();
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: result.success ? result.data : 'Xin lỗi, có lỗi xảy ra khi xử lý thông tin.' 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Không thể kết nối với máy chủ.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin-chatbot {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinning-button { 
            animation: spin-chatbot 5s linear infinite; 
            }
        `}
      </style>

      {/* Nút bấm nổi */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', 
          bottom: '90px', 
          right: '30px', 
          zIndex: 999,
          width: '50px', 
          height: '50px', 
          borderRadius: '50%',
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer', 
          border: '1px #2a8fedff solid',
          display: 'flex', 
          padding: '5px',
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#2a8fedff', 
          transition: 'all 0.3s ease',
        }}
        className={!isOpen ? 'spinning-button chat-button' : 'chat-button'}
      >
        {isOpen ? (
            <img
              src={X}
              alt="x"
              style={{ width: '150%', height: '150%', borderRadius: '30%', objectFit: 'cover' }}
            />
        ) : (
          <img
            src={CHATBOT_ICON}
            alt="Chatbot"
            style={{ width: '100%', height: '100%', borderRadius: '30%', objectFit: 'cover' }}
          />
        )}
      </button>

      {/* Cửa sổ Chat */}
      {isOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed', bottom: '90px', right: '90px', zIndex: 999,
            width: '350px', height: '500px', maxHeight: '70vh',
            backgroundColor: 'white', borderRadius: '20px', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', boxShadow: '0 12px 28px rgba(0,0,0,0.2)', border: '1px solid #f0f0f0'
          }}
        >
          {/* Header */}
          <div style={{ backgroundColor: '#096cc9ff', padding: '15px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '50%', padding: '5px' }}>
               <img src={CHATBOT_ICON} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30%' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>Tamka Hotel Support</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade56ff', borderRadius: '50%' }}></span>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>Sẵn sàng hỗ trợ</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '15px', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '18px', fontSize: '14px', lineHeight: '1.4',
                  backgroundColor: msg.role === 'user' ? '#0360b8ff' : 'white',
                  color: msg.role === 'user' ? 'white' : '#333',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  borderTopRightRadius: msg.role === 'user' ? '2px' : '18px',
                  borderTopLeftRadius: msg.role === 'user' ? '18px' : '2px',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '10px 14px', borderRadius: '18px', borderTopLeftRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="loading-dots" style={{ display: 'flex', gap: '4px' }}>
                   <div style={{ width: '4px', height: '4px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                   <div style={{ width: '4px', height: '4px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.2s' }}></div>
                   <div style={{ width: '4px', height: '4px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both 0.4s' }}></div>
                </div>
                <span style={{ fontSize: '12px', color: '#999' }}>Đang soạn...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{ padding: '12px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Bạn cần tư vấn gì?..."
              style={{ flex: 1, backgroundColor: '#f0f2f5', border: 'none', borderRadius: '20px', padding: '10px 15px', outline: 'none', fontSize: '14px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                backgroundColor: (isLoading || !input.trim()) ? '#ccc' : '#0084FF',
                border: 'none', width: '38px', height: '38px', borderRadius: '50%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Animation bổ sung cho dấu chấm đang soạn tin */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
      `}</style>
    </>
  );
};

export default Chatbot;