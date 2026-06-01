import React from 'react'
import {useDispatch} from 'react-redux';
import authService from '../../appwrite/auth';
import {logout} from '../../Store/authSlice';


function Logoutbtn() {
    const dispatch = useDispatch();

    const logoutHandler = () =>{
        authService.logout().then(() =>{
          dispatch(logout())
        })
    }
  return (
     <button onClick={logoutHandler}>Logout</button>
  )
}

export default Logoutbtn
