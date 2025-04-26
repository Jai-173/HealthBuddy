import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store complete user info
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        isAuthenticated: true
      }));

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      localStorage.setItem("user", JSON.stringify({
        email: user.email,
        uid: user.uid,
        displayName: user.displayName,
        isAuthenticated: true
      }));

      navigate("/");
    } catch (error) {
      console.error("Google Sign-in error:", error);
      alert(error.message || "Google Sign-in failed. Please try again.");
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
            <button type="submit" className="w-full py-3 bg-[#FF7676] text-white font-semibold rounded-lg hover:bg-[#E65C5C] cursor-pointer">
              Login
            </button>
          </form>
          
          {/* Add Google Sign-In button */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignIn}
              className="w-full mt-4 py-3 px-4 border flex justify-center items-center gap-2 bg-white cursor-pointer hover:bg-gray-50 border-gray-300 rounded-lg"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </button>
          </div>

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