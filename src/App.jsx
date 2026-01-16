
import { Routes, Route } from 'react-router-dom';


import UserLogin from './userlogin/userLogin'
import AdminLogin from './adminlogin/adminLogin'
import StaffLogin from './stafflogin/staffLogin'
import Homemain from './home/homeMain';
import HomeUser from './homeuser/homeUser';
import VisitUser from './visituser/visitUser';
import AdminDs from './adminlogin/adminDs/adminDs';
import StaffDs from './stafflogin/staffloginDs.jsx/staffDs';
import './App.css'


function App() {
 

  return (
    <>
   
   <div className="App">
      
      <Routes>
        <Route path="/" element={<Homemain />} /> 
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
        <Route path="/homeuser" element={<HomeUser />} />
        <Route path="/visit" element={<VisitUser />} />
        <Route path="/adminDs" element={<AdminDs />} />
        <Route path="/staffDs" element={<StaffDs />} />

        
        
      </Routes>
    </div>
   
    </>
  )
}

export default App
