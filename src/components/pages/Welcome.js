import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import './ExpensePage.css';

const Welcome = () => {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [photoUrl, setPhotoUrl] = useState('');
  const [name, setName] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const theme = useSelector((state) => state.theme);

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

        setName(displayName);
        setPhotoUrl(photoUrl);
        setEmailVerified(emailVerified);

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

  const handleSendVerificationEmail = async () => {
    const idToken = localStorage.getItem("authToken");

    if (!idToken) {
      history.replace("/");
      return;
    }

    const apiKey = "AIzaSyCsmq92tnnIqmTW8V5Zas257RF0G2lRtXw";
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;

    const payload = {
      requestType: "VERIFY_EMAIL",
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

      alert("Verification email sent! Please check your inbox.");
    } catch (error) {
      alert("Error sending verification email:", error);
    }
  };

  return (
    <div className={`flex  min-h-screen ${theme}`}>
      <div className="flex -mt-16 flex-1 items-center justify-center px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Welcome {name}
            </h2>
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={photoUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                  alt="profile"
                  className="rounded-full h-40 w-40 object-cover mx-auto"
                />
              </div>
            </div>
            {!emailVerified && (
              <div className="text-center mt-4">
                <button
                  onClick={handleSendVerificationEmail}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md"
                >
                  Verify Email
                </button>
              </div>
            )}
            <p className="text-center text-gray-600">
              {profileComplete ? (
                <>
                  Your profile is complete! You can now <Link to="/expenses" className="text-indigo-600 hover:text-indigo-500">go to Expense Page</Link>.
                  <br />
                  <Link to="/update-profile" className="text-indigo-600 hover:text-indigo-500">Edit your profile</Link>
                </>
              ) : (
                <>
                  Your profile is incomplete! Please <Link to="/update-profile" className="text-indigo-600 hover:text-indigo-500">complete your profile</Link>.
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
