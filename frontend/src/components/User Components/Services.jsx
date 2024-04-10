import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link ,useNavigate   } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FaStar , FaStarHalfAlt} from 'react-icons/fa';
import './css/Services.css'
import { useData } from '../../context';

export const Services = () => {

  const { updateBookNowData } = useData();

  const { serviceById , updateServiceById} = useData();  // data fetched from Home Page's More button
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const [serviceName, setServiceName] = useState(serviceById ? serviceById.ServiceName : '');

  const { register, handleSubmit } = useForm()
  const [Service, setService] = useState()

  //It will get Services Data
  const getService = async () => {
    const res = await axios.get("http://localhost:5000/service/getService")
    return res.data.data
  }

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


  var service
  const SubmitHandler = async (data) => {
    console.log(data);
    if (data.ServiceName.trim() !== "") {
      service = await getService();
      console.log("Serviceccc..", service)
      // const result = service?.filter(s => true)
      const result = service?.filter(s => s.service.ServiceName.toLowerCase().includes(data.ServiceName.toLowerCase()))
      // console.log("Services..",service)
      // console.log('Result..', result)  
      console.log("result..",result);
      setService(result); 
      updateServiceById(null)
    }
    else
    {
      setService([])
    }
  }

  if (serviceById != null) {
    SubmitHandler(serviceById)
  }

  return (
    <>
      <div className='Container'>
        <div className='ImageCon'>
          <img src='/assets/Services_Background.jpg' alt='' class="BackgroundImage" />
        </div>
        <div className='serviceContent'>
          <p className='text1'>Our Services</p>
          <p className='text2'>Where Quality Meet Your Home's Every Need</p>
          <form onSubmit={handleSubmit(SubmitHandler)}>
            <div className='inputCon'>
              <input type="text" class='SearchBar' onKeyUp={handleSubmit(SubmitHandler)} {...register("ServiceName")} placeholder='Search...' />
              <button type='submit' className='SearchButton'>
                {/* <img src='/assets/search.png' class="SearchImage" onClick={() => handleSubmit(SubmitHandler)} /> */}
                <img src='/assets/search.png' class="SearchImage" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='serviceContainer2'>
        {Service &&
          (
            <div className='serviceContent2'>
              {
                Service.map((s) => (
                  <div>
                    <div className='uppercontent'>
                      <img width="100%" height="100%" src={`data:image/png;base64,${btoa(String.fromCharCode(...new Uint8Array(s.service.image.data)))}`} alt="Description" />
                    </div>

                    <div className='lowercontent'>
                      <p><b>Service Name: </b>{s.service.ServiceName}</p>
                      <p><b>Area: </b>{s.service.Area}</p>
                      <p><b>Fees: </b>{s.service.Fees}</p>
                      <p><b>City: </b>{s.service.City}</p>
                      {
                        s.averageStar.toFixed >0.0 &&
                      <p><b>Rating: </b> {s.averageStar.toFixed(1)} {renderStarRating(s.averageStar.toFixed(1))}</p>
                      }
                      
                      <div className='lowercontent_button'>
                      <button><Link style={{ color: "#ffff", fontWeight: "bold" }} to="/booknow" onClick={() => updateBookNowData(s)} >BOOK NOW</Link></button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
      </div>
    </>
  )
}
