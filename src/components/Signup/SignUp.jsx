import React,{useState} from 'react'
import authService from '../../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../Store/authSlice'
import Button from '../Button/Button'
import Input from '../Input/Input'
import Logo from '../Logo/Logo'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function SignUp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [error,setError] = useState("");

    const create = async(data) =>{
        setError("")
        try {
            const session = await authService.createUserAccount(data)
            if(session){
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message);
        }
    }
  return (
    <div  className='relative min-h-screen text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]overflow-hidden flex
        items-center justify-center shadow-[0_0_100px_rgba(168,85,247,0.25)]'>
      <div style={{margin:'20px',padding:'20px'}} className='w-130 h-140 rounded-2xl  bg-white/10 * shadow-[2px_0px_5px_5px_rgba(255,255,255,0.15)]  
       hover:shadow-[2px_0px_20px_5px_rgba(168,85,247,0.45)] transition-all duration-300'>
        <div style={{ display: "flex", justifyContent: "center", width: "100%",marginBottom:'20px' }}>
             <Logo/>
       </div>
            <h1 style={{fontSize:'23px',fontWeight:'bolder',marginBottom:'7px'}} className='text-center'>Create your account</h1>
            <h2 style={{fontSize:'15px'}} className='text-center'>Join Blogify and start sharing your ideas</h2>

            {error &&  <p>{error}</p>}
            <form onSubmit={handleSubmit(create)}>
                <div style={{marginTop:'20px',marginLeft:'20px'}}>
                    <Input style={{marginBottom:'10px'}} className='bg-white/5' label="Full Name:" placeholder="Enter your full name" {
                        ...register("name",{
                            required:"Name is required",
                             
                        }) } />
                    {errors.name && <p style={{textAlign:'center',marginTop:'20px'}}>{errors.name.message}</p>}

                    <Input  style={{marginBottom:'10px'}} className='bg-white/5' label="Email:" type="email" placeholder="Enter you email" {
                        ...register("email",{
                            required:"Email is required",
                            validate:{
                                matchPattern: (value) => /^\S+@\S+\.\S+$/.test(value) || "Enter a valid email",
                            }
                        }) } />
                    {errors.email && <p style={{textAlign:'center',marginTop:'20px'}}>{errors.email.message}</p>}

                    <Input  style={{marginBottom:'10px'}} className='bg-white/5' label="Password:" type="password" placeholder="Enter your password" {
                        ...register("password",{
                            required:"Password is required",
                            validate:{
                                matchPattern: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value) ||
                                   "Password must contain 8+ chars, uppercase, lowercase, number & special character",
                            }
                        })} />
                    {errors.password && <p style={{textAlign:'center',marginTop:'20px'}}>{errors.password.message}</p>}

                        <Button style={{marginTop:'30px',color:'white',marginLeft:'65px',width:'300px'}} 
                         type='submit' children="Sign in" className='bg-linear-to-r from-[#360563] to-[#7905de] 
                         hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300'type='submit rounded-2xl '
                          children="Create Account"/>

                        <p style={{textAlign:'center',marginTop:'20px'}}>Already have an account?&nbsp;

                          <Link style={{color:'lightgreen'}}  to="/login"> Login</Link>
                         </p>
                </div>

            </form>

      </div>
    </div>
  )
}

export default SignUp
