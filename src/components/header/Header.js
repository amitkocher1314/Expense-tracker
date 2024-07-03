import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

const Header = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const idToken = localStorage.getItem('authToken');
    if (idToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    history.push('/');
  };

  return (
    <header className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-white text-xl font-bold">Expense Tracker</div>
        {isLoggedIn && (
          <div className="flex space-x-4">
            <Link
              to="/update-profile"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Profile
            </Link>
            <Link
              to="/expenses"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Expenses
            </Link>
          </div>
        )}
        {!isLoggedIn ? (
          <Link
            to="/"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
