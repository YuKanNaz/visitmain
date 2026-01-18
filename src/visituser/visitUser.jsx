import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './visitUser.css';
function VisitUser() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    
    const [shownotice, setShownotice] = useState([]);

    const [selectedPrisoner, setSelectedPrisoner] = useState(null); 
    const [visitDate, setVisitDate] = useState("");
    const [visitTime, setVisitTime] = useState("");
    const [visitorName, setVisitorName] = useState(""); 
    const [phoneN, setPhoneN] = useState("");
    const [relations, setRalations] = useState("");
    const [visit_day, setVisit_day] = useState("");

    const[showuser, setShowuser] = useState([]);

    const myName = localStorage.getItem("userName");
    const navigate = useNavigate();

     useEffect(() => {
            const userStatus = localStorage.getItem("Status");
            showData()
            showuserdata()
            console.log("สถานะผู้ใช้: ", showuser);
            if (userStatus !== "user") {
              
              navigate('/')
            }else{
            setVisitorName(myName);
            }
        }, []);

    const handleLoginout = async () => {
      localStorage.clear();
      navigate('/');
    }

    const handleHome = async () => {
        navigate('/');
    }
    
    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://node-api-visit.vercel.app/prisoner?name=${searchTerm}`);
            setResults(response.data);
            setSelectedPrisoner(null); // รีเซ็ตคน
            
        } catch (error) {
            console.error(error);
        }
    };

    const showuserdata = async () => {
        try{
            const response = await axios.get(`https://node-api-visit.vercel.app/user?name=${myName}`);
            setShowuser(response.data[0].booking_status);
            
        }

        catch (err){
            console("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    }

    const showData = async () => {
        try{
            const response = await axios.get('https://node-api-visit.vercel.app/notice');
            setShownotice(response.data);
        }
       
        catch (err){
            console("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    }

    const handleState = async (nameuser) => {
    try {
        await axios.put("https://node-api-visit.vercel.app/update-visit-status", {
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
            await axios.post('https://node-api-visit.vercel.app/book-visit', {
                prisoner_code: selectedPrisoner.prisoner_code,
                visitor_name: visitorName,
                visit_date: visitDate,
                visit_time: visitTime,
                prisonerName: selectedPrisoner.name,
                phone: phoneN,
                relations: relations,
                visit_day: visit_day

            });
            await handleState(visitorName);
            alert("จองเยี่ยมสำเร็จ!");
            setSelectedPrisoner(null); 
            
        } catch (error) {
            alert("เกิดข้อผิดพลาด");
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
                placeholder="ค้นหาชื่อผู้ต้องขัง..." 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} style={{backgroundColor: "#1a3a5f", color: "white"}}>ค้นหา</button>
        </div>

        <div className="results-container">
            {results.map((item) => (
                <div key={item.prisoner_id} className="prisoner-card" style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                    <h3>{item.name}</h3>
                    <p>รหัส: {item.prisoner_code}</p>
                    <p>เลขบัตร: {item.id_card_number}</p>
                    <p>วันเกิด: {item.birthday}</p>
                    
                    <button 
                        onClick={() => setSelectedPrisoner(item)}
                        style={{ backgroundColor: "#28a745", color: "white", width: "100%" }}>
                        นัดเยี่ยมคนนี้
                    </button>
                </div>
            ))}
        </div>

        {selectedPrisoner && (
            <div className="booking-form-box" style={{ marginTop: "30px", border: "2px solid blue", padding: "20px" }}>
                <h3>กำลังจองเยี่ยม: {selectedPrisoner.name}</h3>
                <form onSubmit={handleBooking}>
                    <div className="form-group-item">
                        <label>วันที่ต้องการเยี่ยม: </label>
                        <input type="date" onChange={(e) => setVisitDate(e.target.value)} required />
                        <p style={{color: "red", fontSize: "0.9rem"}}>*เลือกได้เเค่วัน จันทร์-ศุกร์</p>
                    </div>
                    <div className="form-group-item">
                        <label>รอบเวลา: </label>
                        <select onChange={(e) => setVisitTime(e.target.value)} required>
                            <option value="">กรุณา เลือกรอบเวลา</option>
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
                        <label>เบอร์โทรศัพท์:</label>
                        <input type="text" placeholder="เช่น 0812345678" onChange={(e) => setPhoneN(e.target.value)} required />
                    </div>
                    <div className="form-group-item">
                        <label>ความสัมพันธ์:</label>
                         <select onChange={(e) => setRalations(e.target.value)} required>
                            <option value="">กรุณา เลือกความสัมพันธ์</option>
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

                     <div>
                            <label>เลือกวันที่ต้องการ:</label>
                             <select onChange={(e) => setVisit_day(e.target.value)} required>
                                <option value="">กรุณา เลือกความ วัน</option>
                                <option value="จันทร์">จันทร์</option>
                                <option value="อังคาร">อังคาร</option>
                                <option value="พุธ">พุธ</option>
                                <option value="พฤหัส ">พฤหัส</option>                           
                            </select>
                        </div>

                        
                    <br />
                    <button type="submit" style={{backgroundColor: "#28a745", color: "white"}}>ยืนยันการจอง</button>
                    <button type="button" onClick={() => setSelectedPrisoner(null)} style={{marginLeft: "10px", backgroundColor: "#dc3545", color: "white"}}>ยกเลิก</button>
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