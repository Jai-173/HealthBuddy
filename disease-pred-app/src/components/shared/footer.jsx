import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#F0F7F7] text-[#404040] py-8">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-wrap justify-between items-start">
          {/* Brand Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <Link to="/"><h2 className="text-2xl font-bold text-[#0CAAAB]">HealthBuddy</h2></Link>
            <p className="text-sm mt-2 text-[#3A5A75]">
              Your trusted digital healthcare companion, ensuring a secure and personalized experience.
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2 text-[#0CAAAB]">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link to="/predictor" className="hover:text-[#08E8DE] transition-colors">Get Started</Link></li>
              <li><Link to="/get-appoint" className="hover:text-[#08E8DE] transition-colors">Get Appointment</Link></li>
              <li><Link to="/about" className="hover:text-[#08E8DE] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#08E8DE] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2 text-[#0CAAAB]">Contact Us</h3>
            <p>Email: <a href="mailto:support@healthbuddy.com" className="text-[#5BC7C8] hover:text-[#08E8DE] transition-colors">support@healthbuddy.com</a></p>
            <p>Phone: <a href="tel:+911234567899" className="text-[#5BC7C8] hover:text-[#08E8DE] transition-colors">+91 12345 67899</a></p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-[#3A5A75] hover:text-[#08E8DE] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-[#3A5A75] hover:text-[#08E8DE] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-[#3A5A75] hover:text-[#08E8DE] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-[#3A5A75] hover:text-[#08E8DE] transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#5BC7C8] pt-4 text-center text-sm text-[#3A5A75]">
          <p>© {new Date().getFullYear()} HealthBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;