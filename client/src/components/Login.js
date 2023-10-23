import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from './Constants';
import { useNavigate } from 'react-router-dom';




export const Login = () => {
    const [LoginData, setLoginData] = useState({ email: '', password: '' });
    const navigate = useNavigate();
  
    const loginHandler = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${API_BASE}/login`, {
          email: LoginData.email,
          password: LoginData.password,
        });
  
        const isVerified = response.data.existingUser.verified;
        const email = response.data.existingUser.email;
  
        if (isVerified) {
          navigate(`/dashboard/${email}`);
        }
      } catch (err) {
        console.log('Error while trying to login:', err.message);
      }
    };
  
    const loginDetails = (event) => {
      const { name, value } = event.target;
      setLoginData((data) => ({
        ...data,
        [name]: value,
      }));
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={loginHandler} className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter E-mail"
              onChange={loginDetails}
              name="email"
              value={LoginData.email}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter Password"
              onChange={loginDetails}
              name="password"
              value={LoginData.password}
              className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  };