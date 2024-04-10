import React from 'react'
import './css/About.css'

export const About = () => {


  return (
    <>
      <div className='About_Main_Container'>
        <img src='/assets/About.png' alt='' class="About_BackgroundImage"  />

        <div className='Inside_About_Image'>
          <img src='/assets/Inside_About.png' style={{height:"420px",width:"420px"}} alt='Inside About Image'/>
        </div>

        <div className='About_Content'>
            <h1>About Us</h1>
            <p>
            Metromitra is more than just a website – we're a friendly online hub connecting service providers with those in need. Offering a simple and user-friendly experience, our platform effortlessly brings together individuals offering services and those seeking them. Whether you're showcasing your skills or on the lookout for specific services, Metromitra aims to make the experience easy and connected.
            What sets us apart is our commitment to transparency and safety. With a focus on clear feedback and secure payment methods, Metromitra establishes itself as a trustworthy space for everyone involved. It's not just a platform; it's a thriving community where diverse skills and unique needs converge.
            </p>
        </div>
      </div>
    </>
  )
}
