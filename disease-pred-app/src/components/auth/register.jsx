import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase/firebase';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with username
      await updateProfile(userCredential.user, {
        displayName: username
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignUp = async () => {
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
      console.error("Google Sign-up error:", error);
      alert(error.message || "Google Sign-up failed. Please try again.");
    }
  };

  return (
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
            <button type="submit" className="w-full py-3 bg-[#FF7676] text-white font-semibold rounded-lg hover:bg-[#E65C5C] cursor-pointer">
              Register
            </button>
          </form>

          {/* Add Google Sign-Up button */}
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            
            <button
              onClick={handleGoogleSignUp}
              className="w-full mt-4 py-3 px-4 border flex justify-center items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 rounded-lg"
            >
              <img src="/google.svg" alt="Google" className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </div>

          <p className="text-sm text-center text-[#404040] mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-[#0CAAAB] hover:text-[#08E8DE]">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;