import React from 'react';
import Footer from './shared/footer';
import Navbar from './shared/navbar';

const About = () => {
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#3A5A75] text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-[#08E8DE] mb-6 text-center">🩺 About HealthBuddy</h1>

        <p className="text-lg mb-8 text-center">
          <span className="text-[#FF7676] font-semibold">HealthBuddy</span> is an AI-powered web application designed to assist users in identifying potential diseases based on their symptoms.
          It leverages machine learning to offer early-stage health awareness in an intuitive and accessible way.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#08E8DE] mb-4">🌟 Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="text-[#FF7676] font-semibold">Smart Symptom Analysis:</span> Predicts diseases from symptoms using trained ML models.</li>
            <li><span className="text-[#FF7676] font-semibold">Doctor Recommendations:</span> Suggests relevant specialists based on the prediction.</li>
            <li><span className="text-[#FF7676] font-semibold">Email Alerts:</span> Sends reports to your doctor instantly.</li>
            <li><span className="text-[#FF7676] font-semibold">User-Friendly Interface:</span> Clean and responsive design.</li>
            <li><span className="text-[#FF7676] font-semibold">Secure & Private:</span> Firebase Authentication protects user data.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-[#08E8DE] mb-4">🔍 How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><span className="text-[#FF7676] font-semibold">Input:</span> Users enter symptoms in plain language.</li>
            <li><span className="text-[#FF7676] font-semibold">Prediction:</span> Flask backend predicts the disease.</li>
            <li><span className="text-[#FF7676] font-semibold">Doctor Match:</span> Node.js backend suggests doctors based on disease.</li>
            <li><span className="text-[#FF7676] font-semibold">Action:</span> User sends the result to a family doctor or selects a specialist.</li>
          </ol>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default About;
