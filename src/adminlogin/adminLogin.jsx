import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
function AdminLogin() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
            const adminStatus = localStorage.getItem("Status");
            if (adminStatus == "admin") {
              alert("คุณมีชื่อในระบบเเล้ว")  
              navigate('/adminDs')
            }
        }, []);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login-admin', {
                name: name,
                password: password
            });
            //local เก็บข้อมูล
            if (response.status === 200) {
            
            localStorage.setItem("userName", response.data.user.name); 
            localStorage.setItem("Status", "admin" );

            alert("Login สำเร็จ!");
            navigate('/adminDs')
            }

        } catch (error) {
            alert(error.response?.data?.message || "Login ล้มเหลว");
        }
    };

    return(
        <>
        
         <div style={{ padding: "20px" }}>
            <h2>AdminLogin</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Name: </label>
                    <input 
                        type="text" 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <div>
                    <label>password : </label>
                    <input 
                        type="password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <button type="submit">เข้าสู่ระบบ</button>
            </form>
        </div>
        </>
    )
}
export default AdminLogin