import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserSlice {
  currentUser:
    | {
        currency: string;
        email: string;
        language: string;
        token: string;
        username: string;
      }
    | {};
}

const initialState: UserSlice = {
  currentUser: {}
};

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    logout: () => initialState,
    setCurrency(state, action: PayloadAction<any>) {
      if ('currency' in state.currentUser) {
        state.currentUser.currency = action.payload;
      }
    },
    setLanguage(state, action: PayloadAction<any>) {
      if ('language' in state.currentUser) {
        state.currentUser.language = action.payload;
      }
    },
    setUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    },
    setUsername(state, action: PayloadAction<any>) {
      if ('username' in state.currentUser) {
        state.currentUser.username = action.payload;
      }
    }
  }
});

export const { logout, setCurrency, setLanguage, setUser, setUsername } =
  userSlice.actions;
export default userSlice.reducer;
