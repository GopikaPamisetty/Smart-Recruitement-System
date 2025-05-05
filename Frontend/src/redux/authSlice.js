import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // Set full user object
        setUser: (state, action) => {
            state.user = action.payload;
        },

        // Toggle job ID in savedJobs list
        updateSavedJobs: (state, action) => {
            const jobId = action.payload;
            if (!state.user) return;

            const isAlreadySaved = state.user.savedJobs?.includes(jobId);

            if (isAlreadySaved) {
                state.user.savedJobs = state.user.savedJobs.filter(id => id !== jobId);
            } else {
                if (!state.user.savedJobs) state.user.savedJobs = [];
                state.user.savedJobs.push(jobId);
            }
        }
    }
});

export const { setLoading, setUser, updateSavedJobs } = authSlice.actions;
export default authSlice.reducer;
