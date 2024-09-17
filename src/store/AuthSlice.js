import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: JSON.parse(localStorage.getItem('authData'))?.token || null,
  isAuthenticated: !!localStorage.getItem('authData'),
  isAdmin: JSON.parse(localStorage.getItem('authData'))?.isAdmin || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.isAdmin = action.payload.isAdmin;
      localStorage.setItem('authData', JSON.stringify({
        token: action.payload.token,
        isAdmin: action.payload.isAdmin,
        userId: action.payload.userId
      }));
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      localStorage.removeItem('authData');
      
    },
  },
});

export const { setIsAuthenticated, logout } = authSlice.actions;

export default authSlice.reducer;
