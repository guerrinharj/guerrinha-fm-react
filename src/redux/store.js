import { configureStore } from '@reduxjs/toolkit';
import radioReducer from './radioSlice';
import chatReducer from './chatSlice';

export default configureStore({
    reducer: {
        radio: radioReducer,
        chat: chatReducer
    }
});
