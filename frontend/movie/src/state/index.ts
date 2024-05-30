import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import userReducer, { addUser, clearUser } from "./user.slice";
import dataReducer, { setData, clearData } from './data.slice';

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    data: dataReducer
});

// Configure persist options
const persistConfig = {
    key: 'root',
    storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the persisted reducer
const store = configureStore({
    reducer: persistedReducer,
})

// Create a persistor object
const persistor = persistStore(store);

export { store, persistor };

export type RootState = ReturnType<typeof rootReducer>;

export { addUser, clearUser, setData, clearData };
