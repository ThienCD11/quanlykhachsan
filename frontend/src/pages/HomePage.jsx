import React from "react";
import Header from "../components/Header";
import Slider from "../components/Slider";
import SearchBar from "../components/SearchBar";
import Room from "../components/Room";
import Facility from "../components/Facility";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import About from "../components/About";

export default function HomePage() {
  return (
    <div style={{background: "#F0F0F0"}}>
      <Header />
      <Slider>
        <SearchBar />
      </Slider> 
      <About />
      <Room />
      <Facility />
      <Contact />
      <Footer />
    </div>
  );
}
