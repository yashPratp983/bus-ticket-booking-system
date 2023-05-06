import { useNavigate } from "react-router-dom"
const ConfirmVerification = () => {
    const navigate=useNavigate();
    return (
        <div className="flex flex-col items-center pt-[300px]" >
            <h1 className="text-[30px] text-center">Email Verified!!!</h1>
            <p className="text-[25px] text-center pt-[30px]">Congratulations,your email has been verified.</p>
            <button  className="w-[200px] h-[50px] mt-[30px] bg-[#00CED1] text-white rounded-md hover:cursor-pointer hover:bg-[#318CE7]" onClick={()=>{navigate('/')}}>Home</button>
        </div>
    ) 
}

export default ConfirmVerification