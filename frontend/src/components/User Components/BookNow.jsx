import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/BookNow.css'
import { useForm } from 'react-hook-form'
import { useData } from '../../context';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';


export const BookNow = () => {
    const [show, setShow] = useState(false);

    //Function for displaying stars
    function renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.3;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} color="#ffc107" size={15} />);
        }
        if (halfStar) {
            stars.push(<FaStarHalfAlt key="half" color="#ffc107" size={15} />);
        }
        // Fill the remaining stars with empty stars if needed
        const totalStars = 5;
        const remainingStars = totalStars - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} color="#ccc" size={15} />);
        }

        return stars;
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
        setShow(false)
    };
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
        setShow(true)
    }

    const userId = localStorage.getItem("UserId")

    const { BookNowData } = useData();
    console.log("BookNow Data.... ", BookNowData)

    const [Service, setService] = useState(BookNowData)

    const { register, handleSubmit ,reset} = useForm()

    const navigate = useNavigate()


    const SubmitHandler = async (data) => {
        try {
            console.log("111")
            const user = await axios.get("http://localhost:5000/getuser/getUserById/" + userId)
            console.log("user.data.data.name...", user.data.user.name)
            const mailDataForUser = {
                name: user.data.user.name,
                mail: user.data.user.email,
                message: "We are pleased to inform you that your service request has been booked successfully. Our dedicated service provider will confirm their arrival shortly.<br><br>Thank you for choosing METROMITRA for your service needs. If you have any questions or require further assistance, please do not hesitate to contact us at this mail.<br><br>Best regards,<br>METROMITRA"
            }
            //for sending mail
            axios.post("http://localhost:5000/email/sendMail", mailDataForUser)

            console.log("data...................", data)
            const res = await axios.post("http://localhost:5000/order/addOrder", data)
            const userAddrUpdate = await axios.put("http://localhost:5000/order/updateOrderById/" + res.data.data._id, { Address: data.Address })

            const mailDataForServiceProvider = {
                name: Service.service.ServiceProvider.name,
                // mail: Service.service.ServiceProvider.email,
                mail: "jayprithvi@gmail.com",
                message: "You have a new service request from a user on METROMITRA. Please log in to your account on our website to view the details of the order and confirm your availability.<br><br>Service Request Details:<br>- User Name: <b>"+user.data.user.name+"</b><br>- Service Name: "+Service.service.ServiceName+"<br>- Address: "+data.Address+"<br><br>Thank you for being a part of METROMITRA. We appreciate your prompt attention to this request.<br><br>Best regards,<br>METROMITRA Team"

            }
            //for sending mail
            axios.post("http://localhost:5000/email/sendMail", mailDataForServiceProvider)
            
            if (res.status == 201 && userAddrUpdate.status == 200) {
                toast.success('Service Booked Successfully..!', {
                    position: "top-right",
                    autoClose: 500,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored"
                });
                console.log("User Address..", userAddrUpdate)
                console.log("Order added... ", res.data.data)
                console.log("Order Id... ", res.data.data._id)
                setTimeout(() => {
                    reset()
                    navigate("/userorder")
                }, 400);
            }
          }
        catch (err) {
            console.log(err)
        }
    }

    const [Order, setOrder] = useState([])
    const getOrderByServiceProviderId = async (id) => {
        const res = await axios.get("http://localhost:5000/order/getOrderByServiceProviderIdForReview/" + id)
        console.log("Orders...", res.data.data)
        setOrder(res.data.data)
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={750}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className='bookNow_Container'>
                <div className='bookNow_box'>
                    <div className='Service_Image'>
                        {/* {
                            Service.map((s) => ( */}
                        <img width="100%" height="100%" src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(Service.service.image.data)))}`} alt="Description" />
                        {/* ))
                        } */}
                    </div>
                    {/* {
                        Service && Service.map((s) => ( */}
                    <>
                        <div>

                            <div className='Service_Content'>
                                <div>
                                    {/* <h3><b>Name:</b> {s.service.ServiceProvider.name}</h3> */}
                                    <h3><b>Name:</b> {Service.service.ServiceProvider.name}</h3>
                                    <h3><b>Area:</b> {Service.service.Area}</h3>
                                    {/* <h3><b>Area:</b> {s.service.Area}</h3> */}
                                </div>

                                <div>
                                    <h3><b>Service:</b> {Service.service.ServiceName}</h3>
                                    <h3><b>Fees:</b> {Service.service.Fees}</h3>
                                    {/* <h3><b>Feedback:</b> </h3>Total Number of Reviews */}
                                    {
                                        Service.averageStar.toFixed(1) > 0.0 &&
                                        <h3><b>Rating:  </b>{Service.averageStar.toFixed(1)} {renderStarRating(Service.averageStar.toFixed(1))}</h3>
                                    }
                                </div>

                            </div>
                            <div style={{ display: "flex", gap: "20px" }}>

                                <div className='bookNow_Button'>
                                    <Button onClick={handleShow}>BOOK</Button>
                                </div>
                                {
                                    Service.averageStar.toFixed(1) > 0.0 &&
                                    <div className='readReviews_Button'>
                                        <Button
                                            onClick={() => { getOrderByServiceProviderId(Service.service.ServiceProvider._id) }}>
                                            Read Reviews
                                        </Button>
                                    </div>
                                }
                            </div>
                        </div>

                    </>
                    {/* ))
                    } */}
                </div>
            </div>
            <div className='modal'>
                <Modal show={show} onHide={handleClose} >
                    <Modal.Header closeButton>
                        <Modal.Title>Book</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* {
                            Service && Service.map((s) => ( */}
                        <>
                            <div className='modal_content'>
                                <label><b>Name:</b> {Service.service.ServiceProvider.name}</label><br />
                                <label><b>Service:</b> {Service.service.ServiceName}</label><br />
                                <label><b>Fees:</b> {Service.service.Fees}</label><br />
                            </div>
                        </>
                        {/* ))
                        } */}

                        <div>
                            <form className="bookNow_Form">
                                <div>
                                    <label>Date: </label>
                                    <input type="date" {...register("Date")} />
                                </div>

                                <div>
                                    <label>Specific(Work): </label>
                                    <input type="text" placeholder="E.g.- Fan repair,etc." {...register("Work")}/>
                                </div>

                                <div>
                                    {/* user address */}
                                    <label>Address: </label>
                                    <textarea {...register("Address")}></textarea>
                                </div>

                                <input type="hidden" {...register("Status")} value="Pending" />
                                <input type="hidden" {...register("User")} value={userId} />
                                <input type="hidden" {...register("Service")} value={BookNowData.service._id} />

                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="success" onClick={handleSubmit(SubmitHandler)}>Book</Button>
                        {/* <Button variant="success" onClick={() => handleSubmit(SubmitHandler, Service)}>Book</Button> */}

                    </Modal.Footer>
                </Modal>
            </div>
            {/* {
                Service && Service.map((s) => ( */}
            {

                Service.averageStar.toFixed(1) > 0.0 &&

                <div class="ServiceProviderReviews">
                    <h3 class="ReviewsTitle">Customer Reviews</h3>
                    <div class="ReviewsWrapper">
                        {Order && Order.map((o, index) => (
                            <div class="Review" key={index}>
                                <div class="StarsContainer">
                                    {Array.from({ length: o.Stars }, (_, index) => (
                                        <span class="StarIcon" key={index}><FaStar color="#ffc107" size={15} /></span>
                                    ))}
                                </div>
                                <p class="UserReview">{o.UserReview}</p>
                            </div>
                        ))}
                    </div>
                </div>
            }
            {/* ))}   */}
        </>
    )
}