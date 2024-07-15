import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

const Header = ({ isLoggedIn, handleLogout }) => {
  const history = useHistory();

  useEffect(() => {
    const idToken = localStorage.getItem('authToken');
    if (!idToken) {
      history.push('/');
    }
  }, [isLoggedIn, history]);

  return (
    <header className="relative bg-indigo-600 top-0 shadow-2xl rounded-sm border-t-1  mt-1 mb-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="text-white text-xl font-bold">Expense Tracker</div>
        <div className="flex flex-1 justify-center space-x-4">
          {isLoggedIn && (
            <>
              <NavLink
                to="/welcome"
                activeClassName="text-white-500"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Profile
              </NavLink>
              <NavLink
                to="/expenses"
                activeClassName="text-white-500"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Expenses
              </NavLink>
            </>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        )}
        {!isLoggedIn && (
          <NavLink
            to="/"
            activeClassName="text-white-500"
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-100 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
