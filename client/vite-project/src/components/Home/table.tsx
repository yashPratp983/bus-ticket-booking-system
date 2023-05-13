import { useEffect, useState } from "react"
import axios from "axios"
import { useSchedule } from "../../contexts/scheduleContext"
import { useAuth } from "../../contexts/users"  
import StripeCheckout from "react-stripe-checkout"
import Overlay from "./modal"

const Table=()=>{
    const schedule=useSchedule()
    const auth=useAuth()
    const [time,setTime]=useState<any>('')
    const [open,setOpen]=useState(false)
    const [selectedItem,setSelectedItem]=useState<{starting_address:string,
    destination_address:string,
    leaving_time:string,
    journey_id:number,
    bus_name:string}|null>(null)
    useEffect(()=>{
    const getSchedule=async()=>{
        try{
        const res=await axios.get("http://localhost:3000/api/v1/schedule")
        schedule?.setSchedule(res.data.data.schedule)
        console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }
    const getTime=async()=>{
        try{
            const res=await axios.get("https://worldtimeapi.org/api/timezone/asia/kolkata")
            const date=new Date(res.data.datetime)
            const timeStr = date.toLocaleTimeString('en-US', {hour12: false});
            setTime(timeStr)
            console.log(timeStr)
        }catch(err){
            console.log(err)
        }

    }
    getSchedule()
    getTime()
    },[])

    return(
        <>
        <div>
            <h1 className="my-[40px] text-center text-[30px]">Bus1</h1>
                <div className="grid grid-cols-6 bg-[#318CE7] text-white h-[45px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">From</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">To</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Time</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Price</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-white h-[100%] flex items-center justify-center">Booking Status</h2>
                </div>
                {schedule?.schedule?.map((item:any)=>{
                    if(item.bus_name=='bus1'){
                    return(
                        <div className="grid grid-cols-6 bg-white  h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.starting_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.destination_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.leaving_time}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">20</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.remaining_seats}</h2>
                    {auth.user==null && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Not authorize</h2>}
                    {auth.user!=null && (time>'10:00;00' && time<item.leaving_time) && item.remaining_seats>0 && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center"><button className="bg-[#318CE7] text-white rounded-md px-[10px] py-[5px] hover:bg-[#00CED1]" onClick={()=>{setOpen(true);setSelectedItem(item)}}>Book</button></h2>}
                    {auth.user!=null && (time<='10:00;00' || time>=item.leaving_time || item.remaining_seats<=0) && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Not available</h2>}
                    {/* <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center"><button className="bg-[#318CE7] text-white rounded-md px-[10px] py-[5px]" onClick={()=>{setOpen(true);setSelectedItem(item)}}>Book</button></h2> */}
                </div>
                    )
                }
                })}
        </div>

        <div>
            <h1 className="my-[40px] text-center text-[30px]">Bus2</h1>
                <div className="grid grid-cols-6 bg-[#318CE7] text-white h-[45px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">From</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">To</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Time</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Price</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center">Seats</h2>
                    <h2 className="text-center  border-x-white h-[100%] flex items-center justify-center">Booking Status</h2>
                </div>
                {schedule?.schedule?.map((item:any)=>{
                    if(item.bus_name=='bus2'){
                    return(
                        <div className="grid grid-cols-6 bg-white  h-[40px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.starting_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.destination_address}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.leaving_time}</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">20</h2>
                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center">{item.remaining_seats}</h2>
                    {auth.user==null && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Not authorize</h2>}
                    {auth.user!=null && (time>'10:00;00' && time<item.leaving_time) && item.remaining_seats>0 && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center"><button className="bg-[#318CE7] text-white rounded-md px-[10px] py-[5px] hover:bg-[#00CED1]" onClick={()=>{setOpen(true);setSelectedItem(item)}}>Book</button></h2>}
                    {auth.user!=null && (time<='10:00;00' || time>=item.leaving_time || item.remaining_seats<=0)  && <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center">Not available</h2>}
                    {/* <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center"><button className="bg-[#318CE7] text-white rounded-md px-[10px] py-[5px]" onClick={()=>{setOpen(true);setSelectedItem(item)}}>Book</button></h2> */}
                </div>
                    )
                }
                })}
        </div>
        {/* <StripeCheckout /> */}
        <Overlay open={open} setOpen={setOpen} item={selectedItem}/>
        </>
    )
}

export default Table