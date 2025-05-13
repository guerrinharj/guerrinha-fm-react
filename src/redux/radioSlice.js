import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    queue: [],
    currentTrack: null,
    isPlaying: false,
    isMuted: true
};

const radioSlice = createSlice({
    name: 'radio',
    initialState,
    reducers: {
        enqueue: (state, action) => {
            state.queue.push(action.payload);
        },
        playNext: (state) => {
            state.currentTrack = state.queue.shift() || null;
        },
        setPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setMuted: (state, action) => {
            state.isMuted = action.payload;
        }
    }
});

export const { enqueue, playNext, setPlaying, setMuted } = radioSlice.actions;
export default radioSlice.reducer;
