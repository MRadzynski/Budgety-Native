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
    setUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    }
  }
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;
