import { useState,useEffect } from 'react'
import { useDispatch } from "react-redux";
import { Outlet } from 'react-router-dom';
import {Header,Footer} from './components/index.js';
import authService from './appwrite/auth.js';
import { login, logout } from './Store/authSlice';
import './App.css';

function App() {
  const [loading,setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() =>{
    authService.getCurrentUser()
    .then((userData) =>{
      if(userData){
        dispatch(login(userData));
      } else{
        dispatch(logout())
      }
    }
       
    
    )
    .finally(() => setLoading(false))
  }, [])


  return !loading?
  <div className='appmain'>
       <Header/>
         <main>
          <Outlet />
        </main>
      <Footer/>
  </div>
  :null
}

export default App
