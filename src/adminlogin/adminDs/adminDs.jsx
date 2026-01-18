import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './adminDs.css';

function AdminDs() {
    const navigate = useNavigate();
    //search
    const [prisoners, setPrisoners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    //register off
    const [nameof, setNameof] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //เอาข้อมูลจาก localStorage ออกมาเเสดง
    const myName = localStorage.getItem("userName");

    //เช็คข้อมูลความปลอดภัย
    useEffect(() => {
        const adminStatus = localStorage.getItem("Status");
        if (adminStatus !== "admin") {
         
          navigate('/')
        }
    }, []);

    const handleLoginout = async () => {
      localStorage.clear();
      navigate('/')
    }
    
    const handleReOf = async (e) => {
      e.preventDefault();
      try{
        const response = await axios.post("https://node-api-visit.vercel.app/register-officer", {
          nameof: nameof,
          username: username,
          password: password,

        });
         alert(response.data.message);
      } catch (err) {
        if(err.response){
          console.error("ลงชื่อเข้าใช้ไม่สำเร็จ" + (err.response?.data?.message || err.message))
        }
       
      }
    } 

    const handleAdmin = async (e) => {
    e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บเพื่อให้ required ทำงาน
    try {
      const response = await axios.post("https://node-api-visit.vercel.app/register-user", {
        name: name,
        idCard: idCard,
        phone: phone,
        email: email,
      });

      // ✅ Axios จะเก็บข้อมูลไว้ใน data โดยตรง
      if (response.data.status === "success") {
        alert("✅ " + response.data.message);
        
        // ล้างค่าฟอร์ม
        setName("");
        setIdCard("");
        setPhone("");
        setEmail("");
      }

    } catch (err) {
      // ✅ 3. การจัดการ Error ของ Axios
      if (err.response) {
        // กรณี Server ตอบกลับมาด้วย Error (เช่น 400, 409, 500)
        alert("❌ " + err.response.data.message);
      } else if (err.request) {
        // กรณีส่งคำขอไปแล้วแต่ Server ไม่ตอบกลับ
        alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
      } else {
        alert("❌ เกิดข้อผิดพลาด: " + err.message);
      }
      console.error("Axios Error:", err);
    }
  };

    const fetchPrisoners = async () => {
        try {
            const response = await axios.get(`https://node-api-visit.vercel.app/prisoner?name=${searchTerm}`);
            setPrisoners(response.data);
            
            
        } catch (error) {
            console.error(error);
        }
    };

    
    const handleActivate = async (id) => {
        try {
            const response = await axios.put("https://node-api-visit.vercel.app/update-prisoner-status", {
                prisoner_id: id,
                status: 1 
            });
            fetchPrisoners()// โหลดใหม่
            
           
        } catch (err) {
            console.error("Update Error:", err);
            alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    };
    return (
      <>
        <div className="admin-dashboard">
          <div className="user-info">
              <h3>ชื่อผู้ใช้: {myName}</h3>
              <span>ระบบจัดการเจ้าหน้าที่</span>
          </div>

          <div className="forms-grid">
              
              <div className="con-put-of">
                  <div className="head-of">เพิ่มรายชื่อพนักงาน</div>
                  <form onSubmit={handleReOf}>
                      <div className="inputbox">
                          <input placeholder="ชื่อ-สกุล" value={nameof} onChange={(e) => setNameof(e.target.value)} required />
                      </div>
                      <div className="inputbox">
                          <input placeholder="ชื่อผู้ใช้" value={username} onChange={(e) => setUsername(e.target.value)} required />
                      </div>
                      <div className="inputbox">
                          <input type="password" placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      <div className="buttonbox">
                          <button type="submit">เพิ่มรายชื่อพนักงาน</button>
                      </div>
                  </form>
              </div>

              
          </div>

        <div className="search-section">
            <h1>ค้นหาชื่อผู้ต้องขัง</h1>
            <div className="">
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <input 
                    type="text" 
                    placeholder="ค้นหาชื่อผู้ต้องขัง..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1 }}
                />
                <button onClick={fetchPrisoners} style={{ backgroundColor: "#1a3a5f", color: "white", padding: "0 25px", borderRadius: "8px" }}>ค้นหา</button>
            </div>
            </div>
            <div className="prisoner-grid">
                {prisoners.map((item) => (
                    <div key={item.prisoner_id} className="prisoner-card">
                        <h3>{item.name}</h3>
                        <p>รหัส: {item.prisoner_code}</p>
                        
                    </div>
              ))}
          </div>
        </div>

          <div className="logout-btn-container">
              <button className="logout-btn" onClick={handleLoginout}>ออกจากระบบ (Logout)</button>
          </div>
          <button onClick={() => navigate('/')}>กลับหน้าหลัก</button>
        </div>
      </>
    );
}

export default AdminDs;