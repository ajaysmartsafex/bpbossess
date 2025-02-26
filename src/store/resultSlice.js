import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    results: [], // Store all results
    games: [], // Store all games
    selectedResult: null, // Store a selected result for viewing or editing
};

const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        setResults: (state, action) => {
            state.results = action.payload; // Set all results
        },
        setGames: (state, action) => {
            state.games = action.payload; // Store fetched games
        },
        addResult: (state, action) => {
            state.results.push(action.payload); // Add new result
        },
        updateResult: (state, action) => {
            const index = state.results.findIndex(
                result => result.date === action.payload.date && result.gameName === action.payload.gameName
            );
            if (index !== -1) {
                state.results[index] = action.payload; // Update existing result
            }
        },
        deleteResult: (state, action) => {
            state.results = state.results.filter(result => result.gameId !== action.payload);
        },
        setSelectedResult: (state, action) => {
            state.selectedResult = action.payload; // Store a single result
        },
        rehydrateresult: (state, action) => {
            state.resultData = action.payload.resultData;
            state.session = action.payload.session;
        }
    }
});

// Export actions
export const { setResults, setGames, addResult, updateResult, deleteResult, setSelectedResult, rehydrateresult } = resultSlice.actions;

// Export reducer
export default resultSlice.reducer;
