import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './visitUser.css';

function VisitUser() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    
    const [shownotice, setShownotice] = useState([]);

    const [selectedPrisoner, setSelectedPrisoner] = useState(null); 
    const [selectedPrisonerOnline, setSelectedPrisonerOnline] = useState(null);
    
    const [visitTime, setVisitTime] = useState("");
    const [visitorName, setVisitorName] = useState(""); 
    const [phoneN, setPhoneN] = useState("");
    const [relations, setRalations] = useState("");
    const [visit_day, setVisit_day] = useState("");

    const[showuser, setShowuser] = useState("");
    const[showuserBooking, setshowuserBooking] = useState([]);

    const myName = localStorage.getItem("userName");
    const navigate = useNavigate();

    const [existingBookings, setExistingBookings] = useState([]);

    const ALL_DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์"];
    const ALL_TIMES = [
    "12.00-12.05", "12.05-12.10", "12.10-12.15", "12.15-12.20",
    "12.20-12.25", "12.25-12.30", "12.30-12.35", "12.35-12.40",
    "12.40-12.45", "12.45-12.50", "12.50-12.55", "12.55-13.00"
    ];

    useEffect(() => {
        const fetchData = async () => {
            const userStatus = localStorage.getItem("Status");
            if (userStatus !== "user") {
                navigate('/');
                return;
            }
            await handleuserBooking();
            await showData();
            await showuserdata(); 
            setVisitorName(myName);
        };
        fetchBookings(); 
        fetchData();
    }, []);

    // ✅ ดึงข้อมูลทั้ง 2 ตารางมารวมกัน เพื่อเช็คว่าใคร "เยี่ยมไปแล้ว" บ้าง
    const fetchBookings = async () => {
        try {
            const [resNormal, resOnline] = await Promise.all([
                axios.get('https://khaoplong.quizchainat.com/printdata'),
                axios.get('https://khaoplong.quizchainat.com/printdata-online')
            ]);
            
            // รวมข้อมูลเข้าด้วยกัน
            const allBookings = [...resNormal.data, ...resOnline.data];
            setExistingBookings(allBookings);
        } catch (err) {
            console.error("Error fetching bookings:", err);
        }
    };

    // เช็คว่านักโทษคนนี้ มีชื่ออยู่ในรายการจองไหม
    const checkPrisonerBooked = (nameToCheck) => {
        if (!nameToCheck) return false;
        return existingBookings.some(booking => 
            booking.prisonerName === nameToCheck
        );
    };

    const isTimeBooked = (timeToCheck) => {
        if (!visit_day) return false; 
        return existingBookings.some(booking => 
            booking.visit_day === visit_day && 
            booking.visit_time === timeToCheck
        );
    };

    const handleLoginout = async () => {
      localStorage.clear();
      navigate('/');
    }

    const handleHome = async () => {
        navigate('/');
    }
    
    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://khaoplong.quizchainat.com/prisoner?name=${searchTerm}`);
            setResults(response.data);
            setSelectedPrisoner(null);
            setSelectedPrisonerOnline(null);
            
        } catch (error) {
            console.error(error);
        }
    };

    const showuserdata = async () => {
        try {
            const response = await axios.get(`https://khaoplong.quizchainat.com/user?name=${myName}`);
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
            const response = await axios.get('https://khaoplong.quizchainat.com/notice');
            setShownotice(response.data);
        }
        catch (err){
            console.log("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
        }
    }

    const handleState = async (nameuser) => {
        try {
            await axios.put("https://khaoplong.quizchainat.com/update-visit-status", {
                visit_id: nameuser, 
                status: "จองแล้ว" 
            });
        } catch (err) {
            console.error("Update Status Error:", err);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedPrisoner) return;

        if (checkPrisonerBooked(selectedPrisoner.name)) {
            alert("ขออภัย นักโทษรายนี้ถูกจองเยี่ยมไปแล้ว");
            return;
        }

        try {
            const response = await axios.post('https://khaoplong.quizchainat.com/book-visit', {
                prisoner_code: selectedPrisoner.prisoner_code, 
                visitor_name: visitorName,
                visit_time: visitTime,
                prisonerName: selectedPrisoner.name, 
                phone: phoneN,
                relations: relations,
                visit_day: visit_day
            });

            await handleState(visitorName);
            alert(response.data.message); 
            window.location.reload(); 
        } catch (error) {
           alert("จองไม่สำเร็จ: " + (error.response?.data?.message || error.message));
        }
    };

    const handleBookingOnline = async (e) => {
        e.preventDefault();
        if (!selectedPrisonerOnline) return;

        if (checkPrisonerBooked(selectedPrisonerOnline.name)) {
            alert("ขออภัย นักโทษรายนี้ถูกจองเยี่ยมไปแล้ว");
            return;
        }

        try {
            const response = await axios.post('https://khaoplong.quizchainat.com/book-visit-online', {
                prisoner_code: selectedPrisonerOnline.prisoner_code, 
                visitor_name: visitorName,
                visit_time: visitTime,
                prisonerName: selectedPrisonerOnline.name, 
                phone: phoneN,
                relations: relations,
                visit_day: visit_day
            });

            await handleState(visitorName);
            alert(response.data.message); 
            window.location.reload(); 
        } catch (error) {
            alert("จองออนไลน์ไม่สำเร็จ: " + (error.response?.data?.message || error.message));
        }
    };

    const handleuserBooking = async () => {
        try {
            const response = await axios.get(`https://khaoplong.quizchainat.com/showuser-booking?name=${myName}`);
            setshowuserBooking(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <div className="booking-page">
            <div className="notice-section" style={{ padding: "20px" }}>
                <h2>ประกาศจากสำนักงาน</h2>
                <div>
                    {shownotice.map((itemN) => (
                        <div key={itemN.ID}>
                            <h3>{itemN.Notice}</h3>
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="showuser-booking">
                <div>
                    {showuserBooking.map((userbooking) => (
                        <div key={userbooking.visit_id}>
                            <h1>สถานะการเข้าจอง </h1>
                            <div className="datetime-booking-top">
                                <div className="datetime-booking-name">
                                    <h3>คุณ {userbooking.visitor_name}</h3>
                                </div>    
                                <h3>เข้าจองเยี่ยม {userbooking.prisonerName}</h3>
                            </div>
                            <div className="datetime-booking-bottom">
                                <div className="datetime-booking-day">
                                    <h3>จองคิวเข้าเยี่ยมในวัน {userbooking.visit_day}</h3>
                                </div>
                                <h3> เวลา {userbooking.visit_time}</h3>
                            </div>
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
                    {results.map((item) => {
                        // เช็คว่านักโทษคนนี้ถูกจองหรือยัง
                        const isPrisonerAlreadyBooked = checkPrisonerBooked(item.name);

                        return (
                            <div key={item.prisoner_id} className="prisoner-card" style={{ border: "1px solid #ccc", margin: "10px", padding: "15px", width: "250px" }}>
                                <h3>{item.name}</h3>
                                <p>วันเกิด: {item.birthday}</p>
                                
                                {showuser === "จองแล้ว" ? (
                                    // 1. ถ้า User คนนี้ จองไปแล้ว -> กดไม่ได้ทุกกรณี
                                    <button disabled style={{ backgroundColor: "#6c757d", color: "white", width: "100%" }}>
                                        ท่านได้ใช้สิทธิ์จองไปแล้ว
                                    </button>
                                ) : isPrisonerAlreadyBooked ? (
                                    // 2. ถ้า User ยังไม่จอง แต่ "นักโทษคนนี้ถูกคนอื่นจองไปแล้ว" -> ขึ้นข้อความ "เยี่ยมไปแล้ว"
                                    <button disabled style={{ backgroundColor: "#6c757d", color: "white", width: "100%", cursor: "not-allowed" }}>
                                        เยี่ยมไปแล้ว (ถูกจองคิวแล้ว)
                                    </button>
                                ) : (
                                    // 3. ถ้ายังว่าง -> แสดงปุ่มจอง
                                    <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                                        <p className="text-red">* เลือกประเภทการจอง</p>
                                        
                                        <button 
                                            onClick={() => { setSelectedPrisoner(item); setSelectedPrisonerOnline(null); }}
                                            style={{ backgroundColor: "#007bff", color: "white", width: "100%" }}
                                        >
                                            จองเยี่ยมปกติ
                                        </button>

                                        <button 
                                            onClick={() => { setSelectedPrisonerOnline(item); setSelectedPrisoner(null); }}
                                            style={{ backgroundColor: "#28a745", color: "white", width: "100%" }}
                                        >
                                            จองเยี่ยมออนไลน์
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* แบบฟอร์มจองปกติ */}
                {selectedPrisoner && (
                    <div className="booking-form-box" style={{ marginTop: "30px", border: "2px solid blue", padding: "20px" }}>
                        <h3>กำลังจองเยี่ยม (ปกติ): {selectedPrisoner.name}</h3>
                        <form onSubmit={handleBooking}>
                            <FormFields 
                                setVisit_day={setVisit_day} 
                                visit_day={visit_day} 
                                ALL_DAYS={ALL_DAYS}
                                setVisitTime={setVisitTime}
                                visitTime={visitTime}
                                ALL_TIMES={ALL_TIMES}
                                isTimeBooked={isTimeBooked}
                                setRalations={setRalations}
                                setPhoneN={setPhoneN}
                            />
                            <div className="bottom-visit">
                                <button className="btn-01" type="submit" style={{backgroundColor: "#007bff", color: "white"}}>ยืนยันการจอง (ปกติ)</button>
                                <button className="btn-02" type="button" onClick={() => setSelectedPrisoner(null)} style={{marginLeft: "10px", backgroundColor: "#dc3545", color: "white"}}>ยกเลิก</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* แบบฟอร์มจองออนไลน์ */}
                {selectedPrisonerOnline && (
                    <div className="booking-form-box" style={{ marginTop: "30px", border: "2px solid green", padding: "20px" }}>
                        <h3 style={{color: 'green'}}>กำลังจองเยี่ยม (ออนไลน์): {selectedPrisonerOnline.name}</h3>
                        <form onSubmit={handleBookingOnline}>
                            <FormFields 
                                setVisit_day={setVisit_day} 
                                visit_day={visit_day} 
                                ALL_DAYS={ALL_DAYS}
                                setVisitTime={setVisitTime}
                                visitTime={visitTime}
                                ALL_TIMES={ALL_TIMES}
                                isTimeBooked={isTimeBooked}
                                setRalations={setRalations}
                                setPhoneN={setPhoneN}
                            />
                            <div className="bottom-visit">
                                <button className="btn-01" type="submit" style={{backgroundColor: "#28a745", color: "white"}}>ยืนยันการจอง (ออนไลน์)</button>
                                <button className="btn-02" type="button" onClick={() => setSelectedPrisonerOnline(null)} style={{marginLeft: "10px", backgroundColor: "#dc3545", color: "white"}}>ยกเลิก</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            
            <div className="bottom-nav">
                <div></div>
                <button className="btn-logout" onClick={handleLoginout}>ออกจากระบบ</button>
                <button className="btn-home" onClick={handleHome}>กลับหน้าหลัก</button>
            </div>
        </div>
        </>
    );
}

const FormFields = ({ setVisit_day, visit_day, ALL_DAYS, setVisitTime, visitTime, ALL_TIMES, isTimeBooked, setRalations, setPhoneN }) => (
    <>
        <div>
            <label>วันที่ต้องการเข้าเยี่ยม:</label>
            <select onChange={(e) => setVisit_day(e.target.value)} required value={visit_day}>
                <option value="" disabled>กรุณาเลือกวัน...</option>
                {ALL_DAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                ))}
            </select>
        </div>

        <div className="form-group-item">
            <label>รอบเวลาเข้าเยี่ยม: </label>
            <select onChange={(e) => setVisitTime(e.target.value)} required value={visitTime}>
                <option value="" disabled>กรุณาเลือกรอบเวลา...</option>
                {ALL_TIMES.map((time) => {
                    const booked = isTimeBooked(time); 
                    if (booked) return null;
                    return <option key={time} value={time}>{time}</option>;
                })}
            </select>
        </div>

        <div className="form-group-item">
            <label>เกี่ยวข้องเป็น: <span style={{color: 'red'}}>*</span></label>
            <select name="relations" defaultValue="" onChange={(e) => setRalations(e.target.value)} required>
                <option value="" disabled>กรุณาเลือกความสัมพันธ์...</option>
                <option value="พ่อ">พ่อ</option>
                <option value="แม่">แม่</option>
                <option value="สามี">สามี</option>
                <option value="ภรรยา">ภรรยา</option>
                <option value="พี่น้อง">พี่/น้อง</option>
                <option value="ญาติ">ญาติ</option>
                <option value="อื่นๆ">อื่นๆ</option>
            </select>
        </div>

        <div className="form-group-item">
            <label>กรอก LineID:</label>
            <input type="text" placeholder="ใส่LineID" onChange={(e) => setPhoneN(e.target.value)} required />
        </div>
        <br />
    </>
);

export default VisitUser;