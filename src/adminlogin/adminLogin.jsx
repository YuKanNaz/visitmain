import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './adminLogin.css';

function AdminLogin() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const adminStatus = localStorage.getItem("Status");
        if (adminStatus === "admin") {
            
            navigate('/adminDs')
        }
    }, [navigate]); // เพิ่ม navigate ใน dependency array เพื่อความถูกต้อง

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(' https://khaoplong.quizchainat.com/login-admin', {
                name: name,
                password: password
            });
            // local เก็บข้อมูล
            if (response.status === 200) {
                localStorage.setItem("userName", response.data.user.name);
                localStorage.setItem("Status", "admin");

                alert("Login สำเร็จ!");
                navigate('/adminDs')
            }

        } catch (error) {
            alert(error.response?.data?.message || "Login ล้มเหลว");
        }
    };

    return (
        <div className="admin-login-page">
            <div className="login-card">
                <h2>เข้าสู่ระบบผู้ดูแล</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">ชื่อผู้ใช้</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="กรอกชื่อผู้ใช้"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">รหัสผ่าน</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="กรอกรหัสผ่าน"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login">เข้าสู่ระบบ</button>
                    
                    {/* ปุ่มย้อนกลับ (เผื่อไว้กดกลับหน้าหลัก) */}
                    <button 
                        type="button" 
                        className="btn-back" 
                        onClick={() => navigate('/')}
                    >
                        กลับหน้าหลัก
                    </button>
                </form>
            </div>
        </div>
    )
}
export default AdminLogin