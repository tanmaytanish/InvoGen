import React from 'react'
import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'
import Features from '../../components/landing/Features'
import Testimonials from '../../components/landing/Testimonials'
import Faqs from '../../components/landing/Faqs'
import Footer from '../../components/landing/Footer'

const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header/>
      <main className=''>
        <Hero/>
        <Features/>
        <Testimonials/>
        <Faqs/>
        <Footer />
      </main>
    </div>
  )
}

export default LandingPage