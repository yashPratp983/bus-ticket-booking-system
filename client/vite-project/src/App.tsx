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
import { useEffect,useState } from 'react'
import axios from 'axios'
import Loading from './components/loading'

function App() {
  const {setUser}=useAuth()
  const [loading,setLoading]=useState<boolean>(true)

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
        setLoading(false)
        }catch(err:any){
            console.log(err)
            setLoading(false)
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
      <Route path="/verifyemail/:token" element={<VerifyEmail loading={loading}/>} />
      <Route path="/" element={<Home loading={loading}/>} />
      <Route path="/confirmverification" element={<ConfirmVerification />} />
      <Route path='/wrongtokenresponse' element={<WrongTokenResponse />} />
      <Route path='/loading' element={<Loading />} />
      </Routes>
    

    
  )
}

export default App
