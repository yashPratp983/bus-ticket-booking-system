import { Box,Typography,Button } from "@mui/material"
import { useState } from "react"
import Modal from '@mui/material/Modal';
import StripeCheckout from "react-stripe-checkout"
import { useAuth } from "../../contexts/users";
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import html2pdf from 'html2pdf.js';

type overlayProps={
    open:boolean,
    setOpen:React.Dispatch<React.SetStateAction<boolean>>,
    item:{
    starting_address:string,
    destination_address:string,
    leaving_time:string,
    journey_id:number,
    bus_name:string}|null
}


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const styleFlex={
    display:'flex',
    justifyContent:'spaceBetween',
    alignItems:'center'
  }

const Overlay=(props:overlayProps)=>{
    const auth=useAuth()
    const [num,setNum]=useState(1)

    const handleClose=()=>{
        props.setOpen(false)
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


      

    const handleToken=async(token:any)=>{
        const tok=localStorage.getItem('token')
        try{
            const res=await axios.post("https://localhost:2020/api/v1/booking/payment",
            {
                    token,
                    bus_name:props.item?.bus_name,
                    journey_id:props.item?.journey_id,
                    starting_address:props.item?.starting_address,
                    destination_address:props.item?.destination_address,
                    leaving_time:props.item?.leaving_time,
                    number_of_seats:num,
                    user:auth?.user
            },
            {
                headers:{
                    authorisation:`Bearer ${tok}`
                }
            }
            )
            const html=res.data.html
            const filename = 'ticket.html';
            const url = URL.createObjectURL(new Blob([html], {type: 'text/html'}));
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            
            console.log(res)

            toast.success(`Booking Successful`, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            

        }catch(err:any){
            console.log(err)
            toast.error(`${err.response.data.error}`, {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

        }
    }

    const quantityHandler=(e:any)=>{
        if(e.target.value==='1'){
            setNum(1)
        }else if(e.target.value==='2'){
            setNum(2)
        }
    }

    return(
    <>
    <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
            Bus1
            </Typography>
            <Box sx={styleFlex}>
            <Typography sx={{ mt: 2,width:'50%',font:'bold' }}>
                Starting Adress:
            </Typography>
            <Typography sx={{mt:2,width:'50%'}}>
                {props.item?.starting_address}
            </Typography>
            </Box>
            <Box sx={styleFlex}>
            <Typography sx={{mt:2,width:'50%'}}>
                Destination Address:
            </Typography>
            <Typography sx={{mt:2,width:'50%'}}>
                {props.item?.destination_address}
            </Typography>
            </Box>
            <Box sx={styleFlex}>
            <Typography sx={{mt:2,width:'50%'}}>
                Leaving Time:
            </Typography>
            <Typography sx={{mt:2,width:'50%'}}>
                {props.item?.leaving_time}
            </Typography>
            </Box>
            <Box sx={{mb:'20px',display:'flex',justifyContent:'spaceBetween',alignItems:'center'}}>
            <Typography sx={{mt:2,width:'50%'}}>
                Total tickets:
            </Typography>
            <Typography sx={{mt:2,width:'50%'}}>
                <select  style={{width:'100px',border:'none',outline:'solid 2px #318CE7'}} onChange={quantityHandler}> 
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                </select>
            </Typography>
            </Box>
            <StripeCheckout 
                // className='center'
                amount={num*20}
                stripeKey="pk_test_51N5rooSFRPrc5koGlXTmFTZodji11LyLzMunfBinxYPaVRYCaD0Ni6OwgCTrXIkjSjBegbQsI4Fb1kJonZamU5Ct00aBp8xmRt"
                token={handleToken}
                billingAddress
                shippingAddress
            /> 
        </Box>
    </Modal>
    <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
    </>
    )
}

export default Overlay