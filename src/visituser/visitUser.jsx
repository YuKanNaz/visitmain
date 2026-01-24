import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './visitUser.css';
function VisitUser() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    
    const [shownotice, setShownotice] = useState([]);

    const [selectedPrisoner, setSelectedPrisoner] = useState(null); 
    //const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [visitorName, setVisitorName] = useState(""); 
    const [phoneN, setPhoneN] = useState("");
    const [relations, setRalations] = useState("");
    const [visit_day, setVisit_day] = useState("");

    const[showuser, setShowuser] = useState("");

    const myName = localStorage.getItem("userName");
    const navigate = useNavigate();

    useEffect(() => {
    const fetchData = async () => {
        const userStatus = localStorage.getItem("Status");
        if (userStatus !== "user") {
            navigate('/');
            return;
        }
        await showData();
        await showuserdata(); 
        setVisitorName(myName);
    };

    fetchData();
}, []);

useEffect(() => {
    console.log("สถานะผู้ใช้ล่าสุด: ", showuser);
}, [showuser]); // เมื่อ showuser เปลี่ยนค่า ให้ทำงานในนี้


    const handleLoginout = async () => {
      localStorage.clear();
      navigate('/');
    }

    const handleHome = async () => {
        navigate('/');
    }
    
    const handleSearch = async () => {
        try {
            const response = await axios.get(`prisoner?name=${searchTerm}`);
            setResults(response.data);
            setSelectedPrisoner(null); // รีเซ็ตคน
            
        } catch (error) {
            console.error(error);
        }
    };

    const showuserdata = async () => {
    try {
        const response = await axios.get(`user?name=${myName}`);

        // เช็กว่ามีข้อมูลส่งกลับมาจริงไหม
        if (response.data && response.data.length > 0) {
            setShowuser(response.data[0].booking_status);
        } else {
            setShowuser("ไม่มีสถานะ");
        }
    } catch (err) {
        console.error("เกิดข้อผิดพลาด: ", err);
    }
}

    const showData = async () => {
        try{
            const response = await axios.get('notice');
            setShownotice(response.data);
        }
       
        catch (err){
            console("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    }

    const handleState = async (nameuser) => {
    try {
        await axios.put("update-visit-status", {
            visit_id: nameuser, 
            status: "จองแล้ว" 
        });
        console.log("อัปเดตสถานะสำเร็จ");
    } catch (err) {
        console.error("Update Status Error:", err);
        
    }
};

    
 const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedPrisoner) return;

    try {
        const response = await axios.post('book-visit', {
            prisoner_code: selectedPrisoner.prisoner_code,
            visitor_name: visitorName,
            //visit_date: visitDate,
            visit_time: visitTime,
            prisonerName: selectedPrisoner.name,
            phone: phoneN,
            relations: relations,
            visit_day: visit_day
        });

        // หากจองสำเร็จ
        await handleState(visitorName);
        alert(response.data.message); // แสดง "จองเยี่ยมสำเร็จ รอการอนุมัติ!"
        navigate('/');
        setSelectedPrisoner(null); 

    } catch (error) {
        // จัดการกรณีเกิดข้อผิดพลาด (เช่น ข้อมูลซ้ำ หรือ Error อื่นๆ)
        if (error.response && error.response.data && error.response.data.message) {
            // จะแสดง "เวลานี้ของวันดังกล่าวมีผู้อื่นจองแล้ว..." ตามที่ Backend ส่งมา
            alert(error.response.data.message);
        } else {
            alert("เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่ภายหลัง");
        }
    }
};

    return (
        <>
        
        <div className="booking-page">
    <div className="notice-section" style={{ padding: "20px" }}>
        <h2>ประกาศจากสำนักงาน</h2>
        <div>
            {shownotice.map((itemN) => (
                <div key={itemN.ID}>
                    <h3>- {itemN.Notice}</h3>
                </div>
            ))}
        </div>
    </div>
    
    <div style={{ padding: "20px" }}>
        <h2>ระบบนัดเยี่ยมผู้ต้องขัง</h2>
        
        <div className="search-box">
            <input 
                type="text" 
                placeholder="ใส่ชื่อผู้ต้องขัง..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} style={{backgroundColor: "#1a3a5f", color: "white"}}>ค้นหา</button>
        </div>
        <h4>*หากอยากดูรายชื่อทั้งหมดให้ลบคำค้นหาและกดค้นหา</h4>

        <div className="results-container">
            {results.map((item) => (
                <div key={item.prisoner_id} className="prisoner-card" style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                    <h3>{item.name}</h3>
                    <p>รหัส: {item.prisoner_code}</p>
                    <p>เลขบัตร: {item.id_card_number}</p>
                    <p>วันเกิด: {item.birthday}</p>
                    <p className="text-red">* หากเลือกแล้วให้กรอกข้อมูลการเข้าจองด้านล่าง</p>
                    
                    {showuser === "จองแล้ว" && (
                        <button disabled style={{ backgroundColor: "#6c757d", color: "white", width: "100%" }}>
                            ไม่สามารถจองได้
                            </button>
                    )}
                    {showuser !== "จองแล้ว" && (
                        <button 
                            onClick={() => setSelectedPrisoner(item)}
                            style={{ backgroundColor: "#007bff", color: "white", width: "100%" }}
                        >
                        เลือกเพื่อจองเยี่ยม
                        </button>
                    )}
                </div>
            ))}
        </div>

        {selectedPrisoner && (
            <div className="booking-form-box" style={{ marginTop: "30px", border: "2px solid blue", padding: "20px" }}>
                <h3>กำลังจองเยี่ยม: {selectedPrisoner.name}</h3>
                <form onSubmit={handleBooking}>
                    {/*--<div className="form-group-item">
                        <label>วันที่ต้องการเยี่ยม: </label>
                        <input type="date" onChange={(e) => setVisitDate(e.target.value)} required />
                        <p style={{color: "red", fontSize: "0.9rem"}}>*เลือกได้เเค่วัน จันทร์-ศุกร์</p>
                    </div>--*/}
                        <div>
                            <label>วันที่ต้องการเข้าเยี่ยม:</label>
                             <select onChange={(e) => setVisit_day(e.target.value)} required>
                                <option value="จันทร์">จันทร์</option>
                                <option value="อังคาร">อังคาร</option>
                                <option value="พุธ">พุธ</option>
                                <option value="พฤหัส ">พฤหัส</option>                           
                            </select>
                        </div>


                    <div className="form-group-item">
                        <label>รอบเวลาเข้าเยี่ยม: </label>
                        <select onChange={(e) => setVisitTime(e.target.value)} required>
                            <option value="12.00-12.05">รอบ 12.00-12.05</option>
                            <option value="12.05-12.10">รอบ 12.05-12.10</option>
                            <option value="12.10-12.15">รอบ 12.10-12.15</option>
                            <option value="12.15-12.20">รอบ 12.15-12.20</option>
                            <option value="12.20-12.25">รอบ 12.20-12.25</option>
                            <option value="12.25-12.30">รอบ 12.25-12.30</option>
                            <option value="12.30-12.35">รอบ 12.30-12.35</option>
                            <option value="12.35-12.40">รอบ 12.35-12.40</option>
                            <option value="12.40-12.45">รอบ 12.40-12.45</option>
                            <option value="12.45-12.50">รอบ 12.45-12.50</option>
                            <option value="12.50-12.55">รอบ 12.50-12.55</option>
                            <option value="12.55-13.00">รอบ 12.55-13.00</option>
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>เกี่ยวข้องเป็น:</label>
                         <select onChange={(e) => setRalations(e.target.value)} required>
                            <option value="พ่อ">พ่อ</option>
                            <option value="แม่">แม่</option>
                            <option value="น้อง">น้อง</option>
                            <option value="พี่">พี่</option>
                            <option value="ตา">ตา</option>
                            <option value="ยาย">ยาย</option>
                            <option value="ปู่">ปู่</option>
                            <option value="ย่า">ย่า</option>
                            <option value="น้า">น้า</option>
                            <option value="อา">อา</option>
                            <option value="ลุง">ลุง</option>
                            <option value="ป้า">ป้า</option>
                            <option value="อื่นๆ">อื่นๆ</option>
                            
                        </select>
                    </div>

                    <div className="form-group-item">
                        <label>กรอกเบอร์โทรศัพท์:</label>
                        <input type="text" placeholder="ใส่เบอร์โทรศัพท์" onChange={(e) => setPhoneN(e.target.value)} required />
                    </div>
                    

                     

                        
                    <br />
                    <div className="bottom-visit">
                    <button type="submit" style={{backgroundColor: "#28a745", color: "white"}}>ยืนยันการจอง</button>
                    <button type="button" onClick={() => setSelectedPrisoner(null)} style={{marginLeft: "10px", backgroundColor: "#dc3545", color: "white"}}>ยกเลิก</button>
                    </div>
                </form>
            </div>
        )}
    </div>
    
    <div className="bottom-nav">
        <button className="btn-logout" onClick={handleLoginout}>ออกจากระบบ</button>
        <button className="btn-home" onClick={handleHome}>กลับหน้าหลัก</button>
    </div>
</div>
        </>
    );
}

export default VisitUser;