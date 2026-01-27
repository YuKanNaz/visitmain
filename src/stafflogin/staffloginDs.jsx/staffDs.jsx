import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './staffDs.css';
function StaffDs(){
  

    const [name, setName] = useState("");
    const [idCard, setIdCard] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [detail, setDetail] = useState("");

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
    const [homefrom, setHomefrom] = useState("");


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
        const response = await axios.delete(`https://khaoplong.quizchainat.com/delete-prisoner/${prisoner_id}`);
        alert(response.data.message);
        fetchPrisoners(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };

    const handleDeleteUser = async (id) => {
    if(!window.confirm("ยืนยันที่จะลบข้อมูลผู้ใช้คนนี้?")) return;
    try {
        const response = await axios.delete(`https://khaoplong.quizchainat.com/delete-user/${id}`);
        alert(response.data.message);
        fetchuser(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };


    const handleAdmin = async (e) => {
    e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บเพื่อให้ required ทำงาน
    try {
      const response = await axios.post("https://khaoplong.quizchainat.com/register-user", {
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
            const response = await axios.get(`https://khaoplong.quizchainat.com/prisoner?name=${searchTerm}`);
            setPrisoners(response.data);
            
            
        } catch (error) {
            console.error(error);
        }
    };

   const fetchuser = async () => {
        try {
            const response = await axios.get(`https://khaoplong.quizchainat.com/user-of-chack?name=${searchUser}`);
            setShowUser(response.data);   
        } catch (error) {
            console.error(error);
        }
    };     
  

  const handleputtext = async (e) => {
    e.preventDefault(); 
    try {
        const response = await axios.put("https://khaoplong.quizchainat.com/puttext-officer", {
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
        const response = await axios.post("https://khaoplong.quizchainat.com/putprisoner", {
            prisoner_code: prisoners_code,
            name: namePrisoner,
            age: age,
            cell_number: cell_number,
            sentence_detail: sentence_detail,
            added_by: myName,
            birthdayP: birthdayP,
            id_card_numberP: id_card_numberP,
            homefrom: homefrom
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
        

        <div className="admin-container">
      
      {/* --- ส่วนที่ 1: ลงประกาศ --- */}
      <div className="content-card">
          <div className="card-header">
            <h1>ลงประกาศ</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleputtext}>
              <div className="inputbox full-width">
                <input
                className="form-control"
                placeholder="ใส่ข้อความประกาศ"
                onChange={(e) => setNotice(e.target.value)}
                />
              </div>
              
              <button className="btn-primary" type="submit">ลงประกาศ</button>
              
            </form>
          </div>
      </div>

      
      

      {/* --- ส่วนที่ 3: เพิ่มผู้ต้องขัง --- */}
      <div className="content-card">
          <div className="card-header">
             <h1>เพิ่มรายชื่อผู้ต้องขัง</h1>
          </div>
          <div className="card-body">
            <form onSubmit={handleputprisoner} className="form-layout">
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="รหัสผู้ต้องขัง"
                    value={prisoners_code}
                    onChange={(e) => setPrisoners_code(e.target.value)}
                    required 
                />
                </div>
                <div className="inputbox" >
                <input  
                    className="form-control"
                    placeholder="ชื่อ-สกุล"
                    value={namePrisoner}
                    onChange={(e) => setNamePrisoner(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="อายุ"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="หมายเลขห้องขัง"
                    value={cell_number}
                    onChange={(e) => setCell_number(e.target.value)}
                    required
                />
                </div>
                  {/* --- ลบรายละเอียดคำพิพากษา --- 
                <div className="inputbox full-width">
                <input
                    className="form-control"
                    placeholder="รายละเอียดคำพิพากษา"
                    value={sentence_detail}
                    onChange={(e) => setSentence_detail(e.target.value)}
                    required
                />
                </div>
                */}
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="เลขบัตรประชาชน"
                    value={id_card_numberP}
                    onChange={(e) => setId_card_numberP(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="วันเกิด (วว/ดด/ปปปป)"
                    value={birthdayP}
                    onChange={(e) => setBirthdayP(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="ภูมิลำเนา"
                    value={homefrom}
                    onChange={(e) => setHomefrom(e.target.value)}
                    required
                />
                </div>
                <div className="buttonbox full-width">
                <button className="btn-success" type="submit">บันทึกข้อมูล</button>
                </div>
            </form>
          </div>
      </div>

      <div className="content-card">
                  <div className="card-header">
                      <h1>ค้นหารายชื่อผู้ต้องขัง</h1>
                  </div>
                  <div className="card-body">
                      <div className="search-bar">
                          <input 
                              className="form-control"
                              type="text" 
                              placeholder="ค้นหาชื่อผู้ต้องขัง..." 
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <button className="btn-search" onClick={fetchPrisoners}>ค้นหา</button>
                      </div>

                      <div className="result-grid">
                          {prisoners.map((item) => (
                              <div key={item.prisoner_id} className="result-item">
                                  <h3>{item.name}</h3>
                                  <p>รหัส: {item.prisoner_code}</p>
                                  <p>เลขบัตรประชาชน: {item.id_card_number}</p>
                                  <p>วันเกิด: {item.birthday}</p>
                                  <p>ที่อยู่: {item.homefrom}</p>
                                  <button className="btn-danger small" onClick={() =>handleDeletePrisoner(item.prisoner_id)}>ลบข้อมูล</button>
                              </div>
                          ))}
                      </div>
                  </div>
            </div>
      {/* --- ส่วนที่ 4: เพิ่มผู้ใช้ --- */}
      <div className="content-card">
         <div className="card-header">
            <h2>เพิ่มรายชื่อผู้ใช้</h2>
         </div>
         <div className="card-body">
            <form onSubmit={handleAdmin} className="form-layout">
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="ชื่อ-สกุล"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="เลขบัตรประชาชน"
                    maxLength={13}
                    value={idCard}
                    onChange={(e) => setIdCard(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="เบอร์โทรศัพท์"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    type="email"
                    placeholder="อีเมล"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="วันเกิด"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="รายละเอียดความสัมพันธ์"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    required
                />
                </div>
                <div className="buttonbox full-width">
                <button className="btn-success" type="submit">เพิ่มรายชื่อ</button>
                </div>
            </form>
         </div>
      </div>

      {/* --- ส่วนที่ 5: ค้นหาผู้ใช้ --- */}
      <div className="content-card">
            <div className="card-header">
                <h1>ค้นหารายชื่อผู้ใช้งาน</h1>
            </div>
            <div className="card-body">
                <div className="search-bar">
                    <input 
                        className="form-control"
                        type="text" 
                        placeholder="ค้นหาชื่อผู้ใช้งาน" 
                        onChange={(e) => setSearchUser(e.target.value)}
                    />
                    <button className="btn-search" onClick={fetchuser}>ค้นหา</button>
                </div>  
                <div className="result-grid">
                    {showUser.map((item) => (
                        <div key={item.id} className="result-item">
                            <h3>{item.name}</h3>
                            <p>เลขบัตรประชาชน: {item.id_card_number}</p>
                            <p>วันเกิด: {item.birthday}</p>
                            <p>รายละเอียดความสัมพันธ์: {item.detail}</p>
                            <button className="btn-danger small" onClick={() =>handleDeleteUser(item.id)}>ลบข้อมูล</button>
                        </div>
                    ))}
                </div>
            </div>
      </div>
      <button className="btn-secondary" onClick={() => navigate('/printpage')}>พิมพ์หนังสือ(PDF)</button>
      {/* Footer Buttons */}
      <div className="footer-actions">
        <button className="btn-danger" onClick={handleLoginout}>ออกจากระบบ</button>
        <button className="btn-secondary" onClick={() => navigate('/')}>กลับหน้าหลัก</button>
      </div>

    </div>
        </>
    )
}
export default StaffDs