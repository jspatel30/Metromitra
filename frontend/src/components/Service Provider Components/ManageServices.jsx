import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { useData } from '../../context';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/ManageServices.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

export const ManageServices = () => {
  const tableRef = useRef(null);
  const { register, handleSubmit } = useForm()
  const { register: updateRegister, handleSubmit: updateHandleSubmit, reset } = useForm(); // Use destructuring to access the form methods from the second instance

  const [isLoading, setisLoading] = useState(false)
  const [show, setShow] = useState(false);
  const [existingData, setexistingData] = useState(null)

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
    reset()
    setexistingData(null);
    setShow(false)
  };

  const handleShow = (data) => {

    document.body.removeAttribute('data-rr-ui-modal-open');
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    var backdrops = document.getElementsByClassName("fade modal-backdrop");
    for (var i = 0; i < backdrops.length; i++) {
      backdrops[i].style.display = 'block';
    }

    // Hide all elements with class "fade modal"
    var modals = document.getElementsByClassName("fade modal");
    for (var j = 0; j < modals.length; j++) {
      modals[j].style.display = 'block';
    }
    console.log("Data..", data)
    setexistingData(data)
    setShow(true)
  }

  const serviceProviderId = localStorage.getItem("ServiceProviderId")
  const SubmitHandler = async (data) => {
    // const res = await axios.post("http://localhost:5000/service/addService",data)

    console.log("data.. ", data)
    const formData = new FormData();
    console.log("File..... ", data.File[0])
    formData.append('ServiceName', data.ServiceName);
    formData.append('Fees', data.Fees);
    formData.append('Area', data.Area);
    formData.append('City', data.City);
    formData.append('State', data.State);
    formData.append('Minimum', data.Minimum);
    formData.append('Maximum', data.Maximum);
    formData.append('File', data.File[0]);
    formData.append('ServiceProvider', serviceProviderId);

    try {
      const response = await fetch('http://localhost:5000/service/addService', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        console.log("form data response...", response)
      });
    } catch (error) {
      console.error('Error uploading file:', error);
    }
    getServices()
  }

  const [Service, setService] = useState([])

  //getServices
  const getServices = async () => {
    setisLoading(true)
    // const res = await axios.get("http://localhost:5000/service/getService")
    const res = await axios.get("http://localhost:5000/service/getServiceByServiceProviderId/" + serviceProviderId)
    console.log("res.data.data.. ", res.data.data)
    setService(res.data.data)
    setisLoading(false)
  }

  const updateServiceById = async (data) => {

    console.log("data,,,,,,,,,", data)
    const res = await axios.put("http://localhost:5000/service/updateServiceById/" + data.ServiceId, data)

    console.log("Updated Service.. ", res.data.data)
    getServices()
    setShow(false)
  }

  useEffect(() => {
    getServices()
  }, [])

  useEffect(() => {
    if (Service.length > 0) {
      const dataTable = window.$(tableRef.current).DataTable();
      console.log(dataTable)
      return () => {
        // Destroy the DataTable instance when component unmounts
        dataTable.destroy();
      };
    }
  }, [Service]);

  const deleteServiceById = async (id) => {
    const res = await axios.delete("http://localhost:5000/service/deleteServiceById/" + id)
    var rowToRemove = document.getElementById(id);
    if (rowToRemove) {
      rowToRemove.remove();
    }
  }

  return (
    <>
      {isLoading == true ?
        <div className='loader_container'>
          <div class="loader"></div>
        </div>
        : ""}

      <div className='Form' style={{ background: "url('/assets/desktop-wallpaper-best-6-management-backgrounds-on-hip-project-manager.jpg')", backgroundRepeat: "no-repeat", backgroundSize: "cover", width: "100%" }}>

        <form className="form_container" onSubmit={handleSubmit(SubmitHandler)} >
          {/* <div className="form-group">
            <label htmlFor="ServiceName">Service Name:</label>
            <input type="text" id="ServiceName" {...register("ServiceName")} />
          </div> */}

          <div class="form-floating mb-3">
            <input type="text" id="ServiceName" class="form-control" placeholder="ServiceName" style={{ color: "black !important", width: "350px" }} {...register("ServiceName")} />
            <label for="ServiceName" style={{ color: "black" }}>ServiceName</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" id="Fees" class="form-control" placeholder="Fees" style={{ color: "black !important", width: "350px" }} {...register("Fees")} />
            <label for="Fees" style={{ color: "black" }}>Visiting Fees</label>
          </div>

          <div class="form-floating mb-3">
            <input type="text" id="Area" class="form-control" placeholder="Area" style={{ color: "black !important", width: "350px" }} {...register("Area")} />
            <label for="Area" style={{ color: "black" }}>Area</label>
          </div>


          <label for="Area1" style={{ color: "white" , width:"350px", textAlign:"left"}}>Approximate Cost</label>
          <div class='row' style={{width:"380px"}}>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" id="Minimum" class="form-control" placeholder="Minimum" style={{ color: "black !important", width: "100%" }} {...register("Minimum")} />
                <label for="Minimum" style={{ color: "black" }}>Minimum</label>
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-floating mb-3">
                <input type="text" id="Maximum" class="form-control" placeholder="Maximum" style={{ color: "black !important", width: "100%" }} {...register("Maximum")} />
                <label for="Maximum" style={{ color: "black" }}>Maximum</label>
              </div>
            </div>
          </div>

          <div class="form-floating">
            <select class="form-select" id="City" aria-label="Floating label select example" style={{ color: "black", width: "350px" }} {...register("City")}>
              <option selected>Select a City</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Surat">Surat</option>
              <option value="Vadodara">Vadodara</option>
              <option value="Rajkot">Rajkot</option>
            </select>
            <label for="City">City</label>
          </div>

          <br/>

          <div class="form-floating mb-3" style={{ padding: "5px" }}>
            <input type="file" id="File" class="form-control" placeholder="File" style={{ color: "black !important", width: "350px", }} {...register("File")} />
            <label for="File" style={{ color: "black" }}>Service Profile Pic</label>
          </div>


          <input type="hidden" {...register("ServiceProvider")} value={serviceProviderId} />
          <div className="form-group">
            <input type="Submit" value="Add Service" />
          </div>
        </form>
      </div>


      <h1 style={{ width: "100%", textAlign: "left", padding: "0px 0px 50px 50px" }}>Service List :</h1>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ minHeight: '100vh', overflow: "hidden", width: "80%" }}>
          <table ref={tableRef} id="example" className="table table-striped table-bordered"  >
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Service Name</th>
                <th>Visiting Fees</th>
                <th>Area</th>
                <th>City</th>
                <th>Service Image</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {
                Service && Service.map((s, index) => (
                  <tr key={index} id={s._id}>
                    <td>{index + 1}</td>
                    <td>{s.ServiceName}</td>
                    <td>{s.Fees}</td>
                    <td>{s.Area}</td>
                    <td>{s.City}</td>
                    <td><img width="100px" src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(s.image.data)))}`} alt="Description" /></td>
                    <td>
                      <Button style={{ width: "90px" }} onClick={() => handleShow(s)}>Update</Button>
                      &nbsp;
                      <Button style={{ width: "90px" }} className='btn btn-danger' onClick={() => { deleteServiceById(s._id) }}>Delete</Button>
                      <div>
                        <Modal show={show} onHide={handleClose} >
                          <Modal.Header closeButton>
                            <Modal.Title>Update Your Services: </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            {
                              // existingData && existingData.map((data) => (

                              existingData && (
                                <form className="Update-form-container">
                                  <div className="Update-form-group">
                                    <label htmlFor="Update-ServiceName">Service Name:</label>
                                    <input type="text" id="Update-ServiceName" placeholder='Enter your Updated Service' defaultValue={existingData ? existingData.ServiceName : ''} {...updateRegister("ServiceName")} />
                                    {/* <input type="text" id="Update-ServiceName" placeholder='Enter your Updated Service' defaultValue="Hello Man" {...register("ServiceName")} /> */}
                                  </div>

                                  <div className="Update-form-group">
                                    <label htmlFor="Update-Fees">Visiting Fees:</label>
                                    <input type="text" id="Update-Fees" placeholder='Enter your Updated Fees' defaultValue={existingData ? existingData.Fees : ''} {...updateRegister("Fees")} />
                                  </div>

                                  <div className="Update-form-group">
                                    <label htmlFor="Update-Area">Area:</label>
                                    <input type="text" id="Update-Area" placeholder='Enter your Updated Area' defaultValue={existingData ? existingData.Area : ''} {...updateRegister("Area")} />
                                  </div>

                                  <div className="Update-form-group">
                                    {/*<input type="text" id="Update-City" placeholder='Enter your Updated City' defaultValue={existingData ? existingData.City : ''} {...updateRegister("City")} /> */}
                                    <label htmlFor="Update-City">City:</label>

                                    <select id="Update-City" defaultValue={existingData ? existingData.City : ''} {...updateRegister("City")}>
                                      <option value="Ahmedabad">Ahmedabad</option>
                                      <option value="Surat">Surat</option>
                                      <option value="Vadodara">Vadodara</option>
                                      <option value="Rajkot">Rajkot</option>
                                    </select>

                                    <input type="hidden" {...updateRegister("ServiceId")} value={s._id} />
                                  </div>
                                  <div className="Update-form-group">
                                    <label htmlFor="Update-File">Service Photo:</label>
                                    <input type="file" id="Update-File" {...updateRegister("File")} />

                                  </div>
                                </form>
                              )
                            }
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="success" onClick={() => updateHandleSubmit(updateServiceById)}>Update</Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div >
      </div>
    </>
  )
}