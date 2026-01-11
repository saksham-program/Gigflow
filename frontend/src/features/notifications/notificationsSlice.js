import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: []
  },
  reducers: {
    pushNotification: (state, action) => {
      state.items.unshift({
        id: crypto.randomUUID(),
        ...action.payload,
        createdAt: new Date().toISOString()
      });
    },
    clearNotifications: (state) => {
      state.items = [];
    }
  }
});

export const { pushNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
