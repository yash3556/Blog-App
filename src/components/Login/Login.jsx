import React,{useState} from 'react'
import {Link , useNavigate} from 'react-router-dom'
import {login as authLogin} from '../../Store/authSlice'
import Button from '../Button/Button';
import Input from '../Input/Input';
import Logo from '../Logo/Logo';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import {useForm} from 'react-hook-form';
import './Login.css'


import { HiSparkles } from "react-icons/hi";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [error,setError] = useState("");

    const login = async(data) =>{
        setError("")
        try {
            const session = await authService.login(data)
            if(session){
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            } 
        } catch (error) {
            setError(error.message);
        }
    }
  return (
    <div className='relative min-h-screen text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]overflow-hidden flex
        items-center justify-center shadow-[0_0_100px_rgba(168,85,247,0.25)]'>
        <div style={{margin:'20px',padding:'20px'}} className='w-130 h-130 rounded-2xl  bg-white/10
           shadow-[2px_0px_5px_5px_rgba(255,255,255,0.15)]   hover:shadow-[2px_0px_20px_5px_rgba(168,85,247,0.45)] transition-all duration-300'>
            <div>
                <div style={{ display: "flex", justifyContent: "center", width: "100%",marginBottom:'20px' }}><Logo/></div>
            </div>
            <h1 style={{fontSize:'23px',fontWeight:'bolder',marginBottom:'7px'}} className='text-center'>Welcome Back!</h1>
            <h2 style={{fontSize:'15px'}} className='text-center'>Login to continue your bloging journey</h2>
      
            {error &&  <p>{error}</p>}
            <form onSubmit={handleSubmit(login)}>
                <div style={{marginTop:'20px',marginLeft:'20px'}}>
                    <Input style={{marginBottom:'10px'}} className='bg-white/5' label="Email:" placeholder="Enter your email" type="email" {
                        ...register("email",{
                            required:"Email is required",
                            validate:{
                                matchPatter: (value) => /^\S+@\S+\.\S+$/.test(value) || "Enter a valid email",
                            }
                        })
                    }
                    />
                    {errors.email && <p style={{color:'red',fontWeight:'bolder',minWidth:'100px',marginBottom:'7px'}}>{errors.email.message}</p>}
                    <Input  style={{marginBottom:'10px'}} className='bg-white/5' label="Password" type="password" placeholder="Enter your password" {
                        ...register("password",{
                            required:"Password is required",
                        })}
                         />
                    {errors.password && <p style={{color:'red',fontWeight:'bolder',minWidth:'100px',marginBottom:'7px'}}>{errors.password.message}</p>}
                         <Button style={{marginTop:'30px',color:'white',marginLeft:'65px',width:'300px'}}  type='submit' children="Sign in"
                         className='bg-linear-to-r from-[#360563] to-[#7905de] hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300 
                              rounded-2xl '/>

                               <p style={{textAlign:'center',marginTop:'20px'}}>Don&apos;t have any account?&nbsp;
                               <Link style={{color:'lightgreen'}} to="/signup"> sign up</Link>
                             </p>

                </div>
            </form>
        </div>
    </div>
  )
}

export default Login
