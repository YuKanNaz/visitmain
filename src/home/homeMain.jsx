import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import './home.css';

function Homemain(){

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isUser, setIsUser] = useState(false);
  
  // 1. เพิ่ม State ให้ครบทั้ง 3 ส่วน
  const [officerCount, setOfficerCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [prisonerCount, setPrisonerCount] = useState(0);

  useEffect(() => {
    // ตรวจสอบสถานะ Login
    if (localStorage.getItem("Status") === "admin") setIsAdmin(true);
    if (localStorage.getItem("Status") === "staff") setIsStaff(true);
    if (localStorage.getItem("Status") === "user") setIsUser(true);

    // 2. ดึงข้อมูลและเซ็ตค่าตาม Key ที่ Backend ส่งมา (officer, user, prisoner)
    fetch('https://khaoplong.quizchainat.com/count-data')
      .then(response => response.json())
      .then(data => {
        setOfficerCount(data.officer);   
        setUserCount(data.user);         
        setPrisonerCount(data.prisoner); 
      })
      .catch(error => {
        console.error("Error fetching counts:", error);
      });

  }, []);

  // ส่วนปุ่ม Login
  const buttonLogin = () => {
    return(
      <div className="button-group login-group">
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

          
          {/* 3. ส่วนแสดงผลข้อมูล (เอา Style ออกหมดแล้ว) */}
          <div className="show-card">
            <div className="show-card01">
                <p>เจ้าหน้าที่ปฏิบัติงาน {officerCount} ท่าน</p>
            </div>
            <div className="show-card02">
                <p>สมาชิกทั่วไป {userCount} คน</p>
            </div>
            <div className="show-card03">
                <p>ผู้ต้องขังทั้งหมด {prisonerCount} คน</p>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default Homemain;