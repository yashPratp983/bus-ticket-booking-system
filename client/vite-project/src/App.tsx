import Login from './components/onboarding/login'
import Signup from './components/onboarding/signup'
import{ Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
    </Routes>
    </>
  )
}

export default App
