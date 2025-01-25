'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { fetchTeam, updateTeam, deleteTeam } from '../.././../store/slices/teamSlice';

const UpdateTeam = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const { team, status, error } = useSelector((state) => state.teams);

  const [role, setRole] = useState('');
  const [invitationStatus, setInvitationStatus] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTeam(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (team) {
      setRole(team.role || 'participant');
      setInvitationStatus(team.invitationStatus || false);
    }
  }, [team]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const teamData = { role, invitation_status: invitationStatus };
    dispatch(updateTeam({ teamId: id, teamData }));
  };

  const handleDelete = () => {
    dispatch(deleteTeam(id)).then(() => {
      router.push('/'); // Redirect to the teams list page after deletion
    });
  };

  return (
    <div>
      <h1>Update Team</h1>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'succeeded' && team && (
        <form onSubmit={handleUpdate}>
          <div>
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="organizer">Organizer</option>
              <option value="participant">Participant</option>
            </select>
          </div>
          <div>
            <label>Invitation Status:</label>
            <input
              type="checkbox"
              checked={invitationStatus}
              onChange={(e) => setInvitationStatus(e.target.checked)}
            />
          </div>
          <button type="submit">Update Team</button>
        </form>
      )}
      {status === 'failed' && <p>Error: {error}</p>}
      <button onClick={handleDelete}>Delete Team</button>
    </div>
  );
};

export default UpdateTeam;