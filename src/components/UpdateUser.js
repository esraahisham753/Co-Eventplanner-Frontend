import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/slices/userSlice';

const UpdateUser = () => {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);
  const [username, setUsername] = useState(user ? user.username : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { username, email, image };
    dispatch(updateUser({ user, userData }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">Update User</button>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && <p>User updated successfully.</p>}
      {status === 'failed' && <p>Error: {error}</p>}
    </div>
  );
};

export default UpdateUser;