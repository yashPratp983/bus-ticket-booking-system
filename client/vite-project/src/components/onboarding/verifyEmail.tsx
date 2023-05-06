import axios from "axios"
import { useEffect,useState } from "react"
import { useParams } from "react-router-dom"
import Loading from "../loading.css"
import { useNavigate } from "react-router-dom"
const VerifyEmail = () => {
    const navigate=useNavigate()
    const {token}=useParams<{token:string}>();
    useEffect(()=>{
    const verifyEmail=async()=>{
        try{
            
            const res=await axios.get(`http://localhost:3000/api/v1/users/verifyemail/${token}`)
        
            localStorage.setItem('token',res.data.token)
            navigate('/confirmverification')
        }catch(err:any){
        
            navigate('/wrongtokenresponse')
        }
    }
    verifyEmail()
    },[])
return(
        <div className="spin">

        </div>    
)
}

export default VerifyEmail