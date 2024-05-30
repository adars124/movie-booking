import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    value: Record<string, unknown>;
}

const initialState: UserState = {
    value: {},
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<Record<string, unknown>>) => {
            state.value = action.payload;
        },
        clearUser: (state) => {
            state.value = {};
        },
    },
});

export default userSlice.reducer;

export const { addUser, clearUser } = userSlice.actions;
