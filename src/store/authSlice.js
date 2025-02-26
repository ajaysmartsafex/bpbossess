import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    session: null, // Store session information
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.session = action.payload.session; // Store session after login
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.session = null; // Clear session on logout
        },
        rehydrateUser: (state, action) => {
            state.userData = action.payload.userData;
            state.session = action.payload.session;
        }
    }
})

export const { login, logout, rehydrateUser } = authSlice.actions;

export default authSlice.reducer;