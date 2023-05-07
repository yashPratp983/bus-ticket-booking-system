import { useEffect } from "react"
import axios from "axios"
import { useSchedule1,useSchedule2 } from "../../contexts/scheduleContext"

const Table=()=>{
    const schedule1=useSchedule1()
    const schedule2=useSchedule2()
    useEffect(()=>{
    const getSchedule=async()=>{
        try{
        const res=await axios.get("http://localhost:3000/api/v1/schedule")
        schedule1?.setSchedule1(res.data.data.schedule1)
        schedule2?.setSchedule2(res.data.data.schedule2)
        console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }
    getSchedule()
    },[])

    return(
        <>
        <div>
            <h1 className="my-[40px] text-center text-[30px]">Bus1</h1>
                <div className="grid grid-cols-6 bg-[#318CE7] text-white h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">From</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">To</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Time</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Price</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-white h-[100%] flex items-center justify-center">Booking Status</h2>
                </div>
                {schedule1?.schedule1?.map((item:any)=>{
                    return(
                        <div className="grid grid-cols-6 bg-white  h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.starting_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.destination_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.leaving_time}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">20</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Booking Status</h2>
            
                
                </div>
                    )
                })}
        </div>

        <div>
            <h1 className="my-[40px] text-center text-[30px]">Bus2</h1>
                <div className="grid grid-cols-6 bg-[#318CE7] text-white h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">From</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">To</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Time</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Price</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-white h-[100%] flex items-center justify-center">Booking Status</h2>
                </div>
                {schedule2?.schedule2?.map((item:any)=>{
                    return(
                        <div className="grid grid-cols-6 bg-white  h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.starting_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.destination_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.leaving_time}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">20</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Booking Status</h2>
            
                
                </div>
                    )
                })}
        </div>

        </>
    )
}

export default Table