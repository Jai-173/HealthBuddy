import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Use navigate instead of history.push()

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const response = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      alert("Registration successful! Please log in.");
      navigate("/login"); // ✅ Redirect to login page
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-[url('/bg-1.jpg')] bg-center bg-cover">
      <div className="flex bg-[#FFFFFF] shadow-lg rounded-lg max-w-lg w-full p-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-[#404040] mb-4">Welcome To HealthBuddy</h2>
          <p className="text-[#404040] mb-6">Please fill your personal details</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#404040]">
                Name
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 border rounded-lg mt-2"
                placeholder="Enter Your User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#404040]">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border rounded-lg mt-2"
                placeholder="Enter Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#404040]">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded-lg mt-2"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#404040]">
                By registering you confirm that you accept the{' '}
                <span className="text-[#0CAAAB]">Terms & Conditions</span> and{' '}
                <span className="text-[#0CAAAB]">Privacy Policy</span>
              </label>
            </div>
            <button type="submit" className="w-full py-3 bg-[#FF7676] text-white font-semibold rounded-lg mt-6 hover:bg-[#E65C5C] cursor-pointer">
              Register
            </button>
          </form>
          <p className="text-sm text-center text-[#404040] mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-[#0CAAAB] hover:text-[#08E8DE]">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;