import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';

function Homemain(){

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isUser, setIsUser] = useState(false);
  
  // 1. สร้าง State สำหรับเก็บจำนวนเจ้าหน้าที่ (ค่าเริ่มต้นเป็น 0)
  const [officerCount, setOfficerCount] = useState(0);

  useEffect(() => {
    // ตรวจสอบสถานะ Login
    if (localStorage.getItem("Status") === "admin") {
      setIsAdmin(true);
    }
    if (localStorage.getItem("Status") === "staff") {
      setIsStaff(true);
    }
    if( localStorage.getItem("Status") === "user") {
      setIsUser(true); 
    }

    // 2. ดึงข้อมูลจำนวนเจ้าหน้าที่จาก Backend
    // หมายเหตุ: เปลี่ยน http://localhost:3001 เป็น URL ของ Vercel หากคุณ Deploy แล้ว
    fetch('https://node-api-visit.vercel.app/count-officer')
      .then(response => response.json())
      .then(data => {
        // data.total มาจากชื่อตัวแปรที่เราตั้งใน Backend (SELECT COUNT(*) AS total)
        setOfficerCount(data.total); 
      })
      .catch(error => {
        console.error("Error fetching officer count:", error);
      });

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

          {/* 3. ส่วนแสดงผลข้อมูล (Dashboard Card) */}
          <div className="show-card">
            <div style={statCardStyle}>
                <h3>เจ้าหน้าที่ปฏิบัติงาน</h3>
                <p style={statNumberStyle}>{officerCount} ท่าน</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}



export default Homemain;