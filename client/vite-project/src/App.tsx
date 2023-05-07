import Login from './components/onboarding/login'
import Signup from './components/onboarding/signup'
import{ Routes, Route } from 'react-router-dom'
import ForgotPassword from './components/onboarding/forgotpassword'
import ResetPassword from './components/onboarding/resetPassword'
import VerifyEmail from './components/onboarding/verifyEmail'
import Home from './components/Home/homs'
import ConfirmVerification from './components/onboarding/confirmVerification'
import WrongTokenResponse from './components/onboarding/wrongTokenResponse'
import { useAuth } from './contexts/users'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  const {setUser}=useAuth()

  useEffect(()=>{
    const getUser=async()=>{
        try{
            const user=await axios.get('http://localhost:3000/api/v1/users/me',{
            headers:{
                authorisation:`Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(user);
        setUser(user.data.data)
        }catch(err:any){
            console.log(err)
        }
      }
    
  
        getUser()
      
  },[])
  
  return (
    
 
          <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />
      <Route path="/verifyemail/:token" element={<VerifyEmail />} />
      <Route path="/" element={<Home />} />
      <Route path="/confirmverification" element={<ConfirmVerification />} />
      <Route path='/wrongtokenresponse' element={<WrongTokenResponse />} />
      </Routes>
    

    
  )
}

export default App
