import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
            const response = await axios.post('http://localhost:3001/login', {
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

        

        <div style={{ padding: "20px" }}>
            <h2>User Login</h2>
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
                    <label>Birthday: </label>
                    <input 
                        type="password" 
                        onChange={(e) => setBirthday(e.target.value)} 
                        required 
                    />
                </div>
                <br />
                <button type="submit">เข้าสู่ระบบ</button>
            </form>
        </div>
    );
}

export default UserLogin;