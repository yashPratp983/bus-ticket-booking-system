import axios from "axios"
import { useEffect,useState } from "react"
import html2pdf from 'html2pdf.js';


const TicketTable=()=>{
    const [tickets,setTickets]=useState([])
    const [loading,setLoading]=useState<string[]>([])
    useEffect(()=>{
        const getTickets=async()=>{
            const token=localStorage.getItem("token")
            const res=await axios.get("https://localhost:2020/api/v1/schedule/tickets",{
                headers:{
                        authorisation:`Bearer ${token}`
                    }
            })
            console.log(res.data)
            setTickets(res.data.data.tickets)
        }
        getTickets()

    },[])

    const downloadHandler=async (journey_id:number,transaction_id:string)=>{
        let l:string[]=loading;
        l.push(transaction_id)
        try{
        const token=localStorage.getItem("token")
        let html=await axios.get(`https://localhost:2020/api/v1/schedule/tickets/${journey_id}/${transaction_id}`,{
            headers:{
                authorisation:`Bearer ${token}`
            }
        })
        
        // convertHtmlToPdf(html)
        const filename = 'ticket.html';
        const url = URL.createObjectURL(new Blob([html.data.data.html], {type: 'text/html'}));
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        l=l.filter((item)=>item!==transaction_id)
        setLoading(l)
    }catch(err:any){
        let l=loading;
        l=l.filter((item)=>item!==transaction_id)
        setLoading(l)
        console.log(err)
    }
    }   

    function convertHtmlToPdf(html:any) {
        const element = document.createElement('div');
        element.innerHTML = html;
        html2pdf().from(element).output('blob').then((pdfBlob:any) => {
          const filename = 'ticket.pdf';
          const url = URL.createObjectURL(pdfBlob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);
        });
      }

    return(
        <>
            <div className="mt-[30px] text-center text-[40px]">
                Tickets
            </div>
            <div className="mt-[30px]">
            <div className="grid grid-cols-8 bg-[#318CE7] text-white h-[45px] items-center mx-[10px] rounded-md">
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center col-span-1">Date</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center col-span-4">Details</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center col-span-1">Bus</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center col-span-1">Time</h2>
                    <h2 className="text-center border-r-4 border-x-white h-[100%] flex items-center justify-center col-span-1"></h2>
                </div>
            </div>
            {
                tickets.map((item:any)=>{
                    return(
                            <div className="grid grid-cols-8 bg-white  h-[40px] items-center mx-[10px] rounded-md " key={item.transaction_id}>
                                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center col-span-1">{item.booking_date}</h2>
                                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center col-span-4">{`From ${item.starting_address} to ${item.destination_address}`}</h2>
                                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center col-span-1">{item.bus_name}</h2>
                                    <h2 className="text-center border-r-4 border-x-[#318CE7] h-[100%] flex items-center justify-center col-span-1">{item.leaving_time}</h2>
                                    <h2 className="text-center  border-x-[#318CE7] h-[100%] flex items-center justify-center col-span-1">{!loading.includes(item.transaction_id)?<button className="bg-[#318CE7] text-white rounded-md px-[10px] py-[5px] hover:bg-[#00CED1]" onClick={()=>{downloadHandler(item.journey_id,item.transaction_id)}}>Download</button>:<div className="bg-gray-500 text-white w-[100px] h-[30px] rounded-md flex justify-center items-center">loading</div>}</h2>
                            </div>
                    )
                })
            }
        </>
    )
}

export default TicketTable