import React,{useState,useEffect} from 'react'
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'
import axios from 'axios';

function Home() {
  const { instance } = useMsal();
  let navigate = useNavigate();

  const [ime,setIme]=useState(localStorage.getItem('ime') || null);
  const [flag, setFlag] = useState(JSON.parse(localStorage.getItem('isLoggedInVia2fa'))||false);
//console.log(flag);
useEffect(() => {
  localStorage.setItem('isLoggedInVia2fa', JSON.stringify(flag));
  localStorage.setItem('ime', ime);
}, [flag, ime]);


 /* const handleLogout = () => {
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
    

};*/



  return (
    <div className='home'> {flag ? ime : "neautoriznnovano"}
      

    </div>
    
  );
  }

export default Home