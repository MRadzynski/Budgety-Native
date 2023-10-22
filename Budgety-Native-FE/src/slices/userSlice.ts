import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSlice {
  currentUser: {
    email?: string;
  };
}

const initialState: UserSlice = {
  currentUser: {}
};

const userSlice = createSlice({
  initialState,
  name: 'user',
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
