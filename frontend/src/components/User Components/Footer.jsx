import React from 'react'
import './css/Footer.css'
import { Link , useNavigate } from 'react-router-dom'

export const Footer = () => {

  const navigate = useNavigate()
  const logout = () =>{
    localStorage.removeItem('token')
    navigate("/login")
  }

  return (
    <footer className="footer-container" style={{backgroundImage:"url('./assets/Footer_Background.png')",backgroundPosition:"top",backgroundRepeat:"no-repeat"}}>
      <div className="left-section" >
        
        {/* Logo and Company Name */}
        <div className="company-info">
          <img src="/assets/Metromitra_Logo.png" alt="Company Logo" className="footlogo" />
          <span className="company-name">METROMITRA</span>
        </div>

        {/* Quick Links */}
        <div className="quick-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/services">Service</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login" onClick={()=>logout()}>Logout</Link></li>
          </ul>
        </div>

        {/* Address */}
        <div className="right-section">
          <h4>Address</h4>
          <p>208, Damubhai Vidhyarthi
            Bhavan Navrangupura,
            Ahmedabad
            Gujarat - 431692
          </p>
        </div>
      </div>
    </footer>
  )
}
