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
        const response = await axios.delete(`/delete-prisoner/${prisoner_id}`);
        alert(response.data.message);
        fetchPrisoners(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };

    const handleDeleteUser = async (id) => {
    if(!window.confirm("ยืนยันที่จะลบข้อมูลผู้ใช้คนนี้?")) return;
    try {
        const response = await axios.delete(`/delete-user/${id}`);
        alert(response.data.message);
        fetchuser(); // รีเฟรชรายชื่อหลังจากลบ
    } catch (error) {
        console.error(error);
    }
    };


    const handleAdmin = async (e) => {
    e.preventDefault(); // ✅ หยุดการ reload หน้าเว็บเพื่อให้ required ทำงาน
    try {
      const response = await axios.post("/register-user", {
        name: name,
        idCard: idCard,
        phone: phone,
        email: email,
        birthday: birthday,
        detail: detail

        
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
            const response = await axios.get(`/prisoner-showall?name=${searchTerm}`);
            setPrisoners(response.data);
            
            
        } catch (error) {
            console.error(error);
        }
    };

   const fetchuser = async () => {
        try {
            const response = await axios.get(`/user-of-chack?name=${searchUser}`);
            setShowUser(response.data);   
        } catch (error) {
            console.error(error);
        }
    };     
  

  const handleputtext = async (e) => {
    e.preventDefault(); 
    try {
        const response = await axios.put("/puttext-officer", {
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
        const response = await axios.post("/putprisoner", {
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
                placeholder="ลงประกาศและลบข้อความเพื่อลบประกาศ"
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
            <h5>*ใส่ข้อมูลอย่างถูกต้อง ข้อมูลจะตรงตามที่บันทึกทุกประการ</h5>
            <form onSubmit={handleputprisoner} className="form-layout">
                {/* --- ลบรหัสผู้ต้องขัง --- 
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="รหัสผู้ต้องขัง"
                    value={prisoners_code}
                    onChange={(e) => setPrisoners_code(e.target.value)}
                    required 
                />
                </div>
                */}
                <div className="inputbox" >
                <input  
                    className="form-control"
                    placeholder="ชื่อ-สกุล"
                    value={namePrisoner}
                    onChange={(e) => setNamePrisoner(e.target.value)}
                    required
                />
                </div>
                {/* --- ลบหมายเลขห้องขัง ---
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="อายุ"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                </div>
                */}
                {/* --- ลบหมายเลขห้องขัง --- 
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="หมายเลขห้องขัง"
                    value={cell_number}
                    onChange={(e) => setCell_number(e.target.value)}
                    required
                />
                </div>
                */}
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
                        type="text" 
                        inputMode="numeric" 
                        placeholder="เลขบัตรประชาชน"
                        value={id_card_numberP}
                        onChange={(e) => {
                            const value = e.target.value;
                            const onlyNums = value.replace(/[^0-9]/g, ''); // 1. ยอมให้พิมพ์แค่ตัวเลข
                            
                            if (onlyNums.length <= 13) { // 2. พิมพ์ได้สูงสุดแค่ 13 ตัว
                                setId_card_numberP(onlyNums);
                            }
                        }}
                        required
                        minLength={13}     /* 3. บังคับขั้นต่ำต้อง 13 ตัว */
                        pattern="\d{13}"   /* 4. Pattern ต้องเป็นตัวเลข 13 ตัวเป๊ะๆ */
                        title="กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก" /* ข้อความเตือนตอนกด Submit */
                    />
                    
                    {/* (เสริม) แสดงข้อความเตือนสีแดงทันที ถ้าพิมพ์ยังไม่ครบ */}
                    {id_card_numberP.length > 0 && id_card_numberP.length < 13 && (
                        <div style={{color: 'red', fontSize: '12px', marginTop: '5px'}}>
                            * ยังขาดอีก {13 - id_card_numberP.length} หลัก
                        </div>
                    )}
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
                        // ลบ required ออกแล้ว เพื่อให้ฟิลด์นี้ไม่จำเป็นต้องกรอกก็ได้
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
            <h5>*ใส่ข้อมูลอย่างถูกต้อง ข้อมูลจะตรงตามที่บันทึกทุกประการ</h5>
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
                        type="text"
                        inputMode="numeric" /* ให้มือถือเด้งแป้นตัวเลข */
                        placeholder="เลขบัตรประชาชน"
                        maxLength={13}      /* พิมพ์เกินไม่ได้ */
                        minLength={13}      /* พิมพ์ไม่ครบ แจ้งเตือนตอนกดส่ง */
                        pattern="\d{13}"    /* บังคับ Pattern ตัวเลข 13 ตัว */
                        title="กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก" /* ข้อความแจ้งเตือน */
                        
                        value={idCard}
                        onChange={(e) => {
                            const value = e.target.value;
                            // ลบตัวอักษรทุกอย่างที่ไม่ใช่ตัวเลขออกทันที
                            const onlyNums = value.replace(/[^0-9]/g, '');
                            setIdCard(onlyNums);
                        }}
                        required
                    />
                    
                    {/* (เสริม) แจ้งเตือนสีแดงใต้ช่อง ถ้าพิมพ์ยังไม่ครบ 13 หลัก (จะแสดงเมื่อมีการพิมพ์แล้ว) */}
                    {idCard && idCard.length > 0 && idCard.length < 13 && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                            * กรุณากรอกให้ครบ 13 หลัก (ปัจจุบัน {idCard.length}/13)
                        </div>
                    )}
                </div>
                <div className="inputbox">
                    <input
                        className="form-control"
                        type="tel"          /* ใช้ type="tel" สำหรับเบอร์โทรศัพท์ */
                        inputMode="numeric" /* ให้มือถือเด้งแป้นตัวเลข */
                        placeholder="เบอร์โทรศัพท์"
                        maxLength={10}      /* สูงสุด 10 หลัก */
                        minLength={10}      /* ต่ำสุด 10 หลัก (Browser จะเตือนตอนกดส่ง) */
                        pattern="\d{10}"    /* บังคับต้องเป็นตัวเลข 10 ตัวเท่านั้น */
                        title="กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
                        
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            // ลบตัวอักษรทุกอย่างที่ไม่ใช่ตัวเลขออก
                            const onlyNums = value.replace(/[^0-9]/g, '');
                            setPhone(onlyNums);
                        }}
                        required
                    />

                    {/* (เสริม) แจ้งเตือนสีแดงถ้าพิมพ์ยังไม่ครบ 10 หลัก */}
                    {phone && phone.length > 0 && phone.length < 10 && (
                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                            * กรุณากรอกให้ครบ 10 หลัก (ปัจจุบัน {phone.length}/10)
                        </div>
                    )}
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    type="text"
                    placeholder="LineID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                </div>
                <div className="inputbox">
                <input
                    className="form-control"
                    placeholder="วันเกิด (วว/ดด/ปปปป)"
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
                        /* ลบ required ออกแล้ว */
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