import React, { useEffect, useState, useRef } from 'react'
import './css/Order.css'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';


export const Order = () => {

  const tableRef = useRef(null);
  const [Order, setOrder] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [showReview, setshowReview] = useState(false)
  const [showTime, setshowTime] = useState(false)
  const [showOrderList, setshowOrderList] = useState(false)

  const [OrderByUserId, setOrderByUserId] = useState()
  const [acceptedOrderId, setAcceptedOrderId] = useState(null);
  const [completedOrderId, setCompletedOrderId] = useState(null);
  // const [UserData, setUserData] = useState()
  const { register, handleSubmit } = useForm()
  const { register: orderListRegister, handleSubmit: orderListHandleSubmit, reset: resetOrderList } = useForm();


  const [items, setItems] = useState([{ ItemList: '', Price: '', OrderId: '' }]);

  const handleAddItem = () => {
    setItems([...items, { ItemList: '', Price: '', OrderId: '' }]);
    console.log(items);

  };

  const handleChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    setItems(updatedItems);
    console.log(items);
    console.log(index);
  };



  const getServiceProviderById = async (id) => {
    const res = await axios.get("http://localhost:5000/serviceprovider/getServiceProviderById/" + id)
    console.log(res.data.data)
  }

  const getOrders = async () => {
    try {
      const ServiceProviderId = localStorage.getItem("ServiceProviderId")
      setisLoading(true)
      // const res = await axios.get("http://localhost:5000/order/getOrder");
      const res = await axios.get("http://localhost:5000/order/getOrderByServiceProviderId/" + ServiceProviderId);
      const orders = res.data.data;
      const placedOrders = orders.filter(order => {
        const status = order.Status.toLowerCase();
        console.log("status.. ", status)
        return ((status === "pending" || status === "complete") && status !== "completed")
      });
      console.log("Placed orders:", placedOrders);
      setOrder(placedOrders);
      setisLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }

  useEffect(() => {
    const ServiceProviderId = localStorage.getItem("ServiceProviderId")
    getOrders()
    getServiceProviderById(ServiceProviderId)
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


  //to get the reviews of user
  const getOrderByUserId = async (userId) => {
    const res = await axios.get("http://localhost:5000/order/getOrderByUserId/" + userId)
    return res.data.data;
  }

  const handleShow = (id) => {
    console.log("id--- ", id)
    getOrderByUserId(id).then((data) => {
      console.log("data!!!!!!!!!!!!", data)
      setOrderByUserId(data)
    })

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

  const handleShow_forTime = () => {
    var backdrops = document.getElementsByClassName("fade modal-backdrop");
    for (var i = 0; i < backdrops.length; i++) {
      backdrops[i].style.display = 'block';
    }

    // Hide all elements with class "fade modal"
    var modals = document.getElementsByClassName("fade modal");
    for (var j = 0; j < modals.length; j++) {
      modals[j].style.display = 'block';
    }
    setshowTime(true)
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

    setshowReview(false)
  };

  const handleClose_forTime = () => {
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

    setshowTime(false)
  }

  const handleAccept = async (Time, data) => {
    try {
      console.log("time ", Time)
      console.log(".!.!", data)
      const properDate = data.Date ? new Date(data.Date).toLocaleDateString('en-GB') : '-'
      const id = data._id
      const user = await axios.get("http://localhost:5000/getuser/getUserById/" + data.User._id)
      console.log("user.data.data.name...", data.User.name)
      const mailData = {
        name: data.User.name,
        mail: data.User.email,
        message: "We're delighted to inform you that your service request for an <b>" + data.Service.ServiceName + "</b> has been accepted by our service provider. Your appointment is scheduled for " + Time.Time + " (24 Hour GMT).<br>  Please ensure someone is available at the specified time to facilitate the service. If you have any specific instructions to provide, feel free to let us know.<br><br> Thank you for choosing METROMITRA. We're committed to providing you with excellent service.<br><br><b>Date: " + properDate + "</b><br><b>Time: " + Time.Time + "</b><br><b>Address: " + data.Address + "</b><br><br> Best Regards,<br> METROMITRA"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

      await axios.put(`http://localhost:5000/order/updateOrderById/${id}`, { Status: 'Complete', Time: Time.Time });
      // setAcceptedOrderId(id);
      // setCompletedOrderId(id);
      // window.location.reload()
      getOrders()
      handleClose_forTime()
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleReject = async (data) => {
    try {
      const id = data._id
      const user = await axios.get("http://localhost:5000/getuser/getUserById/" + data.User._id)
      console.log("user.data.data.name...", data.User.name)
      const mailData = {
        name: data.User.name,
        mail: data.User.email,
        message: "We regret to inform you that your service request for " + data.Service.ServiceName + " has been denied by the service provider due to unavailability of slots. We apologize for any inconvenience caused. Rest assured, we will notify you as soon as we have available slots for you.<br><br>Thank you for choosing METROMITRA. We appreciate your understanding and patience.<br><br>Best regards,<br>METROMITRA"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

      await axios.put(`http://localhost:5000/order/updateOrderById/${id}`, { Status: 'Rejected' });
      // window.location.reload()
      getOrders()
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };


  const handleShowOrderList = () => {
    var backdrops = document.getElementsByClassName("fade modal-backdrop");
    for (var i = 0; i < backdrops.length; i++) {
      backdrops[i].style.display = 'block';
    }

    // Hide all elements with class "fade modal"
    var modals = document.getElementsByClassName("fade modal");
    for (var j = 0; j < modals.length; j++) {
      modals[j].style.display = 'block';
    }
    setshowOrderList(true)
  }

  const handleCloseOrderList = () => {
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
    setItems([{ ItemList: '', Price: '', OrderId: '' }])
    setshowOrderList(false)

  }

  const submitOrderList = async (Order) => {
    const formData = items
    console.log("1")
    const dataToSend = { OrderList: formData, orderId: Order._id };
    console.log("dataToSend.. ", dataToSend)
    const res = await axios.post("http://localhost:5000/orderList/addOrderList", dataToSend)
    console.log("Order list..", res)
    const properDate = Order.Date ? new Date(Order.Date).toLocaleDateString('en-GB') : '-'
    const user = await axios.get("http://localhost:5000/getuser/getUserById/" + Order.User._id)
    console.log("user.data.data.name...", Order.User.name)
    const mailData = {
      name: Order.User.name,
      mail: Order.User.email,
      // mail: "jayprithvi@gmail.com",
      message: "Your service request for <b>" + Order.Service.ServiceName + "</b> has been successfully completed by our service provider on " + properDate + ". We would greatly appreciate it if you could take a moment to share your experience on our platform. Your review will assist other users in selecting service providers and help us improve our services in the future.<br><br>Thank you for choosing METROMITRA. <br><br>Best regards,<br>METROMITRA"
    }
    const mail = axios.post("http://localhost:5000/email/sendMail", mailData);

    await axios.put(`http://localhost:5000/order/updateOrderById/${Order._id}`, { Status: 'Completed' });
    console.log("2")

    setCompletedOrderId(Order._id);
    // window.location.reload()
    getOrders()
    handleCloseOrderList()
    setItems([{ ItemList: '', Price: '', OrderId: '' }])
  }


  const handleComplete = async (data) => {
    try {
      console.log(".data....", data)
      const id = data._id
      const properDate = data.Date ? new Date(data.Date).toLocaleDateString('en-GB') : '-'
      const user = await axios.get("http://localhost:5000/getuser/getUserById/" + data.User._id)
      console.log("user.data.data.name...", data.User.name)
      const mailData = {
        name: data.User.name,
        // mail: data.User.email,
        mail: "jayprithvi@gmail.com",
        message: "Your service request for <b>" + data.Service.ServiceName + "</b> has been successfully completed by our service provider on " + properDate + ". We would greatly appreciate it if you could take a moment to share your experience on our platform. Your review will assist other users in selecting service providers and help us improve our services in the future.<br><br>Thank you for choosing METROMITRA. <br><br>Best regards,<br>METROMITRA"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)


      await axios.put(`http://localhost:5000/order/updateOrderById/${id}`, { Status: 'Completed' });
      setCompletedOrderId(id);
      // window.location.reload()
      getOrders()
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const handleCancel = async (data) => {
    try {
      const id = data._id
      const user = await axios.get("http://localhost:5000/getuser/getUserById/" + data.User._id)
      console.log("user.data.data.name...", data.User.name)
      const mailData = {
        name: data.User.name,
        mail: data.User.email,
        message: "We regret to inform you that your service request for <b>" + data.Service.ServiceName + "</b> has been cancelled by the service provider. We apologize for any inconvenience this may have caused.<br><br>If there are any issues with the service provider or if you require assistance, please don't hesitate to inform us. We are committed to resolving any concerns and ensuring your satisfaction.<br><br>Thank you for choosing METROMITRA. We appreciate your understanding and patience.<br><br>Best regards,<br>METROMITRA"
      }
      const mail = axios.post("http://localhost:5000/email/sendMail", mailData)

      await axios.put(`http://localhost:5000/order/updateOrderById/${id}`, { Status: 'Cancelled' });
      window.location.reload()
      // getOrders()

    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };


  return (
    <>
      <div className='Order_Main_Contatiner'>
        <img src='/assets/Orders.png' alt='' className='Order_BackgroundImage' />


        {isLoading == true ?
          <div className='loader_container'>
            <div class="loader"></div>
          </div>
          : ""}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>

          <div style={{ minHeight: '100vh', overflow: "hidden", width: "80%" }}>
            <table ref={tableRef} id="example" className="table table-striped table-bordered" style={{ backgroundColor: "red" }} >
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Customer Name</th>
                  {/* <th>Fees</th> */}
                  <th>Address</th>
                  <th>Service </th>
                  <th>Specific(Work)</th>
                  <th>Date</th>
                  <th style={{maxWidth:"160px"}}>Approve OR Reject</th>
                  <th>Past Reviews of User</th>
                </tr>
              </thead>

              <tbody>
                {
                  Order && Order.map((o, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td style={{ maxWidth: "90px" }}>{o.User ? o.User.name : '-'}</td>
                      {/* <td>{o.Service ? o.Service.Fees : '-'}</td> */}
                      <td style={{ maxWidth: "170px" }}>{o.Address ? o.Address : '-'}</td>
                      <td>{o.Service ? o.Service.ServiceName : '-'}</td>
                      <td style={{ maxWidth: "150px" }}>{o.Work}</td>
                      <td>{o.Date ? new Date(o.Date).toLocaleDateString('en-GB') : '-'}</td>
                      <td style={{ maxWidth: "200px" }}>
                        {o.Status.toLowerCase() === 'pending' && (
                          <div>
                            {/* <button onClick={() => handleAccept(o)} className={o.Status.toLowerCase() === 'pending' ? 'btn btn-primary' : 'btn btn-secondary'}> */}
                            <button style={{ marginRight:"10px" }} onClick={() => handleShow_forTime()} className={o.Status.toLowerCase() === 'pending' ? 'btn btn-primary' : 'btn btn-secondary'}>
                              {acceptedOrderId === o._id ? 'Complete' : 'Accept'}
                            </button>

                            <Modal show={showTime} onHide={handleClose_forTime} backdrop="static">
                              <Modal.Header closeButton>
                                <Modal.Title>
                                  Please Give an Approximate time to User:
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p>Booking Date: {o.Date ? new Date(o.Date).toLocaleDateString('en-GB') : '-'}</p>
                                <form>
                                  <div>
                                    <label htmlFor="time">Select a Time:</label>
                                    <input type="time" id="time" {...register("Time")} />
                                  </div>
                                </form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                  Close
                                </Button>
                                {/* <Button variant="success" onClick={handleSubmit(handleAccept)}>Book</Button> */}
                                <Button variant="success" onClick={handleSubmit(data => handleAccept(data, o))}>Confirm</Button>
                              </Modal.Footer>
                            </Modal>

                            <button onClick={() => handleReject(o)} className='btn btn-danger' >
                              {/* {o.Status.toLowerCase() === 'pending' ? 'btn btn-danger' : 'btn btn-secondary'}> */}
                              {o.Status.toLowerCase() === 'pending' ? 'Reject' : 'Cancel'}
                            </button>
                          </div>
                        )}
                        {o.Status.toLowerCase() === 'complete' && (
                          <div>
                            <button onClick={() => { handleShowOrderList() }} className='btn btn-primary'>Complete</button>


                            <Modal show={showOrderList} onHide={handleCloseOrderList} backdrop="static" >
                              <Modal.Header closeButton>
                                <Modal.Title>
                                  Add Items you worked on:
                                </Modal.Title>
                              </Modal.Header>
                              <Modal.Body>

                                <div className="form-container">
                                  <form>
                                    {items.map((item, index) => (
                                      <div className="form-item" key={index}>
                                        <div className="input-group">
                                          <label className="label">Item:</label>
                                          <input
                                            className="input-field"
                                            type="text" onKeyUp={(e) => handleChange(index, 'ItemList', e.target.value)} />
                                        </div>
                                        <div className="input-group">
                                          <label className="label">Price:</label>
                                          <input
                                            className="input-field"
                                            type="text"

                                            onKeyUp={(e) => handleChange(index, 'Price', e.target.value)}

                                          />
                                        </div>
                                        {/* <input className="hidden-input" type="hidden" {...orderListRegister("OrderId")} value={o.OrderId} /> */}
                                      </div>
                                    ))}
                                  </form>
                                  <button className="add-button" type="button" onClick={handleAddItem}>+</button>
                                </div>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseOrderList}>
                                  Close
                                </Button>
                                <Button variant="success" onClick={() => submitOrderList(o)}
                                >
                                  Complete Order
                                </Button>
                              </Modal.Footer>
                            </Modal>

                            {/* <button onClick={() => handleComplete(o)} className={o.Status.toLowerCase() === 'accepted' ? 'btn btn-primary' : 'btn btn-success'}>
                              {completedOrderId === o._id ? 'Completed' : 'Complete'}
                            </button> */}
                            
                            <button onClick={() => handleCancel(o)} className='btn btn-danger'>Cancel</button>
                          </div>
                        )}
                      </td>
                      <td>
                        <Button onClick={() => handleShow(o._id)}>See Reviews</Button>
                      </td>
                      <Modal show={showReview} onHide={handleClose} >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Reviews Given in Past By Service Providers
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          {/* <div>
                            {
                              OrderByUserId && OrderByUserId.map(o => (
                                <div style={{ width: "100%", margin: "2px", backgroundColor: "yellow" }}>
                                  <p><b>{o.ServiceProviderReview}</b></p>
                                </div>
                              ))
                            }
                          </div> */}

                          <div class="container">
                            {
                              OrderByUserId && OrderByUserId.map((o, index) => (
                                <div class="review-item" key={index}>
                                  <p class="review-text">{o.ServiceProviderReview}</p>
                                </div>
                              ))
                            }
                          </div>


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
    </>
  )
}
