import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/users';
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign:'center' as 'center'
};

const DesignedButton=styled(Button)({
    marginTop:'20px',
    marginLeft:'auto',
    marginRight:'auto',
})

const Header = () => {
    const navigate=useNavigate()
    const auth=useAuth()
    const logoutHandler=()=>{
        auth.setUser(null)
        localStorage.removeItem('token')
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const emailHandler=async()=>{
        try{
        const res=await axios.post('http://localhost:3000/api/v1/users/resendemailverification',{email:auth.user?.user_email})
        handleClose()
        toast.success(`Email sent successfully`, {
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

    return (
        <>
        <div className="h-[120px] w-[100vw] bg-[#318CE7] text-white">
        <div className="flex px-[20px] justify-between pt-[20px] sssm:pt-[35px]">
        <div className="text-[35px]">
            <h1>Bus ticket booking</h1>
        </div>
        <div className="flex flex-row items-center text-[18px] hidden ssm:flex">
            {auth.user && !auth.user?.is_verified && <div className="pr-[15px] cursor-pointer hover:underline" onClick={()=>{handleOpen()}}>Verify Email</div>}
            {auth.user==null ? <div className="cursor-pointer hover:underline" onClick={()=>{navigate('/login')}}>Login</div>:<div className="cursor-pointer hover:underline" onClick={logoutHandler}>Log out</div>}
        </div>
        <div className="flex flex-row items-center text-[18px] block ssm:hidden cursor-pointer">
            <DensitySmallIcon />
        </div>
        </div>
        </div>
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Email not verified
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Please verify your email to book tickets.
            </Typography>
            <DesignedButton onClick={emailHandler}>Resend email</DesignedButton>
          </Box>
        </Fade>
      </Modal>
      <ToastContainer
                position="bottom-left"
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

export default Header