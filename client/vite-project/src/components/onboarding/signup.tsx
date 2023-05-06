import { useState } from "react";
import React from "react";
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

type FormValues={
    email:string,
    password:string
}


const Login=()=>{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate();

    const formSchema = Yup.object().shape({
        email: Yup.string()
            .required('Email is mandatory')
            .email('Email is invalid'),
        password: Yup.string()
            .required('Password is mandatory')
            .min(6, 'Password must be at least 6 char long'),

    })


    const formOptions = { resolver: yupResolver(formSchema) }
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>(formOptions)

    const emailHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value);
    }

    const passwordHandler=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value);
    }

    const getUser=async()=>{
        try{
            const user=await axios.get('http://localhost:3000/api/v1/users/me',{
            headers:{
                authorisation:`Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(user);
        }catch(err:any){
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

    const signupHandler=async(data:FormValues)=>{
            try{
            setLoading(true)
            const tok = await axios.post('http://localhost:3000/api/v1/users/signup', data);
            console.log(tok)
            localStorage.setItem('token', tok.data.token);
            getUser();
            setLoading(false)
            navigate('/');
            }
            catch (err:any) {
            setLoading(false)
              console.log(err,"here")
              toast.error(`${err.response.data.error}`, {
                position: "bottom-right",
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

    return(
        <>
        <div className="flex flex-row ">
        <div className="lg:w-[70%] h-[100vh] md:w-[50%] xs:hidden md:block">
            <img className="h-[100%] w-[100%]" src="https://static.ewebbuddy.com/2018/11/BusTickets-India.jpg"></img>
        </div>
        <div className="lg:w-[30%] flex items-align-center justify-center pt-[300px] bg-[#FAF9F6] md:w-[50%] xs:w-[100vw] ">
            
            <div className="flex flex-col">
            <h1 className="text-4xl pb-[40px]">Sign up</h1>
            <form onSubmit={handleSubmit(signupHandler)} className="flex flex-col">
                <input value={email} {...register("email")} placeholder="Email" onChange={emailHandler} className="w-[300px] h-[50px] p-[10px] bg-[#F0F0F0] rounded-md text-gray-500 border-[#E8E8E8] border-solid border-[2px] focus:border-[#E8E8E8] focus:border-solid focus:border-[2px]"></input>
                <p className="text-red-600 mb-[30px] ">{errors.email?.message}</p>
                <input value={password} type="password" {...register("password")} placeholder="Password" onChange={passwordHandler} className="w-[300px] text-gray-500 h-[50px] mb-[30x] p-[10px] bg-[#F0F0F0] border-[#E8E8E8] rounded-md border-solid border-[2px] focus:border-[#E8E8E8] focus:border-solid focus:border-[2px]"></input>
                <p className="text-red-600">{errors.password?.message}</p>
                {!loading && <button type="submit" className="w-[300px] h-[50px] mt-[30px] bg-[#00CED1] text-white rounded-md hover:cursor-pointer hover:bg-[#318CE7]">Sign up</button>}
                {loading && <div className="w-[300px] h-[50px] mt-[30px] bg-gray-500 text-white flex rounded-md text-center items-center justify-center ">Loading...</div>}
            </form>
                <div className="flex items-baseline">
                <p className="mt-[20px]">Already registered?&nbsp;</p>
                <p className="text-[#00CED1] cursor-pointer" onClick={()=>{navigate('/lo')}}>Sign In</p>
                </div>
            </div>
        </div>
        
        </div>
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

export default Login;