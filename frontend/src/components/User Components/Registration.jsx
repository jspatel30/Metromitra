import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import './css/Registration.css'
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Registration = () => {

  const { register, handleSubmit ,reset} = useForm()
  const { register: otpRegister, handleSubmit: otpHandleSubmit, reset:resetOtp } = useForm();
  const [show, setshow] = useState(false)
  const [RegistrationData, setRegistrationData] = useState()
  const navigate = useNavigate()
  const [randomNumber, setRandomNumber] = useState('');
  
  useEffect(() => {
    generateRandomNumber()
  }, [])

  const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    const newRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    setRandomNumber(newRandomNumber.toString());
  };

  const handleShow = (data) => {
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
    setRegistrationData(data)
    const sendOTP = {
      name: data.name,
      mail: data.email,
      message: "Thank you for choosing Metromitra. Your verification code is: <b>" + randomNumber + "<b>. Please use this code to verify your email address.<br><br>Best regards,<br>Metromitra Team <br><br><b><h1>"+randomNumber+"</h1></b>"
    }
    axios.post("http://localhost:5000/email/sendMail", sendOTP)
    reset()
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
    setshow(false)
  };


  const verifyOTP = (data) => {
    if (randomNumber === data.otp) {
      console.log("OTP Matched")
      toast.success('Registration Done Successfully..!', {
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
      setTimeout(() => {
        SubmitHandler(RegistrationData)
    }, 500);
    }
    else {
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
      handleClose()
    }
  }

  const SubmitHandler = async (data) => {
      if (data.role == '660d478cb08efd702f23f113') {

        const mailData = {
        name: data.name,
        mail: data.email,
        message: "Congratulations on joining Metromitra! 🎉 Enjoy hassle-free services right at your doorstep by logging in with your credentials.<br><br>Thank you for choosing Metromitra! If you need any assistance, we're here to help.<br><br>Best regards,<br>Metromitra Team"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

      const res = await axios.post("http://localhost:5000/login/addUser", data)
      console.log(res.data.data)
      navigate("/login")
    }

    else {
      console.log("data.......................", data)
      const mailData = {
        name: data.name,
        mail: data.email,
        message: "Congratulations on joining Metromitra! 🎉 Start serving customers effortlessly by logging in and adding your services.<br><br>Thank you for choosing Metromitra! If you need assistance, we're here to help.<br><br>Best regards,<br>Metromitra Team"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

      const res = await axios.post("http://localhost:5000/serviceprovider/addServiceProvider", data)
      console.log(res.data.data)
      navigate("/login")
    }
  }


  return (
    <>
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

      <div className='Main-Container'>
        <div className='ImageCon_Registration'>
          <img src='/assets/Login_Background.png' alt='' class="BackgroundImage" />
        </div>
        <div className='Registration-Container'>
          <div className='Registration-Content'>
            <div className="Logo">
              <img src='/assets/Metromitra_Logo.png' alt='' />
            </div>

            <div className="form">
              <form enctype="multipart/form-data" >
                <input type="text" {...register("name")} placeholder="Name" />
                <input type="email" {...register("email")} placeholder="Email" />
                <input type="password" {...register("password")} placeholder="Password" />
                <input type="text" {...register("phone")} placeholder="Contact No" />

                <div className='radio'>
                  <div style={{backgroundColor:"#d9d9d9" ,width:"280px", padding:"5px", borderRadius:"10px", textAlign:"left"}}>

                    <label style={{fontSize:"18px"}}>You Are: </label><br />
                    <div>

                      <input type="radio" value="660d4769b08efd702f23f111" {...register("role")} />{/*Service Provider*/}
                      <label style={{fontSize:"18px"}}>Service Provider</label>
                    </div>
                    <div>

                      <input type="radio" value="660d478cb08efd702f23f113" {...register("role")} />{/* User (Customer) */}
                      <label style={{fontSize:"18px"}}>Customer</label>
                    </div>
                  </div>
                </div>

                {/* <input type="submit" value="Register" /> */}
                <Button onClick={handleSubmit(handleShow)} style={{width:"250px", height:"50px",fontSize:"30px", fontWeight:"bold", backgroundColor:"#0fda9b" , border:"none", borderRadius:"15px"}}>Register</Button>
                <br/>
                <Modal show={show} onHide={handleClose} backdrop="static">
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Please Enter OTP sent to your Email:
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <form>
                      <input type="text" placeholder='Enter OTP' {...otpRegister("otp")} style={{borderRadius:"10px", border:"0", backgroundColor:"#d9d9d9", height:"35px", width:"250px"}} />
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
            <Link to='/login' style={{ color: 'black', textDecoration: 'none' }}><span style={{fontSize:"20px"}}>Existing User ?</span> <span style={{color:"blue", fontSize:"20px"}}>Click to Login</span></Link>
          </div>
        </div>
      </div>
    </>
  )
}

