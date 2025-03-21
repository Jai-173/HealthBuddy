import React from "react";
import Navbar from "./shared/navbar";
import Hero from "./shared/hero";
import Footer from "./shared/footer";
import Chatbot from "./chatbot";


const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero />
      <Chatbot />
      <Footer />
    </div>
  );
};
export default Home;