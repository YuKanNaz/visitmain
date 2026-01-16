import { useState, useEffect } from 'react'
import React  from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


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
      const response = await axios.post('https://node-api-visit.vercel.app/login-officer', {
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
    <div>staffLogin</div>
    <form onSubmit={handleLogin}>
      <div>
        <label>Name: </label>
        <input 
        type="text" 
        onChange={(e) => setUsername(e.target.value)}
        required
        />
      </div>

      <div>
        <label>password :</label>
        <input 
        type="text" 
        onChange={(e) => setPassword(e.target.value)}
        required
        />
      </div>
      <button type="submit">เข้าสู่ระบบ</button>
    </form>





    </>
    
  )
}

export default StaffLogin