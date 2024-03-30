import React,{useState} from 'react'
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'
import axios from 'axios';

function Home() {
  const { instance } = useMsal();
  let navigate = useNavigate();

  const [ime,setIme]=useState(localStorage.getItem('ime') || null);

  const handleLogout = () => {
    if(JSON.parse(localStorage.getItem('isLoggedInVia2fa'))== true){
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('accessToken'); 
      localStorage.setItem('isLoggedInVia2fa', 'false');
      localStorage.setItem('ime', "neautorizovano");
      localStorage.setItem("user","");

      navigate('/');

    }
    else{
    instance.logoutPopup().then(r=>{
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('accessToken'); 
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('ime', "neautorizovano");
      localStorage.setItem("user","");

      navigate('/');

    })}
    

};



  return (
    <div className='home'> {ime}
    {JSON.parse(localStorage.getItem('isLoggedIn')) ?
    <button className='loginout' onClick={handleLogout}>Odjava</button> : 
    <button className='loginout'  onClick={()=>{navigate('/')}}>Prijava</button>
    
    }    

    </div>
    
  );
  }

export default Home