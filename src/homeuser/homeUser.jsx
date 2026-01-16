import React from "react";
import { useNavigate } from 'react-router-dom';
function HomeUser() {
    const navigate = useNavigate()

    return(
        <>
        <div>
            homeUser
        </div>
        <button onClick={() => navigate('/visit')}></button>


        
        </>
    )
}
export default HomeUser