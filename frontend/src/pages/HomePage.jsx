import React from "react";
import Header from "../components/Header";
import Slider from "../components/Slider";
import SearchBar from "../components/SearchBar";
import Room from "../components/Room";
import Facility from "../components/Facility";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div>
      <Header />
      <Slider />
      <SearchBar />
      <Room />
      <Facility />
      <Contact />
      <Footer />
    </div>
  );
}
