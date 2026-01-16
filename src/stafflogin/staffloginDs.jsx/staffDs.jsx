import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function StaffDs(){

    const [name, setName] = useState("");
    const [idCard, setIdCard] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");

    const [prisoners, setPrisoners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [notice, setNotice] = useState("");
    const [createby, setCreateby] = useState("");

    const myName = localStorage.getItem("userName");

    const navigate = useNavigate();
    const handleLoginout = async () => {
      localStorage.clear();
    }
    useEffect(() => {
            const staffStatus = localStorage.getItem("Status");
            if (staffStatus !== "staff") {
              alert("คุณไม่ใช่ officer");
              navigate('/')
            }
    }, []);

    const handleActivate = async (id) => {
        try {
            const response = await axios.put("http://localhost:3001/update-prisoner-status", {
                prisoner_id: id,
                status: 1 
            });
            fetchPrisoners()// โหลดใหม่
            
           
        } catch (err) {
            console.error("Update Error:", err);
            alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    };

    const handleAdmin = async (e) => {
    e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บเพื่อให้ required ทำงาน
    try {
      const response = await axios.post("http://localhost:3001/register-user", {
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
            const response = await axios.get(`http://localhost:3001/prisoner?name=${searchTerm}`);
            setPrisoners(response.data);
            
            
        } catch (error) {
            console.error(error);
        }
    };

  const handleputtext = async (e) => {
    e.preventDefault(); 
    try {
        const response = await axios.put("http://localhost:3001/puttext-officer", {
            Notice: notice,
            createby: myName 
        });
        
        setCreateby(myName);
        alert("ลงประกาศเเล้ว");
        window.location.reload();
        
    } catch (err) {
        alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
}


  


    return(
        <>
        

        <div>
          <div>
            <h1>ลงประกาศ</h1>
            <form onSubmit={handleputtext}>
              <div className="inputbox">
                <input
                placeholder="ใส่ข้อความประกาศ"
                onChange={(e) => setNotice(e.target.value)}
                />
              </div>
              <button type="submit">ลงประกาศ</button>
            </form>
          </div>


            <h1>ค้นหารายชื่อ</h1>
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
                        
                    </div>
                    
                ))}
                
        </div>
            
        </div>







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


    
      <div>
        <button onClick={handleLoginout}>loginout</button>
      </div>
        
      <div>
        <button onClick={() => navigate('/')}>กลับหน้าหลัก</button>
      </div>
        </>
    )
}
export default StaffDs