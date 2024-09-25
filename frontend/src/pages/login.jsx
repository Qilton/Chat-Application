import React from 'react'
import "./login.css"
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../../util'
const login = () => {
const [LoginInfo, setLoginInfo] = useState({email:"",password:""})

const navigate= useNavigate()
const HandleLogin=async(e) => {
  e.preventDefault()
  const {email,password}=LoginInfo
  if( !email || !password){
    return handleError('email and pass are required')
  }
  try {
    const url="http://localhost:3000/auth/login"
    const response= await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(LoginInfo)
    })
    const result=await response.json()
    const {success,message,jwtToken,name,error}=result;
    if (success){
      handleSuccess(message)
      localStorage.setItem('token',jwtToken)
      localStorage.setItem('loggedInUser',name)
      socket.connect()
      setTimeout(() => {
        navigate("/home")
      }, 1000);
    } else if(error){
      const details=error?.details[0].message
      handleError(details)
    }else if(!success){
      handleError(message)
    }
    console.log(result)
  } catch (err) {
    handleError(err)
  }

}



    const HandleChange=(e) => {
      const {name,value}=e.target
      console.log(name,value)
      const copyLoginInfo={...LoginInfo}
      copyLoginInfo[name]=value;
      setLoginInfo(copyLoginInfo)
    }
    
  return (
    <div className='h-[100vh] w-[100vw] justify-center items-center flex'>
    <div className='container justify-center items-center flex flex-col w-[25vw]'>
      <h1 className='font-semibold text-xl'>Login</h1>
      <form action="" onSubmit={HandleLogin}>
        
        <div>
            <label htmlFor="email">Email</label>
            <input onChange={HandleChange} type="text" name='email' autoFocus placeholder='Enter Your Email...' />
        </div>
        <div>
            <label htmlFor="password">Password</label>
            <input onChange={HandleChange} type="text" name='password' autoFocus placeholder='Enter Your Password...' />
        </div>
        <button className='p-4 border bg-purple-700 font-bold text-xl text-white'>Login</button>
        <span>Dont have a account ?
            <Link to="/signup" className='text-blue-600'>Signup</Link>
        </span>
      </form>
      <ToastContainer/>
    </div></div>
  )
}

export default login
