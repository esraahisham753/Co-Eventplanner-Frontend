import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  return (
    <div>
      <h1>User Profile</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && user && (
        <div>
          <p>User ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          {user.image && <img src={user.image} alt="User profile" />}
          {/* Add more user fields as needed */}
        </div>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default UserProfile;