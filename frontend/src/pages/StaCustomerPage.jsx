import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

const StaCustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null); 
    const menuRef = useRef(null); 

    // --- LOGIC ĐÓNG MENU KHI CLICK RA NGOÀI ---
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (openMenuId !== null && menuRef.current && !menuRef.current.contains(event.target)) {
    //             setOpenMenuId(null);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
        
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, [openMenuId]);

    // --- LOGIC FETCH DỮ LIỆU ---

    const fetchCustomers = useCallback(() => {
        axios.get("http://127.0.0.1:8000/api/statistic/customers")
            .then(res => {
                setCustomers(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("Lỗi khi tải danh sách khách hàng:", err);
                setError("Không thể tải dữ liệu khách hàng.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // --- LOGIC TÍNH TOÁN PHÂN TRANG ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; 

    const totalItems = customers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = customers.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // --- CÁC HÀM XỬ LÝ API ---
    const updateCustomerState = (userId, updates) => {
        setCustomers(prevCustomers => prevCustomers.map(c => 
            c.id === userId ? { ...c, ...updates } : c
        ));
    };

    const handlePromoteAdmin = async (userId, currentName) => {
        setOpenMenuId(null);
        if (window.confirm(`Bạn có chắc chắn muốn nâng cấp ${currentName} lên vai trò Admin?`)) {
            try {
                // Sửa API URL (Chuyển sang prefix admin/customers)
                const response = await axios.post(`http://127.0.0.1:8000/api/statistic/customers/${userId}/promote`);
                alert(response.data.message);
                updateCustomerState(userId, { role: 'admin' });
            } catch (err) {
                const message = err.response?.data?.message || "Lỗi nâng cấp quyền.";
                alert(`Thất bại: ${message}`);
            }
        }
    };

    const handleToggleActive = async (userId, currentName, currentIsActive) => {
        setOpenMenuId(null);
        const action = currentIsActive ? "vô hiệu hóa" : "kích hoạt";

        if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${currentName}?`)) {
            try {
                 // Sửa API URL (Chuyển sang prefix admin/customers)
                const response = await axios.post(`http://127.0.0.1:8000/api/statistic/customers/${userId}/toggle-active`);
                alert(response.data.message);
                updateCustomerState(userId, { is_active: response.data.is_active });

            } catch (err) {
                const message = err.response?.data?.message || `Lỗi ${action} tài khoản.`;
                alert(`Thất bại: ${message}`);
            }
        }
    };

    const handleDeleteUser = async (userId, currentName) => {
        setOpenMenuId(null);
        if (window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản ${currentName} và toàn bộ dữ liệu liên quan?`)) {
            try {
                 // Sửa API URL (Chuyển sang prefix admin/customers)
                const response = await axios.post(`http://127.0.0.1:8000/api/statistic/customers/${userId}/delete`); 
                alert(response.data.message);
                
                setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== userId));

            } catch (err) {
                const message = err.response?.data?.message || "Lỗi khi xóa tài khoản. Vui lòng kiểm tra Log Server.";
                alert(`Thất bại: ${message}`);
            }
        }
    };

    // --- ĐỊNH NGHĨA STYLES ---
    const styles = {
        dropdownBtn: {
            display: "block",
            width: "100%",
            padding: "10px",
            border: "none",
            textAlign: "center",
            cursor: "pointer",
            fontSize: "13px",
            borderBottom: "1px solid #eee",
            transition: "all 0.2s",
            fontWeight: "500",
        },
        btnAdmin: { color: "#ffffffff", fontWeight: "bold", background: "#00008b" }, 
        btnDisable: { color: "#ffffffff", fontWeight: "bold", background: "#c38a05ff" }, 
        btnActivate: { color: "#ffffffff", fontWeight: "bold", background: "#009205ff" }, 
        btnDelete: { color: "#ffffffff", fontWeight: "bold", background: "#b90f03ff" }, 
        activeStatus: { color: '#006400', backgroundColor: '#b4f5b4ff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' },
        inactiveStatus: { color: '#9b0101ff', backgroundColor: '#fcc0c0ff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' },
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "5px",
        overflow: "hidden",
    };
    const tableHeaderStyle = {
        backgroundColor: "#000266ff",
        color: "white",
        padding: "15px",
        textAlign: "left",
        fontSize: "15px",
        cursor: "pointer",
    };
    const tableCellStyle = {
        padding: "15px",
        borderBottom: "1px solid #ddd",
        textAlign: "left",
        verticalAlign: "center",
    };

    // --- RENDER LOGIC ---
    if (isLoading) return <h1 style={{textAlign: 'center', marginTop: '100px'}}>Đang tải danh sách khách hàng...</h1>;
    if (error) return <h1 style={{textAlign: 'center', color: 'red', marginTop: '100px'}}>{error}</h1>;

    return (
        <div>
            <h2>Quản Lý Tài Khoản Khách Hàng</h2>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={{...tableHeaderStyle, width: '50px', textAlign: 'center'}}>STT</th>
                        <th style={tableHeaderStyle}>Tên</th>
                        <th style={tableHeaderStyle}>SĐT</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Địa chỉ</th>
                        <th style={{...tableHeaderStyle, textAlign: 'center'}}>Tổng đơn</th>
                        <th style={{...tableHeaderStyle, textAlign: 'center'}}>Đã thanh toán</th>
                        <th style={{...tableHeaderStyle, textAlign: 'center'}}>Trạng thái</th>
                        <th style={{...tableHeaderStyle, textAlign: 'center'}}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan="9" style={{...tableCellStyle, textAlign: 'center'}}>Chưa có khách hàng nào đăng ký.</td>
                        </tr>
                    ) : (
                        currentData.map((customer, index) => { // Dùng index từ currentData.map
                            const isActive = customer.is_active;
                            const toggleActionName = isActive ? "Vô hiệu hóa" : "Kích hoạt";
                            const toggleStyle = isActive ? styles.btnDisable : styles.btnActivate;
                            const isAdmin = customer.role === 'admin';
                            
                            // LOGIC MENU HƯỚNG LÊN/XUỐNG: Kiểm tra 3 hàng cuối trên TRANG HIỆN TẠI
                            const isLastThreeRows = index >= currentData.length - 2; 

                            return (
                                <tr key={customer.id}>
                                    <td style={{...tableCellStyle, textAlign: 'center'}}>{customer.stt}</td>
                                    <td style={{...tableCellStyle, }}>{customer.name}</td>
                                    <td style={tableCellStyle}>{customer.phone}</td>
                                    <td style={tableCellStyle}>{customer.email}</td>
                                    <td style={tableCellStyle}>{customer.address}</td>
                                    <td style={{...tableCellStyle, textAlign: 'center'}}>{customer.total_bookings}</td>
                                    <td style={{...tableCellStyle, textAlign: 'center'}}>
                                        {customer.paid_bookings}
                                    </td>
                                    <td style={{...tableCellStyle, }}>
                                        <span style={isActive ? styles.activeStatus : styles.inactiveStatus}>
                                            {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                                        </span>
                                    </td>
                                    
                                    <td style={{...tableCellStyle, textAlign: 'center', position: 'relative'}}>
                                        {isAdmin ? (
                                            <button
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#a20000ff',
                                                    color: styles.btnAdmin.color,
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    cursor: 'default',
                                                }}
                                            >
                                                ADMIN
                                            </button>
                                        ):( 
                                            <>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === customer.id ? null : customer.id)}
                                                style={{
                                                    padding: '8px 12px',
                                                    backgroundColor: '#00008b',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    transition: 'background-color 0.2s',
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = '#000266ff'}
                                                onMouseLeave={(e) => e.target.style.backgroundColor = '#00008b'}
                                            >
                                                Quản lý ▼
                                            </button>

                                            {openMenuId === customer.id && (
                                                <div
                                                    // ref={menuRef} 
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 10,
                                                        right: '10%',  
                                                        
                                                        // ÁP DỤNG LOGIC HƯỚNG LÊN/XUỐNG
                                                        ...(isLastThreeRows
                                                            ? { bottom: "75%", marginBottom: "2px" } // HƯỚNG LÊN
                                                            : { top: "75%", marginTop: "2px" }        // HƯỚNG XUỐNG
                                                        ),
                                                        
                                                        backgroundColor: 'white',
                                                        border: "1px solid #ddd",
                                                        borderRadius: "6px",
                                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                        width: "140px",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {customer.role !== 'admin' && (
                                                        <button 
                                                            style={{...styles.dropdownBtn, ...styles.btnAdmin}} 
                                                            onClick={() => handlePromoteAdmin(customer.id, customer.name)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#000065ff"}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = styles.btnAdmin.background}
                                                        >Phân quyền Admin</button>
                                                    )}

                                                    {customer.role !== 'admin' && (  
                                                        <button 
                                                            style={{...styles.dropdownBtn, ...toggleStyle}} 
                                                            onClick={() => handleToggleActive(customer.id, customer.name, isActive)}
                                                            onMouseEnter={(e) => e.target.style.filter = "brightness(0.9)"}
                                                            onMouseLeave={(e) => e.target.style.filter = "brightness(1)"}
                                                        >{toggleActionName}</button>
                                                    )}
                                                    {customer.role !== 'admin' && (
                                                        <button 
                                                            style={{...styles.dropdownBtn, ...styles.btnDelete}} 
                                                            onClick={() => handleDeleteUser(customer.id, customer.name)}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#870808ff"}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = styles.btnDelete.background}
                                                        >Xóa tài khoản</button>
                                                    )}
                                                </div>
                                            )}
                                            </>  
                                        )}
                                    </td>
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
            
            {/* --- PHẦN PAGINATION FOOTER --- */}
            {totalItems > itemsPerPage && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px 5px",
                        fontSize: "14px",
                    }}>
                    <span>
                        SHOWING {startIndex + 1} TO {Math.min(startIndex + itemsPerPage, totalItems)} OF {totalItems}
                    </span>

                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => goToPage(currentPage - 1)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                fontSize: "18px"
                            }}
                        >
                            ❮
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => goToPage(i + 1)}
                                style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    border: "none",
                                    cursor: "pointer",
                                    background: i + 1 === currentPage ? "#00008b" : "#eaeaea",
                                    color: i + 1 === currentPage ? "white" : "black",
                                    fontWeight: "bold",
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => goToPage(currentPage + 1)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                fontSize: "18px"
                            }}
                        >
                            ❯
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaCustomerPage;