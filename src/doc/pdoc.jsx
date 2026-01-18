import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './pdoc.css';


const TableComponent = React.forwardRef(({ data , dateValue}, ref) => {
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
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.visit_id || index}>
                <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.prisonerName}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visitor_name}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.phone}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.relations}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visit_day}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{row.visit_time}</td>
                <td style={{ border: '1px solid black', padding: '8px' }}>{""}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>ไม่พบข้อมูลการจอง</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});


const PrintPage = () => {
  const [data, setData] = useState([]);
  const [putdata, setPutdata] = useState("");
  const [inputValue, setInputValue] = useState("");
  const componentRef = useRef();
  const navigate = useNavigate();

  const handldputtext = (e) => {
    e.preventDefault();
    setPutdata(inputValue);
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://node-api-visit.vercel.app/printdata`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
  });

  return (
    <div className="print-page-layout">
      <div className="print-container">
        
        {/* หัวข้อหน้า (เพิ่มเพื่อให้รู้ว่าอยู่หน้าไหน) */}
        <h2 className="page-header">พิมพ์รายงานสรุปยอด</h2>

        {/* ส่วนฟอร์มค้นหา */}
        <div className="search-section">
          <form onSubmit={handldputtext} className="date-form">
            <div className="input-group">
              <label>ลงวันที่:</label>
              <input 
                type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                placeholder="รายละเอียดวันที่"
                className="date-input"
              />
            </div>
            <button type="submit" className="btn-submit">เพิ่มข้อความ</button>
          </form>
        </div>
        
        {/* ส่วนตาราง (ใส่ Wrapper เพื่อให้เลื่อนซ้ายขวาได้ในมือถือ) */}
        <div className="table-responsive">
          <TableComponent ref={componentRef} data={data} dateValue={putdata}/>
        </div>
        
        {/* ส่วนปุ่มกดด้านล่าง */}
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

export default PrintPage;