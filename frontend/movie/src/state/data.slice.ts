import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DataState {
    bookedSeats: string[];
    showtime_id: string;
}

const initialState: DataState = {
    bookedSeats: [],
    showtime_id: '',
};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setData(state, action: PayloadAction<DataState>) {
            state.bookedSeats = action.payload.bookedSeats;
            state.showtime_id = action.payload.showtime_id;
        },
        clearData(state) {
            state.bookedSeats = [];
            state.showtime_id = '';
        },
    },
});

export const { setData, clearData } = dataSlice.actions;

export default dataSlice.reducer;
