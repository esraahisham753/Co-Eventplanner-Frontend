import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import eventReducer from './slices/eventSlice';
import taskReducer from './slices/taskSlice';
import teamReducer from './slices/teamSlice';
import budgetItemReducer from './slices/budgetItemSlice';
import ticketReducer from './slices/ticketSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    events: eventReducer,
    tasks: taskReducer,
    teams: teamReducer,
    budgetItems: budgetItemReducer,
    tickets: ticketReducer,
  },
});
