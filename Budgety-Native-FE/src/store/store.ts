import { configureStore } from '@reduxjs/toolkit';
import settingsSlice from '../slices/settingsSlice';
import userSlice from '../slices/userSlice';

export const store = configureStore({
  reducer: {
    settings: settingsSlice,
    user: userSlice
  }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
