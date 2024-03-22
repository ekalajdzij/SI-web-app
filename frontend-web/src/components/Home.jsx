import React,{useState} from 'react'
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css'

function Home() {
  const { instance } = useMsal();
  let navigate = useNavigate();

  const [ime,setIme]=useState(localStorage.getItem('ime') || null);
  const handleLogout = () => {
    instance.logoutPopup().then(r=>{
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('accessToken'); 
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.setItem('ime', "neautorizovano");
      navigate('/');

    })
    

};

  return (
    <div className='home'> {ime}
    {JSON.parse(localStorage.getItem('isLoggedIn')) ?
    <button className='loginout' onClick={handleLogout}>Odjava</button> : 
    <button className='loginout'  onClick={()=>{navigate('/')}}>Prijava</button>

    
    }
    </div>
    
  )
}

export default Home