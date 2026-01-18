import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function StaffDs(){

    const [name, setName] = useState("");
    const [idCard, setIdCard] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");

    const [prisoners, setPrisoners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [showUser, setShowUser] = useState([]);
    const [searchUser, setSearchUser] = useState("");

    const [prisoners_code, setPrisoners_code] = useState("");
    const [namePrisoner, setNamePrisoner] = useState("");
    const [age, setAge] = useState("");
    const [cell_number, setCell_number] = useState("");
    const [sentence_detail, setSentence_detail] = useState("");
    const [birthdayP, setBirthdayP] = useState("");
    const [id_card_numberP, setId_card_numberP] = useState("");


    const [notice, setNotice] = useState("");
    const [createby, setCreateby] = useState("");

    const myName = localStorage.getItem("userName");

    const navigate = useNavigate();
    const handleLoginout = async () => {
      localStorage.clear();
      navigate('/')
    }
    useEffect(() => {
            const staffStatus = localStorage.getItem("Status");
            if (staffStatus !== "staff") {
              
              navigate('/')
            }
    }, []);

    
   const handleDeletePrisoner = async (prisoner_id) => {
    if(!window.confirm("ยืนยันที่จะลบข้อมูลนักโทษคนนี้?")) return;
    try {
        const response = await axios.delete(`https://node-api-visit.vercel.app/delete-prisoner/${prisoner_id}`);
        alert(response.data.message);
        fetchPrisoners(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };

    const handleDeleteUser = async (id) => {
    if(!window.confirm("ยืนยันที่จะลบข้อมูลผู้ใช้คนนี้?")) return;
    try {
        const response = await axios.delete(`https://node-api-visit.vercel.app/delete-user/${id}`);
        alert(response.data.message);
        fetchuser(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };


    const handleAdmin = async (e) => {
    e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บเพื่อให้ required ทำงาน
    try {
      const response = await axios.post("https://node-api-visit.vercel.app/register-user", {
        name: name,
        idCard: idCard,
        phone: phone,
        email: email,
        birthday: birthday
      });

      alert("เพิ่มรายชื่อผู้ใช้สำเร็จ");

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

   const fetchuser = async () => {
        try {
            const response = await axios.get(`https://node-api-visit.vercel.app/user-of-chack?name=${searchUser}`);
            setShowUser(response.data);   
        } catch (error) {
            console.error(error);
        }
    };     
  

  const handleputtext = async (e) => {
    e.preventDefault(); 
    try {
        const response = await axios.put("https://node-api-visit.vercel.app/puttext-officer", {
            Notice: notice,
            createby: myName 
        });
        
        setCreateby(myName);
        alert("ลงประกาศเเล้ว");
        
        
    } catch (err) {
        alert(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
}

  const handleputprisoner = async (e) => {
    e.preventDefault(); 
    try {
        const response = await axios.post("https://node-api-visit.vercel.app/putprisoner", {
            prisoner_code: prisoners_code,
            name: namePrisoner,
            age: age,
            cell_number: cell_number,
            sentence_detail: sentence_detail,
            added_by: myName,
            birthdayP: birthdayP,
            id_card_numberP: id_card_numberP
        });
         alert(response.data.message);
      } catch (err) {
        if(err.response){
          console.error("เพิ่มผู้ต้องขังไม่สำเร็จ" + (err.response?.data?.message || "เกิดข้อผิดพลาด" ))
        }
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
                <button onClick={() => navigate('/printpage')}>ปริ้นใบรายชื่อ</button>
            </div>



            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                {prisoners.map((item) => (
                    <div key={item.prisoner_id} style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                        <h3>{item.name}</h3>
                        <p>รหัส: {item.prisoner_code}</p>
                        <button onClick={() =>handleDeletePrisoner(item.prisoner_id)}>ลบนักโทษ</button>
                    </div>
                ))}
              </div>
            
        </div>

        <div>
          <h1>เพิ่มรายชื่อผู้ต้องขัง</h1>
          <form onSubmit={handleputprisoner}>
            <div className="inputbox">
              <input
                placeholder="รหัสผู้ต้องขัง"
                value={prisoners_code}
                onChange={(e) => setPrisoners_code(e.target.value)}
                required 
              /><br />
            </div>
            <div className="inputbox" >
              <input  
                placeholder="ชื่อ-สกุล"
                value={namePrisoner}
                onChange={(e) => setNamePrisoner(e.target.value)}
                required
              /><br />
            </div>
            <div className="inputbox">
              <input
                placeholder="อายุ"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              /><br />
            </div>
            <div className="inputbox">
              <input
                placeholder="หมายเลขห้องขัง"
                value={cell_number}
                onChange={(e) => setCell_number(e.target.value)}
                required
              /><br />
            </div>
            <div className="inputbox">
              <input
                placeholder="รายละเอียดคำพิพากษา"
                value={sentence_detail}
                onChange={(e) => setSentence_detail(e.target.value)}
                required
              /><br />
            </div>

            <div className="inputbox">
              <input
                placeholder="เลขบัตร"
                value={id_card_numberP}
                onChange={(e) => setId_card_numberP(e.target.value)}
                required
              /><br />
            </div>
            <div className="inputbox">
              <input
                placeholder="วันเกิด"
                value={birthdayP}
                onChange={(e) => setBirthdayP(e.target.value)}
                required
              /><br />
            </div>
            <div className="buttonbox">
              <button type="submit">เพิ่มรายชื่อผู้ต้องขัง</button>
            </div>


          </form>
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
        <div className="inputbox">
          <input
            placeholder="วันเกิด"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          /><br />
        </div>
        <div className="buttonbox">
          <button type="submit">เพิ่มรายชื่อ</button>
        </div>
      </form>

            <h1>ค้นหารายชื่อ</h1>
            <div>
              <input 
                    type="text" 
                    placeholder="ค้นหาชื่อผู้ใช้งาน" 
                    onChange={(e) => setSearchUser(e.target.value)}
                />
                <button onClick={fetchuser}>ค้นหา</button>
            </div>  
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
                {showUser.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                        <h3>{item.name}</h3>
                        <p>เลขบัตรประชาชน:{item.id_card_number}</p>
                        <p>วันเกิด: {item.birthday}</p>
                        
                        <button onClick={() =>handleDeleteUser(item.id)}>ลบนักโทษ</button>
                    </div>
                ))}
              </div>
            

      <div>
        <button onClick={handleLoginout}>logout</button>
      </div>
        
      <div>
        <button onClick={() => navigate('/')}>กลับหน้าหลัก</button>
      </div>
        </>
    )
}
export default StaffDs