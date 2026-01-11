import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gigsReducer from '../features/gigs/gigsSlice';
import bidsReducer from '../features/bids/bidsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    gigs: gigsReducer,
    bids: bidsReducer,
    notifications: notificationsReducer
  }
});
