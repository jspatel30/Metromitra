import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/Home.css'
import { useData } from '../../context';

export const Home = () => {
  const [services, setservices] = useState([])
  const { updateServiceById } = useData();

  var DataDemo = [];
  const getServices = async () => {
    const res = await axios.get("http://localhost:5000/service/getService")
    console.log("Services.. ", res.data.data)
    setservices(res.data.data)
    // console.log("Services..",res.data.data[0].image.data)
  }

  const navigate = useNavigate()

  const getServiceById = async (Serviceid) => {
    const res = await axios.get("http://localhost:5000/service/getServiceById/" + Serviceid)
    console.log(res.data.data)
    updateServiceById(res.data.data)
    console.log("Get service By Id..", res.data.data)
    navigate("/services")
  }

  useEffect(() => {
    getServices()
  }, [])

  return (
    <>
      <div className='Container'>
        
        <img src='/assets/Home_background.png' alt='' class="BackgroundImage" />
        <div class="try"></div>
        <div className='content'>
          <p className='metromitra'>Metro Mitra Home Services</p>
          <div className='metromitra1'>
            <p>We Care Like a Friend</p>
            <div className='bookNow'>
              <button>
                <Link to='/services'>BOOK NOW</Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class='Container2'>
        <div className='content2'>
          {/* <p>Cleaning & Reparing</p> */}
          <p>Services</p>
        </div>

        <div className='All_Service'>
          {
            services.map((s) => {
              if (DataDemo.includes(s.service.ServiceName.toLowerCase()) == true) {
                return "";
              }
              DataDemo.push(s.service.ServiceName.toLowerCase());
              return (
                <div>
                  <h1>{s.service.ServiceName}</h1>
                  <div className="services" style={{
                    backgroundImage: `url(data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(s.service.image.data)))})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover"
                  }}>
                    {/* <div className="services">
                    <img width="100% " height="100%" src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(s.image.data)))}`} alt="Description" /> */}
                    <div className='moreButton'>
                      <button onClick={() => { getServiceById(s.service._id) }}>More</button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    </>
  )
}