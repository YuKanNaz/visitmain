import { useState, useEffect } from 'react'
import React  from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './stafflogin.css';


function StaffLogin () {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate(); 

  useEffect(() => {
            const staffStatus = localStorage.getItem("Status");
            if (staffStatus == "staff") {
              navigate('/staffDs')
            }
    }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('login-officer', {
        username: username,
        password: password

      });

       if (response.status === 200) {
            
            localStorage.setItem("userName", response.data.user.name); 
            localStorage.setItem("Status", "staff" );

            alert("Login สำเร็จ!");
            navigate('/staffDs');
      }

    } catch (error){
      alert(error.response?.data?.message);
    }

  };
  return (
    <>
    <div className="staff-login-page">
    <div className="staff-container">
        <h2>เข้าสู่ระบบพนักงาน</h2>
        <form onSubmit={handleLogin}>
            <div>
                <label>ชื่อ: </label>
                <input 
                    type="text" 
                    placeholder="ชื่อผู้ใช้"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>รหัสผ่าน: </label>
                <input 
                    type="password"  /* เปลี่ยนเป็น password เพื่อความปลอดภัย */
                    placeholder="กรอกรหัสผ่าน"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">เข้าสู่ระบบพนักงาน</button>
            <div className='back'>
            {/* ปุ่มย้อนกลับ (เผื่อไว้กดกลับหน้าหลัก) */}
                    <button 
                        type="button" 
                        className="btn-back" 
                        onClick={() => navigate('/')}
                    >
                        กลับหน้าหลัก
                    </button>
            </div>
        </form>
    </div>
</div>





    </>
    
  )
}

export default StaffLogin