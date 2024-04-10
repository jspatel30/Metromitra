import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import './css/Login.css'
import { useData } from '../../context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const Login = () => {

    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()

    //Context Data  
    const { checkNavBar, updatecheckNavBar } = useData();
    const { ServiceProviderId, updateServiceProviderId } = useData();

    const submitHandler = async (data) => {
        try {
            if (data.role == "User") {
                const res = await axios.post("http://localhost:5000/login/userLogin", data)
                console.log("method called")
                console.log(res.data)
                console.log("status..", res.status)
                if (res.status == 200) {
                    console.log("Hello")
                    toast.success('Login Successfull..!', {
                        position: "top-right",
                        autoClose: 750,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored"
                    });
                    console.log("Bye..")
                }
                var token = res.data.token
                localStorage.setItem("token", token)
                localStorage.setItem("checkNavBar", "User")
                // updatecheckNavBar("User")    //Updated The data in Context API
                localStorage.setItem("UserId", res.data.data._id)
                localStorage.setItem("UserName", res.data.data.name)
                setTimeout(() => {
                    navigate("/home")           //redirect to User dashboard
                }, 500);

            }

            else if (data.role == "ServiceProvider") {
                const res = await axios.post("http://localhost:5000/login/serviceProviderLogin", data)
                console.log("data..", res.data)
                console.log("Status..", res.status)
                if (res.status == 200) {
                    toast.success('Login Successfull..!', {
                        position: "top-right",
                        autoClose: 750,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    var token = res.data.token
                    localStorage.setItem("token", token)
                    localStorage.setItem("ServiceProviderId", res.data.data._id)
                    localStorage.setItem("ServiceProviderName", res.data.data.name)
                    localStorage.setItem("checkNavBar", "ServiceProvider")
                    // updatecheckNavBar("ServiceProvider")
                    updateServiceProviderId(res.data.data._id)
                    setTimeout(() => {
                        navigate("/order")
                    }, 500);

                }
            }
        }
        catch (error) {
            if (error.response.status !== 200) {
                toast.error('Username Or Password is Incorrect.!', {
                    position: "top-right",
                    autoClose: 750,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
            console.log("error", error)
        }
    }

    return (
        <>
            <div className='Main-Container'>
                <div className='ImageCon_Login'>
                    <img src='/assets/Login_Background.png' alt='' />
                </div>
                <div className='Login-Container'>
                    <div className='Login-Content'>
                        <div className="LoginLogo">
                            <img src='/assets/Metromitra_Logo.png' alt='' />
                        </div>
                        <div className="form">

                            <ToastContainer
                                position="top-right"
                                autoClose={600}
                                hideProgressBar
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="colored"
                            />

                            <form onSubmit={handleSubmit(submitHandler)}>
                                
                                <input type="text" {...register("email")} placeholder="Email" />
                                <input type="password" {...register("password")} placeholder="Password" />

                                <div className='Login_Radio'>
                                    <label>You are : </label>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input type="radio" value="ServiceProvider" {...register("role")} />
                                        <label>Service Provider</label>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <input type="radio" value="User" {...register("role")} />
                                        <label>User</label>
                                    </div>
                                </div>


                                <input type="submit" value="Login" />
                            </form>
                        </div>
                        <Link to='/register' style={{ color: 'black', textDecoration: 'none' }}>New User ? <span style={{ color: 'blue' }}>Click to Register</span></Link>
                    </div>
                </div >
            </div >
        </>
    )
}

