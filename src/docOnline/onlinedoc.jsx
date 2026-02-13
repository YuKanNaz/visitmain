import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './onlinedoc.css';

// รับ props onDelete เพิ่มเข้ามา
const TableComponent = React.forwardRef(({ data, dateValue, onDelete }, ref) => {
  return (
    <div ref={ref} style={{ padding: '20px' }}>
        
      <h3 style={{ textAlign: 'center' }}>{dateValue}</h3>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
        <thead>
          <tr style={{ backgroundColor: '#ffffff' }}>
            <th style={{ border: '1px solid black', padding: '8px' }}>ลำดับ</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ผู้ต้องขัง</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ผู้จองเยี่ยม</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>เบอร์โทร</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ความสัมพันธ์</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>วัน</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>เวลา</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ลายมือชื่อ</th>
            {/* เพิ่มคอลัมน์สำหรับลบ (ใส่ class no-print เพื่อไม่ให้แสดงตอนปริ้น) */}
            <th className="no-print" style={{ border: '1px solid black', padding: '8px', backgroundColor: '#f0f0f0' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.visiton_id || index}>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.prisonerName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visitor_name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.phone}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.relations}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visit_day}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visit_time}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{""}</td>
                
                {/* ปุ่มลบ */}
                <td className="no-print" style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                    <button 
                        onClick={() => onDelete(row.visiton_id)} // ส่ง ID ไปลบ
                        style={{ 
                            backgroundColor: '#ff4d4d', 
                            color: 'white', 
                            border: 'none', 
                            padding: '5px 10px', 
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        ลบ
                    </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '10px' }}>ไม่พบข้อมูลการจอง</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

const PrintPageOnline = () => {
  const [data, setData] = useState([]);
  const [putdata, setPutdata] = useState("");
  const [inputValue, setInputValue] = useState("");
  const componentRef = useRef();
  const navigate = useNavigate();

  const handldputtext = (e) => {
    e.preventDefault();
    setPutdata(inputValue);
  }
  
  // ฟังก์ชันโหลดข้อมูล
  const fetchData = async () => {
      try {
        const response = await axios.get(`/printdata-online`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (id) => {
      if (!id) return;
      // แจ้งเตือนยืนยันก่อนลบ
      if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบรายการจองนี้?")) return;

      try {
          // ยิง API ไปลบที่ Backend (อย่าลืมแก้ URL ให้ตรงกับ Backend ของคุณ)
          await axios.delete(`/delete-visitOnline/${id}`); 
          alert("ลบข้อมูลสำเร็จ");
          
          // อัปเดตข้อมูลในตารางโดยไม่ต้องโหลดหน้าใหม่
          setData(data.filter(item => item.visiton_id !== id));
      } catch (err) {
          console.error(err);
          alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className="print-page-layout">
      <div className="print-container">
        
        <h2 className="page-header">พิมพ์รายงานสรุปยอด</h2>

        <div className="search-section">
          <form onSubmit={handldputtext} className="date-form">
            <div className="input-group">
              <label>ลงวันที่</label>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="ลงวันที่ (ทำให้ว่างเพื่อลบข้อความทั้งหมด)"
                className="date-input"
              />
            </div>
            <button type="submit" className="btn-submit">เพิ่มข้อความ</button>
          </form>
        </div>
        
        <div className="table-responsive">
          {/* ส่งฟังก์ชัน handleDelete ลงไปที่ TableComponent */}
          <TableComponent 
            ref={componentRef} 
            data={data} 
            dateValue={putdata} 
            onDelete={handleDelete} 
          />
        </div>
        
        <div className="action-footer no-print">
            <button 
              className="btn-print"
              onClick={() => handlePrint()} 
            >
              🖨️ ปริ้นหนังสือ
            </button>

            <button 
              className="btn-back"
              onClick={() => navigate('/')}
            >
              กลับหน้าหลัก
            </button>
        </div>

      </div>
    </div>
    
  );
};

export default PrintPageOnline;