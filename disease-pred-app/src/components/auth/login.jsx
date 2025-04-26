import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // ✅ Use navigate instead of useHistory

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }
  
      // ✅ Store token & user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      // ✅ Redirect to dashboard
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/bg-1.jpg')] bg-center bg-cover">
      <div className="flex bg-[#FFFFFF] shadow-lg rounded-lg max-w-lg w-full p-6">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-[#404040] mb-4">Welcome Back</h2>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <button type="submit" className="w-full py-3 bg-[#FF7676] text-white font-semibold rounded-lg mt-6 hover:bg-[#E65C5C] cursor-pointer">
              Login
            </button>
          </form>
          <p className="text-sm text-center text-[#404040] mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-[#0CAAAB] hover:text-[#08E8DE]">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;