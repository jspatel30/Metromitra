import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import './css/History.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';

export const History = () => {

  const { register, handleSubmit } = useForm()
  const tableRef = useRef(null);
  const [Order, setOrder] = useState([])
  const [showReview, setshowReview] = useState(false)
  const [showDetailModal_history, setshowDetailModal_history] = useState(false)
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [orderIdForReview, setorderIdForReview] = useState(null)
  const [showUpdateData_history, setshowUpdateData_history] = useState()

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
    setshowReview(true)
  }

  const addServiceProviderReview = async (data) => {
    console.log(data)
    const res = await axios.put(`http://localhost:5000/order/updateOrderById/${orderIdForReview}`, data);
    console.log("Add Review.. ", res.data)
    handleClose()
    // setshowReview(false)
    getAllOrders()
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
    setshowReview(false)
  };

  const handleCloseDetailModal_history = () => {

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
    setshowDetailModal_history(false)
};

const showdetail_history = async (id) => {

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
  setshowUpdateData_history(res.data.data)
  setshowDetailModal_history(true)
}


  const ServicePeroviderId = localStorage.getItem("ServiceProviderId")
  const getAllOrders = async () => {
    // const res = await axios.get("http://localhost:5000/order/getOrder");
    const res = await axios.get("http://localhost:5000/order/getOrderByServiceProviderId/"+ServicePeroviderId);
    // const orders = res.data.data
    const orders = res.data.data;
    const ordersWithTotalPrice = await Promise.all(
      orders.map(async (order) => {
          const totalPrice = await getOrderListByOrderId(order._id)
          return { ...order ,totalPrice};
      }))

    // setOrder(res.data.data)
    setOrder(ordersWithTotalPrice)
    console.log("Orders..... ", res.data.data)
  }

  useEffect(() => {
    getAllOrders()
  }, [])

  useEffect(() => {
    if (Order.length > 0) {
      const dataTable = window.$(tableRef.current).DataTable();
      return () => {
        // Destroy the DataTable instance when component unmounts
        dataTable.destroy();
      };
    }
  }, [Order]);


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

  return (
    <div className='History_Container'>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

        <div style={{ minHeight: '100vh', overflow: "hidden", width: "80%" }}>
          <table ref={tableRef} id="example" className="table table-striped table-bordered"  >
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Customer Name</th>
                <th>Total</th>
                <th>Service Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Show Detail</th>
              </tr>
            </thead>

            <tbody>
              {
                Order && Order.map((o, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{o.User.name}</td>
                    <td>{parseInt(o.Service.Fees) + o.totalPrice}</td>
                    <td>{o.Service.ServiceName}</td>
                    <td>{new Date(o.Date).toLocaleDateString('en-GB')}</td>
                    <td>
                      <button style={{ width: "100px" , marginRight:"5px" , borderRadius: "10px"}} 
                      className={o.Status == "Completed" ? "btn btn-success" : o.Status == "Pending" ? "btn btn-primary" : "btn btn-danger"} >
                        {o.Status}
                      </button>
                      {
                        o.Status == "Completed" && !o.ServiceProviderReview && (

                          <button
                            className='btn btn-info'
                            style={{ width: '100px', borderRadius: "10px"}}
                            onClick={() => handleShow(o._id)}
                          >Review</button>
                        )
                      }

                      <Modal show={showReview} onHide={handleClose} >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Share your experience with User:
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <form className="UserReview-form">
                            <label>Review</label>
                            <textarea className="UserReview-textarea" {...register("ServiceProviderReview")} placeholder='Write your Review..'></textarea>
                            <input type="hidden" value={o._id} {...register("OrderID")} />
                          </form>

                        </Modal.Body>
                        <Modal.Footer>
                          <Button variant="secondary" onClick={handleClose}>
                            Close
                          </Button>
                          <Button variant="success" onClick={handleSubmit(addServiceProviderReview)}>Submit</Button>
                        </Modal.Footer>
                      </Modal>
                    </td>
                    
                    <td><Button onClick={()=>{showdetail_history(o._id)}}>Show details</Button></td>
                    <Modal show={showDetailModal_history} onHide={handleCloseDetailModal_history} backdrop="static">
                                                <Modal.Header closeButton>
                                                    <Modal.Title>
                                                        Details of Order:
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {
                                                        showUpdateData_history &&

                                                        <div className="modal-details">
                                                            {
                                                                showUpdateData_history.ServiceProviderReview && (
                                                                    <div className="detail-row">
                                                                        <span className="detail-label">Your Review:</span>
                                                                        <span className="detail-value">{showUpdateData_history.ServiceProviderReview}</span>
                                                                    </div>
                                                                )}
                                                            <div className="detail-row">
                                                                <span className="detail-label">User Name:</span>
                                                                <span className="detail-value">{showUpdateData_history.User.name}</span>
                                                            </div>

                                                            <div className="detail-row">
                                                                <span className="detail-label">Service Name:</span>
                                                                <span className="detail-value">{showUpdateData_history.Service.ServiceName}</span>
                                                            </div>
                                                            {
                                                              showUpdateData_history.Work && 
                                                            <div className="detail-row">
                                                                <span className="detail-label">Specific Work:</span>
                                                                <span className="detail-value">{showUpdateData_history.Work}</span>
                                                            </div>
                                                            }
                                                            <div className="detail-row">
                                                                <span className="detail-label">Address:</span>
                                                                <span className="detail-value">{showUpdateData_history.Address}</span>
                                                            </div>
                                                            <div className="detail-row">
                                                                <span className="detail-label">Date:</span>
                                                                <span className="detail-value">{new Date(showUpdateData_history.Date).toLocaleDateString('en-GB')}</span>
                                                            </div>
                                                            {
                                                                showUpdateData_history.UserReview &&
                                                                <div className="detail-row">
                                                                    <span className="detail-label">User Review:</span>
                                                                    <span className="detail-value">{showUpdateData_history.UserReview}</span>
                                                                </div>
                                                            }

                                                            {
                                                                showUpdateData_history.Stars > 0 && (

                                                                    <div className="detail-row">
                                                                        <span className="detail-label">Rating:</span>
                                                                        <span className="detail-value">
                                                                            {Array.from({ length: showUpdateData_history.Stars }, (_, index) => (
                                                                                <FaStar key={index} color="#ffc107" size={15} />
                                                                            ))}
                                                                        </span>
                                                                    </div>
                                                                )}
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
        </div >
      </div>
    </div>
  )
}
