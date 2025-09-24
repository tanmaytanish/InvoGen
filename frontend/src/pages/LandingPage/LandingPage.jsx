import React from 'react'
import Header from '../../components/landing/Header'
import Hero from '../../components/landing/Hero'

const LandingPage = () => {
  return (
    <div className='bg-[#ffffff] text-gray-600'>
      <Header/>
      <main>
        <Hero/>
      </main>
    </div>
  )
}

export default LandingPage