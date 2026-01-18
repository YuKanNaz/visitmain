import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './userLogin.css';

function UserLogin() {
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
                const userStatus = localStorage.getItem("Status");
                if (userStatus == "user") {
                  navigate('/visit')
                }
            }, []);
            
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://node-api-visit.vercel.app/login', {
                name: name,
                birthday: birthday
            });
            
            if (response.status === 200) {
            
            localStorage.setItem("userName", response.data.user.name); 
            localStorage.setItem("Status", "user" );

            alert("Login สำเร็จ!");
            navigate('/visit')
            }
        } catch (error) {
            alert(error.response?.data?.message || "Login ล้มเหลว");
        }
    };

    return (

        

        <div className="user-login-page" style={{ padding: "20px" }}>
            <h2>เข้าสู่ระบบเพื่อจองคิว</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>ชื่อ: </label>
                    <input 
                        type="text"
                        placeholder="กรุณาใส่ชื่อผู้ใช้"
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <div>
                    <label>วันเกิด: </label>
                    <input 
                        type="password" 
                        placeholder="กรุณาใส่วันเกิด"
                        onChange={(e) => setBirthday(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <button type="submit">เข้าจองคิว</button>
            </form>
        </div>
    );
}

export default UserLogin;