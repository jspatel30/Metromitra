import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/UserOrderPage.css'
import { FaStar } from 'react-icons/fa';
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import ReactPDF from '@react-pdf/renderer';
import DownloadInvoice from '../DownloadInvoice';

export const UserOrderPage = () => {

    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const userId = localStorage.getItem("UserId")
    const { register, handleSubmit } = useForm()
    const [show, setShow] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [Order, setOrder] = useState([])
    const [isLoading, setisLoading] = useState(false)
    const [showUpdateData, setshowUpdateData] = useState()
    const tableRef = useRef(null);
    useEffect(() => {
        getOrder();
    }, []);



    useEffect(() => {
        if (Order.length > 0) {
            const dataTable = window.$(tableRef.current).DataTable();
            return () => {
                // Destroy the DataTable instance when component unmounts
                dataTable.destroy();
            };
        }
    }, [Order]);

    const getOrder = async () => {
        setisLoading(true)
        const res = await axios.get("http://localhost:5000/order/getOrderByUserIdHistory/" + userId);
        const orders = res.data.data;
        console.log("res.data.data.. ",res.data.data)
        console.log("orders............", orders)
        // Fetch service provider details for each order
        const ordersWithServiceProvider = await Promise.all(
            orders.map(async (order) => {
                const serviceProviderId = order.Service.ServiceProvider;
                const totalPrice = await getOrderListByOrderId(order._id)
                // console.log("serviceProviderID... ", serviceProviderId)
                const serviceProviderRes = await getServiceProviderById(serviceProviderId);
                // console.log("serviceProviderRes... ", serviceProviderRes)
                const serviceProviderData = serviceProviderRes.data.data.name;
                // console.log("serviceProviderData... ", serviceProviderData)
                return { ...order, serviceProvider: serviceProviderData ,totalPrice};
            })
        );
        setOrder(ordersWithServiceProvider);
        console.log("Full data.. ", ordersWithServiceProvider)
        setisLoading(false)
    };

    const getOrderListByOrderId = async(orderId) =>{
        const res = await axios.get("http://localhost:5000/orderList/getOrderListByOrderId/"+orderId)
        console.log("orderList - ",res.data.orderList)
        const orderList = res.data.orderList;
        const totalPrice = orderList.reduce((total, order) => {
            const price = order.Price === "" ? 0 : parseInt(order.Price);
            return total + price;
        }, 0);
        return totalPrice;
    }


    const addUserReview = async (data) => {
        const user = await axios.get("http://localhost:5000/getuser/getUserById/" + userId)
        console.log("user.data.data.name...", user.data.user.name)
        const mailData = {
            name: user.data.user.name,
            mail: user.data.user.email,
            message: "Thank you for sharing your valuable review and ratings with us. Your feedback is essential in helping us improve our service and enhance the experience for all our users.<br><br>Your review has been successfully submitted. We truly appreciate your contribution to METROMITRA's community.<br><br>Thank you for choosing METROMITRA. We look forward to serving you again in the future.<br><br>Best regards,<br>METROMITRA"
        }
        const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

        const res = await axios.put(`http://localhost:5000/order/updateOrderById/${orderIdForReview}`, data);
        console.log("Add Review.. ", res.data)
        getOrder()
        handleClose()
    }

    const getServiceProviderById = async (ServiceProviderId) => {
        return await axios.get("http://localhost:5000/serviceprovider/getServiceProviderById/" + ServiceProviderId);
    };

    const cancelOrder = async (id) => {
        const user = await axios.get("http://localhost:5000/getuser/getUserById/" + userId)
        console.log("user.data.data.name...", user.data.user.name)
        const mailData = {
            name: user.data.user.name,
            mail: user.data.user.email,
            message: "We regret to inform you that your service request has been cancelled at your request. We understand that circumstances may change, and we appreciate your communication.<br><br>Thank you for considering METROMITRA for your service needs. If you require assistance or have any further inquiries, please feel free to contact us.<br><br>Best regards,<br>METROMITRA"
        }
        const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

        await axios.put(`http://localhost:5000/order/updateOrderById/${id}`, { Status: 'Cancelled' });
        getOrder()
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
        setRating(null); // Reset rating to null
        setShow(false)
    };

    const [orderIdForReview, setorderIdForReview] = useState(null)
    const handleShow = (id) => {
        setorderIdForReview(id)
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

    const showdetail = async (id) => {

        var backdrops = document.getElementsByClassName("fade modal-backdrop");
        for (var i = 0; i < backdrops.length; i++) {
            backdrops[i].style.display = 'block';
        }

        // Hide all elements with class "fade modal"
        var modals = document.getElementsByClassName("fade modal");
        for (var j = 0; j < modals.length; j++) {
            modals[j].style.display = 'block';
        }

        const res = await axios.get("http://localhost:5000/order/getOrderById/" + id);
        console.log(res.data.data)
        setshowUpdateData(res.data.data)
        setShowDetailModal(true)
    }

    const handleCloseDetailModal = () => {

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
        setShowDetailModal(false)
    };


    return (
        <>
            <div className='UserOrder_MainContainer'>
                {isLoading == true ?
                    <div className='loader_container'>
                        <div class="loader"></div>
                    </div>
                    : ""}

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ minHeight: '100vh', overflow: "hidden", width: "80%" }}>
                        <table ref={tableRef} id="example" className="table table-striped table-bordered" style={{ width: '100%' }} >
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Service Provider Name</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                    <th>Service Name</th>
                                    <th>Action</th>
                                    <th>Show Detail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Order && Order.map((o, index) => 
                                    (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{o.serviceProvider}</td>
                                            {/* <td>{o.Service.Fees}</td> */}
                                            <td>{parseInt(o.Service.Fees) + o.totalPrice}</td>
                                            <td>{new Date(o.Date).toLocaleDateString('en-GB')}</td>
                                            <td>{o.Service.ServiceName}</td>
                                            <td style={{ minWidth: "100px" }}>
                                                {o.Status.toLowerCase() !== "cancelled" && (

                                                    <button
                                                        className={
                                                            o.Status === 'Complete' ? 'btn btn-success' :
                                                                o.Status === 'Completed' ? 'btn btn-success' :
                                                                    o.Status === 'Rejected' ? 'btn btn-danger' :
                                                                        o.Status === 'Pending' ? 'btn btn-primary' :
                                                                            o.Status === 'Cancelled' ? 'btn btn-danger' : 'btn btn-primary'
                                                        }
                                                        style={{ width: '100px', borderRadius: "10px", }}
                                                        disabled={o.Status !== 'Completed'}
                                                    // onClick={()=>{invoice(o._id)}}
                                                    >
                                                        {o.Status === 'Completed' ? <DownloadInvoice orderId={o._id} /> :o.Status === 'Complete'? "Accepted": o.Status}
                                                    </button>
                                                )}
                                                &nbsp;
                                                {
                                                    o.Status.toLowerCase() !== "rejected" && o.Status.toLowerCase() !== "completed" && (
                                                        //Cancel Button
                                                        <button className='btn btn-danger'
                                                            style={{ width: '100px', borderRadius: "10px", }}
                                                            disabled={o.Status.toLowerCase() === "cancelled"}
                                                            onClick={() => cancelOrder(o._id)}
                                                        >
                                                            {o.Status.toLowerCase() === "cancelled" ? "Cancelled" : "Cancel"}
                                                        </button>
                                                    )}

                                                {
                                                    o.Status.toLowerCase() === "completed" && !o.UserReview && (
                                                        <button
                                                            className='btn btn-info'
                                                            style={{ width: '100px', borderRadius: "10px", }}
                                                            onClick={() => handleShow(o._id)}
                                                        >Review</button>
                                                    )
                                                }

                                                <Modal show={show} onHide={handleClose} backdrop="static">
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>
                                                            Give your Valuable Review of Service Provider:
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <form className="UserReview-form">
                                                            <label>Review</label>
                                                            <textarea className="UserReview-textarea" {...register("UserReview")} placeholder='Write your Review..'></textarea>
                                                            <label>Rating: </label>
                                                            <div className="UserReview-rating-container">
                                                                {[...Array(5)].map((_, index) => {
                                                                    const ratingValue = index + 1;
                                                                    return (
                                                                        <FaStar
                                                                            key={index}
                                                                            className="UserReview-star"
                                                                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                                                            size={30}
                                                                            onMouseEnter={() => setHover(ratingValue)}
                                                                            onMouseLeave={() => setHover(null)}
                                                                            onClick={
                                                                                () => {
                                                                                    setRating(ratingValue)
                                                                                    register("Stars", { value: ratingValue });
                                                                                }
                                                                            }
                                                                        />
                                                                    );
                                                                })}
                                                            </div>
                                                            {rating !== null && <p className="UserReview-rating-text">You rated {rating} out of 5 stars.</p>}
                                                        </form>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleClose}>
                                                            Close
                                                        </Button>
                                                        <Button variant="success" onClick={handleSubmit(addUserReview)}>Submit</Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            </td>
                                            <td>
                                                <Button variant='primary' onClick={() => { showdetail(o._id) }}>Show Detail</Button>
                                            </td>
                                            <Modal show={showDetailModal} onHide={handleCloseDetailModal} backdrop="static">
                                                <Modal.Header closeButton>
                                                    <Modal.Title>
                                                        Details of Service:
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {
                                                        showUpdateData &&
                                                        <div className="modal-details">
                                                            {
                                                                showUpdateData.UserReview && (
                                                                    <div className="detail-row">
                                                                        <span className="detail-label">Your Review:</span>
                                                                        <span className="detail-value">{showUpdateData.UserReview}</span>
                                                                    </div>
                                                                )}

                                                            {
                                                                showUpdateData.Stars > 0 && (
                                                                    <div className="detail-row">
                                                                        <span className="detail-label">Rating:</span>
                                                                        <span className="detail-value">
                                                                            {Array.from({ length: showUpdateData.Stars }, (_, index) => (
                                                                                <FaStar key={index} color="#ffc107" size={15} />
                                                                            ))}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            <div className="detail-row">
                                                                <span className="detail-label">Service Name:</span>
                                                                <span className="detail-value">{showUpdateData.Service.ServiceName}</span>
                                                            </div>

                                                            {
                                                                showUpdateData.Work &&
                                                                <div className="detail-row">
                                                                    <span className="detail-label">Specific Work:</span>
                                                                    <span className="detail-value">{showUpdateData.Work}</span>
                                                                </div>
                                                            }

                                                            <div className="detail-row">
                                                                <span className="detail-label">Address:</span>
                                                                <span className="detail-value">{showUpdateData.Address}</span>
                                                            </div>
                                                            <div className="detail-row">
                                                                <span className="detail-label">Date:</span>
                                                                <span className="detail-value">{new Date(showUpdateData.Date).toLocaleDateString('en-GB')}</span>
                                                            </div>
                                                            {
                                                                showUpdateData.Time && (
                                                                    <div className="detail-row">
                                                                        <span className="detail-label">Time:</span>
                                                                        <span className="detail-value">{showUpdateData.Time}</span>
                                                                    </div>
                                                                )}
                                                            {
                                                                showUpdateData.ServiceProviderReview &&
                                                                <div className="detail-row">
                                                                    <span className="detail-label">Service Provider Review:</span>
                                                                    <span className="detail-value">{showUpdateData.ServiceProviderReview}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleClose}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}