import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/Navbar.css'
import { useData } from '../../context';

export const Navbar = ({ activeComponent }) => {

  const navigate = useNavigate()

  const UserName = localStorage.getItem("UserName")
  const ServiceProviderName = localStorage.getItem("ServiceProviderName")
  const { checkNavBar, updatecheckNavBar } = useData();

  useEffect(() => {
    // Check if checkNavBar is already set in localStorage
    const storedCheckNavBar = localStorage.getItem('checkNavBar');
    if (storedCheckNavBar) {
      updatecheckNavBar(storedCheckNavBar);
    } else {
      // If checkNavBar is not set in localStorage, set it to the default value
      updatecheckNavBar("User");
      localStorage.setItem('checkNavBar', "User");
    }
  }, [updatecheckNavBar]);


  const logout = () => {
    localStorage.clear();
    updatecheckNavBar("User");
    navigate("/login")

  }


  return (

    <div className='body'>
      <nav class="navbar" >
        <div class="brand">
          <img src='/assets/Metromitra_Logo.png' alt="Company Logo" class="logo" />
          <span class="company-name">METROMITRA</span>
        </div>

        {checkNavBar === "User" && (

          <ul class="nav-list">
            <li><Link to="/home" style={{ color: activeComponent === '/' || activeComponent === '/home' ? '#0fda9b' : '#ffffff' }} >Home</Link></li>
            <li><Link to="/services" style={{ color: activeComponent === '/services' ? '#0fda9b' : '#ffffff' }}  >Service</Link></li>
            <li><Link to="/about" style={{ color: activeComponent === '/about' ? '#0fda9b' : '#ffffff' }} >About</Link></li>
            <li><Link to="/userorder" style={{ color: activeComponent === '/userorder' ? '#0fda9b' : '#ffffff' }} >History</Link></li>
            {UserName ? (
              <li>
                <div className='AvataraCon'>
                  <div className='Avetara'>
                    <img src='/assets/pngwing.com.png' width="50px"height="50px" />
                  </div>
                  <div className='NameLogoutCon'>
                    {UserName && (<h5>{UserName}</h5>)}
                    <p><Link to="/login" id="logout" onClick={() => logout()}>Logout</Link></p>
                  </div>
                </div>
              </li>
            ) : (
              <li><Link to="/login" style={{ color: '#ffffff' }}>Login/Signup</Link></li>
            )}

          </ul>
        )}

        {checkNavBar === "ServiceProvider" && (
          <ul class="nav-list">
            <li><Link to="/order" style={{ color: activeComponent === '/order' ? '#0fda9b' : '#ffffff' }} >Order</Link></li>
            <li><Link to="/history" style={{ color: activeComponent === '/history' ? '#0fda9b' : '#ffffff' }} >History</Link></li>
            <li><Link to="/manageservice" style={{ color: activeComponent === '/manageservice' ? '#0fda9b' : '#ffffff' }} >Manage Service</Link></li>
            {ServiceProviderName ? (
              <li>
                <div className='AvataraCon'>
                  <div className='Avetara'>
                    <img src='/assets/pngwing.com.png' width="50px"height="50px" />
                  </div>
                  <div className='NameLogoutCon'>
                    {ServiceProviderName && (<h5>{ServiceProviderName}</h5>)}
                    <p><Link to="/login" id="logout" onClick={() => logout()}>Logout</Link></p>
                  </div>
                </div>
              </li>
            ) : (
              <li><Link to="/login" style={{ color: '#ffffff' }}>Login</Link></li>
            )}
          </ul>
        )}
      </nav>
    </div>
  )
}