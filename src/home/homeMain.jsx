import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';

function Homemain(){

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("Status") === "admin") {
      setIsAdmin(true);
    }
    if (localStorage.getItem("Status") === "staff") {
      setIsStaff(true);
    }
    if( localStorage.getItem("Status") === "user") {
      setIsUser(true); 
    }
  }, []);

  // ส่วนปุ่ม Login
  const buttonLogin = () => {
    return(
      <div className="button-group login-group">
        {/* เปลี่ยนข้อความเป็นไทยเพื่อให้ผู้สูงอายุเข้าใจง่าย */}
        <button className="btn-user" onClick={() => navigate('/user-login')}>
          จองคิวเข้าเยี่ยม
        </button>
        <button className="btn-staff" onClick={() => navigate('/staff-login')}>
          เข้าสู่ระบบเจ้าหน้าที่
        </button>
        <button className="btn-admin" onClick={() => navigate('/admin-login')}>
          เข้าสู่ระบบผู้ดูแล
        </button>
      </div>
    )
  }

  return(
    <>
      {/* เพิ่ม className หลัก */}
      <div className="home-main-page">
        <div className="container">
          
          <h2>เรือนจำชั่วคราวเขาพลอง</h2>
          
          {/* แสดงปุ่ม Login ถ้ายังไม่ได้ Login */}
          {!isAdmin && !isStaff && !isUser && buttonLogin()}

          {/* ส่วนเมนูหลัง Login */}
          <div className="button-group menu-group">
            {isAdmin && (
              <button className="btn-admin-ds" onClick={() => navigate('/adminDs')}>
                ระบบผู้ดูแล
              </button>
            )}

            {isStaff && (
              <button className="btn-staff-ds" onClick={() => navigate('/staffDs')}>
                ระบบเจ้าหน้าที่
              </button>
            )}

            {isUser && (
              <button className="btn-user-ds" onClick={() => navigate('/visit')}>
                จองคิวเข้าเยี่ยม
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
export default Homemain