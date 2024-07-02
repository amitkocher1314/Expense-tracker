import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const onLogin = () => {
    // Implement your login logic here
    // For demonstration, we assume login is successful and token is stored in localStorage
    localStorage.setItem('token', 'your-token');
    setIsLoggedIn(true);
    // Redirect to the main page or any other page after login
    history.push('/welcome');
  };

  const onLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    // Redirect to the login page after logout
    history.push('/');
  };

  return (
    <header className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-white text-xl font-bold">Expense Tracker</div>
        {!isLoggedIn ? (
          <button
            onClick={onLogin}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        ) : (
          <div>
            <button
              onClick={onLogout}
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
