import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDs() {
    const navigate = useNavigate();
    //search
    const [prisoners, setPrisoners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    //register user
    const [name, setName] = useState("");
    const [idCard, setIdCard] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

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
          alert("คุณไม่ใช่ admin");
          navigate('/')
        }
    }, []);

    const handleLoginout = async () => {
      localStorage.clear();
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
      <div>
        <h3>ชื่อผู้ใช้ {myName}</h3>
      </div>
        <div className="con-put-of">
            <div className="head-of"> เพิ่มรายชื่อพนักงาน</div>

            <form onSubmit={handleReOf}>
                <div className="inputbox">
                    <input 
                        placeholder="ชื่อ-สกุล"
                        value={nameof}
                        onChange={(e) => setNameof(e.target.value)}
                        required
                    />
                </div>

                <div className="inputbox">
                    <input 
                        placeholder="ชื่อผู้ใช้"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="inputbox">
                    <input 
                        placeholder="ใส่รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="buttonbox">
                  <button type="submit">เพิ่มรายชื่อ</button>
                </div>
            </form>

        </div>



        <div className="container">
      <div className="logintext">
        <h2>เพิ่มรายชื่อผู้ใช้</h2>
      </div>

      <form onSubmit={handleAdmin}>
        <div className="inputbox">
          <input
            placeholder="ชื่อ-สกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          /><br />
        </div>
        <div className="inputbox">
          <input
            placeholder="เลขบัตรประชาชน"
            maxLength={13}
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
            required
          /><br />
        </div>
        <div className="inputbox">
          <input
            placeholder="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          /><br />
        </div>
        <div className="inputbox">
          <input
            type="email"
            placeholder="อีเมล"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br />
        </div>
        <div className="buttonbox">
          <button type="submit">เพิ่มรายชื่อ</button>
        </div>
      </form>
    </div>


      <div>
        <h1>ค้นหาชื่อผู้ต้องขัง</h1>
        <div>
              <input 
                    type="text" 
                    placeholder="ค้นหาชื่อผู้ต้องขัง..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={fetchPrisoners}>ค้นหา</button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                {prisoners.map((item) => (
                    <div key={item.prisoner_id} style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                        <h3>{item.name}</h3>
                        <p>รหัส: {item.prisoner_code}</p>
                        <p>สถานะ:
                            <span style=
                            {{ color: item.status == 1 ? "green" : "red" }}>
                            {item.status == 1 ? "ยืนยัน" : "ไม่ยืนยัน"}
                            </span>
                        </p>
                        <button onClick={() => handleActivate(item.prisoner_id)}>เปลี่ยนสถานะ</button>
                    </div>
                    
                ))}
                
        </div>
                
      </div>

      <button onClick={handleLoginout}>
        loginout
      </button>
      </>
    );
}

export default AdminDs;