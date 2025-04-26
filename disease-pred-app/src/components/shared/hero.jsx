import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const storedUser = localStorage.getItem("user");

  const handleGetStarted = () => {
    if (!currentUser && !storedUser) {
      navigate("/login");
    } else {
      navigate("/predictor");
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-[url('/dna.jpg')] bg-cover bg-center">
      <div className="p-10 flex items-center justify-center">
        <div className="flex justify-between items-start mx-20">
          <div className="max-w-[50%] flex flex-col items-start">
            <div className="text-[#404040] text-lg w-full">
              <h1 className="flex flex-col items-start text-5xl leading-tight">
                <div><span className="text-[#08E8DE] animate-fade-up">Reliable Medical Services, Anytime, Anywhere.</span></div>
              </h1>
            </div>
            <div className="text-lg mb-8">
              <p className="text-[#3A5A75] pr-24 pt-4 text-left">
                Smart health starts here - personalized care at your fingertips with HealthBuddy.
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleGetStarted} className="bg-[#FF7676] text-white px-5 py-2 rounded-md font-bold text-lg shadow-md transition duration-300 hover:bg-[#ff6262] cursor-pointer">
                GET STARTED
              </button>
              <button className="bg-[#0CAAAB] text-white px-5 py-2 rounded-md font-bold text-lg shadow-md transition duration-300 hover:bg-[#098e8f] cursor-pointer">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
