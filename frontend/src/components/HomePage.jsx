import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import TourCards from './TourCards';
import Footer from './Footer';
const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <TourCards />
      <Footer/>
    </div>
  );
};

export default HomePage;