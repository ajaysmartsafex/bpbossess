import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import resultReducer from "./resultSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
import { combineReducers } from "redux";

const persistConfig = {
    key: "root",
    storage,
    // whitelist: ["result"]
};

const rootReducer = combineReducers({
    auth: authReducer, // Add more reducers here if needed
    result: resultReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
export default store;
