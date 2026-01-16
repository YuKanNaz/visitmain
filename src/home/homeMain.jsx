import React from "react";
import { useNavigate } from 'react-router-dom';
function Homemain(){
const navigate = useNavigate();

 return(
    <>
    <div>
      <h1>เทสระบบ<h1/>
      <h1>หน้าหลัก</h1>
      <button onClick={() => navigate('/user-login')}>
        loginUser
      </button>

      <button onClick={() => navigate('/admin-login')}>
       AdminLogin
      </button>

      <button onClick={() => navigate('/staff-login')}>
       staffLogin
      </button>
    </div>
    </>
 )
}
export default Homemain
