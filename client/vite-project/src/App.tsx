import Login from './components/onboarding/login'
import Signup from './components/onboarding/signup'
import{ Routes, Route } from 'react-router-dom'
import ForgotPassword from './components/onboarding/forgotpassword'
import ResetPassword from './components/onboarding/resetPassword'
import VerifyEmail from './components/onboarding/verifyEmail'
import Home from './components/Home/homs'
import ConfirmVerification from './components/onboarding/confirmVerification'
import WrongTokenResponse from './components/onboarding/wrongTokenResponse'
import { useContext } from 'react'

function App() {
  
  return (
    <>
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
    </>
  )
}

export default App
