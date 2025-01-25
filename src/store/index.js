import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import eventReducer from './slices/eventSlice';
import taskReducer from './slices/taskSlice';
import teamReducer from './slices/teamSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventReducer,
    tasks: taskReducer,
    teams: teamReducer,
  },
});
