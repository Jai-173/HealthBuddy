import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../firebase/firebase';
import {
  User,
  Stethoscope,
  History,
  Moon,
  Sun,
  LogOut
} from "lucide-react";

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  let dropdownTimeout = null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user"); // Clear the stored user
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleMouseEnter = () => {
    if (dropdownTimeout) clearTimeout(dropdownTimeout);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout = setTimeout(() => setShowDropdown(false), 100);
  };

  // Update the isAdmin check
  const isAdmin = currentUser?.email === "jaichowgule173@gmail.com";

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-[90px] z-50 px-5 py-3 transition-all duration-300 ${scrolled ? "bg-white/50 backdrop-blur-md shadow-md" : "bg-white"
        }`}
    >
      <div className="flex justify-between items-center mx-[105px] mt-2">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/"><img src="./logo.png" alt="HealthBuddy Logo" className="h-10 mr-2" /></Link>
          <Link to="/">
            <h1 className="text-2xl font-bold text-[#0CAAAB]">HealthBuddy</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex list-none space-x-8">
          <li>
            <Link to="/" className="font-semibold text-base text-[#404040] transition duration-300 hover:text-[#0CAAAB]">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="font-semibold text-base text-[#404040] transition duration-300 hover:text-[#0CAAAB]">
              About
            </Link>
          </li>
          <li>
            <Link to="/faq" className="font-semibold text-base text-[#404040] transition duration-300 hover:text-[#0CAAAB]">
              FAQ
            </Link>
          </li>
        </ul>

        {/* Profile Section */}
        <div className="relative">
          {currentUser ? (
            <div className="relative flex items-center">
              <div
                className="w-11 h-11 rounded-full bg-[url('/user.png')] bg-cover bg-center flex justify-center items-center cursor-pointer hover:scale-110 transition-transform border-2 border-[#08E8DE]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <i className="fas fa-user text-white text-xl"></i>
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div
                  className="absolute top-14 right-0 bg-white shadow-lg rounded-md p-4 w-48 transition-all duration-300 border border-gray-100"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  id="user-dropdown"
                  role="menu"
                  aria-labelledby="dropdown-button"
                >
                  <div className="border-b border-gray-200 pb-3 bg-gray-50 -m-4 mb-3 p-4 rounded-t-md">
                    <p className="text-sm font-semibold text-[#3A5A75]">{currentUser.name}</p>
                    <p className="text-xs text-[#5BC7C8]">{currentUser.email}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center py-2 px-2 text-sm text-[#404040] hover:text-[#0CAAAB] hover:bg-gray-50 rounded-md transition-all duration-200"
                      role="menuitem"
                    >
                      <User size={16} className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/predictor"
                      className="flex items-center py-2 px-2 text-sm text-[#404040] hover:text-[#0CAAAB] hover:bg-gray-50 rounded-md transition-all duration-200"
                      role="menuitem"
                    >
                      <Stethoscope size={16} className="mr-2" />
                      Disease Predictor
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center py-2 px-2 text-sm text-[#404040] hover:text-[#0CAAAB] hover:bg-gray-50 rounded-md transition-all duration-200"
                      role="menuitem"
                    >
                      <History size={16} className="mr-2" />
                      Prediction History
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-gray-200 mt-1">
                    <button
                      className="flex items-center w-full py-2 px-2 text-sm cursor-pointer font-semibold text-[#FF7676] hover:text-[#ff6262] hover:bg-red-50 rounded-md transition-all duration-200"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-semibold text-[#0CAAAB] border-none rounded-md transition duration-300 hover:text-[#08E8DE] cursor-pointer">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="px-4 py-2 ml-1 text-sm font-semibold text-white bg-[#FF7676] rounded-md hover:bg-[#ff6262] transition-colors cursor-pointer">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
