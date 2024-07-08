import React from 'react';
import Slider from '../components/Slider';
import AboutUs from '../components/About';
import Article from '../components/Article';
import NavbarComponent from '../components/Navbar';
import FooterComponents from '../components/Footer';

const Home = () => {
  return (
    <div>
      <NavbarComponent />
      <Slider />
      <AboutUs />
      <Article />
      <FooterComponents />
    </div>
  );
};

export default Home;
