import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>Welcome to Expense Tracker</h1>
     
        <div className="mt-4 text-center">
          <p className="text-red-500">Your profile is incomplete.</p>
          <Link to="/update-profile" className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded">
            Complete Profile
          </Link>
        </div>
      
    </div>
  );
};

export default Welcome;
