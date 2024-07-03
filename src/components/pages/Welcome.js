import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Header from "../header/Header";

const Welcome = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idToken = localStorage.getItem("authToken");

      if (!idToken) {
        history.replace("/");
        return;
      }

      const apiKey = "AIzaSyCsmq92tnnIqmTW8V5Zas257RF0G2lRtXw";
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

      const payload = {
        idToken,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error.message);
        }

        const data = await response.json();
        const user = data.users[0];
        const { displayName, photoUrl, emailVerified } = user;

        if (displayName && photoUrl && emailVerified) {
          setProfileComplete(true);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [history]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Welcome to Expense Tracker
            </h2>
            <p className="text-center text-gray-600">
              {profileComplete ? (
                <>
                  Your profile is complete! You can now <Link to="/expenses" className="text-indigo-600 hover:text-indigo-500">go to Expense Page</Link>.
                  <br />
                  <Link to="/update-profile" className="text-indigo-600 hover:text-indigo-500">Edit your profile</Link>
                </>
              ) : (
                <>
                  Your profile is incomplete! Please <Link to="/profile" className="text-indigo-600 hover:text-indigo-500">complete your profile</Link>.
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
