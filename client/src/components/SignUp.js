import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE } from './Constants';

export const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    number: '',
  });
  const [isFormSubmitted, setFormSubmitted] = useState(false)


  const changeHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    await signUp();
  };

  const signUp = async () => {
    try {
      await axios.post(`${API_BASE}/signUp`, formData);

      //show email sent msg on success response of signup
      setFormSubmitted(prev => !prev)

    } catch (err) {
      console.log('Something went wrong:', err.message);
    }
  };

  return !isFormSubmitted ? (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submitHandler} className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="First Name"
            onChange={changeHandler}
            name="firstName"
            value={formData.firstName}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Last Name"
            onChange={changeHandler}
            name="lastName"
            value={formData.lastName}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="E-Mail"
            onChange={changeHandler}
            name="email"
            value={formData.email}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="number"
            placeholder="Mobile number"
            onChange={changeHandler}
            name="number"
            value={formData.number}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Role" className="block text-gray-600">
            Role:
          </label>
          <select
            onChange={changeHandler}
            name="role"
            id="Role"
            value={formData.role}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="Admin">Admin</option>
            <option value="Student">Student</option>
            <option value="Teacher">Instructor</option>
          </select>
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Create Password"
            onChange={changeHandler}
            name="password"
            value={formData.password}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={changeHandler}
            name="confirmPassword"
            value={formData.confirmPassword}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  ): <p> We have sent you a Verification mail on ${formData.email}, please verify it is valid for 10 minutes.</p>;
};


