import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  currency: string;
  language: string;
  username: string;
}

const initialState: SettingsState = {
  currency: 'USD',
  language: 'EN',
  username: 'User'
};

const settingsSlice = createSlice({
  initialState,
  name: 'settings',
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    }
  }
});

export const { setCurrency, setLanguage, setUsername } = settingsSlice.actions;
export default settingsSlice.reducer;
