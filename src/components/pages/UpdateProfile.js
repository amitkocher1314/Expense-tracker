import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
import './ExpensePage.css';
 
const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const history = useHistory();
  const theme = useSelector((state) => state.theme);
  useEffect(() => {
    const fetchUserProfile = async () => {
      const idToken = localStorage.getItem('authToken');

      if (!idToken) {
        alert("User is not authenticated");
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

        setUsername(user.displayName || '');
        setPhotoURL(user.photoUrl || '');

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const idToken = localStorage.getItem('authToken');

    if (!idToken) {
      alert("User is not authenticated");
      return;
    }

    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCsmq92tnnIqmTW8V5Zas257RF0G2lRtXw`;
      const payload = {
        idToken: idToken,
        displayName: username,
        photoUrl: photoURL,
        returnSecureToken: true
      };

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
      console.log('Profile updated successfully', data);

      alert("Profile updated successfully");
      history.replace('/welcome');
    } catch (error) {
      alert(error.message);
    }

    setUsername('');
    setPhotoURL('');
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${theme}`}>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Complete Your Profile</h1>
        <form onSubmit={handleProfileUpdate} className="mt-4 space-y-4 w-80">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
            <input
              type="url"
              id="photoURL"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={() => history.replace('/welcome')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
