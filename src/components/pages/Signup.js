import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Invalid credentials: Passwords do not match');
      return;
    }

    const apiKey = 'AIzaSyCsmq92tnnIqmTW8V5Zas257RF0G2lRtXw';
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

    const payload = {
      email,
      password,
      returnSecureToken: true,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message);
      }

      const data = await response.json();
      console.log('User has successfully signed up', data);
      alert("Your account created successfully, you can now login");
    } catch (error) {
      alert('Invalid credentials: ' + error.message); // Update alert message
    }
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
  <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen">
        <div className="w-full max-w-md space-y-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold text-center">Create new account</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-sm text-gray-600 text-center">
            Already have an account? <Link to="/" className="text-indigo-600 hover:text-indigo-500">Login here</Link>
          </div>
        </div>
      </div>
  );
};

export default Signup;
