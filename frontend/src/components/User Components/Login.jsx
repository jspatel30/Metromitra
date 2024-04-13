import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import './css/Login.css'
import { useData } from '../../context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';


export const Login = () => {

    const { register, handleSubmit } = useForm()
    const navigate = useNavigate()
    const { register: otpRegister, handleSubmit: otpHandleSubmit, reset: resetOtp } = useForm();
    const [show, setshow] = useState(false)

    //Context Data  
    const { checkNavBar, updatecheckNavBar } = useData();
    const { ServiceProviderId, updateServiceProviderId } = useData();

    const [isOtpTrue, setisOtpTrue] = useState(false)
    const verifyOTP = (otpFromForm) => {
        const res = localStorage.getItem("res")
        const response = JSON.parse(res);

        console.log("response ", response)
        console.log("response.data.Otp ", response.data.Otp)
        console.log("otpFromForm.otp. ", otpFromForm.otp)
        if (otpFromForm.otp == response.data.Otp) {
            resetOtp()

            if (response.data.data.role == "660d478cb08efd702f23f113") { //User
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
                var token = response.data.token
                localStorage.setItem("token", token)
                localStorage.setItem("checkNavBar", "User")
                // updatecheckNavBar("User")    //Updated The data in Context API
                localStorage.setItem("UserId", response.data.data._id)
                localStorage.setItem("UserName", response.data.data.name)
                localStorage.removeItem(response)
                setTimeout(() => {
                    navigate("/home")           //redirect to User dashboard 
                }, 400);
            }
            else
            {
                //Service Provider
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
                var token = response.data.token
                localStorage.setItem("token", token)
                localStorage.setItem("ServiceProviderId", response.data.data._id)
                localStorage.setItem("ServiceProviderName", response.data.data.name)
                localStorage.setItem("checkNavBar", "ServiceProvider")
                // updatecheckNavBar("ServiceProvider")
                updateServiceProviderId(response.data.data._id)
                setTimeout(() => {
                    navigate("/order")
                }, 500);
            }
        }
        else
        {
            toast.error('Please enter correct OTP..!', {
                position: "top-right",
                autoClose: 750,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored"
              });
              resetOtp()
            //   handleClose()
        }
    }

    const handleShow = () => {
        var backdrops = document.getElementsByClassName("fade modal-backdrop");
        for (var i = 0; i < backdrops.length; i++) {
            backdrops[i].style.display = 'block';
        }
        // Hide all elements with class "fade modal"
        var modals = document.getElementsByClassName("fade modal");
        for (var j = 0; j < modals.length; j++) {
            modals[j].style.display = 'block';
        }
        setshow(true)

    }

    const handleClose = () => {
        document.body.removeAttribute('data-rr-ui-modal-open');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        var backdrops = document.getElementsByClassName("fade modal-backdrop");
        for (var i = 0; i < backdrops.length; i++) {
            backdrops[i].style.display = 'none';
        }

        // Hide all elements with class "fade modal"
        var modals = document.getElementsByClassName("fade modal");
        for (var j = 0; j < modals.length; j++) {
            modals[j].style.display = 'none';
        }
        resetOtp()
        setshow(false)
    };

    const submitHandler = async (data) => {
        try {
            // console.log(data)    
            if (data.role == "User") {
                console.log("method called")
                const res = await axios.post("http://localhost:5000/login/userLogin", data)
                console.log(res.data)
                console.log("status..", res.status)
                if (res.status == 200) {
                    const response = JSON.stringify(res);
                    localStorage.setItem("res", response)
                    handleShow()
                }
            }
            else if (data.role == "ServiceProvider") {
                const res = await axios.post("http://localhost:5000/login/serviceProviderLogin", data)
                console.log("data..", res.data)
                console.log("Status..", res.status)
                if (res.status == 200) {
                    const response = JSON.stringify(res);
                    localStorage.setItem("res", response)
                    handleShow()
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


                                <Modal show={show} onHide={handleClose} backdrop="static">
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            Please Enter OTP sent to your Email:
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form>
                                            <input type="text" placeholder='Enter OTP' {...otpRegister("otp")} style={{ borderRadius: "10px", border: "0", backgroundColor: "#d9d9d9", height: "35px", width: "250px" }} />
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="primary" onClick={otpHandleSubmit(verifyOTP)}>
                                            Verify
                                        </Button>
                                        <Button variant="secondary" onClick={handleClose}>
                                            Close
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                            </form>
                        </div>
                        <Link to='/register' style={{ color: 'black', textDecoration: 'none' }}>New User ? <span style={{ color: 'blue' }}>Click to Register</span></Link>
                    </div>
                </div >
            </div >
        </>
    )
}

