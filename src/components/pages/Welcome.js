import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header";

const Welcome = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [userName, setUserName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idToken = localStorage.getItem('authToken');

      if (!idToken) {
        return;
      }

      try {
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCsmq92tnnIqmTW8V5Zas257RF0G2lRtXw`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        const user = data.users[0];

        if (user.displayName && user.photoUrl) {
          setProfileComplete(true);
          setPhotoUrl(user.photoUrl);
          setUserName(user.displayName);
        }

      } catch (error) {
        console.error('Error checking user profile:', error);
      } finally {
        setLoading(false); // Update loading state once done fetching
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <div className="w-full bg-white shadow-md">
          <div className="flex justify-between items-center w-full max-w-7xl mx-auto px-4 py-2">
            <div>
              <h1 className="text-xl font-bold">Welcome, {userName || "User"}</h1>
            </div>
            <div>
              {profileComplete ? (
                <Link to="/update-profile" className="text-indigo-600 hover:underline">
                  Edit Profile
                </Link>
              ) : (
                <Link to="/update-profile" className="text-red-500 hover:underline">
                  Complete Your Profile
                </Link>
              )}
            </div>
          </div>
          {profileComplete && (
            <div className="flex justify-center items-center mt-4">
              <img
                src={photoUrl}
                alt="Profile"
                className="rounded-full h-20 w-20"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Welcome;
